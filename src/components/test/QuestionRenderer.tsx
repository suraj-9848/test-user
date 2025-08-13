"use client";

import { useState, useEffect } from "react";
import { Question, TestAnswer, QuestionType } from "@/types/test";
import {
  CheckCircle,
  Circle,
  Square,
  CheckSquare,
  Play,
  Send,
  Clock,
  MemoryStick,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import SimpleCodeEditor from "./SimpleCodeEditor";
import { LANGUAGE_TEMPLATES, PROGRAMMING_LANGUAGES } from "@/utils/languages";

interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?:
    | "PASSED"
    | "FAILED"
    | "ERROR"
    | "RUNTIME_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "COMPILATION_ERROR";
  execution_time?: number;
  memory_used?: number;
  error_message?: string;
  compile_output?: string;
}

interface Judge0Result {
  token: string;
  status: {
    id: number;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: string;
  memory?: number;
  exit_code?: number;
}

interface QuestionRendererProps {
  question: Question;
  answer: TestAnswer;
  onAnswerChange: (
    questionId: string,
    selectedOptions: string[],
    textAnswer?: string,
  ) => void;
  onRunCode?: (
    questionId: string,
    code: string,
    language: string,
  ) => Promise<TestCase[]>;
}

class Judge0Service {
  private static readonly BASE_URL =
    process.env.JUDGE0_BASE_URL || "http://159.89.166.122:2358";

  static async submitCode(
    sourceCode: string,
    languageId: number,
    stdin: string = "",
    expectedOutput: string = "",
    timeLimit: number = 5,
    memoryLimit: number = 256,
  ): Promise<string> {
    try {
      const payload = {
        source_code: btoa(sourceCode),
        language_id: languageId,
        stdin: btoa(stdin),
        expected_output: btoa(expectedOutput),
        cpu_time_limit: timeLimit,
        memory_limit: memoryLimit * 1024,
        wall_time_limit: timeLimit + 1,
      };

      const response = await fetch(
        `${this.BASE_URL}/submissions?base64_encoded=true&wait=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();
      console.log("Judge0 raw response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Judge0 API Error (${response.status}): ${responseText}`,
        );
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!result.token) {
        throw new Error("No token returned from Judge0");
      }

      console.log("Judge0 submission successful, token:", result.token);
      return result.token;
    } catch (error) {
      console.error("Judge0 submission error:", error);
      throw error;
    }
  }

  static async getResult(token: string): Promise<Judge0Result> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/submissions/${token}?base64_encoded=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const responseText = await response.text();
      console.log("Judge0 result response:", responseText);

      if (!response.ok) {
        throw new Error(
          `Judge0 API Error (${response.status}): ${responseText}`,
        );
      }

      const result = JSON.parse(responseText);

      // Decode base64 encoded fields
      if (result.stdout) {
        try {
          result.stdout = atob(result.stdout);
        } catch (e) {
          console.warn("Failed to decode stdout:", e);
        }
      }

      if (result.stderr) {
        try {
          result.stderr = atob(result.stderr);
        } catch (e) {
          console.warn("Failed to decode stderr:", e);
        }
      }

      if (result.compile_output) {
        try {
          result.compile_output = atob(result.compile_output);
        } catch (e) {
          console.warn("Failed to decode compile_output:", e);
        }
      }

