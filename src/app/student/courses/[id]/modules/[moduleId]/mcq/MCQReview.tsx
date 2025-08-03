"use client";

import { useEffect, useState } from "react";
import {
  renderContent,
  CONTENT_DISPLAY_CLASSES,
} from "@/utils/contentRenderer";
import { buildApiUrl, API_ENDPOINTS } from "@/config/urls";

const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
};

export default function MCQReview({ moduleId }: { moduleId: string }) {
  const [reviewData, setReviewData] = useState<any>(null);
  const [mcqStructure, setMcqStructure] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(API_ENDPOINTS.STUDENT.MODULE_MCQ_RESULTS(moduleId)),
      api
        .get(API_ENDPOINTS.STUDENT.MODULE_MCQ_REVIEW(moduleId))
        .catch(() => null),
    ])
      .then(([results, reviewMcq]) => {
        setReviewData(results);
        setMcqStructure(reviewMcq);
      })
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading || !reviewData || !mcqStructure) {
    return <div className="py-8 text-center">Loading your MCQ review...</div>;
  }
  const { responses, score, passed, minimumPassMarks } = reviewData;
  const { questions } = mcqStructure;
  return (
    <div>
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
            <div
              key={q.id || idx}
              className="border rounded-2xl p-6 bg-white shadow-sm"
            >
              <div
                className={`font-semibold text-lg mb-4 ${CONTENT_DISPLAY_CLASSES}`}
                dangerouslySetInnerHTML={{
                  __html: renderContent(q.question),
                }}
              />
              <div className="space-y-2">
                {q.options.map((opt: any, oidx: number) => {
                  const isCorrect = q.correctAnswer === opt.id;
                  const isSelected = studentAnswer === opt.id;
                  const isIncorrect = isSelected && !isCorrect;
                  let rowClass =
                    "flex items-center gap-2 p-3 rounded-xl border";
                  let label = null;
                  if (isSelected && isCorrect) {
                    rowClass += " bg-green-100 border-green-400";
                    label = (
                      <span className="ml-2 text-green-700 text-xs font-semibold">
                        Correct &amp; Your Answer
                      </span>
                    );
                  } else if (isSelected && !isCorrect) {
                    rowClass += " bg-red-100 border-red-400";
                    label = (
                      <span className="ml-2 text-red-700 text-xs font-semibold">
                        Your Answer (Incorrect)
                      </span>
                    );
                  } else if (isCorrect) {
                    rowClass += " bg-green-50 border-green-300";
                    label = (
                      <span className="ml-2 text-green-600 text-xs font-semibold">
                        Correct
                      </span>
                    );
                  } else {
                    rowClass += " border-gray-200";
                  }
                  return (
                    <div key={opt.id || oidx} className={rowClass}>
                      <div
                        className={`flex-1 ${CONTENT_DISPLAY_CLASSES}`}
                        dangerouslySetInnerHTML={{
                          __html: renderContent(opt.text),
                        }}
                      />
                      {label}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <div
                  className={`mt-3 text-sm text-gray-500 ${CONTENT_DISPLAY_CLASSES}`}
                  dangerouslySetInnerHTML={{
                    __html: renderContent(q.explanation),
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
