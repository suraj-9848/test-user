export interface Test {
  id: string;
  title: string;
  description: string;
  courseName: string;
  batchName: string;
  durationInMinutes: number;
  startDate: string;
  endDate: string;
  maxMarks: number;
  passingMarks: number;
  shuffleQuestions: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  maxAttempts: number;
  hasOngoingAttempt: boolean;
  status: TestStatus;
  questions?: Question[];
}

export enum TestStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  options?: QuizOption[];
  correctAnswer?: string;
  explanation?: string;
  order: number;

  // Enhanced fields for better type handling
  originalType?: string; // Backend type (MCQ, DESCRIPTIVE, CODE)
  type?: string; // Alternative field name
  expectedWordCount?: number | null;

  // Coding question specific fields
  codeLanguage?: string;
  constraints?: string;
  visible_testcases?: TestCase[];
  visibleTestcases?: TestCase[]; // Alternative field name
  visibleTestCases?: TestCase[]; // Another alternative
  hidden_testcases?: TestCase[];
  hiddenTestcases?: TestCase[]; // Alternative field name
  hiddenTestCases?: TestCase[]; // Another alternative
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

// Enhanced TestCase interface
export interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?: "PASSED" | "FAILED" | "ERROR";
  execution_time?: number;
  memory_used?: number;
  error_message?: string;
}

export enum QuestionType {
  MCQ = "MCQ",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
}

// Backend question types (what the API actually sends)
export enum BackendQuestionType {
  MCQ = "MCQ",
  DESCRIPTIVE = "DESCRIPTIVE",
  CODE = "CODE",
}

// Enhanced mapping from backend types to frontend types
export const mapBackendToFrontendType = (backendType: string): QuestionType => {
  switch (backendType) {
    case BackendQuestionType.MCQ:
      return QuestionType.MCQ;
    case BackendQuestionType.DESCRIPTIVE:
      return QuestionType.LONG_ANSWER; // Map DESCRIPTIVE to LONG_ANSWER
    case BackendQuestionType.CODE:
      return QuestionType.LONG_ANSWER; // Map CODE to LONG_ANSWER (but preserve originalType for detection)
    default:
      console.warn(
        `Unknown backend question type: ${backendType}, defaulting to MCQ`,
      );
      return QuestionType.MCQ;
  }
};

// Enhanced mapping from frontend types to backend types (for submission)
export const mapFrontendToBackendType = (
  frontendType: QuestionType,
  originalType?: string,
): string => {
  // If we have the original backend type, use it for accurate mapping
  if (originalType) {
    return originalType;
  }

  // Fallback mapping
  switch (frontendType) {
    case QuestionType.MCQ:
    case QuestionType.MULTIPLE_SELECT:
    case QuestionType.TRUE_FALSE:
      return BackendQuestionType.MCQ;
    case QuestionType.SHORT_ANSWER:
    case QuestionType.LONG_ANSWER:
      return BackendQuestionType.DESCRIPTIVE;
    default:
      return BackendQuestionType.MCQ;
  }
};

export interface QuizOption {
  id: string;
  optionText: string;
  optionOrder: number;
  // Additional possible field names from backend
  text?: string;
  label?: string;
  value?: string;
  option_text?: string; // Backend field name
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  status: AttemptStatus;
  score?: number;
  feedback?: string;
  startedAt: string;
  submittedAt?: string;
  lastUpdated: string;
  answers: TestAnswer[];
  // Time remaining in seconds for the current attempt
  timeRemaining?: number;
  // Alias for remaining time, if used elsewhere
  remainingTime?: number;
}

export enum AttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  EVALUATED = "EVALUATED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface TestAnswer {
  id: string;
  questionId: string;
  selectedOptions: string[];
  textAnswer: string;
  timeSpent: number;
  // Additional fields for coding questions
  codeSubmission?: string;
  programmingLanguage?: string;
  executionResults?: TestCase[];
}

export interface MonitoringEvent {
  id: string;
  attemptId: string;
  eventType: MonitoringEventType;
  timestamp: string;
  metadata: Record<string, unknown>;
  severity: SecuritySeverity;
}

export enum MonitoringEventType {
  TAB_SWITCH = "TAB_SWITCH",
  WINDOW_BLUR = "WINDOW_BLUR",
  FULLSCREEN_EXIT = "FULLSCREEN_EXIT",
  COPY = "COPY",
  PASTE = "PASTE",
  CONTEXT_MENU = "CONTEXT_MENU",
  KEYBOARD_SHORTCUT = "KEYBOARD_SHORTCUT",
  CAMERA_DISABLED = "CAMERA_DISABLED",
  MICROPHONE_DISABLED = "MICROPHONE_DISABLED",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum SecuritySeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface TestUIState {
  currentQuestionIndex: number;
  isFullscreen: boolean;
  timeRemaining: number;
  isSubmitting: boolean;
  showWarning: boolean;
  warningMessage: string;
  cameraStatus: "enabled" | "disabled" | "error";
  recordingStatus: RecordingStatus;
  securityViolations: number;
  lastActivity: string;
}

export enum RecordingStatus {
  IDLE = "IDLE",
  RECORDING = "RECORDING",
  PAUSED = "PAUSED",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}

// Test submission related interfaces
export interface TestSubmissionData {
  testId: string;
  responses: Array<{
    questionId: string;
    answer: string | string[];
    timeSpent?: number;
    codeSubmission?: string;
    programmingLanguage?: string;
  }>;
  submissionType:
    | "MANUAL"
    | "AUTO_TIME"
    | "AUTO_VIOLATION"
    | "AUTO_BROWSER_CLOSE";
  totalTimeSpent: number;
  monitoringEvents?: MonitoringEvent[];
}

export interface SubmitTestResponse {
  success: boolean;
  message: string;
  submissionId: string;
  score?: number;
  totalMarks: number;
  percentage?: number;
  hasDescriptiveQuestions: boolean;
  evaluationPending: boolean;
}

// Enhanced interfaces for coding questions
export interface CodeExecutionRequest {
  questionId: string;
  code: string;
  language: string;
  testCases?: TestCase[];
}

export interface CodeExecutionResponse {
  success: boolean;
  results: TestCase[];
  compilationError?: string;
  executionError?: string;
  totalTestCases: number;
  passedTestCases: number;
}

// Judge0 related interfaces
export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0SubmissionResponse {
  token: string;
}

export interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
}

// Enhanced test result interfaces
export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: string;
  evaluatedAt?: string;
  status: "PENDING" | "EVALUATED" | "PARTIAL";
  responses: TestResultResponse[];
  feedback?: string;
  rank?: number;
  timeTaken: number;
}

export interface TestResultResponse {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  marks: number;
  studentAnswer: string | string[];
  correctAnswer?: string | string[];
  score: number;
  feedback?: string;
  isCorrect: boolean;
  codeSubmission?: string;
  executionResults?: TestCase[];
}

// Leaderboard interfaces
export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  submittedAt: string;
}

export interface TestLeaderboard {
  testId: string;
  testTitle: string;
  totalStudents: number;
  entries: LeaderboardEntry[];
  currentStudentRank?: number;
  lastUpdated: string;
}
