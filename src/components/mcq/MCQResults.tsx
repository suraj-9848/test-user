"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface MCQResultsProps {
  results: {
    score: number;
    passed: boolean;
  };
  passingScore: number;
  onBackToModule: () => void;
  onRetake?: () => void;
  showRetake: boolean;
}

export default function MCQResults({
  results,
  passingScore,
  onBackToModule,
  onRetake,
  showRetake,
}: MCQResultsProps) {
  return (
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
            : `You need ${passingScore}% to pass. Keep studying and try again!`}
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onBackToModule}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Module
          </button>
          {showRetake && !results.passed && onRetake && (
            <button
              onClick={onRetake}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Retake Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
