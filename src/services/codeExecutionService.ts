import { TestCase } from "@/types/testInterface";
import { apiPost } from "@/utils/apiClient";

export class CodeExecutionService {
  static async executeCode(
    questionId: string,
    code: string,
    language: string,
    testId: string,
  ): Promise<TestCase[]> {
    if (!testId) {
      throw new Error("Test ID is required for code execution.");
    }

    try {
      console.log("CodeExecutionService: Executing code", {
        testId,
        questionId,
        language,
        codeLength: code.length,
      });

      const response = await apiPost(`/api/student/tests/${testId}/execute`, {
        questionId,
        code,
        language,
      });

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server");
      }

      console.log("CodeExecutionService: Execute response", data);

      if (!data.success) {
        throw new Error(data.error || "Code execution failed");
      }

      return Array.isArray(data.results) ? data.results : [];
    } catch (error) {
      console.error("Code execution error:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("Token expired") ||
          error.message.includes("Authentication")
        ) {
          throw new Error("Session expired. Please login again.");
        }
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          throw new Error(
            "Network error: Unable to connect to server. Please check your connection.",
          );
        }
      }

      throw error;
    }
  }

  static async submitCode(
    questionId: string,
    code: string,
    language: string,
    testId: string,
  ): Promise<{
    success: boolean;
    message: string;
    score: number;
    results: TestCase[];
  }> {
    if (!testId) {
      throw new Error("Test ID is required for code submission.");
    }

    try {
      console.log("CodeExecutionService: Submitting code", {
        testId,
        questionId,
        language,
        codeLength: code.length,
      });

      const response = await apiPost(
        `/api/student/tests/${testId}/submit-code`,
        {
          questionId,
          code,
          language,
        },
      );

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server");
      }

      console.log("CodeExecutionService: Submit response", data);

      return {
        success: data.success !== false,
        message: data.message || "Code submitted successfully",
        score: Number(data.score) || 0,
        results: Array.isArray(data.results) ? data.results : [],
      };
    } catch (error) {
      console.error("Code submission error:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("Token expired") ||
          error.message.includes("Authentication")
        ) {
          throw new Error("Session expired. Please login again.");
        }
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          throw new Error(
            "Network error: Unable to connect to server. Please check your connection.",
          );
        }
      }

      throw error;
    }
  }
}
