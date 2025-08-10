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
  Building,
  MapPin,
  DollarSign,
  Calendar as CalendarIcon,
  Crown,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";
import { API_ENDPOINTS } from "@/config/urls";
import { usePro } from "@/context/usePro";
import { apiGet, handleApiResponse } from "@/utils/apiClient";
import {
  fetchMeetingsForCourses,
  annotateMeetings,
  formatRelative as formatRelativeMeeting,
} from "@/utils/meetings";

// Add back missing local interfaces used in this page
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

export default function StudentDashboard() {
  const { data: session } = useSession();
  const { jwt } = useJWT();
  const { isProUser } = usePro();
  const [greeting, setGreeting] = useState("Good day");

  // State for real data (move before usage)
  const [courses, setCourses] = useState<Course[]>([]);
  // const [upcomingTests, setUpcomingTests] = useState<TestResponse[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Jobs preview state
  interface PublicJobLight {
    id: string;
    title?: string;
    company?: string;
    organization?: { name?: string };
    location?: string;
    type?: string;
    salary?: string;
    deadline?: string | Date;
    earlyAccess?: { isInEarlyAccessPeriod: boolean; userHasAccess: boolean };
  }
  const [jobsPreview, setJobsPreview] = useState<PublicJobLight[]>([]);
  const [jobsLoading, setJobsLoading] = useState<boolean>(true);
  const [jobsError, setJobsError] = useState<string>("");
  const [jobsEarlyInfo, setJobsEarlyInfo] = useState<{
    hiddenJobsCount: number;
    message: string;
  } | null>(null);
  const [liveMeetings, setLiveMeetings] = useState<any[]>([]);
  const [liveMeetingsLoading, setLiveMeetingsLoading] = useState(false);

  // Use Google Auth session data, with reasonable defaults (remove duplicate above)
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

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Fetch dashboard data from backend
  useEffect(() => {
    if (
      !jwt &&
      !localStorage.getItem("jwt") &&
      !localStorage.getItem("token")
    ) {
      setLoading(false);
      setError("");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        // Dashboard stats
        const statsRes = await apiGet(API_ENDPOINTS.STUDENT.DASHBOARD_STATS);
        const statsJson = await handleApiResponse<any>(statsRes);
        setStats(statsJson.stats);

        // Courses
        const coursesRes = await apiGet(API_ENDPOINTS.STUDENT.COURSES);
        const coursesJson: Course[] = await handleApiResponse<any>(coursesRes);
        const transformed = (coursesJson || [])
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
        setCourses(transformed);

        // Optional: Tests
        try {
          const testsRes = await apiGet(API_ENDPOINTS.STUDENT.TESTS);
          await handleApiResponse<any>(testsRes);
        } catch (testError) {
          console.log("Tests not available:", testError);
        }

        // Non-blocking: Meetings for enrolled courses
        try {
          const meetingCourseIds = transformed.map((c) => c.id);
          if (meetingCourseIds.length) {
            setLiveMeetingsLoading(true);
            const meetings = await fetchMeetingsForCourses(meetingCourseIds);
            const annotated = annotateMeetings(meetings);
            setLiveMeetings(annotated);
          }
        } catch (meetErr) {
          console.log("Meetings fetch failed:", meetErr);
        } finally {
          setLiveMeetingsLoading(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [jwt]);

  // Fetch public jobs (preview)
  useEffect(() => {
    let cancelled = false;
    const loadJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError("");
        const res = await apiGet(API_ENDPOINTS.HIRING.JOBS);
        const data = await handleApiResponse<any>(res);
        if (cancelled) return;
        const list: PublicJobLight[] = (data?.jobs || []).slice(0, 4);
        setJobsPreview(list);
        if (data?.earlyAccessInfo?.hiddenJobsCount && !isProUser) {
          setJobsEarlyInfo({
            hiddenJobsCount: data.earlyAccessInfo.hiddenJobsCount,
            message: data.earlyAccessInfo.message,
          });
        } else {
          setJobsEarlyInfo(null);
        }
      } catch (e: any) {
        if (cancelled) return;
        setJobsError(e?.message || "Failed to load jobs");
        setJobsPreview([]);
        setJobsEarlyInfo(null);
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    };
    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [isProUser]);

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
    <div className="pt-8 md:pt-12 pb-16 space-y-6">
      {isProUser && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Crown className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                Pro Subscriber Active
              </h3>
              <p className="text-sm text-gray-600">
                Enjoy early access to job postings and premium features.
              </p>
            </div>
          </div>
        </div>
      )}

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
        <div className="lg:col-span-2 space-y-6">
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
            <div className="p-6">
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
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="group border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all h-full"
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
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview (moved below Continue Learning) */}
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Latest Jobs (Compact) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                Latest Jobs
                {isProUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                    <Crown className="w-3 h-3" /> Pro
                  </span>
                )}
              </h2>
              <Link
                href="/hiring?tab=jobs"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                See all
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="p-4">
              {jobsEarlyInfo && !isProUser && (
                <div className="mb-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 flex items-start justify-between gap-3">
                  <div className="text-sm text-gray-700">
                    {jobsEarlyInfo.message}
                  </div>
                  <Link
                    href="/hiring?tab=pro"
                    className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                  >
                    Upgrade
                  </Link>
                </div>
              )}

              {jobsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : jobsError ? (
                <div className="text-sm text-gray-600 py-6 text-center">
                  No jobs available right now.
                </div>
              ) : jobsPreview.length === 0 ? (
                <div className="text-sm text-gray-600 py-6 text-center">
                  No jobs available right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {jobsPreview.map((job) => {
                    const company =
                      job.organization?.name || job.company || "Company";
                    const location = job.location || "Remote";
                    const type = job.type || "full-time";
                    const deadline = job.deadline
                      ? new Date(job.deadline)
                      : null;
                    const daysLeft = deadline
                      ? Math.ceil(
                          (deadline.getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24),
                        )
                      : null;
                    const isEarly = !!job.earlyAccess?.isInEarlyAccessPeriod;
                    return (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Building className="w-4 h-4 text-gray-500" />
                              <span className="truncate font-medium text-gray-900">
                                {company}
                              </span>
                            </div>
                            <div className="mt-1 font-semibold text-gray-900 truncate">
                              {job.title || "Job Title"}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />{" "}
                                {job.salary || "—"}
                              </span>
                              {deadline && (
                                <span className="inline-flex items-center gap-1">
                                  <CalendarIcon className="w-3 h-3" />{" "}
                                  {deadline.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${type === "internship" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}
                            >
                              {type}
                            </span>
                            {isEarly && (
                              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                                <Crown className="w-3 h-3" /> Early
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <Link
                  href="/hiring?tab=apply"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Apply now →
                </Link>
                <Link
                  href="/hiring?tab=jobs"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse all jobs →
                </Link>
              </div>
            </div>
          </div>

          {/* Live Classes Widget */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Live Classes
              </h2>
              <Link
                href="/student/courses"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {liveMeetingsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
                </div>
              ) : liveMeetings.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No upcoming live classes.
                </p>
              ) : (
                <ul className="space-y-3">
                  {liveMeetings.map((m) => {
                    const relative =
                      m.status === "live"
                        ? `${formatRelativeMeeting(m.diffEnd)} left`
                        : formatRelativeMeeting(m.diffStart);
                    const statusColor =
                      m.status === "live"
                        ? "bg-red-100 text-red-700"
                        : m.status === "starting"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700";
                    return (
                      <li
                        key={m.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 transition flex items-start gap-3"
                      >
                        <div
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${statusColor}`}
                        >
                          {m.status === "live"
                            ? "Live"
                            : m.status === "starting"
                              ? "Starting Soon"
                              : "Upcoming"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {m.title}
                          </p>
                          <p className="text-xs text-gray-500">{relative}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (m.status !== "ended")
                              window.open(m.link, "_blank", "noopener");
                          }}
                          disabled={m.status === "upcoming"}
                          className={`text-xs font-medium px-3 py-1 rounded-md ${
                            m.status === "live" || m.status === "starting"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {m.status === "live"
                            ? "Join"
                            : m.status === "starting"
                              ? "Join Soon"
                              : "Not Yet"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}
