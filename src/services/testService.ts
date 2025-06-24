/* eslint-disable @typescript-eslint/no-explicit-any */
// Simplified test service - returns empty data to avoid build errors

import { mockTestService } from "./mockTestService";

export class TestService {
  static async getAvailableTests() {
    return mockTestService.getAvailableTests();
  }

  static async startTest(testId: string) {
    return mockTestService.startTest(testId);
  }

  static async getTestQuestions(attemptId: string) {
    return mockTestService.getTestQuestions(attemptId);
  }

  static async submitTest(attemptId: string, submissionData?: any) {
    return mockTestService.submitTest(attemptId);
  }

  static async saveAnswers(attemptId: string, answers: any) {
    return mockTestService.autoSave(attemptId, answers);
  }

  static async logMonitoringEvent(event: any) {
    return mockTestService.logMonitoringEvent(event);
  }

  static async uploadVideoRecording(formData: FormData) {
    return { success: true, url: "" };
  }

  static async logMonitoringEventsBatch(events: any[]) {
    return { success: true };
  }
}

export class StudentService {
  static async getProfile() {
    return { id: "", name: "", email: "" };
  }

  static async getTestHistory() {
    return { tests: [], totalCount: 0 };
  }

  static async getAttempts() {
    return { attempts: [], totalCount: 0 };
  }
}

// Export convenience methods
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
