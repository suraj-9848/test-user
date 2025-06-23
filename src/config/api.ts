// API Configuration
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
  // Test Management
  TEST: {
    AVAILABLE: `${BASE_URL}/api/test/available`,
    START: (testId: string) => `${BASE_URL}/api/test/${testId}/start`,
    QUESTIONS: (attemptId: string) =>
      `${BASE_URL}/api/test/attempts/${attemptId}/questions`,
    SUBMIT: (attemptId: string) => `${BASE_URL}/api/test/${attemptId}/submit`,
  },

  // Test Attempt Management
  ATTEMPT: {
    SAVE_ANSWERS: (attemptId: string) =>
      `${BASE_URL}/api/test/${attemptId}/save-answers`,
    AUTO_SAVE: (attemptId: string) =>
      `${BASE_URL}/api/test/${attemptId}/auto-save`,
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

// Request Configuration
export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include" as RequestCredentials,
};

// Multipart form data configuration (for file uploads)
export const MULTIPART_CONFIG = {
  credentials: "include" as RequestCredentials,
  // Don't set Content-Type for multipart, let browser set it
};

// API Helper Functions
export const apiHelpers = {
  // Generic GET request
  get: async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      method: "GET",
      ...API_CONFIG,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Generic POST request
  post: async (url: string, data?: unknown, options?: RequestInit) => {
    const response = await fetch(url, {
      method: "POST",
      ...API_CONFIG,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Multipart POST request (for file uploads)
  postMultipart: async (
    url: string,
    formData: FormData,
    options?: RequestInit,
  ) => {
    const response = await fetch(url, {
      method: "POST",
      ...MULTIPART_CONFIG,
      body: formData,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Generic PUT request
  put: async (url: string, data?: unknown, options?: RequestInit) => {
    const response = await fetch(url, {
      method: "PUT",
      ...API_CONFIG,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  // Generic DELETE request
  delete: async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      method: "DELETE",
      ...API_CONFIG,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};

export default API_ENDPOINTS;
