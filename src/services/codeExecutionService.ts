export interface TestCase {
  input: string;
  expected_output: string;
  actual_output?: string;
  status?: "PASSED" | "FAILED" | "ERROR";
  execution_time?: number;
  memory_used?: number;
  error_message?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  results: TestCase[];
  error?: string;
}

export class CodeExecutionService {
  private static readonly API_BASE = "/api/student";

  /**
   * Execute code against test cases
   */
  static async executeCode(
    questionId: string,
    code: string,
    language: string,
    testId: string,
  ): Promise<TestCase[]> {
    try {
      const response = await fetch(`${this.API_BASE}/tests/${testId}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
        },
        body: JSON.stringify({
          questionId,
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to execute code");
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Code execution error:", error);
      throw error;
    }
  }

  /**
   * Submit code solution
   */
  static async submitCode(
    questionId: string,
    code: string,
    language: string,
    testId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(
        `${this.API_BASE}/tests/${testId}/submit-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
          },
          body: JSON.stringify({
            questionId,
            code,
            language,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit code");
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Code submitted successfully",
      };
    } catch (error) {
      console.error("Code submission error:", error);
      throw error;
    }
  }

  /**
   * Get question details with test cases
   */
  static async getQuestionDetails(
    testId: string,
    questionId: string,
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.API_BASE}/tests/${testId}/questions/${questionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("studentToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch question details");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch question details:", error);
      throw error;
    }
  }

  /**
   * Validate code syntax before execution
   */
  static validateCodeSyntax(code: string, language: string): boolean {
    // Basic syntax validation
    if (!code.trim()) {
      return false;
    }

    switch (language) {
      case "javascript":
        // Check for basic JavaScript syntax
        try {
          new Function(code);
          return true;
        } catch (e) {
          return false;
        }

      case "python":
        // Basic Python syntax checks
        if (
          code.includes("def ") ||
          code.includes("print(") ||
          code.includes("import ")
        ) {
          return true;
        }
        return code.trim().length > 0;

      case "java":
        // Basic Java syntax checks
        return (
          code.includes("class ") && code.includes("{") && code.includes("}")
        );

      case "cpp":
      case "c":
        // Basic C/C++ syntax checks
        return code.includes("#include") || code.includes("int main");

      default:
        return true;
    }
  }

  /**
   * Format execution time
   */
  static formatExecutionTime(timeMs: number): string {
    if (timeMs < 1) {
      return "< 1ms";
    } else if (timeMs < 1000) {
      return `${timeMs.toFixed(2)}ms`;
    } else {
      return `${(timeMs / 1000).toFixed(2)}s`;
    }
  }

  /**
   * Format memory usage
   */
  static formatMemoryUsage(memoryKB: number): string {
    if (memoryKB < 1024) {
      return `${memoryKB}KB`;
    } else {
      return `${(memoryKB / 1024).toFixed(2)}MB`;
    }
  }

  /**
   * Get language-specific template
   */
  static getLanguageTemplate(language: string): string {
    const templates = {
      javascript: `// Write your solution here
function solution() {
    // Your code here
    return result;
}

// Test your solution
console.log(solution());`,

      python: `# Write your solution here
def solution():
    # Your code here
    return result

# Test your solution
print(solution())`,

      java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        // Your code here
        System.out.println(solution());
    }
    
    public static Object solution() {
        // Your code here
        return result;
    }
}`,

      cpp: `// Write your solution here
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    // Your code here
    cout << solution() << endl;
    return 0;
}`,

      c: `// Write your solution here
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your code here
    printf("%d\\n", solution());
    return 0;
}`,
    };

    return (
      templates[language as keyof typeof templates] || templates.javascript
    );
  }

  /**
   * Parse test cases from different formats
   */
  static parseTestCases(testCases: any): TestCase[] {
    if (!testCases) return [];

    if (Array.isArray(testCases)) {
      return testCases;
    }

    if (typeof testCases === "string") {
      try {
        const parsed = JSON.parse(testCases);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Failed to parse test cases:", error);
        return [];
      }
    }

    return [];
  }

  /**
   * Create mock test results for testing
   */
  static createMockResults(visibleTestCases: TestCase[]): TestCase[] {
    return visibleTestCases.map((testCase, index) => ({
      ...testCase,
      actual_output:
        index % 2 === 0 ? testCase.expected_output : "Wrong output",
      status: index % 2 === 0 ? ("PASSED" as const) : ("FAILED" as const),
      execution_time: Math.random() * 100 + 10,
      memory_used: Math.random() * 1024 + 512,
    }));
  }
}
