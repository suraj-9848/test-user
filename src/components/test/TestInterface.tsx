"use client";

import { useState, useEffect, useRef } from "react";
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
  QuestionType,
} from "@/types/test";
import { AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { apiService } from "@/config/api";
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
  const [testStarted, setTestStarted] = useState(false);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);

  // Monitoring events state
  const [monitoringEvents, setMonitoringEvents] = useState<MonitoringEvent[]>(
    [],
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastActivityRef = useRef<Date>(new Date());
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  // Ref to store cleanup for security monitoring event listeners
  const securityCleanupRef = useRef<() => void>(() => {});

  // Check if current question is a coding question
  const currentQuestion = questions[uiState.currentQuestionIndex];
  const isCurrentQuestionCode =
    currentQuestion?.originalType === "CODE" ||
    (currentQuestion as any)?.type === "CODE" ||
    (currentQuestion as any)?.questionType === "CODE";

  // Trigger permissions (camera & fullscreen) then start test
  const handleStartTest = async () => {
    try {
      // Request camera permission and start stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;
      setUIState((prev: any) => ({ ...prev, cameraStatus: "enabled" }));

      // Request fullscreen on user gesture
      await enterFullscreen();

      // Now mark test as started
      setTestStarted(true);
    } catch (error) {
      console.error("Permission denied or fullscreen failed:", error);
      setError(
        "Permissions required to start test. Please allow camera and fullscreen.",
      );
    }
  };

  // Initialize test data when user has granted permissions
  useEffect(() => {
    if (!testStarted) return;
    const initializeTest = async () => {
      try {
        setIsLoading(true);

        // Get test details using the test ID
        const { test: testDetails } = await apiService.getTestDetails(test.id);
        console.log("Test details received:", testDetails);
        console.log("Questions received:", testDetails.questions);

        // Log each question type to help debug
        if (testDetails.questions && testDetails.questions.length > 0) {
          testDetails.questions.forEach((q: Question, index: number) => {
            console.log(`Question ${index + 1}:`, {
              id: q.id,
              type: q.questionType,
              originalType: (q as any).originalType || (q as any).type,
              text: q.questionText
                ? q.questionText.substring(0, 50) + "..."
                : "No text",
            });
          });
        }

        setQuestions(testDetails.questions || []);

        // Initialize answers array for new attempt
        const initialAnswers = testDetails.questions.map((q: Question) => ({
          id: `${attempt.id}-${q.id}`,
          questionId: q.id,
          selectedOptions: [],
          textAnswer: "",
          timeSpent: 0,
        }));
        setAnswers(initialAnswers);

        // Use remaining time from attempt
        setUIState((prev: any) => ({
          ...prev,
          timeRemaining: Math.floor(
            attempt.timeRemaining ?? test.durationInMinutes * 60,
          ),
        }));

        // Start camera recording, security monitoring, and autosave
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
    return () => {
      cleanup();
    };
  }, [test.id, attempt.id, testStarted]);

  // Enter fullscreen mode - improved cross-platform support
  const enterFullscreen = async () => {
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
          (
            element as unknown as {
              mozRequestFullScreen?: () => Promise<void>;
            }
          ).mozRequestFullScreen
        ) {
          await (
            element as unknown as {
              mozRequestFullScreen: () => Promise<void>;
            }
          ).mozRequestFullScreen();
        } else if (
          (
            element as unknown as {
              msRequestFullscreen?: () => Promise<void>;
            }
          ).msRequestFullscreen
        ) {
          await (
            element as unknown as {
              msRequestFullscreen: () => Promise<void>;
            }
          ).msRequestFullscreen();
        }

        setUIState((prev: any) => ({ ...prev, isFullscreen: true }));
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
  };

  // Start camera monitoring and recording
  const startCameraMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      streamRef.current = stream;
      setUIState((prev: any) => ({ ...prev, cameraStatus: "enabled" }));

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
      setUIState((prev: any) => ({ ...prev, cameraStatus: "error" }));
      logMonitoringEvent(
        MonitoringEventType.CAMERA_DISABLED,
        SecuritySeverity.CRITICAL,
        {
          error:
            error instanceof Error ? error.message : "Camera access denied",
        },
      );
    }
  };

  // Start security monitoring
  const startSecurityMonitoring = () => {
    // Track fullscreen exit - improved cross-platform detection
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setUIState((prev: any) => ({ ...prev, isFullscreen: isFs }));
      if (!isFs) {
        // Exited fullscreen: immediate violation
        logMonitoringEvent(
          MonitoringEventType.FULLSCREEN_EXIT,
          SecuritySeverity.HIGH,
          {},
        );
        setUIState((prevState) => ({
          ...prevState,
          showWarning: true,
          warningMessage: "Fullscreen mode exited!",
          securityViolations: prevState.securityViolations + 1,
        }));
        autoSubmitTest("AUTO_VIOLATION");
      }
    };

    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Immediate violation on tab switch
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          logMonitoringEvent(
            MonitoringEventType.TAB_SWITCH,
            SecuritySeverity.HIGH,
            { tabSwitchCount: newCount },
          );
          setUIState((prevState) => ({
            ...prevState,
            showWarning: true,
            warningMessage: `Tab switching detected! Count: ${newCount}`,
            securityViolations: prevState.securityViolations + 1,
          }));
          autoSubmitTest("AUTO_VIOLATION");
          return newCount;
        });
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

    // Track copy/paste attempts
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logMonitoringEvent(MonitoringEventType.COPY, SecuritySeverity.MEDIUM, {});
      autoSubmitTest("AUTO_VIOLATION");
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.PASTE,
        SecuritySeverity.MEDIUM,
        {},
      );
      autoSubmitTest("AUTO_VIOLATION");
    };

    // Track right-click/context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logMonitoringEvent(
        MonitoringEventType.CONTEXT_MENU,
        SecuritySeverity.MEDIUM,
        {},
      );
      autoSubmitTest("AUTO_VIOLATION");
    };

    // Track keyboard shortcuts like copy/cut/paste
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable tab switching via ctrl+tab or cmd+tab
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "tab") {
        e.preventDefault();
        // Immediate violation on tab switch
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;
          logMonitoringEvent(
            MonitoringEventType.TAB_SWITCH,
            SecuritySeverity.HIGH,
            { tabSwitchCount: newCount },
          );
          setUIState((ps) => ({
            ...ps,
            showWarning: true,
            warningMessage: `Tab switching detected! Count: ${newCount}`,
            securityViolations: ps.securityViolations + 1,
          }));
          autoSubmitTest("AUTO_VIOLATION");
          return newCount;
        });
        return;
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "v", "x"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        logMonitoringEvent(
          MonitoringEventType.KEYBOARD_SHORTCUT,
          SecuritySeverity.MEDIUM,
          { key: e.key },
        );
        autoSubmitTest("AUTO_VIOLATION");
      }

      // Prevent F11 and Escape from exiting fullscreen
      if (e.key === "F11" || e.key === "Escape") {
        e.preventDefault();
        logMonitoringEvent(
          MonitoringEventType.FULLSCREEN_EXIT,
          SecuritySeverity.HIGH,
          { key: e.key },
        );
        setFullscreenExitCount((prev) => {
          const count = prev + 1;
          setUIState((ps) => ({
            ...ps,
            showWarning: true,
            warningMessage: `Fullscreen mode exited via ${e.key}! Count: ${count}`,
            securityViolations: ps.securityViolations + 1,
          }));
          autoSubmitTest("AUTO_VIOLATION");
          return count;
        });
        return;
      }
    };

    // Track browser close attempt
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      cleanup();
      // Log and submit before closing
      logMonitoringEvent(
        MonitoringEventType.WINDOW_BLUR,
        SecuritySeverity.HIGH,
        { reason: "browser-close" },
      );
      autoSubmitTest("AUTO_BROWSER_CLOSE");
      e.preventDefault();
      e.returnValue = "";
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

    // Store cleanup to remove listeners
    securityCleanupRef.current = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  };

  // Auto-save answers periodically
  const startAutoSave = () => {
    autoSaveIntervalRef.current = setInterval(() => {
      saveAnswers();
    }, 30000); // Save every 30 seconds
  };

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

    setMonitoringEvents((prev) => [...prev, event]);

    // Send to mock service
    apiService.logMonitoringEvent(event).catch(console.error);
  };

  // Save answers to backend
  const saveAnswers = async () => {
    try {
      await apiService.saveAnswers(attempt.id, answers);
    } catch (error) {
      console.error("Failed to save answers:", error);
    }
  };

  // Upload video recording to S3
  const uploadVideoRecording = async (videoBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "recording.webm");
      formData.append("attemptId", attempt.id);

      await apiService.uploadRecording(formData);
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
    setUIState((prev: any) => ({ ...prev, isSubmitting: true }));

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
      // Stop recording
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }

      // Ensure all questions have responses (even if empty)
      const formattedResponses: {
        questionId: string;
        answer: string[] | string;
      }[] = questions.map((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        let formattedAnswer: string[] | string;
        if (q.questionType === QuestionType.MCQ) {
          if (
            answer &&
            Array.isArray(answer.selectedOptions) &&
            answer.selectedOptions.length > 0
          ) {
            formattedAnswer = answer.selectedOptions;
          } else {
            formattedAnswer = [];
          }
        } else {
          formattedAnswer = answer?.textAnswer || "";
        }
        return {
          questionId: q.id,
          answer: formattedAnswer,
        };
      });

      // Always send at least one response (API requires non-empty array)
      if (formattedResponses.length === 0) {
        formattedResponses.push({
          questionId: questions[0]?.id || "unknown",
          answer: "",
        });
      }

      console.log("Submitting test with responses:", formattedResponses);

      // Submit test data -  Use test.id instead of attempt.id
      await apiService.submitTest(test.id, formattedResponses);

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
      setUIState((prev: any) => ({ ...prev, isSubmitting: false }));
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
      document.exitFullscreen().catch(() => {});
    }

    // Remove security monitoring listeners
    securityCleanupRef.current();

    // Update camera status to indicate it's disabled
    setUIState((prev: any) => ({
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
          ? {
              ...answer,
              selectedOptions,
              textAnswer: textAnswer || "",
            }
          : answer,
      ),
    );

    // Update last activity
    lastActivityRef.current = new Date();
    setUIState((prev: any) => ({
      ...prev,
      lastActivity: new Date().toISOString(),
    }));
  };

  // Navigation functions
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setUIState((prev: any) => ({ ...prev, currentQuestionIndex: index }));
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
    setUIState((prev: any) => ({
      ...prev,
      showWarning: false,
      warningMessage: "",
    }));
  };

  // Handle back navigation: cleanup resources then navigate back
  const handleBackAction = () => {
    cleanup();
    onBack();
  };

  // Render permission overlay before test starts
  if (!testStarted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg text-center max-w-sm">
          <h2 className="text-xl font-semibold mb-4">
            Ready to begin the test?
          </h2>
          <p className="mb-6">
            This test requires camera access and fullscreen mode. Please allow
            permissions.
          </p>
          <button
            onClick={handleStartTest}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Start Test
          </button>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    );
  }

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
            onClick={handleBackAction}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  return (
    // Fullscreen overlay hides all underlying layout
    <div
      ref={fullscreenRef}
      className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden"
      style={{ minHeight: "100vh", maxHeight: "100vh" }}
    >
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

      {/* Conditional Layout based on question type */}
      {isCurrentQuestionCode ? (
        // Full-width layout for coding questions (like LeetCode)
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
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

          {/* Question Navigation */}
          <div className="bg-white border-b px-6 py-3 flex-shrink-0">
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

          {/* Full-width coding interface */}
          <div className="flex-1 min-h-0">
            {currentQuestion && currentAnswer && (
              <QuestionRenderer
                question={currentQuestion}
                answer={currentAnswer}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </div>
        </div>
      ) : (
        // Standard centered layout for non-coding questions
        <>
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
                  disabled={
                    uiState.currentQuestionIndex === questions.length - 1
                  }
                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex justify-center items-start w-full py-8 px-2 overflow-auto flex-1">
            <div
              className="bg-white shadow-lg rounded-xl p-10 w-full max-w-5xl min-h-[400px] flex flex-col justify-center overflow-auto"
              style={{
                minHeight: "400px",
                minWidth: "700px",
                fontSize: "1.18rem",
              }}
            >
              {currentQuestion && currentAnswer && (
                <QuestionRenderer
                  question={currentQuestion}
                  answer={currentAnswer}
                  onAnswerChange={handleAnswerChange}
                />
              )}
            </div>
          </div>
        </>
      )}

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
