// lms-frontend/src/components/TestInterface.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Send,
  Clock,
  MemoryStick,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import MonacoCodeEditor from "./MonacoCodeEditor";

interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?: "PASSED" | "FAILED" | "ERROR";
  execution_time?: number;
  memory_used?: number;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string; // This matches your backend
  type?: "MCQ" | "DESCRIPTIVE" | "CODE"; // Add this for backwards compatibility
  marks: number;
  options?: { id: string; optionText: string; text?: string }[];
  constraints?: string;
  visible_testcases?: TestCase[];
  hidden_testcases?: TestCase[];
  time_limit_ms?: number;
  memory_limit_mb?: number;
  // Add these to parse from your backend
  codeLanguage?: string;
}

interface TestInterfaceProps {
  test: {
    id: string;
    title: string;
    durationInMinutes: number;
    questions: Question[];
  };
  attempt: any; // Your existing attempt structure
  onTestComplete: () => void;
  onBack: () => void;
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

const TestInterface: React.FC<TestInterfaceProps> = ({
  test,
  attempt,
  onTestComplete,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"MCQ" | "CODE">("MCQ");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [codeStates, setCodeStates] = useState<
    Record<string, { code: string; language: string; results?: TestCase[] }>
  >({});
  const [timeRemaining, setTimeRemaining] = useState(
    test.durationInMinutes * 60,
  );
  const [isRunning, setIsRunning] = useState(false);

  // Parse questions and normalize the type field
  const normalizedQuestions = test.questions.map((q) => ({
    ...q,
    type:
      q.type ||
      ((q.questionType === "CODE"
        ? "CODE"
        : q.questionType === "MCQ"
          ? "MCQ"
          : "DESCRIPTIVE") as "MCQ" | "DESCRIPTIVE" | "CODE"),
    // Parse test cases if they're stored as JSON strings
    visible_testcases:
      typeof q.visible_testcases === "string"
        ? JSON.parse(q.visible_testcases)
        : q.visible_testcases || [],
    hidden_testcases:
      typeof q.hidden_testcases === "string"
        ? JSON.parse(q.hidden_testcases)
        : q.hidden_testcases || [],
  }));

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTestComplete]);

  // Separate questions by type
  const mcqQuestions = normalizedQuestions.filter((q) => q.type === "MCQ");
  const codeQuestions = normalizedQuestions.filter((q) => q.type === "CODE");

  // Set default tab based on available questions
  useEffect(() => {
    if (mcqQuestions.length > 0 && codeQuestions.length === 0) {
      setActiveTab("MCQ");
    } else if (codeQuestions.length > 0 && mcqQuestions.length === 0) {
      setActiveTab("CODE");
    } else if (codeQuestions.length > 0) {
      setActiveTab("CODE"); // Prefer CODE tab if both exist
    }
  }, [mcqQuestions.length, codeQuestions.length]);

