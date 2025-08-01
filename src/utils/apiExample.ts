// Example usage of the API client with automatic token handling
// Import the configured fetch client instead of using raw fetch

import apiClient, {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  handleApiResponse,
} from "./apiClient";

// Example 1: Simple GET request using convenience method
export const getStudentCourses = async () => {
  try {
    const response = await apiGet("/api/student/courses");
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    // Error is automatically handled by interceptor
    // Token expiry redirect happens automatically
    console.error("Failed to fetch student courses:", error);
    throw error;
  }
};

// Example 2: GET request with query parameters
export const getStudentTests = async (courseId?: string) => {
  const url = courseId
    ? `/api/student/tests?courseId=${courseId}`
    : "/api/student/tests";

  try {
    const response = await apiGet(url);
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to fetch student tests:", error);
    throw error;
  }
};

// Example 3: POST request using convenience method
export const submitTestAnswers = async (testId: string, answers: any) => {
  try {
    const response = await apiPost(
      `/api/student/tests/${testId}/submit`,
      answers,
    );
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to submit test answers:", error);
    throw error;
  }
};

// Example 4: PUT request for updating profile
export const updateStudentProfile = async (profileData: any) => {
  try {
    const response = await apiPut("/api/student/profile", profileData);
    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

// Example 5: Using the raw apiClient for more control
export const getModuleContent = async (moduleId: string) => {
  try {
    const response = await apiClient(
      `/api/student/modules/${moduleId}/content`,
      {
        method: "GET",
        // You can add custom options here
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch module content:", error);
    throw error;
  }
};

// Example 6: Handling file uploads
export const uploadAssignment = async (assignmentId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("assignmentId", assignmentId);

  try {
    const response = await apiClient("/api/student/assignments/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header for FormData - let browser set it
      headers: {},
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to upload assignment:", error);
    throw error;
  }
};

// Example 7: Making requests without authentication (for public endpoints)
export const getPublicCourses = async () => {
  try {
    const response = await apiClient("/api/public/courses", {
      method: "GET",
      skipAuth: true, // Skip automatic token handling
    });

    const data = await handleApiResponse(response);
    return data;
  } catch (error) {
    console.error("Failed to fetch public courses:", error);
    throw error;
  }
};

// Example 8: Using with React hook
/*
import { useState, useEffect } from 'react';
import { getStudentCourses } from './utils/apiExample';

export const useStudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentCourses();
        setCourses(data);
      } catch (err) {
        setError(err.message);
        // If token expired, user will be automatically redirected to login
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};
*/

// Example 9: Using with React component
/*
import React from 'react';
import { useStudentCourses } from './hooks/useStudentCourses';

export const CoursesPage = () => {
  const { courses, loading, error } = useStudentCourses();

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h1>My Courses</h1>
      {courses.map((course) => (
        <div key={course.id}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};
*/

// Example 10: Handling specific error codes
export const markModuleComplete = async (moduleId: string) => {
  try {
    const response = await apiPost(`/api/student/modules/${moduleId}/complete`);
    const data = await handleApiResponse(response);
    return data;
  } catch (error: any) {
    // The interceptor handles token expiry automatically
    // But you can handle other specific errors
    if (error.message.includes("403")) {
      throw new Error(
        "You have not completed all required tasks in this module",
      );
    } else if (error.message.includes("404")) {
      throw new Error("Module not found");
    } else {
      throw new Error("Failed to mark module as complete");
    }
  }
};

/**
 * IMPORTANT NOTES:
 *
 * 1. Always use the imported API client functions instead of raw fetch
 * 2. The client will automatically:
 *    - Add Authorization headers with JWT
 *    - Check token expiry before requests
 *    - Redirect to login if token is expired
 *    - Handle 401 authentication errors
 *
 * 3. Available convenience methods:
 *    - apiGet(url, options) - GET requests
 *    - apiPost(url, data, options) - POST requests
 *    - apiPut(url, data, options) - PUT requests
 *    - apiDelete(url, options) - DELETE requests
 *    - apiPatch(url, data, options) - PATCH requests
 *
 * 4. Use handleApiResponse() to automatically handle response errors
 *
 * 5. For public endpoints, use { skipAuth: true } option
 *
 * 6. The client will redirect users to login at /sign-in on token expiry
 *
 * 7. Custom headers can be added via the options parameter
 */
