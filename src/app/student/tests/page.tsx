"use client";

import { useState, useEffect, useCallback } from "react";
import TestSelection from "@/components/test/TestSelection";
import TestInterface from "@/components/test/TestInterface";
import { Test, TestAttempt } from "@/types/test";
import { mockTestService } from "@/services/mockTestService";
import { DEMO_CONFIG } from "@/config/demo";

export default function StudentTests() {
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<TestAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available tests
  const fetchAvailableTests = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use mock service directly for demo
      const data = await mockTestService.getAvailableTests();
      setAvailableTests(data.tests || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableTests();
  }, [fetchAvailableTests]);

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
  };

  const handleStartTest = async (testId: string) => {
    try {
      setIsLoading(true);
      // Use mock service directly for demo
      const data = await mockTestService.startTest(testId);
      setCurrentAttempt(data.attempt);
      setError(null);
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

  // Show spinner only while loading
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

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Tests
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAvailableTests}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If test is active (in full-screen mode)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Available Tests
        </h1>
        <p className="text-gray-600">
          Select a test to begin your examination. All tests include security
          monitoring and recording.
        </p>
      </div>

      {/* Demo Mode Banner */}
      {DEMO_CONFIG.useMockData && (
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode Active:</strong> This is a demonstration of
                the test system with mock data. All features including security
                monitoring, camera recording, and auto-submit are functional.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Selection Component */}
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
