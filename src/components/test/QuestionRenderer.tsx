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
} from "lucide-react";
import MonacoCodeEditor from "../MonacoCodeEditor";

interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?: "PASSED" | "FAILED" | "ERROR";
  execution_time?: number;
  memory_used?: number;
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

const LANGUAGE_TEMPLATES = {
  javascript: `// Write your solution here
function solution() {
    
}`,
  python: `# Write your solution here
def solution():
    pass`,
  java: `// Write your solution here
public class Solution {
    public void solution() {
        
    }
}`,
  cpp: `// Write your solution here
#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    return 0;
}`,
  c: `// Write your solution here
#include <stdio.h>

int main() {
    // Write your solution here
    return 0;
}`,
};

const LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
];

export default function QuestionRenderer({
  question,
  answer,
  onAnswerChange,
  onRunCode,
}: QuestionRendererProps) {
  const [textValue, setTextValue] = useState(answer.textAnswer || "");
  const [codeValue, setCodeValue] = useState(
    answer.textAnswer || LANGUAGE_TEMPLATES.javascript,
  );
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Enhanced detection for CODE questions
  const isCodeQuestion =
    question.originalType === "CODE" ||
    (question as any).questionType === "CODE" ||
    (question as any).type === "CODE";

  // Enhanced parsing function for test cases
  const parseTestCases = (testCases: any): TestCase[] => {
    if (!testCases) {
      console.log("No test cases provided");
      return [];
    }

    // If it's already an array, return it
    if (Array.isArray(testCases)) {
      console.log("Test cases already parsed as array:", testCases);
      return testCases;
    }

    // If it's a string, try to parse it as JSON
    if (typeof testCases === "string") {
      try {
        const parsed = JSON.parse(testCases);
        console.log("Successfully parsed test cases from JSON string:", parsed);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error(
          "Failed to parse test cases JSON:",
          error,
          "Raw data:",
          testCases,
        );
        return [];
      }
    }

    console.log("Unknown test cases format:", typeof testCases, testCases);
    return [];
  };

  // Enhanced data extraction with multiple fallback paths
  const getQuestionData = () => {
    const questionData = question as any;

    // Try multiple paths for each field to handle different data structures
    const visibleTestCases = parseTestCases(
      questionData.visible_testcases ||
        questionData.visibleTestcases ||
        questionData.visibleTestCases ||
        [],
    );

    const hiddenTestCases = parseTestCases(
      questionData.hidden_testcases ||
        questionData.hiddenTestcases ||
        questionData.hiddenTestcases ||
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

    const codeLanguage =
      questionData.codeLanguage ||
      questionData.code_language ||
      questionData.language ||
      "javascript";

    console.log("Extracted question data:", {
      isCodeQuestion,
      visibleTestCases: visibleTestCases.length,
      hiddenTestCases: hiddenTestCases.length,
      constraints: !!constraints,
      timeLimit,
      memoryLimit,
      codeLanguage,
      rawQuestion: questionData,
    });

    return {
      visibleTestCases,
      hiddenTestCases,
      constraints,
      timeLimit,
      memoryLimit,
      codeLanguage,
    };
  };

  const {
    visibleTestCases,
    hiddenTestCases,
    constraints,
    timeLimit,
    memoryLimit,
    codeLanguage,
  } = getQuestionData();

  useEffect(() => {
    if (isCodeQuestion) {
      const defaultLanguage = codeLanguage || "javascript";
      setSelectedLanguage(defaultLanguage);

      if (!answer.textAnswer) {
        const template =
          LANGUAGE_TEMPLATES[
            defaultLanguage as keyof typeof LANGUAGE_TEMPLATES
          ] || LANGUAGE_TEMPLATES.javascript;
        setCodeValue(template);
      } else {
        setCodeValue(answer.textAnswer);
      }
    }
  }, [isCodeQuestion, answer.textAnswer, codeLanguage]);

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
    if (!onRunCode || !isCodeQuestion) return;

    setIsRunning(true);
    try {
      const results = await onRunCode(question.id, codeValue, selectedLanguage);
      setTestResults(results);
    } catch (error) {
      console.error("Error running code:", error);
      setTestResults([]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "PASSED":
        return <Check className="w-4 h-4 text-green-500" />;
      case "FAILED":
      case "ERROR":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  const renderMCQOptions = () => {
    console.log("Rendering MCQ options for question:", question);
    console.log("Available options:", question.options);

    if (!question.options || question.options.length === 0) {
      console.warn("No options found for MCQ question:", question);
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">
          <strong>Error:</strong> No options available for this MCQ question.
          <br />
          <span className="text-sm">Question ID: {question.id}</span>
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
      <div className="h-screen flex bg-gray-50">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            {/* Problem Information */}
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

            {/* Problem Statement */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Problem Statement
              </h3>
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: question.questionText }}
              />
            </div>

            {/* Examples */}
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

            {/* Show message if no test cases */}
            {(!visibleTestCases || visibleTestCases.length === 0) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Examples
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    No visible test cases available for this problem.
                  </p>
                </div>
              </div>
            )}

            {/* Constraints */}
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

            {/* Show message if no constraints */}
            {!constraints && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Constraints
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm text-gray-500 italic">
                    No constraints specified for this problem.
                  </p>
                </div>
              </div>
            )}

            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg border">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Debug Info:
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Visible Test Cases: {visibleTestCases?.length || 0}</div>
                  <div>Hidden Test Cases: {hiddenTestCases?.length || 0}</div>
                  <div>Has Constraints: {!!constraints}</div>
                  <div>Time Limit: {timeLimit}ms</div>
                  <div>Memory Limit: {memoryLimit}MB</div>
                  <div>Code Language: {codeLanguage}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Editor Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {LANGUAGES.map((lang) => (
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
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoCodeEditor
              value={codeValue}
              onChange={handleCodeChange}
              language={selectedLanguage}
              height="100%"
            />
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              {onRunCode && (
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? "Running..." : "Run Code"}
                </button>
              )}
              <button
                onClick={() => handleCodeChange(codeValue)}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Solution
              </button>
            </div>
          </div>

          {/* Test Results Panel */}
          {testResults.length > 0 && (
            <div className="h-48 border-t border-gray-200 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">Test Results</h4>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium text-sm">
                            Test Case {index + 1}
                          </span>
                          {result.status === "PASSED" && (
                            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">
                              Passed
                            </span>
                          )}
                          {result.status === "FAILED" && (
                            <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">
                              Failed
                            </span>
                          )}
                          {result.status === "ERROR" && (
                            <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded">
                              Error
                            </span>
                          )}
                        </div>
                        {result.execution_time && (
                          <div className="text-xs text-gray-500">
                            {result.execution_time.toFixed(1)}ms
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <div className="text-gray-600 mb-1 font-medium">
                            Input
                          </div>
                          <div className="bg-gray-50 p-2 rounded font-mono border max-h-12 overflow-y-auto">
                            {result.input || "No input"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1 font-medium">
                            Expected
                          </div>
                          <div className="bg-gray-50 p-2 rounded font-mono border max-h-12 overflow-y-auto">
                            {result.expected_output || "No expected output"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1 font-medium">
                            Actual
                          </div>
                          <div className="bg-gray-50 p-2 rounded font-mono border max-h-12 overflow-y-auto">
                            {result.actual_output || "No output"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
    console.log(
      "Rendering question with type:",
      question.questionType,
      "Original type:",
      question.originalType,
      "Is code:",
      isCodeQuestion,
    );

    // Handle CODE questions first
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
        console.error(
          "Unsupported question type:",
          question.questionType,
          "Question:",
          question,
        );
        return (
          <div className="text-red-500 p-4 border border-red-300 rounded-lg bg-red-50">
            <strong>Unsupported Question Type:</strong> {question.questionType}
            <br />
            <span className="text-sm">
              Supported types: MCQ, MULTIPLE_SELECT, TRUE_FALSE, SHORT_ANSWER,
              LONG_ANSWER, CODE
            </span>
          </div>
        );
    }
  };

  return (
    <>
      {isCodeQuestion ? (
        // Full-screen LeetCode-style layout for CODE questions
        renderCodeInterface()
      ) : (
        // Regular card layout for other question types
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Question Header */}
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

          {/* Question Content */}
          <div className="mb-6">{renderQuestionContent()}</div>

          {/* Answer Status */}
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

              <div className="text-gray-500">Question {question.order}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
