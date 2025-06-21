import { API_ENDPOINTS, apiHelpers } from '@/config/api';
import { Test, TestAttempt, Question, TestAnswer, MonitoringEvent, TestSubmissionData, SubmitTestResponse } from '@/types/test';
import { mockTestService } from './mockTestService';

// Use mock data for demo purposes
const USE_MOCK_DATA = true;

// API Response Types
interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  // Add other profile fields as needed
}

interface TestHistoryResponse {
  tests: Test[];
  totalCount: number;
}

interface AttemptsResponse {
  attempts: TestAttempt[];
  totalCount: number;
}

/**
 * Test Service - Handles all test-related API operations
 */
export class TestService {
  /**
   * Fetch all available tests for the current student
   */
  static async getAvailableTests(): Promise<{ availableTests: Test[] }> {
    if (USE_MOCK_DATA) {
      const result = await mockTestService.getAvailableTests();
      return { availableTests: result.tests };
    }
    return apiHelpers.get(API_ENDPOINTS.TEST.AVAILABLE);
  }

  /**
   * Start a new test attempt
   */
  static async startTest(testId: string): Promise<{ attempt: TestAttempt }> {
    if (USE_MOCK_DATA) {
      return mockTestService.startTest(testId);
    }
    return apiHelpers.post(API_ENDPOINTS.TEST.START(testId));
  }

  /**
   * Fetch questions for a specific test attempt
   */
  static async getTestQuestions(attemptId: string): Promise<{ questions: Question[]; answers: TestAnswer[]; remainingTimeSeconds: number }> {
    if (USE_MOCK_DATA) {
      const result = await mockTestService.getTestQuestions(attemptId);
      const attempt = mockTestService.getCurrentAttempt();
      return { 
        questions: result.questions, 
        answers: [], 
        remainingTimeSeconds: attempt?.timeRemaining || 3600 
      };
    }
    return apiHelpers.get(API_ENDPOINTS.TEST.QUESTIONS(attemptId));
  }

  /**
   * Submit completed test
   */
  static async submitTest(attemptId: string, submissionData: TestSubmissionData): Promise<SubmitTestResponse> {
    if (USE_MOCK_DATA) {
      const result = await mockTestService.submitTest(attemptId);
      return {
        success: result.success,
        message: 'Test submitted successfully',
        results: result.results
      };
    }
    return apiHelpers.post(API_ENDPOINTS.TEST.SUBMIT(attemptId), submissionData);
  }

  /**
   * Save student answers (auto-save functionality)
   */
  static async saveAnswers(attemptId: string, answers: TestAnswer[]): Promise<void> {
    if (USE_MOCK_DATA) {
      // Convert TestAnswer[] to Record<string, any> for mock service
      const answersMap = answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.selectedAnswer || answer.textAnswer;
        return acc;
      }, {} as Record<string, any>);
      await mockTestService.autoSave(attemptId, answersMap);
      return;
    }
    return apiHelpers.post(API_ENDPOINTS.ATTEMPT.SAVE_ANSWERS(attemptId), { answers });
  }

  /**
   * Log a monitoring/security event
   */
  static async logMonitoringEvent(event: MonitoringEvent): Promise<void> {
    if (USE_MOCK_DATA) {
      await mockTestService.logMonitoringEvent(event);
      return;
    }
    return apiHelpers.post(API_ENDPOINTS.MONITORING.LOG_EVENT, event);
  }

  /**
   * Upload video recording chunk to S3
   */
  static async uploadVideoRecording(formData: FormData): Promise<{ success: boolean; url?: string }> {
    return apiHelpers.postMultipart(API_ENDPOINTS.RECORDING.UPLOAD, formData);
  }

  /**
   * Batch upload multiple monitoring events
   */
  static async logMonitoringEventsBatch(events: MonitoringEvent[]): Promise<void> {
    return apiHelpers.post(API_ENDPOINTS.MONITORING.BATCH_EVENTS, { events });
  }
}

/**
 * Student Service - Handles student-related API operations
 */
export class StudentService {
  /**
   * Get student profile information
   */
  static async getProfile(): Promise<ProfileResponse> {
    return apiHelpers.get(API_ENDPOINTS.STUDENT.PROFILE);
  }

  /**
   * Get student's test history
   */
  static async getTestHistory(): Promise<TestHistoryResponse> {
    return apiHelpers.get(API_ENDPOINTS.STUDENT.TESTS);
  }

  /**
   * Get student's test attempts
   */
  static async getAttempts(): Promise<AttemptsResponse> {
    return apiHelpers.get(API_ENDPOINTS.STUDENT.ATTEMPTS);
  }
}

// Export convenience methods for backward compatibility
export const testAPI = {
  getAvailableTests: TestService.getAvailableTests,
  startTest: TestService.startTest,
  getTestQuestions: TestService.getTestQuestions,
  submitTest: TestService.submitTest,
  saveAnswers: TestService.saveAnswers,
  logMonitoringEvent: TestService.logMonitoringEvent,
  uploadVideoRecording: TestService.uploadVideoRecording,
  logMonitoringEventsBatch: TestService.logMonitoringEventsBatch,
};

export const studentAPI = {
  getProfile: StudentService.getProfile,
  getTestHistory: StudentService.getTestHistory,
  getAttempts: StudentService.getAttempts,
}; 