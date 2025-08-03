"use client";

import {
  renderContent,
  CONTENT_DISPLAY_CLASSES,
} from "@/utils/contentRenderer";

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  type: string;
}

interface MCQQuestionsProps {
  questions: Question[];
  responses: { [key: number]: string };
  onResponseChange: (questionIndex: number, optionId: string) => void;
  disabled?: boolean;
}

export default function MCQQuestions({
  questions,
  responses,
  onResponseChange,
  disabled = false,
}: MCQQuestionsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
        <p className="text-gray-600 mt-1">
          Progress: {Object.keys(responses).length} of {questions.length}{" "}
          questions answered
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {questions.map((question, questionIndex) => (
          <div key={question.id || questionIndex} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {questionIndex + 1}.{" "}
                <span
                  className={CONTENT_DISPLAY_CLASSES}
                  dangerouslySetInnerHTML={{
                    __html: renderContent(question.question),
                  }}
                />
              </h3>
            </div>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={option.id || optionIndex}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    disabled
                      ? "cursor-not-allowed opacity-50"
                      : responses[questionIndex] === option.id
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
                      !disabled && onResponseChange(questionIndex, option.id)
                    }
                    disabled={disabled}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span
                    className={`ml-3 text-gray-900 ${CONTENT_DISPLAY_CLASSES}`}
                    dangerouslySetInnerHTML={{
                      __html: renderContent(option.text),
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
