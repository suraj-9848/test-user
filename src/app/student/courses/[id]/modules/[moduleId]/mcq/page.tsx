"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

// API Configuration
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create API helper
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
  post: async (endpoint: string, data?: unknown) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
};

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  type: string;
}

interface MCQData {
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
}

interface SubmissionResponse {
  success: boolean;
  score?: number;
  passed?: boolean;
  message?: string;
}

// Helper to convert Quill Delta or string to HTML
function quillDeltaToHtml(delta: any): string {
  if (!delta) return "";
  if (typeof delta === "string") return delta;
  if (typeof delta === "object" && delta.ops) {
    return delta.ops
      .map((op: any) => (typeof op.insert === "string" ? op.insert : ""))
      .join("");
  }
  return "";
}

export default function MCQTest() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [mcq, setMCQ] = useState<MCQData | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  // const [isSubmitting, setIsSubmitting] = useState(false); // Removed for now
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [mcqStructure, setMcqStructure] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [retakeStatus, setRetakeStatus] = useState<any>(null);
  const [showRetakeOption, setShowRetakeOption] = useState(false);

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Invalid course or module ID");
      setLoading(false);
      return;
    }

    const fetchMCQData = async () => {
      try {
        setLoading(true);
        setError("");

        // First check retake status
        const retakeData = await api.get(
          `/api/student/modules/${moduleId}/mcq/retake-status`,
        );
        setRetakeStatus(retakeData);

        if (retakeData.hasAttempted && !retakeData.canRetake) {
          // Already passed, show review mode
          setAlreadyAttempted(true);
          // Still need to fetch MCQ structure for review
          try {
            const mcqData: MCQData = await api.get(
              `/api/student/modules/${moduleId}/mcq/review`,
            );
            setMcqStructure(mcqData);
          } catch (reviewErr) {
            console.warn(
              "Could not fetch MCQ structure for review:",
              reviewErr,
            );
          }
          return;
        }

        if (retakeData.hasAttempted && retakeData.canRetake) {
          // Failed but can retake
          setShowRetakeOption(true);
        }

        const mcqData: MCQData = await api.get(
          `/api/student/modules/${moduleId}/mcq`,
        );

        if (!mcqData.questions || mcqData.questions.length === 0) {
          throw new Error("No questions available");
        }

        setMCQ(mcqData);
      } catch (err: unknown) {
        console.error("Error fetching MCQ data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load MCQ";

        if (errorMessage.includes("already")) {
          setAlreadyAttempted(true);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMCQData();
  }, [courseId, moduleId]);

  // On mount, if already attempted, fetch review data
  useEffect(() => {
    if (alreadyAttempted) {
      setLoadingReview(true);
      Promise.all([
        api.get(`/api/student/modules/${moduleId}/mcq/results`),
        api
          .get(`/api/student/modules/${moduleId}/mcq/review`)
          .catch(() => null),
      ])
        .then(([results, reviewMcq]) => {
          setReviewData(results);
          setMcqStructure(reviewMcq);
        })
        .finally(() => setLoadingReview(false));
    }
  }, [alreadyAttempted, moduleId]);

  const handleSubmit = async () => {
    if (!mcq || Object.keys(responses).length !== mcq.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    // Build array of selected option IDs in question order
    const responseArray = mcq.questions.map((_, idx) => responses[idx]);

    try {
      const submissionData: SubmissionResponse = await api.post(
        `/api/student/modules/${moduleId}/mcq/responses`,
        {
          responses: responseArray,
          timeSpent: timeLeft,
        },
      );
      // Always show review after submit
      setAlreadyAttempted(true);
      setError("");
    } catch (err: any) {
      console.error("Error submitting MCQ:", err);
      // If 403, show review UI instead of just error
      if (err instanceof Error && err.message.includes("403")) {
        setAlreadyAttempted(true);
        setError("");
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit MCQ";
        setError(errorMessage);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (results || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, results, handleSubmit]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResponseChange = (questionIndex: number, optionId: string) => {
    setResponses((prev) => ({ ...prev, [questionIndex]: optionId }));
  };

  const handleRetakeAttempt = () => {
    // Reset all states for a fresh attempt
    setAlreadyAttempted(false);
    setReviewData(null);
    setMcqStructure(null);
    setResponses({});
    setResults(null);
    setTimeLeft(1800);
    setError("");
    setShowRetakeOption(false);

    // Refetch MCQ data
    window.location.reload();
  };

  const handleBack = () => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  if (!courseId || !moduleId) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Invalid Parameters
              </h3>
              <p className="text-red-700 mt-1">Invalid course or module ID</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading MCQ test...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("already attempted") && alreadyAttempted) {
    // Don't show the error, show the review UI instead
    return null;
  }

  if (!mcq && !alreadyAttempted) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Test Not Available
        </h2>
        <p className="text-gray-600 mb-6">
          The MCQ test for this module is not available at the moment.
        </p>
        <button
          onClick={handleBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Module
        </button>
      </div>
    );
  }

  // If already attempted or review data is present, only show review UI
  if (alreadyAttempted || (reviewData && mcqStructure)) {
    if (loadingReview || !reviewData || !mcqStructure) {
      return (
        <div className="py-12 text-center">Loading your MCQ review...</div>
      );
    }
    const { responses, score, passed, minimumPassMarks } = reviewData;
    const { questions } = mcqStructure;
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-8">
        <h2 className="text-xl font-bold mb-2">MCQ Attempt Review</h2>
        <div className="mb-4 text-sm text-gray-600">
          Score: <span className="font-semibold">{score.toFixed(1)}%</span>{" "}
          &middot; Passing: {minimumPassMarks}%<br />
          <span className={passed ? "text-green-600" : "text-red-600"}>
            {passed ? "Passed" : "Not Passed"}
          </span>
        </div>
        <div className="space-y-8">
          {questions.map((q: any, idx: number) => {
            const studentResp = responses.find(
              (r: any) => r.questionId === q.id,
            );
            const studentAnswer = studentResp ? studentResp.answer : null;
            return (
              <div key={q.id || idx} className="border rounded-lg p-4">
                <div
                  className="font-medium mb-2"
                  dangerouslySetInnerHTML={{
                    __html: quillDeltaToHtml(q.question),
                  }}
                />
                <div className="space-y-1">
                  {q.options.map((opt: any, oidx: number) => {
                    const isCorrect = q.correctAnswer === opt.id;
                    const isSelected = studentAnswer === opt.id;
                    const isIncorrect = isSelected && !isCorrect;
                    return (
                      <div
                        key={opt.id || oidx}
                        className={`flex items-center gap-2 p-1 rounded 
                          ${isCorrect ? "bg-green-50" : ""}
                          ${isIncorrect ? "bg-red-50 border border-red-400" : ""}
                          ${isSelected && isCorrect ? "bg-green-100 border border-green-400" : ""}`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: quillDeltaToHtml(opt.text),
                          }}
                        />
                        {isCorrect && (
                          <span className="ml-2 text-green-600 text-xs font-semibold">
                            Correct
                          </span>
                        )}
                        {isIncorrect && (
                          <span className="ml-2 text-red-700 text-xs font-semibold">
                            Your Answer (Incorrect)
                          </span>
                        )}
                        {isSelected && isCorrect && (
                          <span className="ml-2 text-green-700 text-xs font-semibold">
                            Correct &amp; Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <div
                    className="mt-2 text-xs text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: quillDeltaToHtml(q.explanation),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-8">
          {retakeStatus &&
            !retakeStatus.hasPassed &&
            retakeStatus.canRetake && (
              <button
                className="px-6 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
                onClick={handleRetakeAttempt}
              >
                Retake MCQ
              </button>
            )}
          <button
            className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
            onClick={() =>
              router.push(`/student/courses/${courseId}/modules/${moduleId}`)
            }
          >
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Retake Notification */}
      {showRetakeOption && retakeStatus && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-medium text-orange-800">
                Previous Attempt: {retakeStatus.score?.toFixed(1)}%
              </h3>
              <p className="text-orange-700 mt-1">
                You need {retakeStatus.passingScore}% to pass. You can retake
                this MCQ to improve your score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Module
            </button>
          </div>

          {!results && (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span
                className={`text-lg font-mono font-bold ${
                  timeLeft < 300 ? "text-red-600" : "text-orange-600"
                }`}
              >
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Module MCQ Test
          </h1>
          <p className="text-gray-600">
            Answer all questions to complete this module. Passing score:{" "}
            {mcq?.passingScore || 60}%
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div
          className={`rounded-xl p-6 shadow-sm border ${
            results.passed
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="text-center">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                results.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {results.passed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <h2
              className={`text-2xl font-bold mb-2 ${
                results.passed ? "text-green-800" : "text-red-800"
              }`}
            >
              {results.passed ? "Congratulations! You Passed!" : "Test Failed"}
            </h2>

            <p
              className={`text-lg mb-4 ${
                results.passed ? "text-green-700" : "text-red-700"
              }`}
            >
              Your Score:{" "}
              <span className="font-bold">{Math.round(results.score)}%</span>
            </p>

            <p
              className={`mb-6 ${
                results.passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {results.passed
                ? "You have successfully completed this module!"
                : `You need ${mcq?.passingScore || 60}% to pass. Keep studying and try again!`}
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBack}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Module
              </button>
              {!results.passed && (
                <button
                  onClick={() => {
                    setResults(null);
                    setResponses({});
                    setTimeLeft(1800);
                    setError("");
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retake Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      {!results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p className="text-gray-600 mt-1">
              Progress: {Object.keys(responses).length} of{" "}
              {mcq?.questions.length || 0} questions answered
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {mcq?.questions?.map((question, questionIndex) => (
              <div key={question.id || questionIndex} className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {questionIndex + 1}.{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: quillDeltaToHtml(question.question),
                      }}
                    />
                  </h3>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={option.id || optionIndex}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        responses[questionIndex] === option.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option.id}
                        checked={responses[questionIndex] === option.id}
                        onChange={() =>
                          handleResponseChange(questionIndex, option.id)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span
                        className="ml-3 text-gray-900"
                        dangerouslySetInnerHTML={{
                          __html: quillDeltaToHtml(option.text),
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )) || (
              <div className="p-6 text-center text-gray-500">
                No questions available
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {Object.keys(responses).length} of {mcq?.questions.length || 0}{" "}
                questions completed
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  Object.keys(responses).length !==
                    (mcq?.questions.length || 0) || alreadyAttempted
                }
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  alreadyAttempted
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : Object.keys(responses).length ===
                        (mcq?.questions.length || 0)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
