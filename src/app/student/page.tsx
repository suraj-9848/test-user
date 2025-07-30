"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  // Calendar, // Removed unused
  AlertCircle,
  PlayCircle,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";

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

interface Course {
  id: string;
  title: string;
  instructor?: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  image?: string;
  status: "active" | "completed" | "not-started";
  end_date: string;
  hoursSpent?: number;
  averageGrade?: number;
}

interface TestResponse {
  id: string;
  title: string;
  courseName?: string;
  course?: { title: string };
  courseId: string;
  dueDate?: string;
  endDate?: string;
  status?: string;
  attempted?: boolean;
}

interface DashboardStats {
  coursesEnrolled: number;
  hoursLearned: number;
  testsCompleted: number;
  averageGrade: number;
}

interface StudentProfile {
  streak: number;
  points: number;
  rank: number;
}

interface LeaderboardEntry {
  userName: string;
  totalScore: number;
  percentage: number;
}

interface LeaderboardResponse {
  data: LeaderboardEntry[];
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const { jwt } = useJWT();
  const [greeting, setGreeting] = useState("Good day");

  // State for real data
  const [courses, setCourses] = useState<Course[]>([]);
  // const [upcomingTests, setUpcomingTests] = useState<TestResponse[]>([]); // Removed unused
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Use Google Auth session data, with reasonable defaults
  const student = session?.user
    ? {
        name: session.user.name || "Student",
        avatar: session.user.image || "/user-placeholder.svg",
        streak: studentProfile?.streak || 0,
        points: studentProfile?.points || 0,
        rank: studentProfile?.rank || 0,
      }
    : {
        name: "Student",
        avatar: "/user-placeholder.svg",
        streak: studentProfile?.streak || 0,
        points: studentProfile?.points || 0,
        rank: studentProfile?.rank || 0,
      };

  // Fetch dashboard data from backend
  useEffect(() => {
    if (!jwt) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch dashboard stats from new endpoint
        const statsResponse = await api.get("/api/student/dashboard/stats");
        setStats(statsResponse.stats);

        // Fetch courses for the course cards
        const coursesResponse: Course[] = await api.get("/api/student/courses");
        const transformedCourses = coursesResponse
          .slice(0, 3)
          .map((course: Course) => ({
            id: course.id,
            title: course.title,
            instructor: course.instructor,
            progress: course.progress || 0,
            totalModules: course.totalModules || 0,
            completedModules: course.completedModules || 0,
            image:
              course.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            status:
              course.status ||
              ((course.progress > 0 ? "active" : "not-started") as
                | "active"
                | "completed"
                | "not-started"),
            end_date: course.end_date,
          }));
        setCourses(transformedCourses);

        // Fetch tests for upcoming tasks
        try {
          const testsResponse: TestResponse[] =
            await api.get("/api/student/tests");
          // Tests data is available in testsResponse if needed for future features
        } catch (testError) {
          console.log("Tests not available:", testError);
        }

        // Try to get leaderboard data for student profile
        try {
          // TODO: Replace with dedicated user stats endpoint
          // For now, set default student profile data
          setStudentProfile({
            streak: 7, // Default for now, could be from another endpoint
            points: 0, // Will be updated when user stats endpoint is available
            rank: 0, // Will be updated when user stats endpoint is available
          });
        } catch (profileError) {
          console.log("Profile data not available:", profileError);
        }
      } catch (err: unknown) {
        console.error("Error fetching dashboard data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [jwt, session?.user?.name, session?.user?.email]);

  const dashboardStats = stats
    ? [
        {
          label: "Courses Enrolled",
          value: stats.coursesEnrolled.toString(),
          icon: BookOpen,
          color: "bg-blue-50 text-blue-600",
        },
        ...(stats.hoursLearned > 0
          ? [
              {
                label: "Hours Learned",
                value: stats.hoursLearned.toString(),
                icon: Clock,
                color: "bg-green-50 text-green-600",
              },
            ]
          : []),
        {
          label: "Tests Completed",
          value: stats.testsCompleted.toString(),
          icon: Trophy,
          color: "bg-purple-50 text-purple-600",
        },
        ...(stats.averageGrade > 0
          ? [
              {
                label: "Average Grade",
                value: `${Math.round(stats.averageGrade)}%`,
                icon: TrendingUp,
                color: "bg-orange-50 text-orange-600",
              },
            ]
          : []),
      ]
    : [];

  // Removed unused functions for build

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
                Error Loading Dashboard
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-24 -translate-x-24"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {greeting}, {student.name}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              Ready to continue your learning journey? You&apos;re doing great!
            </p>
            <div className="flex items-center space-x-6">
              {student.streak > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{student.streak} day streak</span>
                </div>
              )}
              {student.rank > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Rank #{student.rank}</span>
                </div>
              )}
              {student.points > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{student.points} points</span>
                </div>
              )}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={student.avatar}
                alt={student.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Continue Learning
                </h2>
                <Link
                  href="/student/courses"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Courses Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your learning journey by enrolling in a course.
                  </p>
                  <Link
                    href="/student/courses"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={course.image || "/hero-image.png"}
                          alt={course.title}
                          width={64}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {course.title}
                          </h3>
                          {course.status === "not-started" && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        {course.instructor && (
                          <p className="text-sm text-gray-600 mb-2">
                            by {course.instructor}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {course.completedModules}/{course.totalModules}{" "}
                              modules
                            </span>
                            {course.end_date && (
                              <span>Due: {formatDate(course.end_date)}</span>
                            )}
                          </div>
                          <Link
                            href={`/student/courses/${course.id}`}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Continue
                          </Link>
                        </div>
                        {course.totalModules > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium text-gray-900">
                                {course.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <Link
                href="/student/tests"
                className="block w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900 group-hover:text-blue-700">
                      Take Tests
                    </h3>
                    <p className="text-xs text-blue-600">
                      Practice and evaluate your skills
                    </p>
                  </div>
                  <PlayCircle className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                </div>
              </Link>

              <Link
                href="/student/leaderboard"
                className="block w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-purple-900 group-hover:text-purple-700">
                      View Leaderboard
                    </h3>
                    <p className="text-xs text-purple-600">
                      See how you rank among peers
                    </p>
                  </div>
                  <Target className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                </div>
              </Link>

              <Link
                href="/student/results"
                className="block w-full p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-900 group-hover:text-green-700">
                      Check Results
                    </h3>
                    <p className="text-xs text-green-600">
                      Review your test performance
                    </p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                </div>
              </Link>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Progress
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.slice(0, 2).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs text-gray-600">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="ml-3 text-blue-600 hover:text-blue-800"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                  <Link
                    href="/student/courses"
                    className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Courses →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    No courses enrolled yet
                  </p>
                  <Link
                    href="/student/courses"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
