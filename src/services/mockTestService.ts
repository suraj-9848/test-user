/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Test,
  TestAttempt,
  Question,
  MonitoringEvent,
  QuestionType,
  AttemptStatus,
} from "@/types/test";

interface TestResults {
  attemptId: string;
  testId: string;
  studentId: string;
  score: number;
  obtainedMarks: number;
  maxMarks: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  timeTaken: number;
  submittedAt: string;
  grade: string;
  passed: boolean;
  violations: number;
  questionWiseResults: Array<{
    questionId: string;
    isCorrect: boolean;
    marksObtained: number;
    maxMarks: number;
  }>;
}

// Mock Data
const MOCK_TESTS: Test[] = [
  {
    id: "test-1",
    title: "JavaScript Fundamentals Assessment",
    description:
      "Comprehensive test covering JavaScript basics, ES6 features, and DOM manipulation",
    durationInMinutes: 60,
    maxMarks: 100,
    totalQuestions: 25,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    instructions: [
      "Read each question carefully before answering",
      "You can navigate between questions using the navigation panel",
      "Your progress is automatically saved",
      "Ensure stable internet connection throughout the test",
      "Do not switch tabs or minimize the browser window",
      "Camera monitoring is active during the test",
    ],
    hasOngoingAttempt: false,
    courseName: "Full Stack JavaScript Development",
    batchName: "Batch 2024-A",
  },
  {
    id: "test-2",
    title: "React Development Skills Test",
    description:
      "Advanced React concepts including hooks, context, state management, and performance optimization",
    durationInMinutes: 90,
    maxMarks: 150,
    totalQuestions: 30,
    startDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    instructions: [
      "This test covers advanced React topics",
      "Code snippets may be provided for analysis",
      "Focus on best practices and performance",
      "Time management is crucial for this test",
      "All questions are mandatory",
    ],
    hasOngoingAttempt: false,
    courseName: "Advanced React Development",
    batchName: "Batch 2024-A",
  },
  {
    id: "test-3",
    title: "Node.js Backend Assessment",
    description:
      "Server-side development with Node.js, Express, databases, and API design",
    durationInMinutes: 75,
    maxMarks: 120,
    totalQuestions: 20,
    startDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    instructions: [
      "Focus on backend development concepts",
      "Database design questions included",
      "API security best practices covered",
      "Performance optimization topics included",
    ],
    hasOngoingAttempt: true,
    courseName: "Backend Development with Node.js",
    batchName: "Batch 2024-B",
  },
];

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    questionText:
      "What is the difference between `let`, `const`, and `var` in JavaScript?",
    questionType: QuestionType.MCQ,
    options: [
      {
        id: "a",
        optionText:
          "`let` and `const` are block-scoped, `var` is function-scoped",
        optionOrder: 1,
      },
      {
        id: "b",
        optionText: "All three have the same scope behavior",
        optionOrder: 2,
      },
      {
        id: "c",
        optionText:
          "`var` is block-scoped, `let` and `const` are function-scoped",
        optionOrder: 3,
      },
      { id: "d", optionText: "Only `const` is block-scoped", optionOrder: 4 },
    ],
    correctAnswer: "a",
    marks: 4,
    order: 1,
  },
  {
    id: "q2",
    questionText:
      "Which of the following array methods does NOT mutate the original array?",
    questionType: QuestionType.MCQ,
    options: [
      { id: "a", optionText: "push()", optionOrder: 1 },
      { id: "b", optionText: "pop()", optionOrder: 2 },
      { id: "c", optionText: "map()", optionOrder: 3 },
      { id: "d", optionText: "splice()", optionOrder: 4 },
    ],
    correctAnswer: "c",
    marks: 3,
    order: 2,
  },
  {
    id: "q3",
    questionText:
      "What will be the output of the following code?\n\n```javascript\nconsole.log(typeof null);\nconsole.log(typeof undefined);\n```",
    questionType: QuestionType.MCQ,
    options: [
      { id: "a", optionText: "object, undefined", optionOrder: 1 },
      { id: "b", optionText: "null, undefined", optionOrder: 2 },
      { id: "c", optionText: "object, object", optionOrder: 3 },
      { id: "d", optionText: "null, null", optionOrder: 4 },
    ],
    correctAnswer: "a",
    marks: 5,
    order: 3,
  },
  {
    id: "q4",
    questionText:
      "Explain the concept of closures in JavaScript with an example.",
    questionType: QuestionType.LONG_ANSWER,
    marks: 10,
    order: 4,
  },
  {
    id: "q5",
    questionText:
      "Which of the following statements about React hooks are correct?",
    questionType: QuestionType.MULTIPLE_SELECT,
    options: [
      {
        id: "a",
        optionText:
          "Hooks can only be called at the top level of React functions",
        optionOrder: 1,
      },
      {
        id: "b",
        optionText:
          "useState returns an array with the current state and a setter function",
        optionOrder: 2,
      },
      {
        id: "c",
        optionText: "useEffect runs after every render by default",
        optionOrder: 3,
      },
      {
        id: "d",
        optionText: 'Custom hooks must start with "use"',
        optionOrder: 4,
      },
    ],
    correctAnswer: "a,b,c,d",
    marks: 8,
    order: 5,
  },
];

let currentAttempt: TestAttempt | null = null;
let savedAnswers: Record<string, unknown> = {};
let monitoringEvents: MonitoringEvent[] = [];

