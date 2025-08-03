"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import MCQReview from "./mcq/MCQReview";
import {
  renderContent,
  CONTENT_DISPLAY_CLASSES,
} from "@/utils/contentRenderer";
import { buildApiUrl, API_ENDPOINTS } from "@/config/urls";

// Create API helper
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
  patch: async (endpoint: string, data?: Record<string, unknown>) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(buildApiUrl(endpoint), {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
};

interface DayContent {
  id: string;
  content: string;
  dayNumber: number;
  completed: boolean;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: DayContent[];
  mcqAttempted?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: DayContent[];
  mcqAttempted: boolean;
  mcqAccessible: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface ModuleResult {
  testScore: number;
  minimumPassMarks: number;
  passed: boolean;
}

interface MCQRetakeStatus {
  canRetake: boolean;
  attemptsLeft: number;
  hasFailed: boolean;
}

export default function ModuleDetail() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [moduleResult, setModuleResult] = useState<ModuleResult | null>(null);
  const [mcqRetakeStatus, setMcqRetakeStatus] =
    useState<MCQRetakeStatus | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [markingDayId, setMarkingDayId] = useState<string | null>(null);
  const [markError, setMarkError] = useState<string>("");

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Invalid course or module ID");
      setLoading(false);
      return;
    }

    const fetchModuleAndContent = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch module details
        const moduleData: ModuleData = await api.get(
          API_ENDPOINTS.STUDENT.MODULE_BY_ID(moduleId),
        );
        if (!moduleData) throw new Error("Module not found");

        // Fetch course details
        const courseResponse = await api.get(
          API_ENDPOINTS.STUDENT.COURSE_BY_ID(courseId),
        );
        if (!courseResponse) throw new Error("Course data not found");

        // Mark all days as completed and fetch completion status
        const daysWithCompletion = await Promise.all(
          moduleData.days.map(async (day: DayContent) => {
            try {
              // Mark day as completed
              await api.patch(
                API_ENDPOINTS.STUDENT.DAY_CONTENT_COMPLETE(day.id),
              );
              return { ...day, completed: true };
            } catch (err) {
              console.warn(`Failed to mark day ${day.id} as completed:`, err);
              // Proceed with completed status to avoid blocking
              return { ...day, completed: true };
            }
          }),
        );

        setModule({
          ...moduleData,
          days: daysWithCompletion,
          mcqAttempted: moduleData.mcqAttempted || false,
          mcqAccessible: moduleData.days.every((d) => d.completed),
        });
        setCourse(courseResponse);

        // Fetch module result (test score & pass status)
        try {
          const resultResponse = await api.get(
            API_ENDPOINTS.STUDENT.MODULE_MCQ_RESULTS(moduleId),
          );
          if (resultResponse && resultResponse.score != null) {
            setModuleResult({
              testScore: resultResponse.score,
              minimumPassMarks: resultResponse.minimumPassMarks,
              passed: resultResponse.passed,
            });
          } else {
            setModuleResult(null);
          }
        } catch (err: unknown) {
          console.warn("No MCQ results found:", err);
          setModuleResult(null);
        }

        // Fetch MCQ retake status
        try {
          const retakeResponse = await api.get(
            API_ENDPOINTS.STUDENT.MODULE_MCQ_RETAKE_STATUS(moduleId),
          );
          setMcqRetakeStatus({
            canRetake: retakeResponse.canRetake || false,
            attemptsLeft: retakeResponse.attemptsLeft || 0,
            hasFailed: retakeResponse.hasFailed || false,
          });
        } catch (err: unknown) {
          console.warn("No MCQ retake status found:", err);
          setMcqRetakeStatus(null);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load module";
        setError(errorMessage);
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleAndContent();
  }, [courseId, moduleId]);

  const handleBackToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const handleTakeMCQ = () => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}/mcq`);
  };

  // Add function to mark a day as completed
  const handleMarkDayCompleted = async (dayId: string) => {
    setMarkingDayId(dayId);
    setMarkError("");
    try {
      await api.patch(API_ENDPOINTS.STUDENT.DAY_CONTENT_COMPLETE(dayId));
      // Refresh module data
      if (courseId && moduleId) {
        // Re-fetch module data
        const moduleData: ModuleData = await api.get(
          API_ENDPOINTS.STUDENT.MODULE_BY_ID(moduleId),
        );
        setModule({
          ...moduleData,
          days: moduleData.days,
          mcqAttempted: moduleData.mcqAttempted || false,
          mcqAccessible: moduleData.days.every((d) => d.completed),
        });
      }
    } catch (err: unknown) {
      setMarkError("Failed to mark day as completed. Please try again.");
    } finally {
      setMarkingDayId(null);
    }
  };

  // Update the document title using the browser API
  useEffect(() => {
    if (module) {
      document.title = `${module.title} - ${course?.title || "Course"}`;
    }
  }, [module, course]);

  if (!courseId || !moduleId) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Invalid Parameters
              </h3>
              <p className="text-red-700 mt-1">Invalid course or module ID</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading module details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error Loading Module
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackToCourse}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!module || !course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Module Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The module you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={handleBackToCourse}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Course
        </button>
      </div>
    );
  }

  const completedDays = module.days.filter((day) => day.completed).length;
  const progressPercentage =
    module.days.length > 0 ? (completedDays / module.days.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button
          onClick={handleBackToCourse}
          className="hover:text-blue-600 transition-colors"
        >
          {course.title}
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{module.title}</span>
      </div>

      {/* Module Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={handleBackToCourse}
              className="inline-flex items-center text-indigo-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to {course.title}
            </button>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-3">
            {module.title}
          </h1>

          {module.description && (
            <p className="text-indigo-100 text-lg mb-4 max-w-3xl">
              {module.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>{module.days.length} days of content</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{completedDays} days completed</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="font-medium text-gray-900">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* MCQ Test Section */}
      {module.mcqAccessible && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Module Assessment
              </h3>
              {moduleResult ? (
                <>
                  <p className="text-gray-600 mb-2">
                    Test completed with score: {moduleResult.testScore}% (
                    <span
                      className={
                        moduleResult.passed
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {moduleResult.passed ? "Passed" : "Failed"}
                    </span>
                    )
                  </p>
                  {!moduleResult.passed && mcqRetakeStatus?.canRetake && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-yellow-800 font-medium text-sm">
                            You can retake this assessment
                          </p>
                          <p className="text-yellow-700 text-sm mt-1">
                            You have {mcqRetakeStatus.attemptsLeft} attempt(s)
                            remaining.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* MCQ Review UI */}
                  <MCQReview moduleId={moduleId} />
                </>
              ) : (
                <p className="text-gray-600">
                  {module.mcqAttempted
                    ? "You have already attempted this test"
                    : "Take the MCQ test to complete this module"}
                </p>
              )}
            </div>
            {/* Show appropriate button based on test status */}
            {!moduleResult && (
              <button
                onClick={handleTakeMCQ}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {module.mcqAttempted ? "Retake Test" : "Take Test"}
              </button>
            )}
            {moduleResult &&
              !moduleResult.passed &&
              mcqRetakeStatus?.canRetake && (
                <button
                  onClick={handleTakeMCQ}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Retake Test
                </button>
              )}
            {moduleResult && moduleResult.passed && (
              <button
                onClick={handleTakeMCQ}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Review Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* Day Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Day-by-Day Content
          </h2>
          <p className="text-gray-600 mt-1">
            Complete each day's content to progress through the module
          </p>
        </div>

        {module.days.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Content Available
            </h3>
            <p className="text-gray-600">
              Day content will appear here once it's published.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {module.days.map((day) => (
              <div key={day.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        day.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {day.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="font-medium">{day.dayNumber}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Day {day.dayNumber}
                      </h3>
                      <div
                        className={`text-sm font-medium ${
                          day.completed ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {day.completed ? "Completed" : "Not Completed"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${CONTENT_DISPLAY_CLASSES}`}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderContent(day.content),
                    }}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                  />
                </div>

                {/* Mark as Completed Button */}
                {!day.completed && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleMarkDayCompleted(day.id)}
                      disabled={markingDayId === day.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {markingDayId === day.id
                        ? "Marking..."
                        : "Mark as Completed"}
                    </button>
                    {markError && markingDayId === day.id && (
                      <div className="text-red-600 mt-2 text-sm">
                        {markError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
