"use client";

import { AlertCircle } from "lucide-react";

interface MCQAlertProps {
  type: "error" | "warning" | "info" | "success";
  title?: string;
  message: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  };
}

export default function MCQAlert({
  type,
  title,
  message,
  actionButton,
}: MCQAlertProps) {
  const getColorClasses = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-700";
      case "warning":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "error":
        return "text-red-600";
      case "warning":
        return "text-orange-600";
      case "info":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getButtonClasses = () => {
    if (!actionButton) return "";
    switch (actionButton.variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-orange-600 text-white hover:bg-orange-700";
    }
  };

  return (
    <div className={`rounded-xl p-6 border ${getColorClasses()}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`w-6 h-6 ${getIconColor()}`} />
        <div className="flex-1">
          {title && <h3 className="text-lg font-medium mb-1">{title}</h3>}
          <p>{message}</p>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className={`mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${getButtonClasses()}`}
            >
              {actionButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
