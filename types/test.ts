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
}

export enum QuestionType {
  MCQ = "MCQ",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  TRUE_FALSE = "TRUE_FALSE",
  SHORT_ANSWER = "SHORT_ANSWER",
  LONG_ANSWER = "LONG_ANSWER",
}

export interface QuizOption {
  id: string;
  optionText: string;
  optionOrder: number;
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
  remainingTime?: number;
}

export enum AttemptStatus {
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  EVALUATED = "EVALUATED",
}

export interface TestAnswer {
  id: string;
  questionId: string;
  selectedOptions: string[];
  textAnswer?: string;
  isCorrect?: boolean;
  marksAwarded?: number;
  timeSpent?: number;
}

// Monitoring and Security Types
export interface MonitoringEvent {
  id: string;
  attemptId: string;
  eventType: MonitoringEventType;
  timestamp: string;
  metadata?: Record<string, any>;
  severity: SecuritySeverity;
}

export enum MonitoringEventType {
  TAB_SWITCH = "TAB_SWITCH",
  WINDOW_BLUR = "WINDOW_BLUR",
  FULLSCREEN_EXIT = "FULLSCREEN_EXIT",
  COPY_ATTEMPT = "COPY_ATTEMPT",
  PASTE_ATTEMPT = "PASTE_ATTEMPT",
  RIGHT_CLICK = "RIGHT_CLICK",
  KEYBOARD_SHORTCUT = "KEYBOARD_SHORTCUT",
  BROWSER_CLOSE_ATTEMPT = "BROWSER_CLOSE_ATTEMPT",
  CAMERA_DISABLED = "CAMERA_DISABLED",
  MICROPHONE_DISABLED = "MICROPHONE_DISABLED",
  FACE_NOT_DETECTED = "FACE_NOT_DETECTED",
  MULTIPLE_FACES = "MULTIPLE_FACES",
  SCREEN_RECORDING_DETECTED = "SCREEN_RECORDING_DETECTED",
  DEVELOPER_TOOLS_OPENED = "DEVELOPER_TOOLS_OPENED",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
}

export enum SecuritySeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface VideoRecording {
  id: string;
  attemptId: string;
  s3Url: string;
  fileName: string;
  duration: number;
  createdAt: string;
  expiresAt: string; // 1 week from creation
  status: RecordingStatus;
}

export enum RecordingStatus {
  RECORDING = "RECORDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  EXPIRED = "EXPIRED",
}

export interface CameraSettings {
  enabled: boolean;
  resolution: {
    width: number;
    height: number;
  };
  frameRate: number;
  facingMode: "user" | "environment";
}

export interface TestSettings {
  fullscreenRequired: boolean;
  cameraRequired: boolean;
  microphoneRequired: boolean;
  screenRecordingBlocked: boolean;
  copyPasteBlocked: boolean;
  rightClickBlocked: boolean;
  developerToolsBlocked: boolean;
  tabSwitchingAllowed: boolean;
  maxTabSwitches: number;
  autoSubmitOnViolation: boolean;
  watermarkText: string;
  faceDetectionEnabled: boolean;
  suspiciousActivityThreshold: number;
}

export interface TestSubmissionData {
  attemptId: string;
  answers: TestAnswer[];
  monitoringEvents: MonitoringEvent[];
  videoRecordingId?: string;
  submissionType:
    | "MANUAL"
    | "AUTO_TIME"
    | "AUTO_VIOLATION"
    | "AUTO_BROWSER_CLOSE";
  finalScore?: number;
  completedAt: string;
}

// UI State Types
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

// API Response Types
export interface TestAPIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AvailableTestsResponse {
  availableTests: Test[];
}

export interface TestQuestionsResponse {
  test: Test;
  questions: Question[];
  attempt: TestAttempt;
}

export interface SubmitTestResponse {
  attempt: TestAttempt;
  score?: number;
  passed?: boolean;
}
