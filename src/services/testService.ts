import { apiService } from "@/config/api";
import {
    Test,
    TestAttempt,
    Question,
    TestAnswer,
    MonitoringEvent,
    TestSubmissionData,
    SubmitTestResponse,
    AttemptStatus,
} from "@/types/test";

// Test Service always uses real backend API

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
        const response = await apiService.getAvailableTests();
        console.log("Tests response:", response);
        return { availableTests: response.tests };
    }

    /**
     * Get test details
     */
    static async getTestDetails(testId: string): Promise<{ test: Test }> {
        return apiService.getTestDetails(testId);
    }

    /**
     * Submit test
     */
    static async submitTest(
        testId: string,
        responses: Array<{ questionId: string; answer: string | string[] }>
    ): Promise<any> {
        return apiService.submitTest(testId, responses);
    }

    /**
     * Get test results
     */
    static async getTestResults(testId: string): Promise<any> {
        return apiService.getTestResults(testId);
    }

    /**
     * Start a new test attempt (placeholder - may not be needed)
     */
    static async startTest(testId: string): Promise<{ attempt: TestAttempt }> {
        // For now, just get test details and create a mock attempt
        const { test } = await this.getTestDetails(testId);
        
        const attempt: TestAttempt = {
            id: `attempt-${Date.now()}`,
            testId: test.id,
            studentId: "student-123", // This should come from auth
            status: AttemptStatus.IN_PROGRESS,
            startedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            answers: [],
            timeRemaining: test.durationInMinutes * 60,
        };
        
        return { attempt };
    }

    /**
     * Fetch questions for a specific test attempt
     */
    static async getTestQuestions(attemptId: string): Promise<{
        questions: Question[];
        answers: TestAnswer[];
        remainingTimeSeconds: number;
    }> {
        // For now, get test details and extract questions
        const testId = attemptId.split('-')[1]; // Extract testId from attemptId
        const { test } = await this.getTestDetails(testId);
        
        return {
            questions: test.questions || [],
            answers: [],
            remainingTimeSeconds: test.durationInMinutes * 60,
        };
    }

    /**
     * Save student answers (auto-save functionality)
     */
    static async saveAnswers(
        attemptId: string,
        answers: TestAnswer[]
    ): Promise<void> {
        // This might not be needed if we're submitting all at once
        console.log("Saving answers:", answers);
    }

    /**
     * Log a monitoring/security event
     */
    static async logMonitoringEvent(event: MonitoringEvent): Promise<void> {
        // This might not be needed if monitoring is handled differently
        console.log("Monitoring event:", event);
    }

    /**
     * Upload video recording chunk to S3
     */
    static async uploadVideoRecording(
        formData: FormData
    ): Promise<{ success: boolean; url?: string }> {
        // This might not be needed if video recording is handled differently
        console.log("Uploading video recording");
        return { success: true };
    }

    /**
     * Batch upload multiple monitoring events
     */
    static async logMonitoringEventsBatch(
        events: MonitoringEvent[]
    ): Promise<void> {
        // This might not be needed if monitoring is handled differently
        console.log("Batch monitoring events:", events);
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
        // This might need to be implemented based on your auth system
        throw new Error("Not implemented");
    }

    /**
     * Get student's test history
     */
    static async getTestHistory(): Promise<TestHistoryResponse> {
        const response = await apiService.getAvailableTests();
        return {
            tests: response.tests,
            totalCount: response.tests.length,
        };
    }

    /**
     * Get student's test attempts
     */
    static async getAttempts(): Promise<AttemptsResponse> {
        // This might need to be implemented based on your backend
        throw new Error("Not implemented");
    }
}

// Export test API methods
export const testAPI = {
    getAvailableTests: TestService.getAvailableTests,
    getTestDetails: TestService.getTestDetails,
    submitTest: TestService.submitTest,
    getTestResults: TestService.getTestResults,
    startTest: TestService.startTest,
    getTestQuestions: TestService.getTestQuestions,
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
