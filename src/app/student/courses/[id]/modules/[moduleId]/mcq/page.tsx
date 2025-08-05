"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import MCQHeader from "@/components/mcq/MCQHeader";
import MCQAlert from "@/components/mcq/MCQAlert";
import MCQQuestions from "@/components/mcq/MCQQuestions";
import MCQSubmit from "@/components/mcq/MCQSubmit";
import MCQResults from "@/components/mcq/MCQResults";
import MCQReview from "@/components/mcq/MCQReview";
import { mcqApi } from "@/utils/mcqApiClient";

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
  passingScore?: number;
}

interface SubmissionResponse {
  success: boolean;
  score?: number;
  passed?: boolean;
  message?: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
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
        const retakeData = await mcqApi.getRetakeStatus(moduleId);
        setRetakeStatus(retakeData);

        if (retakeData.hasAttempted && !retakeData.canRetake) {
          // Already passed, show review mode
          setAlreadyAttempted(true);
          // Still need to fetch MCQ structure for review
          try {
            const mcqData: MCQData = await mcqApi.getReview(moduleId);
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

        const mcqData: MCQData = await mcqApi.getMCQ(moduleId);

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
        mcqApi.getResults(moduleId),
        mcqApi.getReview(moduleId).catch(() => null),
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
      setIsSubmitting(true);
      const submissionData: SubmissionResponse = await mcqApi.submitResponses(
        moduleId,
        responseArray,
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
    } finally {
      setIsSubmitting(false);
    }
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
        <MCQAlert
          type="error"
          title="Invalid Parameters"
          message="Invalid course or module ID"
        />
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

    return (
      <MCQReview
        reviewData={reviewData}
        mcqStructure={mcqStructure}
        retakeStatus={retakeStatus}
        onRetake={handleRetakeAttempt}
        onBackToModule={handleBack}
        courseId={courseId}
        moduleId={moduleId}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-10 bg-white rounded-2xl shadow-xl">
      <div className="space-y-8 p-8">
        {/* Retake Notification */}
        {showRetakeOption && retakeStatus && (
          <MCQAlert
            type="warning"
            title={`Previous Attempt: ${retakeStatus.score?.toFixed(1)}%`}
            message={`You need ${retakeStatus.passingScore}% to pass. You can retake this MCQ to improve your score.`}
          />
        )}

        {/* Header */}
        <MCQHeader
          onBack={handleBack}
          moduleTitle="Module"
          passingScore={mcq?.passingScore || 60}
        />

        {/* Error Alert */}
        {error && <MCQAlert type="error" message={error} />}

        {/* Results */}
        {results && (
          <MCQResults
            results={results}
            passingScore={mcq?.passingScore || 60}
            onBackToModule={handleBack}
            onRetake={() => {
              setResults(null);
              setResponses({});
              setError("");
            }}
            showRetake={!results.passed}
          />
        )}

        {/* Questions */}
        {!results && mcq && (
          <div className="flex flex-col">
            <div className="overflow-y-auto max-h-[50vh] min-h-[200px] p-4 gap-6 rounded-xl bg-gray-50">
              <MCQQuestions
                questions={mcq.questions}
                responses={responses}
                onResponseChange={handleResponseChange}
                disabled={alreadyAttempted || isSubmitting}
              />
            </div>
          </div>
        )}
      </div>
      {/* Always visible submit button */}
      {!results && mcq && (
        <div className="sticky bottom-0 left-0 right-0 bg-white shadow-lg px-6 py-4 z-20">
          <MCQSubmit
            questionsCount={mcq.questions.length}
            responsesCount={Object.keys(responses).length}
            onSubmit={handleSubmit}
            disabled={
              Object.keys(responses).length !== mcq.questions.length ||
              alreadyAttempted
            }
            loading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
