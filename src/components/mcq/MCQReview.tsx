"use client";

import {
  renderContent,
  CONTENT_DISPLAY_CLASSES,
} from "@/utils/contentRenderer";

interface ReviewData {
  responses: Array<{
    questionId: string;
    answer: string;
  }>;
  score: number;
  passed: boolean;
  minimumPassMarks: number;
}

interface MCQStructure {
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correctAnswer: string;
    explanation?: string;
  }>;
}

interface MCQReviewProps {
  reviewData: ReviewData;
  mcqStructure: MCQStructure;
  retakeStatus: any;
  onRetake: () => void;
  onBackToModule: () => void;
  courseId: string;
  moduleId: string;
}

export default function MCQReview({
  reviewData,
  mcqStructure,
  retakeStatus,
  onRetake,
  onBackToModule,
}: MCQReviewProps) {
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
          const studentResp = responses.find((r: any) => r.questionId === q.id);
          const studentAnswer = studentResp ? studentResp.answer : null;
          return (
            <div key={q.id || idx} className="border rounded-lg p-4">
              <div
                className={`font-medium mb-2 ${CONTENT_DISPLAY_CLASSES}`}
                dangerouslySetInnerHTML={{
                  __html: renderContent(q.question),
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
                        className={CONTENT_DISPLAY_CLASSES}
                        dangerouslySetInnerHTML={{
                          __html: renderContent(opt.text),
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
                  className={`mt-2 text-xs text-gray-500 ${CONTENT_DISPLAY_CLASSES}`}
                  dangerouslySetInnerHTML={{
                    __html: renderContent(q.explanation),
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 mt-8">
        {retakeStatus && !retakeStatus.hasPassed && retakeStatus.canRetake && (
          <button
            className="px-6 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
            onClick={onRetake}
          >
            Retake MCQ
          </button>
        )}
        <button
          className="px-6 py-2 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
          onClick={onBackToModule}
        >
          Back to Module
        </button>
      </div>
    </div>
  );
}
