"use client";

import { useState } from "react";
import { Test } from "@/types/test";
import {
  Clock,
  Calendar,
  User,
  BookOpen,
  AlertTriangle,
  Camera,
  Monitor,
} from "lucide-react";

interface TestSelectionProps {
  tests: Test[];
  onTestSelect: (test: Test) => void;
  onStartTest: (testId: string) => void;
  selectedTest: Test | null;
  isLoading: boolean;
}

export default function TestSelection({
  // Helper to get course and batch title
  tests = [],
  onTestSelect,
  onStartTest,
  selectedTest,
  isLoading,
}: TestSelectionProps) {
  const [showStartConfirmation, setShowStartConfirmation] = useState(false);

  // Helper to get time left until test starts (for upcoming tests)
  const getTimeUntilStart = (test: Test) => {
    const start = new Date(test.startDate);
    const now = new Date();
    const diff = start.getTime() - now.getTime();
    if (diff <= 0) return "Starting soon";
    const mins = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000) % 24;
    const days = Math.floor(diff / 86400000);
    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    result.push(`${mins}m`);
    return result.join(" ") + " left";
  };

  // Helper to get course and batch title
  const getCourseTitle = (test: Test) => {
    // Prefer test.course?.title, then test.courseName, then test.course
    // @ts-ignore for possible backend variations
    return test.course?.title || test.courseName || test.course || "-";
  };
  const getBatchTitle = (test: Test) => {
    // Prefer test.batch?.title, then test.batchName, then fallback to course title
    // @ts-ignore for possible backend variations
    return test.batch?.title || test.batchName || getCourseTitle(test);
  };

  // Helper to get time left for ongoing tests
  const getTimeLeft = (test: Test) => {
    const end = new Date(test.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Ended";
    const mins = Math.floor(diff / 60000) % 60;
    const hours = Math.floor(diff / 3600000);
    return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
  };

  // Group tests by status
  const now = new Date();
  const upcomingTests = tests.filter((t) => new Date(t.startDate) > now);
  const ongoingTests = tests.filter(
    (t) => new Date(t.startDate) <= now && new Date(t.endDate) >= now
  );
  const pastTests = tests.filter((t) => new Date(t.endDate) < now);

  // Check camera permission
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const handleTestSelect = (test: Test) => {
    onTestSelect(test);
  };

  const handleStartTest = async () => {
    if (!selectedTest) return;

    // Check camera permission before starting
    const hasCameraAccess = await checkCameraPermission();
    if (!hasCameraAccess) {
      alert(
        "Camera access is required for this test. Please enable camera permissions and try again."
      );
      return;
    }

    setShowStartConfirmation(true);
  };

  const confirmStartTest = async () => {
    if (selectedTest) {
      // Enter fullscreen mode before starting test
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.warn("Could not enter fullscreen:", error);
      }

      onStartTest(selectedTest.id);
      setShowStartConfirmation(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isTestActive = (test: Test) => {
    const now = new Date();
    const startDate = new Date(test.startDate);
    const endDate = new Date(test.endDate);
    return now >= startDate && now <= endDate;
  };

  const getTestStatusBadge = (test: Test) => {
    if (test.hasOngoingAttempt) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Ongoing
        </span>
      );
    }

    if (!isTestActive(test)) {
      const now = new Date();
      const startDate = new Date(test.startDate);
      const endDate = new Date(test.endDate);

      if (now < startDate) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Upcoming
          </span>
        );
      } else if (now > endDate) {
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Ended
          </span>
        );
      }
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Tests Available
        </h3>
        <p className="text-gray-600">
          There are no tests available for you at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Security Notice at Top Bar */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800 mb-1">
            Test Security Requirements:
          </p>
          <ul className="text-yellow-700 space-y-1">
            <li className="flex items-center">
              <Monitor className="h-3 w-3 mr-2" />
              Full-screen mode required
            </li>
            <li className="flex items-center">
              <Camera className="h-3 w-3 mr-2" />
              Camera monitoring enabled
            </li>
            <li>• Tab switching and copying are monitored</li>
            <li>• Auto-submit on violations or browser close</li>
          </ul>
        </div>
      </div>

      {/* Ongoing Tests */}
      {ongoingTests.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Ongoing Tests</h2>
          <div className="grid gap-4">
            {ongoingTests.map((test) => (
              <div
                key={test.id}
                className={`bg-white rounded-lg shadow-md border-2 transition-all ${"border-gray-200 hover:border-gray-300"}`}
              >
                <div className="p-6">
                  {/* Header: Title, Status, Course/Batch, Start/End, Time Left */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {test.title}
                        </h3>
                        <div>{getTestStatusBadge(test)}</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {test.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-2">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {getCourseTitle(test)}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {getBatchTitle(test)}
                        </span>
                        <span className="flex items-center">
                          <span className="font-medium">Start:</span>{" "}
                          {formatDate(test.startDate)}
                        </span>
                        <span className="flex items-center">
                          <span className="font-medium">End:</span>{" "}
                          {formatDate(test.endDate)}
                        </span>
                        {ongoingTests.includes(test) && (
                          <span className="flex items-center text-blue-700 font-semibold">
                            <Clock className="h-4 w-4 mr-1" />
                            {getTimeLeft(test)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 border-gray-200" />
                  {/* Details: Duration, Max Marks, Passing */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(test.durationInMinutes)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Until {formatDate(test.endDate)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Max Marks:</span>{" "}
                      {test.maxMarks}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Passing:</span>{" "}
                      {test.passingMarks}
                    </div>
                  </div>
                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={async () => {
                        // Check camera permission before starting
                        const hasCameraAccess = await checkCameraPermission();
                        if (!hasCameraAccess) {
                          alert(
                            "Camera access is required for this test. Please enable camera permissions and try again."
                          );
                          return;
                        }
                        setShowStartConfirmation(true);
                        onTestSelect(test);
                      }}
                      disabled={isLoading || !isTestActive(test)}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        isLoading || !isTestActive(test)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isLoading ? "Starting..." : "Start Test"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Tests */}
      {upcomingTests.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Tests</h2>
          <div className="grid gap-4">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className={`bg-white rounded-lg shadow-md border-2 transition-all ${"border-gray-200 hover:border-gray-300"}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {test.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {getCourseTitle(test)}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {getBatchTitle(test)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getTestStatusBadge(test)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(test.durationInMinutes)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Start: {formatDate(test.startDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>End: {formatDate(test.endDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{getTimeUntilStart(test)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Max Marks:</span>{" "}
                      {test.maxMarks}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Passing:</span>{" "}
                      {test.passingMarks}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      disabled
                      className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Tests */}
      {pastTests.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Tests</h2>
          <div className="grid gap-4">
            {pastTests.map((test) => (
              <div
                key={test.id}
                className={`bg-white rounded-lg shadow-md border-2 transition-all ${"border-gray-200 hover:border-gray-300"}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {test.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {test.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {getCourseTitle(test)}
                        </span>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {getBatchTitle(test)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getTestStatusBadge(test)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(test.durationInMinutes)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Until {formatDate(test.endDate)}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Max Marks:</span>{" "}
                      {test.maxMarks}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Passing:</span>{" "}
                      {test.passingMarks}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      disabled
                      className="px-6 py-3 rounded-lg font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                      Start Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Start Confirmation Modal */}
      {showStartConfirmation && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Test Start
            </h3>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <p>
                You are about to start:{" "}
                <span className="font-medium">{selectedTest.title}</span>
              </p>
              <p>
                Duration:{" "}
                <span className="font-medium">
                  {formatDuration(selectedTest.durationInMinutes)}
                </span>
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="font-medium text-red-800 mb-2">
                  Important Reminders:
                </p>
                <ul className="text-red-700 text-xs space-y-1">
                  <li>• The test will switch to full-screen mode</li>
                  <li>• Your camera will be activated for monitoring</li>
                  <li>• Tab switching will be tracked</li>
                  <li>• The test will auto-submit if you close the browser</li>
                  <li>• Ensure stable internet connection</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowStartConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStartTest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
