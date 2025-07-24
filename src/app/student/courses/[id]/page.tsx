"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Users,
  Play,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
} from "lucide-react";

// API Configuration
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create API wrapper for consistency
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
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
};

interface Module {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  status: "completed" | "in-progress" | "not-started";
  progress?: number;
  order?: number;
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  instructorImage?: string;
  image?: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  duration?: string;
  level?: string;
  rating?: number;
  studentsEnrolled?: number;
  start_date: string;
  end_date: string;
  modules?: Module[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "modules">(
    "overview",
  );

  // Only show tabs with real backend data

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const courseData: CourseDetail = await api.get(
          `/api/student/courses/${courseId}`,
        );

        // Transform API data to match UI expectations
        const transformedCourse: CourseDetail = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          instructor: courseData.instructor,
          instructorImage: courseData.instructorImage,
          image: courseData.image,
          progress: courseData.progress || 0,
          totalModules: courseData.totalModules || 0,
          completedModules: courseData.completedModules || 0,
          duration: courseData.duration,
          level: courseData.level,
          rating: courseData.rating,
          studentsEnrolled: courseData.studentsEnrolled,
          start_date: courseData.start_date,
          end_date: courseData.end_date,
          modules: courseData.modules || [],
        };

        setCourse(transformedCourse);
      } catch (err: unknown) {
        console.error("Error fetching course:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load course";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();

    // Refetch on window focus
    const handleFocus = () => {
      fetchCourse();
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [courseId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
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
                Error Loading Course
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Course Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/student/courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <div className="flex items-start space-x-6">
            <div className="w-32 h-24 rounded-lg overflow-hidden border-4 border-white/20 flex-shrink-0">
              <Image
                src={course.image || "/hero-image.png"}
                alt={course.title}
                width={128}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              {course.instructor && (
                <p className="text-blue-100 mb-4">by {course.instructor}</p>
              )}

              <div className="flex items-center space-x-6 text-blue-100 text-sm">
                {course.level && (
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>{course.level}</span>
                  </div>
                )}
                {course.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {course.duration} days</span>
                  </div>
                )}
                {course.studentsEnrolled && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{course.studentsEnrolled} enrolled</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-blue-100">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${!isNaN(Number(course.progress)) ? Number(course.progress) : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "modules", label: "Modules", icon: Play },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "overview" | "modules")}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Description
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{course.description}</p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Total Modules
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {course.totalModules}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {course.completedModules}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">
                        Progress
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {course.progress}%
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Course Timeline */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Course Timeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Start Date
                    </p>
                    <p className="text-lg text-gray-900">
                      {formatDate(course.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      End Date
                    </p>
                    <p className="text-lg text-gray-900">
                      {formatDate(course.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {activeTab === "modules" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Course Modules ({course.modules?.length || 0})
                </h2>
              </div>

              <div className="space-y-4">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                module.status === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : module.status === "in-progress"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {module.status === "completed" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-medium">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {module.description}
                              </p>
                            )}
                            {module.duration && (
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4 mr-1" />
                                {module.duration}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {module.status === "completed" ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-green-600 font-medium">
                                Completed
                              </span>
                              <Link
                                href={`/student/courses/${courseId}/modules/${module.id}`}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors border border-green-200"
                              >
                                <BookOpen className="w-4 h-4 mr-1" />
                                Review
                              </Link>
                            </div>
                          ) : (
                            <Link
                              href={`/student/courses/${courseId}/modules/${module.id}`}
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              {module.status === "in-progress"
                                ? "Continue"
                                : "Start"}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Modules Yet
                    </h3>
                    <p className="text-gray-600">
                      Modules will appear here when they&apos;re added to the
                      course.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
