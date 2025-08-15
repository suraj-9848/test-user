import { Question, TestAnswer } from "./test";

export interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?:
    | "PASSED"
    | "FAILED"
    | "ERROR"
    | "RUNTIME_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "COMPILATION_ERROR";
  execution_time?: number;
  memory_used?: number;
  error_message?: string;
  compile_output?: string;
}

export interface QuestionRendererProps {
  question: Question;
  answer: TestAnswer;
  onAnswerChange: (
    questionId: string,
    selectedOptions: string[],
    textAnswer?: string,
  ) => void;
  onRunCode?: (
    questionId: string,
    code: string,
    language: string,
  ) => Promise<TestCase[]>; // ✅ Added this
  onCodeSubmit?: (
    questionId: string,
    code: string,
    language: string,
    results: TestCase[],
    score: number,
  ) => void;
  existingSubmission?: {
    submitted: boolean;
    message: string;
    success: boolean;
    allTestsPassed: boolean;
    totalTests: number;
    passedTests: number;
    score: number;
  } | null;
  testId?: string;
}
