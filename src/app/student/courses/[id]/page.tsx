"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { apiGet, handleApiResponse } from "@/utils/apiClient";
import {
  normalizeMeetings,
  annotateMeetings,
  formatRelative as formatRelativeMeeting,
  STARTING_SOON_WINDOW_MIN,
} from "@/utils/meetings";

// Removed inline API wrapper using centralized URL config

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
  const [activeTab, setActiveTab] = useState<"overview" | "modules" | "live">(
    "overview",
  );
  const [meetings, setMeetings] = useState<
    Array<{
      id: string;
      title: string;
      description?: string;
      link: string;
      startTime: string;
      endTime: string;
    }>
  >([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string>("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState<
    "all" | "upcoming" | "starting" | "live" | "ended"
  >("all");
  const [meetingSearch, setMeetingSearch] = useState("");
  const [showPast, setShowPast] = useState(true);
  // tick to keep statuses (live / starting soon) updated
  const [nowTs, setNowTs] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNowTs(Date.now()), 30000);
    return () => clearInterval(i);
  }, []);

  // Only show tabs with real backend data

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiGet(`/api/student/courses/${courseId}`);
        const courseData: CourseDetail = await handleApiResponse(res);

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

    const fetchMeetings = async () => {
      if (!courseId) return;
      try {
        setMeetingsLoading(true);
        setMeetingsError("");
        const res = await apiGet(`/api/student/courses/${courseId}/meetings`);
        const data = await handleApiResponse<any>(res);
        const rawList = Array.isArray(data)
          ? data
          : data.data || data.meetings || [];
        setMeetings(normalizeMeetings(rawList));
      } catch (e: any) {
        setMeetingsError(e.message || "Failed to load live classes");
      } finally {
        setMeetingsLoading(false);
      }
    };
    fetchMeetings();

    // Refetch on window focus
    const handleFocus = () => {
      fetchCourse();
      fetchMeetings();
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

  // Derived annotated meetings with status + helper fields
  const annotatedMeetings = useMemo(() => {
    return annotateMeetings(meetings, nowTs);
  }, [meetings, nowTs]);

  const visibleMeetings = useMemo(() => {
    return annotatedMeetings.filter((m) => {
      if (!showPast && m.status === "ended") return false;
      if (meetingStatusFilter !== "all" && m.status !== meetingStatusFilter)
        return false;
      if (
        meetingSearch &&
        !m.title.toLowerCase().includes(meetingSearch.toLowerCase())
      )
        return false;
      return true;
    });
  }, [annotatedMeetings, meetingStatusFilter, meetingSearch, showPast]);

  const formatRelative = (ms: number) => {
    return formatRelativeMeeting(ms);
  };

  const statusMeta: Record<
    string,
    { label: string; classes: string; ribbon: string }
  > = {
    live: {
      label: "Live Now",
      classes: "bg-red-100 text-red-700",
      ribbon: "bg-red-600",
    },
    starting: {
      label: "Starting Soon",
      classes: "bg-amber-100 text-amber-700",
      ribbon: "bg-amber-500",
    },
    upcoming: {
      label: "Upcoming",
      classes: "bg-blue-100 text-blue-700",
      ribbon: "bg-blue-500",
    },
    ended: {
      label: "Ended",
      classes: "bg-gray-200 text-gray-600",
      ribbon: "bg-gray-500",
    },
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
                      width: `${
                        !isNaN(Number(course.progress))
                          ? Number(course.progress)
                          : 0
                      }%`,
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
              {
                id: "overview",
                label: "Overview",
                icon: BookOpen,
              },
              { id: "modules", label: "Modules", icon: Play },
              { id: "live", label: "Live Classes", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "overview" | "modules" | "live")
                  }
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

          {/* Live Classes Tab */}
          {activeTab === "live" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Live Classes
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Join upcoming sessions or review ended ones.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative flex-1 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Search sessions..."
                          value={meetingSearch}
                          onChange={(e) => setMeetingSearch(e.target.value)}
                          className="w-full text-sm border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md pl-3 pr-9 py-2 transition"
                          aria-label="Search live classes"
                        />
                        <Clock className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
                      </div>
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none whitespace-nowrap bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                        <input
                          type="checkbox"
                          checked={showPast}
                          onChange={(e) => setShowPast(e.target.checked)}
                          className="accent-blue-600"
                        />
                        Show ended
                      </label>
                      <button
                        onClick={() => {
                          (async () => {
                            try {
                              setMeetingsLoading(true);
                              const res = await apiGet(
                                `/api/student/courses/${courseId}/meetings`,
                              );
                              const data = await handleApiResponse<any>(res);
                              const rawList = Array.isArray(data)
                                ? data
                                : data.data || data.meetings || [];
                              setMeetings(normalizeMeetings(rawList));
                            } catch (e: any) {
                              setMeetingsError(
                                e.message || "Failed to refresh classes",
                              );
                            } finally {
                              setMeetingsLoading(false);
                            }
                          })();
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-100 transition"
                        aria-label="Refresh live classes"
                      >
                        {meetingsLoading ? "Refreshing..." : "Refresh"}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Filter Pills Row */}
                <div
                  className="overflow-x-auto -mx-1 pb-1"
                  aria-label="Filter live classes by status"
                >
                  <div className="flex gap-2 px-1 min-w-max">
                    {[
                      { id: "all", label: "All" },
                      { id: "live", label: "Live" },
                      {
                        id: "starting",
                        label: "Starting Soon",
                      },
                      {
                        id: "upcoming",
                        label: "Upcoming",
                      },
                      { id: "ended", label: "Ended" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() =>
                          setMeetingStatusFilter(
                            btn.id as typeof meetingStatusFilter,
                          )
                        }
                        className={`relative px-4 py-2 rounded-full text-xs font-medium transition shadow-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ${meetingStatusFilter === btn.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        aria-pressed={meetingStatusFilter === btn.id}
                      >
                        {btn.label}
                        {meetingStatusFilter === btn.id && (
                          <span
                            className="absolute inset-0 rounded-full ring-2 ring-blue-300 animate-pulse pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* States */}
              {meetingsLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full" />
                </div>
              )}
              {meetingsError && !meetingsLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                  {meetingsError}
                </div>
              )}
              {!meetingsLoading && !meetingsError && meetings.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Live Classes Yet
                  </h3>
                  <p className="text-gray-600 text-sm">
                    When your instructor schedules live sessions they will
                    appear here.
                  </p>
                </div>
              )}

              {/* Grid */}
              {!meetingsLoading &&
                !meetingsError &&
                meetings.length > 0 &&
                (visibleMeetings.length === 0 ? (
                  <div className="text-center py-10 text-sm text-gray-600">
                    No sessions match current filters.
                  </div>
                ) : (
                  <div className="grid gap-5 md:gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleMeetings.map((m) => {
                      const meta = statusMeta[m.status];
                      const startDate = new Date(m.startTime);
                      const niceDate = startDate.toLocaleString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      const relative =
                        m.status === "live"
                          ? `${formatRelative(m.diffEnd)} left`
                          : m.status === "ended"
                            ? formatRelative(-(nowTs - m.endMs))
                            : formatRelative(m.diffStart);
                      const canJoin =
                        m.status === "live" || m.status === "starting";
                      return (
                        <div
                          key={m.id}
                          className="relative border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                        >
                          {/* Mobile status ribbon */}
                          <div
                            className={`absolute top-0 left-0 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white ${meta.ribbon} rounded-br-lg shadow-md md:hidden`}
                          >
                            {meta.label}
                          </div>
                          <div className="p-4 pt-6 flex flex-col h-full">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                {m.title}
                              </h3>
                              {m.description && (
                                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                                  {m.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 text-[11px] mb-4">
                                {/* Status pill (hide on mobile to avoid duplicate with ribbon) */}
                                <span
                                  className={`hidden md:inline-flex px-2 py-0.5 rounded-full font-medium ${meta.classes}`}
                                >
                                  {meta.label}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {m.durationMin} min
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {relative}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> {niceDate}
                              </div>
                            </div>
                            <div className="pt-4">
                              <button
                                onClick={() => {
                                  if (canJoin)
                                    window.open(m.link, "_blank", "noopener");
                                }}
                                disabled={!canJoin}
                                className={`w-full inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg px-3 py-2 transition-colors ${canJoin ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                                aria-disabled={!canJoin}
                              >
                                <Play className="w-4 h-4" />{" "}
                                {canJoin
                                  ? "Join Now"
                                  : m.status === "ended"
                                    ? "Ended"
                                    : "Not Yet"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
