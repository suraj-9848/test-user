import axios from "axios";
import {
  CPTrackerProfile,
  CPTrackerConnection,
  CPTrackerLeaderboard,
  CPTrackerStats,
  CPTrackerUpdateResult,
  CronJobStatus,
  CPTrackerApiResponse,
  LeaderboardFilters,
} from "../types/cptracker";
import { API_ENDPOINTS } from "../config/urls";

// Define interfaces for response handling
export interface LeaderboardResponse {
  leaderboard: CPTrackerLeaderboard[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    offset: number;
  };
}
// Add this interface
export interface LeaderboardResponse {
  leaderboard: CPTrackerLeaderboard[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    offset: number;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  },
);

export class CPTrackerAPI {
  // === STUDENT ENDPOINTS ===

  // Refresh CPTracker data for the current user (student endpoint)
  static async refreshMyCPTrackerData(): Promise<CPTrackerProfile> {
    try {
      const response = await apiClient.post<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.REFRESH);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to refresh CP data");
      }
      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to refresh CP data",
      );
    }
  }

  // Connect/Update CPTracker profiles
  static async connectCPTracker(
    data: CPTrackerConnection,
  ): Promise<CPTrackerProfile> {
    try {
      const response = await apiClient.post<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.UPDATE, data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to connect CP platforms",
        );
      }

      return response.data.data!;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as any;
        throw new Error(
          axiosError.response?.data?.message ||
            "Failed to connect CP platforms",
        );
      }
      throw new Error("Failed to connect CP platforms");
    }
  }

  // Get current user's CPTracker profile
  static async getMyCPTracker(): Promise<CPTrackerProfile | null> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.MY_PROFILE);

      if (!response.data.success) {
        if (response.data.message.includes("not found")) {
          return null; // No profile exists yet
        }
        throw new Error(response.data.message || "Failed to fetch CP profile");
      }

      return response.data.data!;
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 404) {
          return null; // No profile exists yet
        }
        throw new Error(
          axiosError.response?.data?.message || "Failed to fetch CP profile",
        );
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch CP profile");
    }
  }

  // Get CPTracker leaderboard with pagination

  // Get user's enrolled batches
  static async getUserBatches(): Promise<string[]> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.MY_PROFILE);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch user profile",
        );
      }

      return response.data.data?.user?.batch_id
        ? [response.data.data.user.batch_id]
        : [];
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as any;
        throw new Error(
          axiosError.response?.data?.message || "Failed to fetch user batches",
        );
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch user batches");
    }
  }

  // === ADMIN/INSTRUCTOR ENDPOINTS ===

  // Get CPTracker profile by user ID
  static async getCPTrackerByUserId(
    userId: string,
  ): Promise<CPTrackerProfile | null> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.USER_BY_ID(userId));

      if (!response.data.success) {
        if (response.data.message.includes("not found")) {
          return null;
        }
        throw new Error(
          response.data.message || "Failed to fetch user CP profile",
        );
      }

      return response.data.data!;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user CP profile",
      );
    }
  }

  // Update CPTracker profile by user ID (admin/instructor)
  static async updateCPTrackerByUserId(
    userId: string,
    data: Partial<CPTrackerConnection>,
  ): Promise<CPTrackerProfile> {
    try {
      const response = await apiClient.put<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.UPDATE_USER(userId), data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to update user CP profile",
        );
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update user CP profile",
      );
    }
  }

  // Get all CPTrackers with pagination (Admin only)
  static async getCPTrackerLeaderboard(
    filters?: LeaderboardFilters,
  ): Promise<LeaderboardResponse> {
    try {
      const params = new URLSearchParams();

      if (filters?.batch) params.append("batch_id", filters.batch);
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());
      if (filters?.page) params.append("page", filters.page.toString());

      const url = `${API_ENDPOINTS.CP_TRACKER.LEADERBOARD}${params.toString() ? "?" + params.toString() : ""}`;

      const response = await apiClient.get<CPTrackerApiResponse<any>>(url);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch leaderboard");
      }

      const data = response.data.data;
      // Handle different response formats
      // New format: { leaderboard: [], pagination: {} }
      if (data && typeof data === "object" && "leaderboard" in data) {
        return {
          leaderboard: data.leaderboard || [],
          pagination: data.pagination,
        };
      }
      // Old format: direct array
      if (Array.isArray(data)) {
        return {
          leaderboard: data,
          pagination: undefined,
        };
      }
      // Handle object with trackers array (from getAllCPTrackers)
      if (data && typeof data === "object" && "trackers" in data) {
        return {
          leaderboard: data.trackers || [],
          pagination: data.pagination,
        };
      }
      // Fallback
      return {
        leaderboard: [],
        pagination: undefined,
      };
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as any;
        throw new Error(
          axiosError.response?.data?.message || "Failed to fetch leaderboard",
        );
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch leaderboard");
    }
  }

  // Get CPTracker statistics
  static async getCPTrackerStats(): Promise<CPTrackerStats> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CPTrackerStats>
      >(API_ENDPOINTS.CP_TRACKER.STATS);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch CP stats");
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch CP stats",
      );
    }
  }

  // Refresh CPTracker data for specific user
  static async refreshCPTrackerData(userId: string): Promise<CPTrackerProfile> {
    try {
      const response = await apiClient.post<
        CPTrackerApiResponse<CPTrackerProfile>
      >(API_ENDPOINTS.CP_TRACKER.REFRESH_USER(userId));

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to refresh CP data");
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to refresh CP data",
      );
    }
  }

  // Delete CPTracker profile (admin only)
  static async deleteCPTracker(userId: string): Promise<void> {
    try {
      const response = await apiClient.delete<CPTrackerApiResponse>(
        API_ENDPOINTS.CP_TRACKER.DELETE_USER(userId),
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete CP profile");
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete CP profile",
      );
    }
  }

  // === CRON JOB MANAGEMENT ENDPOINTS ===

  // Trigger manual update for all users
  static async triggerManualUpdateAll(): Promise<CPTrackerUpdateResult> {
    try {
      const response = await apiClient.post<
        CPTrackerApiResponse<CPTrackerUpdateResult>
      >(API_ENDPOINTS.CP_TRACKER.ADMIN_UPDATE_ALL);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to trigger manual update",
        );
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to trigger manual update",
      );
    }
  }

  // Trigger manual update for specific batch
  static async triggerManualUpdateBatch(
    batchId: string,
  ): Promise<CPTrackerUpdateResult> {
    try {
      const response = await apiClient.post<
        CPTrackerApiResponse<CPTrackerUpdateResult>
      >(API_ENDPOINTS.CP_TRACKER.ADMIN_UPDATE_BATCH(batchId));

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to trigger batch update",
        );
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to trigger batch update",
      );
    }
  }

  // Get cron job status
  static async getCronJobStatus(): Promise<CronJobStatus[]> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CronJobStatus[]>
      >(API_ENDPOINTS.CP_TRACKER.ADMIN_CRON_STATUS);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch cron job status",
        );
      }

      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch cron job status",
      );
    }
  }

  // Manage cron job (start/stop)
  static async manageCronJob(
    jobName: string,
    action: "start" | "stop",
  ): Promise<void> {
    try {
      const response = await apiClient.post<CPTrackerApiResponse>(
        API_ENDPOINTS.CP_TRACKER.ADMIN_CRON(jobName),
        { action },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || `Failed to ${action} cron job`,
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${action} cron job`,
      );
    }
  }

  // Get update statistics
  static async getUpdateStats(): Promise<CPTrackerStats> {
    try {
      const response = await apiClient.get<
        CPTrackerApiResponse<CPTrackerStats>
      >(API_ENDPOINTS.CP_TRACKER.ADMIN_UPDATE_STATS);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch update stats",
        );
      }

      return response.data.data!;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch update stats",
      );
    }
  }

  // Create custom batch cron job
  static async createBatchCronJob(
    batchId: string,
    cronExpression: string,
  ): Promise<void> {
    try {
      const response = await apiClient.post<CPTrackerApiResponse>(
        API_ENDPOINTS.CP_TRACKER.ADMIN_BATCH_CRON(batchId),
        { cronExpression },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to create batch cron job",
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create batch cron job",
      );
    }
  }

  // Remove custom batch cron job
  static async removeBatchCronJob(batchId: string): Promise<void> {
    try {
      const response = await apiClient.delete<CPTrackerApiResponse>(
        API_ENDPOINTS.CP_TRACKER.ADMIN_BATCH_CRON(batchId),
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to remove batch cron job",
        );
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove batch cron job",
      );
    }
  }
}

export default CPTrackerAPI;
