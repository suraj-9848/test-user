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
  GripVertical,
} from "lucide-react";
import MonacoCodeEditor from "../MonacoCodeEditor";
import { LANGUAGE_TEMPLATES, PROGRAMMING_LANGUAGES } from "@/utils/languages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../resizable";

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

// Helper function to map language IDs to Monaco language identifiers
const getMonacoLanguage = (languageId: string): string => {
  const languageMap: { [key: string]: string } = {
    "63": "javascript",
    "71": "python",
    "62": "java",
    "54": "cpp",
    "50": "c",
    "51": "csharp",
    "78": "kotlin",
    "60": "go",
    "72": "ruby",
    "68": "php",
    "75": "typescript",
    "76": "rust",
    "77": "swift",
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    kotlin: "kotlin",
    go: "go",
    ruby: "ruby",
    php: "php",
    typescript: "typescript",
    rust: "rust",
    swift: "swift",
  };

  return languageMap[languageId] || "javascript";
};

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
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);
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
          headers: {
            Accept: "application/json",
          },
        },
      );

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      const result = JSON.parse(responseText);

      if (result.stdout) result.stdout = atob(result.stdout);
      if (result.stderr) result.stderr = atob(result.stderr);
      if (result.compile_output)
        result.compile_output = atob(result.compile_output);

      return result;
    } catch (error) {
      console.error("Judge0 result retrieval error:", error);
      throw error;
    }
  }

  static async runCode(
    sourceCode: string,
    languageId: number,
    testCases: TestCase[],
    timeLimit: number = 5,
    memoryLimit: number = 256,
  ): Promise<TestCase[]> {
    const results: TestCase[] = [];

    for (const testCase of testCases) {
      try {
        const token = await this.submitCode(
          sourceCode,
          languageId,
          testCase.input,
          testCase.expected_output,
          timeLimit,
          memoryLimit,
        );

        let result: Judge0Result;
        let attempts = 0;
        const maxAttempts = 30;

        do {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          result = await this.getResult(token);
          attempts++;
        } while (result.status.id <= 2 && attempts < maxAttempts);

        const processedTestCase = this.processResult(result, testCase);
        results.push(processedTestCase);
      } catch (error) {
        console.error("Error running test case:", error);
        results.push({
          ...testCase,
          status: "ERROR",
          error_message: `Execution error: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }

    return results;
  }

  private static processResult(
    result: Judge0Result,
    testCase: TestCase,
  ): TestCase {
    const processedTestCase: TestCase = {
      ...testCase,
      actual_output: result.stdout || "",
      execution_time: result.time ? parseFloat(result.time) : 0,
      memory_used: result.memory || 0,
    };

    const expectedOutput = testCase.expected_output;
    const actualOutput = result.stdout || "";

    switch (result.status.id) {
      case 3:
        const expectedTrimmed = expectedOutput.trim();
        const actualTrimmed = actualOutput.trim();
        processedTestCase.status =
          expectedTrimmed === actualTrimmed ? "PASSED" : "FAILED";

        if (processedTestCase.status === "FAILED" && expectedTrimmed) {
          processedTestCase.error_message = `Output mismatch. Expected: "${expectedTrimmed}", Got: "${actualTrimmed}"`;
        }
        break;
      case 4:
        processedTestCase.status = "FAILED";
        processedTestCase.error_message = `Wrong Answer. Expected: "${expectedOutput.trim()}", Got: "${actualOutput.trim()}"`;
        break;
      case 5:
        processedTestCase.status = "TIME_LIMIT_EXCEEDED";
        processedTestCase.error_message = "Time limit exceeded";
        break;
      case 6:
        processedTestCase.status = "COMPILATION_ERROR";
        processedTestCase.error_message =
          result.compile_output || "Compilation failed";
        processedTestCase.compile_output = result.compile_output;
        break;
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        processedTestCase.status = "RUNTIME_ERROR";
        processedTestCase.error_message =
          result.stderr || result.message || "Runtime error occurred";
        break;
      default:
        processedTestCase.status = "ERROR";
        processedTestCase.error_message =
          result.message || result.status.description || "Unknown error";
    }

    return processedTestCase;
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
    allTestsPassed: boolean;
    totalTests: number;
    passedTests: number;
  }>({
    submitted: false,
    message: "",
    success: false,
    allTestsPassed: false,
    totalTests: 0,
    passedTests: 0,
  });

  // Enhanced detection for CODE questions
  const questionData = question as any;
  const isCodeQuestion =
    questionData.originalType === "CODE" ||
    questionData.type === "CODE" ||
    questionData.questionType === "CODE";

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
    if (template && !codeValue.trim()) {
      setCodeValue(template);
      onAnswerChange(question.id, [], template);
    }
  };

  const handleRunCode = async () => {
    if (!codeValue.trim()) {
      alert("Please write some code before running tests.");
      return;
    }

    if (visibleTestCases.length === 0) {
      alert("No sample test cases available for this question.");
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      const languageConfig = PROGRAMMING_LANGUAGES.find(
        (lang) => lang.id === selectedLanguage,
      );

      if (!languageConfig) {
        throw new Error("Unsupported language selected");
      }

      // Only run visible test cases
      const results = await Judge0Service.runCode(
        codeValue,
        languageConfig.judge0Id,
        visibleTestCases,
        Math.floor(timeLimit / 1000),
        memoryLimit,
      );

      setTestResults(results);
    } catch (error) {
      console.error("Code execution error:", error);
      alert(
        `Error running code: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!codeValue.trim()) {
      alert("Please write some code before submitting.");
      return;
    }

    // Check if already submitted
    if (submissionStatus.submitted) {
      alert("You have already submitted this solution.");
      return;
    }

    // Direct submission without popup
    const allTestCases = [...visibleTestCases, ...hiddenTestCases];

    if (allTestCases.length === 0) {
      alert("No test cases available for this question.");
      return;
    }

    setIsSubmitting(true);

    try {
      const languageConfig = PROGRAMMING_LANGUAGES.find(
        (lang) => lang.id === selectedLanguage,
      );

      if (!languageConfig) {
        throw new Error("Unsupported language selected");
      }

      // Run all test cases (visible + hidden)
      const results = await Judge0Service.runCode(
        codeValue,
        languageConfig.judge0Id,
        allTestCases,
        Math.floor(timeLimit / 1000),
        memoryLimit,
      );

      const passedTests = results.filter((r) => r.status === "PASSED").length;
      const totalTests = results.length;
      const allPassed = passedTests === totalTests;

      // Calculate score - only give full marks if ALL tests pass
      const score = allPassed ? question.marks : 0;

      setSubmissionStatus({
        submitted: true,
        success: allPassed,
        allTestsPassed: allPassed,
        totalTests,
        passedTests,
        message: allPassed
          ? `ACCEPTED - All ${totalTests} test cases passed!`
          : `WRONG ANSWER - ${passedTests}/${totalTests} test cases passed.`,
      });

      // Only store visible test cases results for display
      const visibleResults = results.slice(0, visibleTestCases.length);
      setTestResults(visibleResults);

      // Update the answer - call onAnswerChange to save the code
      onAnswerChange(question.id, [], codeValue);

      // Show success/failure message with score information
      if (allPassed) {
        alert(
          `🎉 ACCEPTED!\n\nAll ${totalTests} test cases passed!\nScore: ${score}/${question.marks} marks`,
        );
      } else {
        alert(
          `❌ WRONG ANSWER\n\n${passedTests}/${totalTests} test cases passed.\nScore: 0/${question.marks} marks\n\nAll test cases must pass to earn marks.`,
        );
      }
    } catch (error) {
      console.error("Code submission error:", error);
      setSubmissionStatus({
        submitted: true,
        success: false,
        allTestsPassed: false,
        totalTests: 0,
        passedTests: 0,
        message: `ERROR - Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });

      alert(
        `❌ ERROR\n\nSubmission failed: ${error instanceof Error ? error.message : "Unknown error"}\nScore: 0/${question.marks} marks`,
      );
    } finally {
      setIsSubmitting(false);
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
        {question.options.map((option) => {
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
                <span className="text-gray-900 font-medium">
                  {option.optionText || option.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMultipleSelectOptions = () => {
    if (!question.options || question.options.length === 0) {
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">
          <strong>Error:</strong> No options available for this question.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">Select all that apply:</p>
        {question.options.map((option) => {
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
                <span className="text-gray-900 font-medium">
                  {option.optionText || option.text}
                </span>
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

  const renderTextInput = (
    isLongAnswer: boolean = false,
    isCode: boolean = false,
  ) => {
    const placeholder = isCode
      ? "Write your code here..."
      : isLongAnswer
        ? "Write your detailed answer here..."
        : "Write your short answer here...";

    if (isLongAnswer || isCode) {
      return (
        <div className="space-y-2">
          <textarea
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[200px] resize-vertical ${
              isCode ? "font-mono text-sm" : ""
            }`}
            rows={8}
            spellCheck={!isCode}
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Coding Question
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Marks: {question.marks}</span>
                {timeLimit && (
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(timeLimit / 1000)}s
                  </span>
                )}
                {memoryLimit && (
                  <span className="flex items-center">
                    <MemoryStick className="w-4 h-4 mr-1" />
                    {memoryLimit}MB
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Resizable Panels */}
        <div className="h-[calc(100vh-100px)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Problem Description Panel */}
            <ResizablePanel defaultSize={40} minSize={25}>
              <div className="h-full overflow-y-auto">
                <div className="p-6">
                  <div className="prose prose-sm max-w-none mb-6">
                    <div
                      className="text-gray-900 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: question.questionText,
                      }}
                    />
                  </div>

                  {constraints && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">
                        Constraints
                      </h4>
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <pre className="whitespace-pre-wrap">{constraints}</pre>
                      </div>
                    </div>
                  )}

                  {visibleTestCases.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">
                        Examples
                      </h4>
                      <div className="space-y-4">
                        {visibleTestCases.map((testCase, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                              <span className="text-sm font-medium text-gray-700">
                                Example {index + 1}
                              </span>
                            </div>
                            <div className="p-3 space-y-2">
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  Input:
                                </span>
                                <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                  {testCase.input}
                                </pre>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  Output:
                                </span>
                                <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                                  {testCase.expected_output}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Code Editor and Results Panel */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <ResizablePanelGroup direction="vertical" className="h-full">
                {/* Code Editor Panel */}
                <ResizablePanel defaultSize={65} minSize={40}>
                  <div className="h-full flex flex-col bg-white">
                    {/* Code Editor Header */}
                    <div className="bg-white border-b border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Solution</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleRunCode}
                            disabled={isRunning}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                              isRunning
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            {isRunning ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4 mr-2" />
                            )}
                            {isRunning ? "Running..." : "Run"}
                          </button>

                          <button
                            onClick={handleSubmitSolution}
                            disabled={isRunning || isSubmitting}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                              isRunning || isSubmitting
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : submissionStatus.submitted
                                  ? "bg-green-600 text-white"
                                  : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {submissionStatus.submitted ? (
                              <Check className="w-4 h-4 mr-2" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            {submissionStatus.submitted
                              ? "Submitted"
                              : "Submit Answer"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <select
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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

                    {/* Monaco Editor */}
                    <div className="flex-1">
                      <MonacoCodeEditor
                        value={codeValue}
                        onChange={handleCodeChange}
                        language={getMonacoLanguage(selectedLanguage)}
                        height="100%"
                        theme="vs-dark"
                        className="h-full"
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Test Results Panel */}
                <ResizablePanel defaultSize={35} minSize={20}>
                  <div className="h-full border-t border-gray-200 bg-gray-50 flex flex-col">
                    <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {isRunning ? "Running Tests..." : "Test Results"}
                      </h4>
                      {submissionStatus.submitted && (
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            submissionStatus.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {submissionStatus.success
                            ? "ACCEPTED"
                            : `WRONG ANSWER (${submissionStatus.passedTests}/${submissionStatus.totalTests})`}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {isRunning ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                            <p className="text-gray-600">Running tests...</p>
                          </div>
                        </div>
                      ) : testResults.length > 0 ? (
                        <div className="space-y-3">
                          {testResults.map((result, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                result.status === "PASSED"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">
                                  Test Case {index + 1}
                                  {index < visibleTestCases.length
                                    ? " (Sample)"
                                    : " (Hidden)"}
                                </span>
                                <div className="flex items-center space-x-2">
                                  {result.status === "PASSED" ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <X className="w-4 h-4 text-red-600" />
                                  )}
                                  <span
                                    className={`text-xs font-medium ${
                                      result.status === "PASSED"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {result.status}
                                  </span>
                                </div>
                              </div>

                              {result.execution_time !== undefined && (
                                <div className="text-xs text-gray-500 mb-1">
                                  Time: {result.execution_time.toFixed(3)}s
                                  {result.memory_used &&
                                    ` | Memory: ${result.memory_used}KB`}
                                </div>
                              )}

                              {index < visibleTestCases.length && (
                                <div className="mt-2 space-y-1">
                                  <div className="text-xs">
                                    <span className="font-medium text-gray-700">
                                      Input:
                                    </span>
                                    <div className="bg-gray-100 p-1 rounded text-xs font-mono">
                                      {result.input || "No input"}
                                    </div>
                                  </div>
                                  <div className="text-xs">
                                    <span className="font-medium text-gray-700">
                                      Expected:
                                    </span>
                                    <div className="bg-gray-100 p-1 rounded text-xs font-mono">
                                      {result.expected_output}
                                    </div>
                                  </div>
                                  <div className="text-xs">
                                    <span className="font-medium text-gray-700">
                                      Your Output:
                                    </span>
                                    <div className="bg-gray-100 p-1 rounded text-xs font-mono">
                                      {result.actual_output || "No output"}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {result.error_message && (
                                <div className="text-sm text-red-600 mt-1">
                                  {result.error_message}
                                </div>
                              )}

                              {result.compile_output && (
                                <div className="text-sm text-red-600 mt-1 font-mono">
                                  <strong>Compilation Error:</strong>
                                  <pre className="mt-1 text-xs">
                                    {result.compile_output}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <p>
                            No test results yet. Run some tests to see results
                            here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
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
        return question.originalType === "CODE" ? "Code Answer" : "Long Answer";
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
        const isCode = question.originalType === "CODE";
        return renderTextInput(true, isCode);
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
                {answer.selectedOptions.length > 0 || answer.textAnswer ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Answered</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600 font-medium">
                      Not answered
                    </span>
                  </>
                )}
              </div>
              <span className="text-gray-500">
                Question {question.id} of {question.marks} marks
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