  // Initialize code states for coding questions
  useEffect(() => {
    const initialCodeStates: Record<
      string,
      { code: string; language: string }
    > = {};
    codeQuestions.forEach((q) => {
      initialCodeStates[q.id] = {
        code: LANGUAGE_TEMPLATES.javascript,
        language: "javascript",
      };
    });
    setCodeStates(initialCodeStates);
  }, [codeQuestions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMCQAnswer = (questionId: string, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    // You can call your submit answer API here
  };

  const handleCodeChange = (questionId: string, code: string) => {
    setCodeStates((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], code },
    }));
  };

  const handleLanguageChange = (questionId: string, language: string) => {
    setCodeStates((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        language,
        code:
          LANGUAGE_TEMPLATES[language as keyof typeof LANGUAGE_TEMPLATES] || "",
      },
    }));
  };

  const handleRunCode = async (questionId: string) => {
    // TODO: Implement your Judge0 API call here
    setIsRunning(true);
    try {
      const codeState = codeStates[questionId];
      // Mock results for now - replace with actual Judge0 call
      const mockResults: TestCase[] = [
        {
          input: "5 3",
          expected_output: "8",
          actual_output: "8",
          status: "PASSED",
          execution_time: 25.5,
          memory_used: 15.2,
        },
      ];

      setTimeout(() => {
        setCodeStates((prev) => ({
          ...prev,
          [questionId]: { ...prev[questionId], results: mockResults },
        }));
        setIsRunning(false);
      }, 2000);
    } catch (error) {
      console.error("Error running code:", error);
      setIsRunning(false);
    }
  };

  const handleSubmitCode = (questionId: string) => {
    const codeState = codeStates[questionId];
    const newAnswers = { ...answers, [questionId]: codeState.code };
    setAnswers(newAnswers);
    // Call your submit API here
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

  // Don't show tabs if there's only one type of question
  const showTabs = mcqQuestions.length > 0 && codeQuestions.length > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">{test.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span
                className={`font-mono text-lg ${timeRemaining < 300 ? "text-red-600" : "text-gray-700"}`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={onTestComplete}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {/* Tab Navigation - only show if both types exist */}
          {showTabs && (
            <div className="border-b border-gray-200">
              <nav className="flex">
                {mcqQuestions.length > 0 && (
                  <button
                    onClick={() => setActiveTab("MCQ")}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "MCQ"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Multiple Choice ({mcqQuestions.length})
                  </button>
                )}
                {codeQuestions.length > 0 && (
                  <button
                    onClick={() => setActiveTab("CODE")}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "CODE"
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Coding ({codeQuestions.length})
                  </button>
                )}
              </nav>
            </div>
          )}

          {/* Question List */}
          <div className="p-4">
            {(activeTab === "MCQ" || !showTabs) && mcqQuestions.length > 0 && (
              <div className="space-y-2">
                {mcqQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedQuestionId === question.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            answers[question.id]
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        />
                        <span className="font-medium">
                          Question {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          {question.marks} marks
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {(activeTab === "CODE" || !showTabs) &&
              codeQuestions.length > 0 && (
                <div className="space-y-2">
                  {codeQuestions.map((question, index) => (
                    <button
                      key={question.id}
                      onClick={() => setSelectedQuestionId(question.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedQuestionId === question.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              answers[question.id]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="font-medium">
                            Problem {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">
                            {question.marks} marks
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedQuestionId ? (
            (() => {
              const question = normalizedQuestions.find(
                (q) => q.id === selectedQuestionId,
              );
              if (!question) return <div>Question not found</div>;

              if (question.type === "MCQ") {
                return (
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Question{" "}
                            {mcqQuestions.findIndex(
                              (q) => q.id === question.id,
                            ) + 1}
                          </h2>
                          <div className="text-sm text-gray-500 mb-4">
                            Marks: {question.marks}
                          </div>
                        </div>

                        <div
                          className="prose max-w-none mb-6"
                          dangerouslySetInnerHTML={{
                            __html: question.questionText,
                          }}
                        />

                        <div className="space-y-3">
                          {question.options?.map((option, index) => (
                            <label
                              key={option.id}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                answers[question.id] === option.id
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={option.id}
                                checked={answers[question.id] === option.id}
                                onChange={() =>
                                  handleMCQAnswer(question.id, option.id)
                                }
                                className="mr-3"
                              />
                              <span className="font-medium text-gray-700 mr-2">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <span className="text-gray-800">
                                {option.optionText || option.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (question.type === "CODE") {
                const codeState = codeStates[question.id];
                if (!codeState) return <div>Loading...</div>;

                return (
                  <div className="flex-1 flex">
                    {/* Left Panel - Problem Description */}
                    <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
                      <div className="p-6">
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Problem{" "}
                            {codeQuestions.findIndex(
                              (q) => q.id === question.id,
                            ) + 1}
                          </h2>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Marks: {question.marks}</span>
                            {question.time_limit_ms && (
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {question.time_limit_ms}ms
                              </span>
                            )}
                            {question.memory_limit_mb && (
                              <span className="flex items-center">
                                <MemoryStick className="w-4 h-4 mr-1" />
                                {question.memory_limit_mb}MB
                              </span>
                            )}
                          </div>
                        </div>

                        <div
                          className="prose max-w-none mb-6"
                          dangerouslySetInnerHTML={{
                            __html: question.questionText,
                          }}
                        />

                        {/* Examples */}
                        {question.visible_testcases &&
                          question.visible_testcases.length > 0 && (
                            <div className="mb-6">
                              <h3 className="text-md font-semibold text-gray-800 mb-3">
                                Examples
                              </h3>
                              <div className="space-y-4">
                                {question.visible_testcases.map(
                                  (
                                    testCase: {
                                      input:
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactElement<
                                            unknown,
                                            | string
                                            | React.JSXElementConstructor<any>
                                          >
                                        | Iterable<React.ReactNode>
                                        | React.ReactPortal
                                        | Promise<
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactPortal
                                            | React.ReactElement<
                                                unknown,
                                                | string
                                                | React.JSXElementConstructor<any>
                                              >
                                            | Iterable<React.ReactNode>
                                            | null
                                            | undefined
                                          >
                                        | null
                                        | undefined;
                                      expected_output:
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactElement<
                                            unknown,
                                            | string
                                            | React.JSXElementConstructor<any>
                                          >
                                        | Iterable<React.ReactNode>
                                        | React.ReactPortal
                                        | Promise<
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | React.ReactPortal
                                            | React.ReactElement<
                                                unknown,
                                                | string
                                                | React.JSXElementConstructor<any>
                                              >
                                            | Iterable<React.ReactNode>
                                            | null
                                            | undefined
                                          >
                                        | null
                                        | undefined;
                                    },
                                    index: any,
                                  ) => (
                                    <div
                                      key={index}
                                      className="bg-gray-50 p-4 rounded-lg"
                                    >
                                      <div className="font-medium mb-2">
                                        Example {index + 1}:
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium text-gray-700">
                                            Input:
                                          </span>
                                          <pre className="bg-white p-2 rounded mt-1 font-mono text-sm">
                                            {testCase.input}
                                          </pre>
                                        </div>
                                        <div>
                                          <span className="font-medium text-gray-700">
                                            Output:
                                          </span>
                                          <pre className="bg-white p-2 rounded mt-1 font-mono text-sm">
                                            {testCase.expected_output}
                                          </pre>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Constraints */}
                        {question.constraints && (
                          <div className="mb-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">
                              Constraints
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <pre className="text-sm text-gray-700 whitespace-pre-line">
                                {question.constraints}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel - Code Editor */}
                    <div className="w-1/2 flex flex-col">
                      {/* Editor Header */}
                      <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                          <select
                            value={codeState.language}
                            onChange={(e) =>
                              handleLanguageChange(question.id, e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {LANGUAGES.map((lang) => (
                              <option key={lang.id} value={lang.id}>
                                {lang.name}
                              </option>
                            ))}
                          </select>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRunCode(question.id)}
                              disabled={isRunning}
                              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {isRunning ? "Running..." : "Run Code"}
                            </button>
                            <button
                              onClick={() => handleSubmitCode(question.id)}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Code Editor */}
                      <div className="flex-1">
                        <MonacoCodeEditor
                          value={codeState.code}
                          onChange={(code) =>
                            handleCodeChange(question.id, code)
                          }
                          language={codeState.language}
                          height="100%"
                        />
                      </div>

                      {/* Test Results */}
                      {codeState.results && codeState.results.length > 0 && (
                        <div className="h-48 border-t border-gray-200 bg-gray-50 overflow-y-auto">
                          <div className="p-4">
                            <h4 className="font-medium text-gray-800 mb-3">
                              Test Results
                            </h4>
                            <div className="space-y-2">
                              {codeState.results.map((result, index) => (
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
                                        <span className="text-green-600 text-xs">
                                          Passed
                                        </span>
                                      )}
                                      {result.status === "FAILED" && (
                                        <span className="text-red-600 text-xs">
                                          Failed
                                        </span>
                                      )}
                                    </div>
                                    {result.execution_time && (
                                      <div className="text-xs text-gray-500">
                                        {result.execution_time.toFixed(1)}ms
                                      </div>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <div className="text-gray-600 mb-1">
                                        Input
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded font-mono max-h-12 overflow-y-auto">
                                        {result.input}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600 mb-1">
                                        Expected
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded font-mono max-h-12 overflow-y-auto">
                                        {result.expected_output}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-gray-600 mb-1">
                                        Actual
                                      </div>
                                      <div className="bg-gray-50 p-2 rounded font-mono max-h-12 overflow-y-auto">
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
              }
            })()
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">
                  Select a question to start
                </div>
                <p className="text-sm">Choose from the questions on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
