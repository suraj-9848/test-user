"use client";

interface MCQSubmitProps {
  questionsCount: number;
  responsesCount: number;
  onSubmit: () => void;
  disabled: boolean;
  loading?: boolean;
}

export default function MCQSubmit({
  questionsCount,
  responsesCount,
  onSubmit,
  disabled,
  loading = false,
}: MCQSubmitProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {responsesCount} of {questionsCount} questions completed
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled || loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
            disabled || loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>Submit Test</span>
        </button>
      </div>
    </div>
  );
}