export const mockTestService = {
  // Get available tests
  getAvailableTests: async (): Promise<{ tests: Test[] }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      tests: MOCK_TESTS,
    };
  },

  // Start a test attempt
  startTest: async (testId: string): Promise<{ attempt: TestAttempt }> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const test = MOCK_TESTS.find((t) => t.id === testId);
    if (!test) {
      throw new Error("Test not found");
    }

    currentAttempt = {
      id: `attempt-${Date.now()}`,
      testId,
      studentId: "student-123",
      startTime: new Date().toISOString(),
      endTime: new Date(
        Date.now() + test.durationInMinutes * 60 * 1000,
      ).toISOString(),
      status: AttemptStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: test.durationInMinutes * 60,
      violations: [],
      isFullscreen: true,
      cameraPermission: true,
      microphonePermission: true,
    };

    return { attempt: currentAttempt };
  },

  // Get test questions
  getTestQuestions: async (
    attemptId: string,
  ): Promise<{ questions: Question[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!currentAttempt || currentAttempt.id !== attemptId) {
      throw new Error("Invalid attempt");
    }

    return {
      questions: MOCK_QUESTIONS,
    };
  },

  // Save answer
  saveAnswer: async (
    attemptId: string,
    questionId: string,
    answer: any,
  ): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!currentAttempt || currentAttempt.id !== attemptId) {
      throw new Error("Invalid attempt");
    }

    savedAnswers[questionId] = answer;
    currentAttempt.answers = { ...savedAnswers };

    return { success: true };
  },

  // Auto-save answers
  autoSave: async (
    attemptId: string,
    answers: Record<string, any>,
  ): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!currentAttempt || currentAttempt.id !== attemptId) {
      throw new Error("Invalid attempt");
    }

    savedAnswers = { ...savedAnswers, ...answers };
    currentAttempt.answers = savedAnswers;

    return { success: true };
  },

  // Submit test
  submitTest: async (
    attemptId: string,
  ): Promise<{ success: boolean; results?: TestResults }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!currentAttempt || currentAttempt.id !== attemptId) {
      throw new Error("Invalid attempt");
    }

    currentAttempt.status = "submitted";
    currentAttempt.submittedAt = new Date().toISOString();

    // Calculate mock results
    const totalQuestions = MOCK_QUESTIONS.length;
    const answeredQuestions = Object.keys(savedAnswers).length;
    const mockScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    const maxMarks = MOCK_QUESTIONS.reduce((sum, q) => sum + q.marks, 0);
    const obtainedMarks = Math.floor((mockScore / 100) * maxMarks);

    const results: TestResults = {
      attemptId,
      testId: currentAttempt.testId,
      studentId: currentAttempt.studentId,
      score: mockScore,
      obtainedMarks,
      maxMarks,
      totalQuestions,
      answeredQuestions,
      correctAnswers: Math.floor(answeredQuestions * 0.8),
      incorrectAnswers: answeredQuestions - Math.floor(answeredQuestions * 0.8),
      unansweredQuestions: totalQuestions - answeredQuestions,
      timeTaken: Math.floor(Math.random() * 3000) + 1800, // 30-80 minutes in seconds
      submittedAt: currentAttempt.submittedAt,
      grade:
        mockScore >= 80
          ? "A"
          : mockScore >= 70
            ? "B"
            : mockScore >= 60
              ? "C"
              : "F",
      passed: mockScore >= 60,
      violations: monitoringEvents.filter((e) => e.severity === "high").length,
      questionWiseResults: MOCK_QUESTIONS.map((q) => ({
        questionId: q.id,
        isCorrect: Math.random() > 0.3,
        marksObtained: Math.random() > 0.3 ? q.marks : 0,
        maxMarks: q.marks,
      })),
    };

    return { success: true, results };
  },

  // Log monitoring event
  logMonitoringEvent: async (
    event: Omit<MonitoringEvent, "id" | "timestamp">,
  ): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const monitoringEvent: MonitoringEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    monitoringEvents.push(monitoringEvent);
    console.log("Monitoring Event:", monitoringEvent);

    return { success: true };
  },

  // Batch log monitoring events
  logMonitoringEventsBatch: async (
    events: Omit<MonitoringEvent, "id" | "timestamp">[],
  ): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const timestampedEvents = events.map((event) => ({
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    }));

    monitoringEvents.push(...timestampedEvents);
    console.log("Batch Monitoring Events:", timestampedEvents);

    return { success: true };
  },

  // Upload video recording
  uploadRecording: async (
    videoBlob: Blob,
    attemptId: string,
  ): Promise<{ success: boolean; url?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate upload time

    console.log(`Mock video upload for attempt ${attemptId}:`, {
      size: videoBlob.size,
      type: videoBlob.type,
    });

    return {
      success: true,
      url: `https://mock-storage.example.com/recordings/${attemptId}.webm`,
    };
  },

  // Upload video chunk
  uploadRecordingChunk: async (
    chunkBlob: Blob,
    attemptId: string,
    chunkIndex: number,
  ): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(
      `Mock video chunk upload for attempt ${attemptId}, chunk ${chunkIndex}:`,
      {
        size: chunkBlob.size,
        type: chunkBlob.type,
      },
    );

    return { success: true };
  },

  // Get current attempt (for testing)
  getCurrentAttempt: (): TestAttempt | null => currentAttempt,

  // Get saved answers (for testing)
  getSavedAnswers: (): Record<string, any> => savedAnswers,

  // Get monitoring events (for testing)
  getMonitoringEvents: (): MonitoringEvent[] => monitoringEvents,

  // Reset mock data (for testing)
  resetMockData: (): void => {
    currentAttempt = null;
    savedAnswers = {};
    monitoringEvents = [];
  },
};

export default mockTestService;
