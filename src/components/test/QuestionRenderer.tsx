"use client";

import { useState, useEffect } from "react";
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
import MonacoCodeEditor from "../MonacoCodeEditor";
import { LANGUAGE_TEMPLATES, PROGRAMMING_LANGUAGES } from "@/utils/languages";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../resizable";
import { Confetti } from "../Confetti";
import { QuestionRendererProps, TestCase } from "@/types/testInterface";
import { QuestionType } from "@/types/test";
import { Toast } from "@/utils/Toast";
import { CodeExecutionService } from "@/services/codeExecutionService";
import { getMonacoLanguage } from "@/utils/getMonacoLanguage";

export default function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
  onCodeSubmit,
  existingSubmission,
  testId = "",
}: QuestionRendererProps) {
  useEffect(() => {
    console.log("QuestionRenderer mounted/updated:", {
      questionId: question.id,
      testId: testId,
      testIdType: typeof testId,
      testIdLength: testId?.length,
      hasTestId: !!testId,
      isCodeQuestion,
    });
  }, [testId, question.id]);
  useEffect(() => {
    console.log("Question changed, clearing test results:", {
      previousResults: testResults.length,
      newQuestionId: question.id,
    });
    setTestResults([]);
    setIsRunning(false);
    setIsSubmitting(false);
    setToast(null);
    setShowConfetti(false);
  }, [question.id]);

  const [textValue, setTextValue] = useState(answer.textAnswer || "");
  const [codeValue, setCodeValue] = useState(
    answer.textAnswer || LANGUAGE_TEMPLATES.javascript,
  );
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [submissionStatus, setSubmissionStatus] = useState<{
    submitted: boolean;
    message: string;
    success: boolean;
    allTestsPassed: boolean;
    totalTests: number;
    passedTests: number;
    score: number;
  }>({
    submitted: false,
    message: "",
    success: false,
    allTestsPassed: false,
    totalTests: 0,
    passedTests: 0,
    score: 0,
  });
  const questionData = question as any;
  const isCodeQuestion =
    questionData.originalType === "CODE" ||
    questionData.type === "CODE" ||
    questionData.questionType === "CODE";

  useEffect(() => {
    if (existingSubmission) {
      setSubmissionStatus(existingSubmission);
    } else {
      setSubmissionStatus({
        submitted: false,
        message: "",
        success: false,
        allTestsPassed: false,
        totalTests: 0,
        passedTests: 0,
        score: 0,
      });
    }

    setTestResults([]);
    setIsRunning(false);
    setIsSubmitting(false);
    setToast(null);
    setShowConfetti(false);
  }, [existingSubmission, question.id]);

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

      // Clear test results when switching to a different code question
      console.log("Switching to code question, clearing previous test results");
      setTestResults([]);
      setIsRunning(false);
      setIsSubmitting(false);
      setToast(null);
      setShowConfetti(false);
    }
  }, [isCodeQuestion, answer.textAnswer, selectedLanguage, question.id]);

  const showToast = (
    message: string,
    type: "success" | "error" | "warning" | "info",
  ) => {
    setToast({ message, type });
  };

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

    // Clear test results when language changes
    console.log("Language changed, clearing test results");
    setTestResults([]);
    setIsRunning(false);
    setIsSubmitting(false);
    setToast(null);
    setShowConfetti(false);
  };

  const handleRunCode = async () => {
    // Enhanced validation with better debugging
    if (!codeValue.trim()) {
      showToast("Please write some code before running tests.", "warning");
      return;
    }

    if (visibleTestCases.length === 0) {
      showToast("No sample test cases available for this question.", "warning");
      return;
    }

    // Better testId validation and debugging
    if (!testId || testId.trim() === "") {
      console.error("QuestionRenderer: testId is missing or empty", {
        testId,
        question: question.id,
      });
      showToast(
        "Test session not found. Please refresh the page and try again.",
        "error",
      );
      return;
    }

    // UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(testId)) {
      console.error("QuestionRenderer: Invalid testId format", {
        testId,
        question: question.id,
      });
      showToast(
        "Invalid test session. Please refresh the page and try again.",
        "error",
      );
      return;
    }

    console.log("QuestionRenderer: Starting code execution", {
      testId,
      questionId: question.id,
      language: selectedLanguage,
      codeLength: codeValue.length,
    });

    setIsRunning(true);
    setTestResults([]);

    try {
      const results = await CodeExecutionService.executeCode(
        question.id,
        codeValue,
        selectedLanguage,
        testId,
      );

      setTestResults(results);

      const passedTests = results.filter((r) => r.status === "PASSED").length;
      const totalTests = results.length;

      if (passedTests === totalTests) {
        showToast(`🎉 All ${totalTests} sample test cases passed!`, "success");
      } else {
        showToast(
          `${passedTests}/${totalTests} sample test cases passed.`,
          "info",
        );
      }
    } catch (error) {
      console.error("Code execution error:", error);
      showToast(
        `Execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    // Enhanced validation with better debugging
    if (!codeValue.trim()) {
      showToast("Please write some code before submitting.", "warning");
      return;
    }

    // Better testId validation and debugging
    if (!testId || testId.trim() === "") {
      console.error(
        "QuestionRenderer: testId is missing or empty for submission",
        { testId, question: question.id },
      );
      showToast(
        "Test session not found. Please refresh the page and try again.",
        "error",
      );
      return;
    }

    // UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(testId)) {
      console.error("QuestionRenderer: Invalid testId format for submission", {
        testId,
        question: question.id,
      });
      showToast(
        "Invalid test session. Please refresh the page and try again.",
        "error",
      );
      return;
    }

    console.log("QuestionRenderer: Starting code submission", {
      testId,
      questionId: question.id,
      language: selectedLanguage,
      codeLength: codeValue.length,
    });

    setIsSubmitting(true);

    try {
      const result = await CodeExecutionService.submitCode(
        question.id,
        codeValue,
        selectedLanguage,
        testId,
      );

      const passedTests = result.results.filter(
        (r) => r.status === "PASSED",
      ).length;
      const totalTests = result.results.length;
      const allPassed = passedTests === totalTests;

      const newSubmissionStatus = {
        submitted: true,
        success: allPassed,
        allTestsPassed: allPassed,
        totalTests,
        passedTests,
        score: result.score,
        message: allPassed
          ? `ACCEPTED - All ${totalTests} test cases passed!`
          : `WRONG ANSWER - ${passedTests}/${totalTests} test cases passed.`,
      };

      setSubmissionStatus(newSubmissionStatus);

      // Only show visible test results
      const visibleResults = result.results.slice(0, visibleTestCases.length);
      setTestResults(visibleResults);

      // Update answer
      onAnswerChange(question.id, [], codeValue);

      // Notify parent component
      if (onCodeSubmit) {
        onCodeSubmit(
          question.id,
          codeValue,
          selectedLanguage,
          result.results,
          result.score,
        );
      }

      // FIXED: Only show confetti and success message when ALL tests pass AND score > 0
      if (allPassed && result.score > 0) {
        setShowConfetti(true);
        showToast(
          `🎉 ACCEPTED! All ${totalTests} test cases passed! Score: ${result.score}/${question.marks} marks`,
          "success",
        );
        setTimeout(() => setShowConfetti(false), 5000);
      } else if (allPassed && result.score === 0) {
        // Edge case: All tests pass but score is 0 (shouldn't happen normally)
        showToast(
          `⚠️ All test cases passed but no score awarded. Please contact instructor.`,
          "warning",
        );
      } else {
        // Some or all tests failed
        showToast(
          `❌ WRONG ANSWER: ${passedTests}/${totalTests} test cases passed. Score: 0/${question.marks} marks`,
          "error",
        );
      }
    } catch (error) {
      console.error("Code submission error:", error);

      const errorSubmissionStatus = {
        submitted: true,
        success: false,
        allTestsPassed: false,
        totalTests: 0,
        passedTests: 0,
        score: 0,
        message: `ERROR - Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };

      setSubmissionStatus(errorSubmissionStatus);
      showToast(
        `❌ Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error",
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
                {submissionStatus.submitted && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      submissionStatus.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submissionStatus.success
                      ? "✅ ACCEPTED"
                      : "❌ WRONG ANSWER"}{" "}
                    ({submissionStatus.score}/{question.marks} marks)
                  </span>
                )}
                {/* Debug Info - Remove in production */}
                {process.env.NODE_ENV === "development" && (
                  <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                    TestID:{" "}
                    {testId ? `${testId.substring(0, 8)}...` : "MISSING"}
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
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                              isRunning
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
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
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                              isRunning || isSubmitting
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : submissionStatus.submitted
                                  ? submissionStatus.success
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-orange-600 text-white hover:bg-orange-700"
                                  : "bg-green-600 text-white hover:bg-green-700 transform hover:scale-105"
                            }`}
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : submissionStatus.submitted ? (
                              submissionStatus.success ? (
                                <Check className="w-4 h-4 mr-2" />
                              ) : (
                                <X className="w-4 h-4 mr-2" />
                              )
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            {submissionStatus.submitted
                              ? submissionStatus.success
                                ? "Accepted"
                                : "Try Again"
                              : isSubmitting
                                ? "Submitting..."
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

                            // Clear test results when resetting code
                            console.log("Code reset, clearing test results");
                            setTestResults([]);
                            setIsRunning(false);
                            setIsSubmitting(false);
                            setToast(null);
                            setShowConfetti(false);
                          }}
                          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
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
                      <div className="flex items-center space-x-2">
                        {testResults.length > 0 && !isRunning && (
                          <button
                            onClick={() => {
                              console.log("Manual clear test results");
                              setTestResults([]);
                              setToast(null);
                              setShowConfetti(false);
                            }}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-all"
                          >
                            Clear
                          </button>
                        )}
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
                              key={`${question.id}-${index}`}
                              className={`p-3 rounded-lg border transition-all ${
                                result.status === "PASSED"
                                  ? "bg-green-50 border-green-200 hover:bg-green-100"
                                  : "bg-red-50 border-red-200 hover:bg-red-100"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">
                                  Test Case {index + 1} (Sample)
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

        {/* Toast Notifications */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* FIXED: Confetti Animation - Only shown when truly successful */}
        <Confetti trigger={showConfetti} />
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

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      )}
    </>
  );
}
