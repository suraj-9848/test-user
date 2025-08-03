"use client";

import { ArrowLeft, Clock } from "lucide-react";

interface MCQHeaderProps {
  onBack: () => void;
  timeLeft?: number;
  showTimer?: boolean;
  moduleTitle: string;
  passingScore: number;
}

export default function MCQHeader({
  onBack,
  timeLeft,
  showTimer = false,
  moduleTitle,
  passingScore,
}: MCQHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Module
          </button>
        </div>

        {showTimer && timeLeft !== undefined && (
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
          {moduleTitle} - MCQ Test
        </h1>
        <p className="text-gray-600">
          Answer all questions to complete this module. Passing score:{" "}
          {passingScore}%
        </p>
      </div>
    </div>
  );
}
