import { mapBackendToFrontendType } from "@/types/test";

// API Configuration
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

console.log("API Configuration - BASE_URL:", BASE_URL);

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("jwt");
  console.log("JWT Token found:", token ? "Yes" : "No");
  return token;
};

// Transform backend questions to frontend format
const transformQuestions = (questions: any[]): any[] => {
  return questions.map((question) => {
    console.log("Transforming question:", question);
    console.log("Question options/choices:", {
      options: question.options,
      choices: question.choices,
      answers: question.answers,
      allKeys: Object.keys(question),
    });

    // Handle options - they might be in a different format
    let options = [];

    // Check all possible field names for options
    const possibleOptionFields = [
      "options",
      "choices",
      "answers",
      "alternatives",
      "options_list",
      "choices_list",
    ];

    for (const fieldName of possibleOptionFields) {
      if (question[fieldName] && Array.isArray(question[fieldName])) {
        console.log(
          `Found options in field: ${fieldName}`,
          question[fieldName],
        );
        options = question[fieldName];
        break;
      }
    }

    // If no options found, check if there are nested objects that might contain options
    if (options.length === 0) {
      console.log(
        "No options found in standard fields, checking nested objects...",
      );
      Object.keys(question).forEach((key) => {
        if (typeof question[key] === "object" && question[key] !== null) {
          console.log(`Checking nested object in field: ${key}`, question[key]);
        }
      });
    }

    console.log("Final options array:", options);

    // Map backend field names to frontend field names
    const transformedQuestion = {
      id: question.id,
      questionText: question.question_text || question.questionText || "",
      questionType: mapBackendToFrontendType(
        question.type || question.questionType,
      ),
      marks: question.marks || 0,
      options: options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      order: question.order || 0,
      originalType: question.type || question.questionType, // Preserve original backend type
      // Keep any other fields that might be useful
      expectedWordCount: question.expectedWordCount,
    };

    console.log("Transformed question:", transformedQuestion);
    return transformedQuestion;
  });
};

// Import enhanced API client with automatic token refresh
const getEnhancedApiClient = async () => {
  // Dynamically import to avoid SSR issues
  const { apiClient } = await import("@/utils/apiClient");
  return apiClient;
};

// Enhanced API Service with automatic token refresh
export const apiService = {
  // Get available tests with automatic token refresh
  getAvailableTests: async (): Promise<{ tests: any[] }> => {
    try {
      console.log("🔄 Fetching available tests with enhanced API client...");
      const apiClient = await getEnhancedApiClient();
      const response = await apiClient("/api/student/tests");

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" API Error response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(" Raw API response:", data);
      return { tests: data.data?.tests || [] };
    } catch (error) {
      console.error(" Error in getAvailableTests:", error);
      throw error;
    }
  },

  // Get test details with automatic token refresh
  getTestDetails: async (testId: string): Promise<{ test: any }> => {
    try {
      console.log(
        `🔄 Fetching test details for ${testId} with enhanced API client...`,
      );
      const apiClient = await getEnhancedApiClient();
      const response = await apiClient(`/api/student/tests/${testId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" API Error response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(" Test details response:", data);

      // Transform questions to frontend format
      const transformedTest = {
        ...data.data.test,
        questions: transformQuestions(data.data.test.questions || []),
      };

      console.log(" Transformed test:", transformedTest);
      return { test: transformedTest };
    } catch (error) {
      console.error(" Error in getTestDetails:", error);
      throw error;
    }
  },

  // Submit test -  Use testId instead of attemptId
  submitTest: async (testId: string, responses: any[]): Promise<any> => {
    const token = getAuthToken();
    console.log(
      "Submitting test with testId:",
      testId,
      "responses:",
      responses,
    );

    const response = await fetch(
      `${BASE_URL}/api/student/tests/${testId}/submit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Get test results
  getTestResults: async (testId: string): Promise<any> => {
    const token = getAuthToken();
    const response = await fetch(
      `${BASE_URL}/api/student/tests/${testId}/results`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error response:", errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Add missing methods that TestInterface is calling
  logMonitoringEvent: async (event: any): Promise<void> => {
    // Disabled - endpoint doesn't exist on backend
    console.log("Monitoring event (disabled):", event);
    return Promise.resolve();
  },

  uploadRecording: async (
    formData: FormData,
  ): Promise<{ success: boolean; url?: string }> => {
    // Disabled - endpoint doesn't exist on backend
    console.log("Upload recording (disabled):", formData);
    return Promise.resolve({ success: true });
  },

  saveAnswers: async (attemptId: string, answers: any[]): Promise<void> => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        `${BASE_URL}/api/student/tests/attempts/${attemptId}/answers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        },
      );

      if (!response.ok) {
        console.warn("Failed to save answers:", response.status);
      }
    } catch (error) {
      console.warn("Failed to save answers:", error);
    }
  },
  getBlogs: async (
    page: number = 1,
    limit: number = 12,
  ): Promise<{
    blogs: any[];
    pagination: any;
    success: boolean;
    message: string;
  }> => {
    try {
      console.log("🔄 Fetching blogs with enhanced API client...");
      const apiClient = await getEnhancedApiClient();
      const response = await apiClient(
        `/api/student/blogs?page=${page}&limit=${limit}`,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(" Error:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Blogs API response:", data);

      return {
        blogs: data.data?.blogs || [],
        pagination: data.data?.pagination || {},
        success: data.success || true,
        message: data.message || "Blogs fetched successfully",
      };
    } catch (error) {
      console.error("Error in getBlogs:", error);
      throw error;
    }
  },

  getBlogById: async (
    blogId: string,
  ): Promise<{
    blog: any;
    success: boolean;
    message: string;
  }> => {
    try {
      console.log(`🔄 Fetching blog details for ${blogId}...`);
      const apiClient = await getEnhancedApiClient();
      const response = await apiClient(`/api/student/blogs/${blogId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Blog API Error:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(" Blog details response:", data);

      return {
        blog: data.data?.blog || {},
        success: data.success || true,
        message: data.message || "Blog fetched successfully",
      };
    } catch (error) {
      console.error("❌ Error in getBlogById:", error);
      throw error;
    }
  },
};

// Keep the old API_ENDPOINTS for backward compatibility
export const API_ENDPOINTS = {
  // Test Management
  TEST: {
    AVAILABLE: `${BASE_URL}/api/student/tests`,
    START: (testId: string) => `${BASE_URL}/api/student/tests/${testId}/start`,
    QUESTIONS: (attemptId: string) =>
      `${BASE_URL}/api/student/tests/attempts/${attemptId}/questions`,
    SUBMIT: (testId: string) =>
      `${BASE_URL}/api/student/tests/${testId}/submit`,
  },

  // Test Attempt Management
  ATTEMPT: {
    SAVE_ANSWERS: (attemptId: string) =>
      `${BASE_URL}/api/student/tests/attempts/${attemptId}/answers`,
  },

  // Monitoring and Security
  MONITORING: {
    LOG_EVENT: `${BASE_URL}/api/test/monitoring-event`,
    BATCH_EVENTS: `${BASE_URL}/api/test/monitoring-events/batch`,
  },

  // Video Recording
  RECORDING: {
    UPLOAD: `${BASE_URL}/api/test/upload-recording`,
    UPLOAD_CHUNK: `${BASE_URL}/api/test/upload-recording-chunk`,
  },

  // Student Management
  STUDENT: {
    PROFILE: `${BASE_URL}/api/student/profile`,
    TESTS: `${BASE_URL}/api/student/tests`,
    ATTEMPTS: `${BASE_URL}/api/student/attempts`,
  },
} as const;

export default API_ENDPOINTS;
