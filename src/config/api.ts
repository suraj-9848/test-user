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

const transformQuestions = (questions: any[]): any[] => {
  return questions.map((q) => {
    console.log("🔄 Transforming question:", {
      id: q.id,
      type: q.type,
      questionType: q.questionType,
      question_text: q.question_text,
      questionText: q.questionText,
      visible_testcases: q.visible_testcases,
      constraints: q.constraints,
    });

    // Enhanced field mapping with multiple fallbacks
    const transformedQuestion = {
      id: q.id,
      questionText: q.question_text || q.questionText || "",
      marks: q.marks || 1,
      order: q.order || 1,

      // Preserve original type information for coding questions
      originalType: q.type,
      type: q.type, // Keep backend type

      // Map backend types to frontend QuestionType enum
      questionType: mapBackendToFrontendType(q.type),

      // Handle options for MCQ questions
      options:
        q.options?.map((opt: any) => ({
          id: opt.id,
          optionText: opt.text || opt.option_text || opt.optionText,
          optionOrder: opt.order || opt.option_order || 0,
          text: opt.text || opt.option_text || opt.optionText, // Fallback field
          label: opt.text || opt.option_text || opt.optionText, // Another fallback
        })) || [],

      // Enhanced coding question fields with multiple fallback paths
      codeLanguage: q.codeLanguage || q.code_language || q.programming_language,
      constraints: q.constraints,

      // FIXED: Handle test cases that are already parsed arrays from backend
      visible_testcases: Array.isArray(q.visible_testcases)
        ? q.visible_testcases
        : parseTestCases(q.visible_testcases),
      visibleTestcases: Array.isArray(q.visible_testcases)
        ? q.visible_testcases
        : parseTestCases(q.visible_testcases),
      visibleTestCases: Array.isArray(q.visible_testcases)
        ? q.visible_testcases
        : parseTestCases(q.visible_testcases),

      hidden_testcases: Array.isArray(q.hidden_testcases)
        ? q.hidden_testcases
        : parseTestCases(q.hidden_testcases),
      hiddenTestcases: Array.isArray(q.hidden_testcases)
        ? q.hidden_testcases
        : parseTestCases(q.hidden_testcases),
      hiddenTestCases: Array.isArray(q.hidden_testcases)
        ? q.hidden_testcases
        : parseTestCases(q.hidden_testcases),

      time_limit_ms: q.time_limit_ms || q.timeLimitMs || 5000,
      memory_limit_mb: q.memory_limit_mb || q.memoryLimitMb || 256,

      // Additional fields that might be useful
      expectedWordCount: q.expectedWordCount || q.expected_word_count,
    };

    console.log("✅ Transformed question:", {
      id: transformedQuestion.id,
      type: transformedQuestion.type,
      originalType: transformedQuestion.originalType,
      hasConstraints: !!transformedQuestion.constraints,
      visibleTestCasesCount: transformedQuestion.visible_testcases?.length || 0,
      hiddenTestCasesCount: transformedQuestion.hidden_testcases?.length || 0,
    });

    return transformedQuestion;
  });
};

// Enhanced test case parsing function
const parseTestCases = (testCases: any): any[] => {
  if (!testCases) {
    return [];
  }

  // If it's already an array, return it
  if (Array.isArray(testCases)) {
    return testCases;
  }

  // If it's a string, try to parse it as JSON
  if (typeof testCases === "string") {
    try {
      const parsed = JSON.parse(testCases);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to parse test cases JSON:", error);
      return [];
    }
  }

  console.warn("Unknown test cases format:", typeof testCases, testCases);
  return [];
};

// Enhanced type mapping function
const mapBackendToFrontendType = (backendType: string): string => {
  switch (backendType) {
    case "MCQ":
      return "MCQ";
    case "DESCRIPTIVE":
      return "LONG_ANSWER"; // Map DESCRIPTIVE to LONG_ANSWER
    case "CODE":
      return "LONG_ANSWER"; // Map CODE to LONG_ANSWER but preserve originalType
    default:
      console.warn(
        `Unknown backend question type: ${backendType}, defaulting to MCQ`,
      );
      return "MCQ";
  }
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