      return result;
    } catch (error) {
      console.error("Judge0 result fetch error:", error);
      throw error;
    }
  }

  static async executeTestCase(
    code: string,
    language: string,
    input: string,
    expectedOutput: string,
    options: { timeLimit?: number; memoryLimit?: number } = {},
  ): Promise<TestCase> {
    const lang = PROGRAMMING_LANGUAGES.find((l) => l.id === language);
    if (!lang) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const timeLimit = options.timeLimit || 5000; // ms
    const memoryLimit = options.memoryLimit || 256; // MB

    try {
      // Submit code
      const token = await this.submitCode(
        code,
        lang.judge0Id,
        input,
        expectedOutput,
        timeLimit / 1000,
        memoryLimit,
      );

      // Poll for result
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second

        const result = await this.getResult(token);

        // Check if processing is complete
        if (result.status.id !== 1 && result.status.id !== 2) {
          // Not "In Queue" or "Processing"
          return this.parseResult(result, input, expectedOutput);
        }

        attempts++;
      }

      throw new Error("Execution timeout - Judge0 took too long to process");
    } catch (error) {
      console.error("Test case execution error:", error);
      return {
        input,
        expected_output: expectedOutput,
        actual_output: "",
        status: "ERROR",
        error_message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private static parseResult(
    result: Judge0Result,
    input: string,
    expectedOutput: string,
  ): TestCase {
    const testCase: TestCase = {
      input,
      expected_output: expectedOutput,
      actual_output: result.stdout || "",
      execution_time: result.time ? parseFloat(result.time) * 1000 : undefined, // Convert to ms
      memory_used: result.memory ? result.memory / 1024 : undefined, // Convert to MB
    };

    // Determine status based on Judge0 status ID
    switch (result.status.id) {
      case 3: // Accepted
        const actualTrimmed = (result.stdout || "").trim();
        const expectedTrimmed = expectedOutput.trim();
        testCase.status =
          actualTrimmed === expectedTrimmed ? "PASSED" : "FAILED";

        if (testCase.status === "FAILED" && expectedTrimmed) {
          testCase.error_message = `Output mismatch. Expected: "${expectedTrimmed}", Got: "${actualTrimmed}"`;
        }
        break;
      case 4: // Wrong Answer
        testCase.status = "FAILED";
        testCase.error_message = `Wrong Answer. Expected: "${expectedOutput.trim()}", Got: "${(result.stdout || "").trim()}"`;
        break;
      case 5: // Time Limit Exceeded
        testCase.status = "TIME_LIMIT_EXCEEDED";
        testCase.error_message = "Time limit exceeded";
        break;
      case 6: // Compilation Error
        testCase.status = "COMPILATION_ERROR";
        testCase.error_message = result.compile_output || "Compilation failed";
        testCase.compile_output = result.compile_output;
        break;
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12: // Runtime Errors
        testCase.status = "RUNTIME_ERROR";
        testCase.error_message =
          result.stderr || result.message || "Runtime error occurred";
        break;
      default:
        testCase.status = "ERROR";
        testCase.error_message =
          result.message || result.status.description || "Unknown error";
    }

    return testCase;
  }
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
}: QuestionRendererProps) {
  const [textValue, setTextValue] = useState(answer.textAnswer || "");
  const [codeValue, setCodeValue] = useState(
    answer.textAnswer || LANGUAGE_TEMPLATES.javascript,
  );
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    submitted: boolean;
    message: string;
    success: boolean;
  }>({ submitted: false, message: "", success: false });

  // Enhanced detection for CODE questions
  const questionData = question as any;
  const isCodeQuestion =
    questionData.originalType === "CODE" ||
    questionData.type === "CODE" ||
    questionData.questionType === "CODE";

  console.log("Question analysis:", {
    id: question.id,
    originalType: questionData.originalType,
    type: questionData.type,
    questionType: question.questionType,
    isCodeQuestion,
  });

  // Parse test cases with enhanced error handling
  const parseTestCases = (testCases: any): TestCase[] => {
    if (!testCases) return [];

    if (Array.isArray(testCases)) return testCases;

    if (typeof testCases === "string") {
      try {
        const parsed = JSON.parse(testCases);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Failed to parse test cases:", error);
        return [];
      }
    }

    return [];
  };

  // Get question data with fallbacks
  const getQuestionData = () => {
    const visibleTestCases = parseTestCases(
      questionData.visible_testcases ||
        questionData.visibleTestcases ||
        questionData.visibleTestCases ||
        questionData.testCases ||
        questionData.examples ||
        [],
    );

    const hiddenTestCases = parseTestCases(
      questionData.hidden_testcases ||
        questionData.hiddenTestcases ||
        questionData.hiddenTestCases ||
        [],
    );

    const constraints =
      questionData.constraints ||
      questionData.constraint ||
      questionData.problemConstraints ||
      null;

    const timeLimit =
      questionData.time_limit_ms ||
      questionData.timeLimitMs ||
      questionData.timeLimit ||
      5000;

    const memoryLimit =
      questionData.memory_limit_mb ||
      questionData.memoryLimitMb ||
      questionData.memoryLimit ||
      256;

    return {
      visibleTestCases,
      hiddenTestCases,
      constraints,
      timeLimit,
      memoryLimit,
    };
  };

  const {
    visibleTestCases,
    hiddenTestCases,
    constraints,
    timeLimit,
    memoryLimit,
  } = getQuestionData();

  useEffect(() => {
    if (isCodeQuestion) {
      if (!answer.textAnswer) {
        const template =
          LANGUAGE_TEMPLATES[
            selectedLanguage as keyof typeof LANGUAGE_TEMPLATES
          ] || LANGUAGE_TEMPLATES.javascript;
        setCodeValue(template);
      } else {
        setCodeValue(answer.textAnswer);
      }
    }
  }, [isCodeQuestion, answer.textAnswer, selectedLanguage]);

  const handleOptionChange = (
    optionId: string,
    isMultiSelect: boolean = false,
  ) => {
    let newSelectedOptions: string[];

    if (isMultiSelect) {
      if (answer.selectedOptions.includes(optionId)) {
        newSelectedOptions = answer.selectedOptions.filter(
          (id) => id !== optionId,
        );
      } else {
        newSelectedOptions = [...answer.selectedOptions, optionId];
      }
    } else {
      newSelectedOptions = [optionId];
    }

    onAnswerChange(question.id, newSelectedOptions);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    onAnswerChange(question.id, [], value);
  };

  const handleCodeChange = (value: string) => {
    setCodeValue(value);
    onAnswerChange(question.id, [], value);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const template =
      LANGUAGE_TEMPLATES[language as keyof typeof LANGUAGE_TEMPLATES];
    if (template && !(codeValue as any).trim()) {
      setCodeValue(template);
      onAnswerChange(question.id, [], template);
    }
  };

  const handleRunCode = async () => {
    if (!codeValue.trim()) {
      alert("Please write some code before running tests.");
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // If no visible test cases, create a simple test to run the code
      let testCasesToRun = visibleTestCases;
      if (testCasesToRun.length === 0) {
        testCasesToRun = [{ input: "", expected_output: "" }];
      }

      const results: TestCase[] = [];

      for (let i = 0; i < testCasesToRun.length; i++) {
        const testCase = testCasesToRun[i];

        try {
          console.log(
            `Running test case ${i + 1}: Input="${testCase.input}", Expected="${testCase.expected_output}"`,
          );

          const result = await Judge0Service.executeTestCase(
            codeValue,
            selectedLanguage,
            testCase.input || "",
            testCase.expected_output || "",
            {
              timeLimit,
              memoryLimit,
            },
          );

          results.push(result);
          console.log(`Test case ${i + 1} result:`, result);
        } catch (error) {
          console.error(`Test case ${i + 1} execution failed:`, error);
          results.push({
            input: testCase.input || "",
            expected_output: testCase.expected_output || "",
            actual_output: "",
            status: "ERROR",
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      setTestResults(results);

      // Show success message if no test cases but code ran successfully
      if (
        visibleTestCases.length === 0 &&
        results.length > 0 &&
        results[0].status !== "ERROR"
      ) {
        console.log("Code executed successfully!");
      }
    } catch (error) {
      console.error("Code execution error:", error);
      alert(
        `Execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );

      // Set error result
      setTestResults([
        {
          input: "",
          expected_output: "",
          actual_output: "",
          status: "ERROR",
          error_message:
            error instanceof Error ? error.message : "Unknown error",
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!codeValue.trim()) {
      alert("Please write some code before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const allTestCases = [...visibleTestCases, ...hiddenTestCases];
      const results: TestCase[] = [];
      let passedCount = 0;

      for (let i = 0; i < allTestCases.length; i++) {
        const testCase = allTestCases[i];

        try {
          const result = await Judge0Service.executeTestCase(
            codeValue,
            selectedLanguage,
            testCase.input || "",
            testCase.expected_output || "",
            {
              timeLimit,
              memoryLimit,
            },
          );

          results.push(result);
          if (result.status === "PASSED") {
            passedCount++;
          }
        } catch (error) {
          console.error(`Test case ${i + 1} execution failed:`, error);
          results.push({
            input: testCase.input || "",
            expected_output: testCase.expected_output || "",
            actual_output: "",
            status: "ERROR",
            error_message:
              error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      // Calculate score
      const totalTests = allTestCases.length;
      const scorePercentage =
        totalTests > 0 ? (passedCount / totalTests) * 100 : 0;
      const score =
        totalTests > 0 ? (passedCount / totalTests) * question.marks : 0;

      // Store submission data (you can extend this to save to backend)
      const submissionData = {
        questionId: question.id,
        code: codeValue,
        language: selectedLanguage,
        results,
        totalTests,
        passedTests: passedCount,
        score,
        scorePercentage,
        submittedAt: new Date().toISOString(),
      };

      // Save to localStorage for now (replace with API call)
      localStorage.setItem(
        `submission_${question.id}`,
        JSON.stringify(submissionData),
      );

      setSubmissionStatus({
        submitted: true,
        success: scorePercentage >= 50, // Consider 50% as success threshold
        message: `Code submitted successfully! Passed ${passedCount}/${totalTests} test cases (${scorePercentage.toFixed(1)}%). Score: ${score.toFixed(1)}/${question.marks}`,
      });

      // Update the answer to mark as submitted
      onAnswerChange(question.id, [], codeValue);
    } catch (error) {
      console.error("Code submission error:", error);
      setSubmissionStatus({
        submitted: false,
        success: false,
        message: `Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "PASSED":
        return <Check className="w-4 h-4 text-green-500" />;
      case "FAILED":
        return <X className="w-4 h-4 text-red-500" />;
      case "TIME_LIMIT_EXCEEDED":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "COMPILATION_ERROR":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "RUNTIME_ERROR":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "ERROR":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PASSED":
        return "text-green-600 bg-green-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      case "TIME_LIMIT_EXCEEDED":
        return "text-yellow-600 bg-yellow-100";
      case "COMPILATION_ERROR":
        return "text-orange-600 bg-orange-100";
      case "RUNTIME_ERROR":
        return "text-red-600 bg-red-100";
      case "ERROR":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const renderMCQOptions = () => {
    if (!question.options || question.options.length === 0) {
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">
          <strong>Error:</strong> No options available for this MCQ question.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {question.options
          .sort((a, b) => (a.optionOrder || 0) - (b.optionOrder || 0))
          .map((option, index) => {
            const isSelected = answer.selectedOptions.includes(option.id);

            return (
              <div
                key={option.id || index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleOptionChange(option.id, false)}
              >
                <div className="flex items-center space-x-3">
                  {isSelected ? (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-700 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-gray-900">
                    {option.optionText ||
                      option.text ||
                      option.label ||
                      `Option ${index + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderMultipleSelectOptions = () => {
    if (!question.options) return null;

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">Select all that apply:</p>
        {question.options
          .sort((a, b) => a.optionOrder - b.optionOrder)
          .map((option) => {
            const isSelected = answer.selectedOptions.includes(option.id);
            return (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleOptionChange(option.id, true)}
              >
                <div className="flex items-center space-x-3">
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-900">{option.optionText}</span>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderTrueFalseOptions = () => {
    const options = [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ];

    return (
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = answer.selectedOptions.includes(option.id);
          return (
            <div
              key={option.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => handleOptionChange(option.id)}
            >
              <div className="flex items-center space-x-3">
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-gray-900 font-medium">{option.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextInput = (isLongAnswer: boolean = false) => {
    const placeholder = isLongAnswer
      ? "Write your detailed answer here..."
      : "Write your short answer here...";

    if (isLongAnswer) {
      return (
        <div className="space-y-2">
          <textarea
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[200px] resize-vertical"
            rows={8}
            spellCheck={true}
          />
          <div className="text-right text-sm text-gray-500">
            {textValue.length} characters
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <div className="text-right text-sm text-gray-500">
          {textValue.length} characters
        </div>
      </div>
    );
  };

  const renderCodeInterface = () => {
    return (
      <div className="h-full flex bg-gray-50">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <span className="font-medium">Marks:</span>
                <span className="ml-1">{question.marks}</span>
              </div>
              {timeLimit && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{timeLimit}ms</span>
                </div>
              )}
              {memoryLimit && (
                <div className="flex items-center">
                  <MemoryStick className="w-4 h-4 mr-1" />
                  <span>{memoryLimit}MB</span>
                </div>
              )}
            </div>

            {submissionStatus.submitted && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  submissionStatus.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {submissionStatus.success ? (
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <X className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span
                    className={`font-medium ${
                      submissionStatus.success
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                  >
                    {submissionStatus.success
                      ? "Submitted Successfully!"
                      : "Submission Error"}
                  </span>
                </div>
                <p
                  className={`mt-1 text-sm ${
                    submissionStatus.success ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {submissionStatus.message}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Problem Statement
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: question.questionText }}
              />
            </div>

            {visibleTestCases && visibleTestCases.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Examples
                </h3>
                <div className="space-y-4">
                  {visibleTestCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="font-medium mb-3 text-gray-800">
                        Example {index + 1}:
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">
                            Input:
                          </span>
                          <pre className="bg-white p-3 rounded border font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                            {testCase.input || "No input"}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 block mb-1">
                            Output:
                          </span>
                          <pre className="bg-white p-3 rounded border font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                            {testCase.expected_output || "No expected output"}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {constraints && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Constraints
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-sm text-gray-700 whitespace-pre-line font-mono">
                    {constraints}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const template =
                      LANGUAGE_TEMPLATES[
                        selectedLanguage as keyof typeof LANGUAGE_TEMPLATES
                      ];
                    setCodeValue(template);
                    handleCodeChange(template);
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RefreshCw className="w-4 h-4 mr-1 inline" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <SimpleCodeEditor
                value={codeValue}
                onChange={handleCodeChange}
                language={selectedLanguage}
                height="100%"
                theme="dark"
              />
            </div>

            {(testResults.length > 0 || isRunning) && (
              <div className="h-48 border-t border-gray-200 bg-gray-50 flex flex-col">
                <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800 text-sm">Output</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {isRunning ? (
                    <div className="flex items-center text-gray-600">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Running code...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(result.status)}
                              <span className="font-medium text-sm">
                                Test Case {index + 1}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${getStatusColor(result.status)}`}
                              >
                                {result.status?.replace(/_/g, " ") || "Unknown"}
                              </span>
                            </div>
                            {result.execution_time && (
                              <div className="text-xs text-gray-500">
                                {result.execution_time.toFixed(1)}ms
                              </div>
                            )}
                          </div>

                          {result.actual_output && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-600 font-medium mb-1">
                                Output:
                              </div>
                              <div className="text-xs bg-gray-100 p-2 rounded border font-mono">
                                {result.actual_output}
                              </div>
                            </div>
                          )}

                          {result.error_message && (
                            <div className="mb-2">
                              <div className="text-xs text-red-600 font-medium mb-1">
                                Error:
                              </div>
                              <div className="text-xs text-red-700 bg-red-50 p-2 rounded border font-mono">
                                {result.error_message}
                              </div>
                            </div>
                          )}

                          {result.compile_output && (
                            <div className="mb-2">
                              <div className="text-xs text-orange-600 font-medium mb-1">
                                Compilation Output:
                              </div>
                              <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border font-mono">
                                {result.compile_output}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                            <div>
                              <div className="text-gray-600 mb-1 font-medium">
                                Input
                              </div>
                              <div className="bg-gray-50 p-2 rounded font-mono border max-h-16 overflow-y-auto">
                                {result.input || "No input"}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600 mb-1 font-medium">
                                Expected
                              </div>
                              <div className="bg-gray-50 p-2 rounded font-mono border max-h-16 overflow-y-auto">
                                {result.expected_output || "No expected output"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isRunning ? "Running..." : "Run Code"}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isSubmitting || submissionStatus.submitted}
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ml-auto ${
                  submissionStatus.submitted
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : submissionStatus.submitted ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {isSubmitting
                  ? "Submitting..."
                  : submissionStatus.submitted
                    ? "Submitted"
                    : "Submit Solution"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getQuestionTypeLabel = () => {
    if (isCodeQuestion) {
      return "Coding Question";
    }

    switch (question.questionType) {
      case QuestionType.MCQ:
        return "Multiple Choice (Select one)";
      case QuestionType.MULTIPLE_SELECT:
        return "Multiple Select (Select all that apply)";
      case QuestionType.TRUE_FALSE:
        return "True/False";
      case QuestionType.SHORT_ANSWER:
        return "Short Answer";
      case QuestionType.LONG_ANSWER:
        return "Long Answer";
      default:
        return "Question";
    }
  };

  const renderQuestionContent = () => {
    if (isCodeQuestion) {
      return renderCodeInterface();
    }

    switch (question.questionType) {
      case QuestionType.MCQ:
        return renderMCQOptions();
      case QuestionType.MULTIPLE_SELECT:
        return renderMultipleSelectOptions();
      case QuestionType.TRUE_FALSE:
        return renderTrueFalseOptions();
      case QuestionType.SHORT_ANSWER:
        return renderTextInput(false);
      case QuestionType.LONG_ANSWER:
        return renderTextInput(true);
      default:
        return (
          <div className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">
            <strong>Unsupported Question Type:</strong> {question.questionType}
          </div>
        );
    }
  };

  return (
    <>
      {isCodeQuestion ? (
        renderCodeInterface()
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  isCodeQuestion
                    ? "text-purple-600 bg-purple-100"
                    : "text-blue-600 bg-blue-100"
                }`}
              >
                {getQuestionTypeLabel()}
              </span>
              <span className="text-sm text-gray-500">
                {question.marks} {question.marks === 1 ? "mark" : "marks"}
              </span>
            </div>

            <div className="prose prose-sm max-w-none mb-3">
              <div
                className="text-lg text-gray-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: question.questionText }}
              />
            </div>
          </div>

          <div className="mb-6">{renderQuestionContent()}</div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {answer.selectedOptions.length > 0 ||
                answer.textAnswer ||
                codeValue !== LANGUAGE_TEMPLATES.javascript ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">
                      {isCodeQuestion ? "Code Written" : "Answered"}
                    </span>
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">
                      {isCodeQuestion ? "No code written" : "Not answered"}
                    </span>
                  </>
                )}
              </div>

              <div className="text-gray-500">
                Question {question.order || 1}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
