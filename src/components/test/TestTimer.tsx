"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface TestTimerProps {
  initialTime: number; // in seconds
  onTimeExpired: () => void;
}

export default function TestTimer({
  initialTime,
  onTimeExpired,
}: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    setTimeRemaining(initialTime);
    hasExpiredRef.current = false;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        // Update warning states
        if (newTime <= 300 && newTime > 60) {
          setIsWarning(true);
          setIsCritical(false);
        } else if (newTime <= 60) {
          setIsWarning(true);
          setIsCritical(true);
        } else {
          setIsWarning(false);
          setIsCritical(false);
        }

        if (newTime <= 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onTimeExpired();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // Only run on mount/unmount, not on initialTime change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  };

  const getTimerColor = (): string => {
    if (isCritical) return "text-red-600";
    if (isWarning) return "text-yellow-600";
    return "text-gray-700";
  };

  const getBackgroundColor = (): string => {
    if (isCritical) return "bg-red-50 border-red-200";
    if (isWarning) return "bg-yellow-50 border-yellow-200";
    return "bg-gray-50 border-gray-200";
  };

  const getWarningMessage = (): string | null => {
    if (timeRemaining <= 60) {
      return "Test will auto-submit in less than 1 minute!";
    } else if (timeRemaining <= 300) {
      return "Less than 5 minutes remaining!";
    }
    return null;
  };

  return (
    <div className="flex flex-col items-end space-y-2">
      {/* Timer Display */}
      <div
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getBackgroundColor()}`}
      >
        <Clock
          className={`h-5 w-5 ${getTimerColor()} ${
            isCritical ? "animate-pulse" : ""
          }`}
        />
        <div className="text-right">
          <div className={`text-lg font-mono font-bold ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-gray-500">Time Remaining</div>
        </div>
      </div>

      {/* Warning Message */}
      {(isWarning || isCritical) && (
        <div
          className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
            isCritical
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          } ${isCritical ? "animate-pulse" : ""}`}
        >
          <AlertTriangle className="h-3 w-3" />
          <span>{getWarningMessage()}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isCritical
              ? "bg-red-500"
              : isWarning
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{
            width: `${(timeRemaining / initialTime) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
