"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Test,
  TestAttempt,
  Question,
  TestAnswer,
  MonitoringEvent,
  MonitoringEventType,
  SecuritySeverity,
  TestUIState,
  RecordingStatus,
} from "@/types/test";
import { AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { mockTestService } from "@/services/mockTestService";
import SecurityMonitor from "./SecurityMonitor";
import CameraMonitor from "./CameraMonitor";
import TestTimer from "./TestTimer";
import QuestionRenderer from "./QuestionRenderer";
import Watermark from "./Watermark";

interface TestInterfaceProps {
  test: Test;
  attempt: TestAttempt;
  onTestComplete: () => void;
  onBack: () => void;
}

export default function TestInterface({
  test,
  attempt,
  onTestComplete,
  onBack,
}: TestInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [uiState, setUIState] = useState<TestUIState>({
    currentQuestionIndex: 0,
    isFullscreen: false,
    timeRemaining: 0,
    isSubmitting: false,
    showWarning: false,
    warningMessage: "",
    cameraStatus: "disabled",
    recordingStatus: RecordingStatus.RECORDING,
    securityViolations: 0,
    lastActivity: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastActivityRef = useRef<Date>(new Date());
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Initialize test data
  useEffect(() => {
    const initializeTest = async () => {
      try {
        setIsLoading(true);

        // Fetch test questions using attempt ID
        const data = await mockTestService.getTestQuestions(attempt.id);
        setQuestions(data.questions || []);

        // Initialize answers array for new attempt
        const initialAnswers = data.questions.map((q: Question) => ({
          id: `${attempt.id}-${q.id}`,
          questionId: q.id,
          selectedOptions: [],
          textAnswer: "",
          timeSpent: 0,
        }));
        setAnswers(initialAnswers);

        // Use remaining time from attempt
        const currentAttempt = mockTestService.getCurrentAttempt();
        setUIState((prev) => ({
          ...prev,
          timeRemaining: Math.floor(
            (currentAttempt as any)?.timeRemaining || test.durationInMinutes * 60,
          ),
        }));

        // Enter fullscreen and start monitoring
        await enterFullscreen();
        await startCameraMonitoring();
        startSecurityMonitoring();
        startAutoSave();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize test",
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeTest();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [test.id, attempt.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Enter fullscreen mode - improved cross-platform support
  const enterFullscreen = useCallback(async () => {
    try {
      if (fullscreenRef.current) {
        const element = fullscreenRef.current;

        // Try different fullscreen methods for cross-browser compatibility
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (
          (
            element as unknown as {
              webkitRequestFullscreen?: () => Promise<void>;
            }
          ).webkitRequestFullscreen
        ) {
          await (
            element as unknown as {
              webkitRequestFullscreen: () => Promise<void>;
            }
          ).webkitRequestFullscreen();
        } else if (
          (element as unknown as { mozRequestFullScreen?: () => Promise<void> })
            .mozRequestFullScreen
        ) {
          await (
            element as unknown as { mozRequestFullScreen: () => Promise<void> }
          ).mozRequestFullScreen();
        } else if (
          (element as unknown as { msRequestFullscreen?: () => Promise<void> })
            .msRequestFullscreen
        ) {
          await (
            element as unknown as { msRequestFullscreen: () => Promise<void> }
          ).msRequestFullscreen();
        }

        setUIState((prev) => ({ ...prev, isFullscreen: true }));
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      logMonitoringEvent(
        MonitoringEventType.FULLSCREEN_EXIT,
        SecuritySeverity.HIGH,
        {
          error: "Failed to enter fullscreen",
        },
      );
    }
  }, []);

  // Start camera monitoring and recording
  const startCameraMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;
      setUIState((prev) => ({ ...prev, cameraStatus: "enabled" }));

      // Start recording
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });
        await uploadVideoRecording(videoBlob);
      };

      mediaRecorder.start(10000); // Record in 10-second chunks
    } catch (error) {
      console.error("Failed to start camera:", error);
      setUIState((prev) => ({ ...prev, cameraStatus: "error" }));
      logMonitoringEvent(
        MonitoringEventType.CAMERA_DISABLED,
        SecuritySeverity.CRITICAL,
        {
          error:
            error instanceof Error ? error.message : "Camera access denied",
        },
      );
    }
  }, []);

  // Start security monitoring
  const startSecurityMonitoring = useCallback(() => {
    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        logMonitoringEvent(
          MonitoringEventType.TAB_SWITCH,
          SecuritySeverity.HIGH,
          {
            tabSwitchCount: tabSwitchCount + 1,
          },
        );

        setUIState((prev) => ({
          ...prev,
          showWarning: true,
          warningMessage: `Tab switching detected! Count: ${tabSwitchCount + 1}`,
          securityViolations: prev.securityViolations + 1,
        }));

        // Auto-submit if too many violations
        if (tabSwitchCount >= 3) {
          autoSubmitTest("AUTO_VIOLATION");
        }
      }
    };

    // Track window blur/focus
    const handleWindowBlur = () => {
      logMonitoringEvent(
        MonitoringEventType.WINDOW_BLUR,
        SecuritySeverity.MEDIUM,
        {},
      );
    };

    // Track fullscreen exit - improved cross-platform detection
    const handleFullscreenChange = () => {
      // Check multiple fullscreen properties for cross-browser compatibility
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
      );

      setUIState((prev) => ({ ...prev, isFullscreen: isFullscreen }));

      if (!isFullscreen && !isTestSubmitted) {
        logMonitoringEvent(
          MonitoringEventType.FULLSCREEN_EXIT,
          SecuritySeverity.HIGH,
          {},
        );
        setUIState((prev) => ({
          ...prev,
          showWarning: true,
          warningMessage:
            "Fullscreen mode exited! Please return to fullscreen.",
          securityViolations: prev.securityViolations + 1,
        }));
      }
    };

    // Track copy/paste attempts
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.COPY_ATTEMPT,
        SecuritySeverity.MEDIUM,
        {},
      );
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.PASTE_ATTEMPT,
        SecuritySeverity.MEDIUM,
        {},
      );
    };

    // Track right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.RIGHT_CLICK,
        SecuritySeverity.LOW,
        {},
      );
    };

    // Track keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common shortcuts
      if (
        (e.ctrlKey &&
          (e.key === "c" || e.key === "v" || e.key === "a" || e.key === "x")) ||
        (e.ctrlKey && e.shiftKey && e.key === "I") || // Dev tools
        e.key === "F12" || // Dev tools
        (e.ctrlKey && e.key === "u") || // View source
        (e.ctrlKey && e.key === "s") // Save page
      ) {
        e.preventDefault();
        logMonitoringEvent(
          MonitoringEventType.KEYBOARD_SHORTCUT,
          SecuritySeverity.MEDIUM,
          {
            key: e.key,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
          },
        );
      }
    };

    // Track browser close attempt
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.BROWSER_CLOSE_ATTEMPT,
        SecuritySeverity.CRITICAL,
        {},
      );
      autoSubmitTest("AUTO_BROWSER_CLOSE");
      return "Test in progress. Are you sure you want to leave?";
    };

    // Add event listeners for cross-browser compatibility
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tabSwitchCount, isTestSubmitted]);

  // Auto-save answers periodically
  const startAutoSave = useCallback(() => {
    autoSaveIntervalRef.current = setInterval(() => {
      saveAnswers();
    }, 30000); // Save every 30 seconds
  }, []);

  // Log monitoring events
  const logMonitoringEvent = (
    eventType: MonitoringEventType,
    severity: SecuritySeverity,
    metadata: Record<string, unknown>,
  ) => {
    const event: MonitoringEvent = {
      id: `${Date.now()}-${Math.random()}`,
      attemptId: attempt.id,
      eventType,
      timestamp: new Date().toISOString(),
      metadata,
      severity,
    };

    // setMonitoringEvents((prev) => [...prev, event]); // Commented out for build

    // Send to mock service
    mockTestService.logMonitoringEvent(event).catch(console.error);
  };

  // Save answers to backend
  const saveAnswers = async () => {
    try {
      // Convert answers to the format expected by mock service
      const answersMap = answers.reduce(
        (acc, answer) => {
          acc[answer.questionId] =
            answer.selectedOptions.length > 0
              ? answer.selectedOptions
              : answer.textAnswer || "";
          return acc;
        },
        {} as Record<string, string | string[]>,
      );

      await mockTestService.autoSave(attempt.id, answersMap);
    } catch (error) {
      console.error("Failed to save answers:", error);
    }
  };

  // Upload video recording to S3
  const uploadVideoRecording = async (videoBlob: Blob) => {
    try {
      await mockTestService.uploadRecording(videoBlob, attempt.id);
    } catch (error) {
      console.error("Failed to upload video recording:", error);
    }
  };

  // Auto-submit test
  const autoSubmitTest = async (
    submissionType: "AUTO_TIME" | "AUTO_VIOLATION" | "AUTO_BROWSER_CLOSE",
  ) => {
    if (isTestSubmitted) return;

    setIsTestSubmitted(true);
    setUIState((prev) => ({ ...prev, isSubmitting: true }));

    await submitTest(submissionType);
  };

  // Submit test
  const submitTest = async (
    submissionType:
      | "MANUAL"
      | "AUTO_TIME"
      | "AUTO_VIOLATION"
      | "AUTO_BROWSER_CLOSE" = "MANUAL",
  ) => {
    try {
      console.log(`Submitting test with type: ${submissionType}`);
      
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Submit test data
      await mockTestService.submitTest(attempt.id);

      // Exit fullscreen
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // Clean up
      cleanup();

      // Notify parent component
      onTestComplete();
    } catch (error) {
      console.error("Failed to submit test:", error);
      setError("Failed to submit test. Please try again.");
      setUIState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Clean up resources
  const cleanup = () => {
    console.log("Cleaning up test resources...");

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    // Stop media recorder
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Clear intervals
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }

    // Update camera status to indicate it's disabled
    setUIState((prev) => ({
      ...prev,
      cameraStatus: "disabled",
      recordingStatus: RecordingStatus.COMPLETED,
    }));
  };

  // Handle answer change
  const handleAnswerChange = (
    questionId: string,
    selectedOptions: string[],
    textAnswer?: string,
  ) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === questionId
          ? { ...answer, selectedOptions, textAnswer: textAnswer || "" }
          : answer,
      ),
    );

    // Update last activity
    lastActivityRef.current = new Date();
    setUIState((prev) => ({ ...prev, lastActivity: new Date().toISOString() }));
  };

  // Navigation functions
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setUIState((prev) => ({ ...prev, currentQuestionIndex: index }));
    }
  };

  const nextQuestion = () => {
    goToQuestion(uiState.currentQuestionIndex + 1);
  };

  const prevQuestion = () => {
    goToQuestion(uiState.currentQuestionIndex - 1);
  };

  // Timer expired callback
  const handleTimeExpired = () => {
    autoSubmitTest("AUTO_TIME");
  };

  // Dismiss warning
  const dismissWarning = () => {
    setUIState((prev) => ({ ...prev, showWarning: false, warningMessage: "" }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[uiState.currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  return (
    <div ref={fullscreenRef} className="min-h-screen bg-gray-50 relative">
      {/* Watermark */}
      <Watermark text={`${test.title} - Student Test`} />

      {/* Security Monitor */}
      <SecurityMonitor
        violations={uiState.securityViolations}
        tabSwitches={tabSwitchCount}
        isFullscreen={uiState.isFullscreen}
        cameraStatus={uiState.cameraStatus}
      />

      {/* Camera Monitor */}
      <CameraMonitor
        stream={streamRef.current}
        isRecording={uiState.recordingStatus === "RECORDING"}
      />

      {/* Warning Banner */}
      {uiState.showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{uiState.warningMessage}</span>
            </div>
            <button
              onClick={dismissWarning}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Test Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {test.title}
              </h1>
              <p className="text-sm text-gray-600">
                Question {uiState.currentQuestionIndex + 1} of{" "}
                {questions.length}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <TestTimer
                initialTime={uiState.timeRemaining}
                onTimeExpired={handleTimeExpired}
              />

              <button
                onClick={() => setShowSubmitConfirmation(true)}
                disabled={uiState.isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {uiState.isSubmitting ? "Submitting..." : "Submit Test"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={uiState.currentQuestionIndex === 0}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium ${
                    index === uiState.currentQuestionIndex
                      ? "bg-blue-600 text-white"
                      : answers[index]?.selectedOptions.length > 0 ||
                          answers[index]?.textAnswer
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextQuestion}
              disabled={uiState.currentQuestionIndex === questions.length - 1}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentQuestion && currentAnswer && (
          <QuestionRenderer
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Test
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your test? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirmation(false);
                  submitTest("MANUAL");
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
