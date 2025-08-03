"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";
import { useParams, useRouter } from "next/navigation";
import { Test, TestAttempt } from "@/types/test";
import { apiService } from "@/config/api";
import TestInterface from "@/components/test/TestInterface";

export default function TestAttemptPage() {
  const { data: session } = useSession();
  const { jwt } = useJWT();
  const params = useParams();
  const router = useRouter();

  const [test, setTest] = useState<Test | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const testId = params?.testId as string;

  useEffect(() => {
    const syncJwtFromStorage = () => {
      const storedJwt = localStorage.getItem("jwt");
      if (storedJwt && storedJwt !== jwt) {
      }
      setHydrated(true);
    };
    syncJwtFromStorage();
    window.addEventListener("storage", syncJwtFromStorage);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        syncJwtFromStorage();
      }
    });
    return () => {
      window.removeEventListener("storage", syncJwtFromStorage);
      window.removeEventListener("visibilitychange", syncJwtFromStorage);
    };
  }, [jwt]);

  const initializeTestAttempt = useCallback(async () => {
    if (!testId || !hydrated || !session?.user || !jwt) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { test: testDetails } = await apiService.getTestDetails(testId);

      setTest(testDetails);

      const now = new Date();
      const startDate = new Date(testDetails.startDate);
      const endDate = new Date(testDetails.endDate);

      if (now < startDate) {
        setError("This test has not started yet.");
        return;
      }

      if (now > endDate) {
        setError("This test has already ended.");
        return;
      }

      const attempt: TestAttempt = {
        id: `attempt-${Date.now()}`,
        testId: testDetails.id,
        studentId: session.user.email || "",
        status: "IN_PROGRESS" as any,
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        answers: [],
        timeRemaining: testDetails.durationInMinutes * 60,
      };

      setCurrentAttempt(attempt);
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        setError("Session expired or unauthorized. Please sign in again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load test");
      }
    } finally {
      setIsLoading(false);
    }
  }, [testId, hydrated, session, jwt]);

  useEffect(() => {
    initializeTestAttempt();
  }, [initializeTestAttempt]);

  const handleTestComplete = () => {
    router.push("/student/tests");
  };

  const handleBackToSelection = () => {
    router.push("/student/tests");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading test...</p>
          {testId && (
            <p className="text-sm text-gray-400 mt-2">Test ID: {testId}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    const testTokenRefresh = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000"}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            window.location.reload();
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            `Token refresh failed: ${response.status} - ${errorData.error || response.statusText}`,
          );
        }
      } catch (error) {
        alert(
          `Token refresh error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Test
          </h2>
          <div className="space-y-2">
            <button
              onClick={initializeTestAttempt}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-2"
            >
              Try Again
            </button>
            <button
              onClick={testTokenRefresh}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mr-2"
            >
              Test Token Refresh
            </button>
            <div className="mt-2">
              <button
                onClick={() => router.push("/student/tests")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors mr-2"
              >
                Back to Tests
              </button>
              <button
                onClick={() => (window.location.href = "/sign-in")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (test && currentAttempt) {
    return (
      <TestInterface
        test={test}
        attempt={currentAttempt}
        onTestComplete={handleTestComplete}
        onBack={handleBackToSelection}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Preparing test interface...</p>
      </div>
    </div>
  );
}
