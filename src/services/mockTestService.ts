/* eslint-disable @typescript-eslint/no-explicit-any */
// Simplified mock test service - returns empty data to avoid build errors

export const mockTestService = {
  // Get available tests
  getAvailableTests: async () => {
    return { tests: [] };
  },

  // Start a test attempt  
  startTest: async (testId: string) => {
    return { 
      attempt: {
        id: `attempt-${Date.now()}`,
        testId,
        studentId: "student-123",
        status: "IN_PROGRESS",
        currentQuestionIndex: 0,
        answers: [],
      }
    };
  },

  // Get test questions
  getTestQuestions: async (attemptId: string) => {
    return { questions: [] };
  },

  // Get current attempt
  getCurrentAttempt: () => {
    return { timeRemaining: 3600 };
  },

  // Submit test
  submitTest: async (attemptId: string) => {
    return { 
      success: true,
      results: {
        score: 0,
        passed: false
      }
    };
  },

  // Auto save
  autoSave: async (attemptId: string, answers: any) => {
    return { success: true };
  },

  // Log monitoring event
  logMonitoringEvent: async (event: any) => {
    return { success: true };
  },

  // Upload recording
  uploadRecording: async (videoBlob: Blob, attemptId: string) => {
    return { success: true };
  }
};
