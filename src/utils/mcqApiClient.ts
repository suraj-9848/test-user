import { buildApiUrl, API_ENDPOINTS } from "@/config/urls";

// Create API helper
const createApiClient = () => {
  const getToken = () => localStorage.getItem("jwt");

  const makeRequest = async (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<any> => {
    const token = getToken();
    const url = buildApiUrl(endpoint);

    const config: RequestInit = {
      ...options,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  };

  return {
    get: (endpoint: string) => makeRequest(endpoint, { method: "GET" }),
    post: (endpoint: string, data?: unknown) =>
      makeRequest(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),
    put: (endpoint: string, data?: unknown) =>
      makeRequest(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      }),
    delete: (endpoint: string) => makeRequest(endpoint, { method: "DELETE" }),
  };
};

// MCQ-specific API functions
export const mcqApi = {
  // Get MCQ for a module
  getMCQ: async (moduleId: string) => {
    const api = createApiClient();
    return api.get(API_ENDPOINTS.STUDENT.MODULE_MCQ(moduleId));
  },

  // Submit MCQ responses
  submitResponses: async (moduleId: string, responses: string[]) => {
    const api = createApiClient();
    return api.post(API_ENDPOINTS.STUDENT.MODULE_MCQ_RESPONSES(moduleId), {
      responses,
    });
  },

  // Get MCQ results
  getResults: async (moduleId: string) => {
    const api = createApiClient();
    return api.get(API_ENDPOINTS.STUDENT.MODULE_MCQ_RESULTS(moduleId));
  },

  // Get MCQ review (with correct answers)
  getReview: async (moduleId: string) => {
    const api = createApiClient();
    return api.get(API_ENDPOINTS.STUDENT.MODULE_MCQ_REVIEW(moduleId));
  },

  // Get retake status
  getRetakeStatus: async (moduleId: string) => {
    const api = createApiClient();
    return api.get(API_ENDPOINTS.STUDENT.MODULE_MCQ_RETAKE_STATUS(moduleId));
  },
};

export default createApiClient;
