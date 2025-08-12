import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/router";

interface TestCase {
  input: string;
  expected_output: string;
}

interface Question {
  id: string;
  question_text: string;
  type: "MCQ" | "DESCRIPTIVE" | "CODE";
  marks: number;
  options?: Array<{ id: string; text: string }>;
  codeLanguage?: string;
  constraints?: string;
  time_limit_ms?: number;
  memory_limit_mb?: number;
  visible_testcases?: TestCase[];
  expectedWordCount?: number;
}

interface Test {
  id: string;
  title: string;
  description: string;
  durationInMinutes: number;
  maxMarks: number;
  questions: Question[];
}

interface TestTakingPageProps {
  testId: string;
}

interface Response {
  questionId: string;
  type: "mcq" | "descriptive" | "code";
  answer?: string[];
  text?: string;
  code?: string;
  language?: string;
}

const TestTakingPage: React.FC<TestTakingPageProps> = ({ testId }) => {
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<"mcq" | "code">("mcq");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Response State
  const [responses, setResponses] = useState<Record<string, Response>>({});

  // Code Execution State
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef<any>(null);

  // Filter questions by type
  const mcqQuestions =
    test?.questions.filter(
      (q) => q.type === "MCQ" || q.type === "DESCRIPTIVE",
    ) || [];
  const codeQuestions = test?.questions.filter((q) => q.type === "CODE") || [];

  useEffect(() => {
    loadTestData();
  }, [testId]);

  useEffect(() => {
    // Set initial selected question based on active tab
    if (activeTab === "mcq" && mcqQuestions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(mcqQuestions[0].id);
    } else if (
      activeTab === "code" &&
      codeQuestions.length > 0 &&
      !selectedQuestionId
    ) {
      setSelectedQuestionId(codeQuestions[0].id);
    }
  }, [activeTab, mcqQuestions, codeQuestions, selectedQuestionId]);

  useEffect(() => {
    // Timer countdown
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/tests/${testId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load test");
      }

      const result = await response.json();
      setTest(result.data);
      setTimeRemaining(result.data.durationInMinutes * 60);
    } catch (error) {
      console.error("Error loading test:", error);
      alert("Failed to load test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentQuestion = (): Question | undefined => {
    return test?.questions.find((q) => q.id === selectedQuestionId);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateResponse = (
    questionId: string,
    responseData: Partial<Response>,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], questionId, ...responseData },
    }));
  };

  const handleMCQResponse = (questionId: string, optionIds: string[]) => {
    updateResponse(questionId, { type: "mcq", answer: optionIds });
  };

  const handleDescriptiveResponse = (questionId: string, text: string) => {
    updateResponse(questionId, { type: "descriptive", text });
  };

  const handleCodeResponse = (
    questionId: string,
    code: string,
    language: string,
  ) => {
    updateResponse(questionId, { type: "code", code, language });
  };

  const executeCode = async () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion || currentQuestion.type !== "CODE") return;

    const code = editorRef.current?.getValue() || "";
    if (!code.trim()) {
      alert("Please write some code before executing.");
      return;
    }

    setIsExecuting(true);
    setCodeOutput("Executing...");

    try {
      const response = await fetch("/api/student/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          code,
          language: currentQuestion.codeLanguage,
          testCases: currentQuestion.visible_testcases || [],
        }),
      });

      if (!response.ok) {
        throw new Error("Code execution failed");
      }

      const result = await response.json();

      // Format output
      let output = `Execution Results (${result.data.testcases_passed}/${result.data.total_testcases} passed):\n\n`;

      result.data.execution_results?.forEach(
        (testResult: any, index: number) => {
          const status =
            testResult.status === "PASSED"
              ? "✅"
              : testResult.status === "FAILED"
                ? "❌"
                : "⚠️";
          output += `Test Case ${index + 1}: ${status} ${testResult.status}\n`;
          output += `Input: ${testResult.input}\n`;
          output += `Expected: ${testResult.expected_output}\n`;
          output += `Your Output: ${testResult.actual_output}\n`;

          if (testResult.execution_time) {
            output += `Time: ${testResult.execution_time.toFixed(2)}ms\n`;
          }

          if (testResult.error_message) {
            output += `Error: ${testResult.error_message}\n`;
          }

          output += "\n";
        },
      );

      setCodeOutput(output);

      // Save the code response
      handleCodeResponse(
        currentQuestion.id,
        code,
        currentQuestion.codeLanguage || "javascript",
      );
    } catch (error) {
      setCodeOutput("Error executing code: " + (error as Error).message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitTest = async () => {
    if (
      !confirm(
        "Are you sure you want to submit the test? This action cannot be undone.",
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      // Convert responses to the expected format
      const submissionResponses = Object.values(responses).map((response) => {
        if (response.type === "mcq") {
          return {
            questionId: response.questionId,
            type: "mcq",
            answer: response.answer || [],
          };
        } else if (response.type === "descriptive") {
          return {
            questionId: response.questionId,
            type: "descriptive",
            answer: response.text || "",
          };
        } else if (response.type === "code") {
          return {
            questionId: response.questionId,
            type: "code",
            code: response.code || "",
            language: response.language || "javascript",
          };
        }
        return response;
      });

      const response = await fetch(`/api/student/tests/${testId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
        body: JSON.stringify({ responses: submissionResponses }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit test");
      }

      const result = await response.json();

      // Redirect to results page
      router.push(
        `/student/tests/${testId}/results?submissionId=${result.data.submissionId}`,
      );
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStarterCode = (language: string): string => {
    const starters: Record<string, string> = {
      javascript: `// Write your solution here
function solve() {
    // Your code here
}

console.log(solve());`,
      python: `# Write your solution here
def solve():
    # Your code here
    pass

print(solve())`,
      java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Your code here
    }
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    };
    return starters[language] || starters.javascript;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Test not found
          </h2>
          <button
            onClick={() => router.push("/student/tests")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const currentQuestions = activeTab === "mcq" ? mcqQuestions : codeQuestions;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">Total Marks: {test.maxMarks}</p>
            </div>
            <div className="text-right">
              <div
                className={`text-xl font-mono font-bold ${
                  timeRemaining < 300 ? "text-red-600" : "text-blue-600"
                }`}
              >
                Time Remaining: {formatTime(timeRemaining)}
              </div>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Question Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              {/* Tab Navigation */}
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("mcq")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "mcq"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  MCQ ({mcqQuestions.length})
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "code"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Code ({codeQuestions.length})
                </button>
              </div>

              {/* Question List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currentQuestions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setSelectedQuestionId(question.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedQuestionId === question.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : responses[question.id]
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        Q{index + 1} {question.type === "CODE" && "💻"}
                      </span>
                      <span className="text-sm">
                        {question.marks}{" "}
                        {question.marks === 1 ? "mark" : "marks"}
                      </span>
                    </div>
                    {responses[question.id] && (
                      <div className="text-xs mt-1 text-green-600">
                        ✓ Answered
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                <div className="text-sm text-gray-600">
                  <div>
                    Answered: {Object.keys(responses).length}/
                    {test.questions.length}
                  </div>
                  <div>
                    MCQ:{" "}
                    {
                      Object.keys(responses).filter((id) =>
                        mcqQuestions.find((q) => q.id === id),
                      ).length
                    }
                    /{mcqQuestions.length}
                  </div>
                  <div>
                    Code:{" "}
                    {
                      Object.keys(responses).filter((id) =>
                        codeQuestions.find((q) => q.id === id),
                      ).length
                    }
                    /{codeQuestions.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentQuestion ? (
              <div className="bg-white rounded-lg shadow-sm">
                {activeTab === "mcq" ? (
                  <MCQQuestionView
                    question={currentQuestion}
                    response={responses[currentQuestion.id]}
                    onMCQResponse={handleMCQResponse}
                    onDescriptiveResponse={handleDescriptiveResponse}
                  />
                ) : (
                  <CodeQuestionView
                    question={currentQuestion}
                    response={responses[currentQuestion.id]}
                    onCodeResponse={handleCodeResponse}
                    onExecuteCode={executeCode}
                    codeOutput={codeOutput}
                    isExecuting={isExecuting}
                    editorRef={editorRef}
                    getStarterCode={getStarterCode}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">
                  {activeTab === "mcq"
                    ? "No MCQ questions available"
                    : "No coding questions available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// MCQ Question Component
const MCQQuestionView: React.FC<{
  question: Question;
  response: Response;
  onMCQResponse: (questionId: string, optionIds: string[]) => void;
  onDescriptiveResponse: (questionId: string, answer: string) => void;
}> = ({ question, response, onMCQResponse, onDescriptiveResponse }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    response?.answer || [],
  );
  const [descriptiveAnswer, setDescriptiveAnswer] = useState<string>(
    response?.text || "",
  );

  useEffect(() => {
    if (question.type === "MCQ") {
      onMCQResponse(question.id, selectedOptions);
    } else if (question.type === "DESCRIPTIVE") {
      onDescriptiveResponse(question.id, descriptiveAnswer);
    }
  }, [selectedOptions, descriptiveAnswer, question.id, question.type]);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {question.type === "MCQ"
              ? "Multiple Choice Question"
              : "Descriptive Question"}
          </h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
        </div>

        <div
          className="prose max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: question.question_text }}
        />
      </div>

      {question.type === "MCQ" && question.options ? (
        <div className="space-y-3">
          {question.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOptions.includes(option.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionToggle(option.id)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                  selectedOptions.includes(option.id)
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOptions.includes(option.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-gray-900">{option.text}</span>
            </label>
          ))}
        </div>
      ) : question.type === "DESCRIPTIVE" ? (
        <div>
          {question.expectedWordCount && (
            <p className="text-sm text-gray-600 mb-3">
              Expected word count: {question.expectedWordCount} words
            </p>
          )}
          <textarea
            value={descriptiveAnswer}
            onChange={(e) => setDescriptiveAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
          <div className="mt-2 text-sm text-gray-500">
            Word count:{" "}
            {
              descriptiveAnswer.split(/\s+/).filter((word) => word.length > 0)
                .length
            }
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Code Question Component
const CodeQuestionView: React.FC<{
  question: Question;
  response: Response;
  onCodeResponse: (questionId: string, code: string, language: string) => void;
  onExecuteCode: () => void;
  codeOutput: string;
  isExecuting: boolean;
  editorRef: React.MutableRefObject<any>;
  getStarterCode: (language: string) => string;
}> = ({
  question,
  response,
  onCodeResponse,
  onExecuteCode,
  codeOutput,
  isExecuting,
  editorRef,
  getStarterCode,
}) => {
  const [code, setCode] = useState(
    response?.code || getStarterCode(question.codeLanguage || "javascript"),
  );

  useEffect(() => {
    onCodeResponse(question.id, code, question.codeLanguage || "javascript");
  }, [code, question.id, question.codeLanguage]);

  return (
    <div className="h-full">
      {/* Question Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Coding Question
          </h2>
          <div className="flex items-center space-x-4">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.codeLanguage?.toUpperCase()}
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.marks} {question.marks === 1 ? "mark" : "marks"}
            </span>
          </div>
        </div>

        <div
          className="prose max-w-none text-gray-700 mb-4"
          dangerouslySetInnerHTML={{ __html: question.question_text }}
        />

        {/* Constraints */}
        {question.constraints && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Constraints:</h3>
            <p className="text-yellow-700 text-sm whitespace-pre-line">
              {question.constraints}
            </p>
          </div>
        )}

        {/* Time and Memory Limits */}
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Time Limit: {question.time_limit_ms}ms</span>
          <span>Memory Limit: {question.memory_limit_mb}MB</span>
        </div>
      </div>

      {/* Code Editor and Test Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
        {/* Left: Test Cases */}
        <div className="p-6 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <h3 className="font-medium text-gray-900 mb-4">Sample Test Cases</h3>

          {question.visible_testcases &&
          question.visible_testcases.length > 0 ? (
            <div className="space-y-4">
              {question.visible_testcases.map((testCase, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Test Case {index + 1}
                  </h4>
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Input:
                    </span>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {testCase.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Expected Output:
                    </span>
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
                      {testCase.expected_output}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sample test cases available.</p>
          )}
        </div>

        {/* Right: Code Editor */}
        <div className="flex flex-col">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <span className="font-medium text-gray-700">Code Editor</span>
            <button
              onClick={onExecuteCode}
              disabled={isExecuting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1">
            <Editor
              defaultLanguage={question.codeLanguage || "javascript"}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={(editor) => {
                editorRef.current = editor;
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Output Section */}
      {codeOutput && (
        <div className="p-6 border-t bg-gray-50">
          <h3 className="font-medium text-gray-900 mb-3">Output</h3>
          <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
            {codeOutput}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestTakingPage;
