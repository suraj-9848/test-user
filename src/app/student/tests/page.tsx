"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";
import { Test, TestAttempt } from "@/types/test";
import { apiService } from "@/config/api";
import TestSelection from "@/components/test/TestSelection";
import TestInterface from "@/components/test/TestInterface";

export default function StudentTestsPage() {
  const { data: session } = useSession();
  const { jwt } = useJWT();
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate JWT from localStorage (like leaderboard)
  useEffect(() => {
    const syncJwtFromStorage = () => {
      const storedJwt = localStorage.getItem("jwt");
      if (storedJwt && storedJwt !== jwt) {
        // Optionally update context if needed
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

  // Fetch available tests using apiService
  const fetchAvailableTests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching available tests...");
      console.log("JWT token:", jwt ? "Present" : "Missing");

      const response = await apiService.getAvailableTests();
      console.log("Tests response:", response);
      setAvailableTests(response.tests);
    } catch (err) {
      console.error("Error fetching tests:", err);
      if (err instanceof Error && err.message.includes("401")) {
        setError("Session expired or unauthorized. Please sign in again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to load tests");
      }
      setAvailableTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    if (hydrated && session?.user && jwt) {
      fetchAvailableTests();
    }
  }, [hydrated, session, jwt, fetchAvailableTests]);

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
  };

  const handleStartTest = async (testId: string) => {
    try {
      setIsLoading(true);
      // Start test via backend API
      const { test } = await apiService.getTestDetails(testId);

      // Create a mock attempt for now
      const attempt: TestAttempt = {
        id: `attempt-${Date.now()}`,
        testId: test.id,
        studentId: "student-123", // This should come from auth
        status: "IN_PROGRESS" as any,
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        answers: [],
        timeRemaining: test.durationInMinutes * 60,
      };

      setCurrentAttempt(attempt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start test");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestComplete = () => {
    setSelectedTest(null);
    setCurrentAttempt(null);
    fetchAvailableTests();
  };

  const handleBackToSelection = () => {
    setSelectedTest(null);
    setCurrentAttempt(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  // Error state with token refresh debugging
  if (error) {
    const testTokenRefresh = async () => {
      try {
        console.log("🧪 Testing manual token refresh...");
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
          console.log("✅ Manual token refresh successful:", data);
          if (data.token) {
            localStorage.setItem("jwt", data.token);
            window.location.reload();
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log(
            "❌ Manual token refresh failed:",
            response.status,
            errorData,
          );
          alert(
            `Token refresh failed: ${response.status} - ${errorData.error || response.statusText}`,
          );
        }
      } catch (error) {
        console.error("❌ Manual token refresh error:", error);
        alert(
          `Token refresh error: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    };

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Tests
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>

          {/* Token Refresh Debug Panel */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <h3 className="font-semibold mb-2 text-center">
              🔧 Debug Information
            </h3>
            <div className="text-sm space-y-1">
              <div>JWT Present: {jwt ? "✅ Yes" : "❌ No"}</div>
              <div>Session Present: {session ? "✅ Yes" : "❌ No"}</div>
              <div>Hydrated: {hydrated ? "✅ Yes" : "❌ No"}</div>
              <div>
                Error Type:{" "}
                {error.includes("401") ? "🔐 Authentication" : "⚠️ Other"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={fetchAvailableTests}
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
                onClick={() => (window.location.href = "/sign-in")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Sign In Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render test interface or test selection without student nav/sidebar
  if (currentAttempt && selectedTest) {
    return (
      <TestInterface
        test={selectedTest}
        attempt={currentAttempt}
        onTestComplete={handleTestComplete}
        onBack={handleBackToSelection}
      />
    );
  }

  // Test selection view
  return (
    <div>
      <TestSelection
        tests={availableTests}
        onTestSelect={handleTestSelect}
        onStartTest={handleStartTest}
        selectedTest={selectedTest}
        isLoading={isLoading}
      />
    </div>
  );
}
