"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadRazorpayScript } from "@/utils/razorpay";
import { buildUrl, API_ENDPOINTS } from "@/config/urls";
import {
  BookOpen,
  Clock,
  Star,
  Filter,
  Search,
  PlayCircle,
  BarChart3,
  AlertCircle,
  DollarSign,
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

interface Course {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  image?: string;
  progress?: number;
  totalModules?: number;
  completedModules?: number;
  status?: "active" | "completed" | "not-started";
  level?: string;
  duration?: string;
  rating?: number;
  studentsEnrolled?: number;
  start_date: string;
  end_date: string;
  is_public?: boolean;
  price?: number;
  instructor_name?: string;
  overview?: string;
  features?: string[];
  curriculum?: string[];
  prerequisites?: string[];
  tags?: string[];
  mode?: string;
  what_you_will_learn?: string[];
}

export default function CoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [publicCourses, setPublicCourses] = useState<Course[]>([]);
  const [filteredEnrolledCourses, setFilteredEnrolledCourses] = useState<
    Course[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed" | "not-started"
  >("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch enrolled courses
        const enrolledCoursesData: Course[] = await api.get(
          "/api/student/courses",
        );
        const transformedEnrolledCourses = enrolledCoursesData.map(
          (course: Course) => ({
            id: course.id,
            title: course.title,
            description: course.overview || "No description available",
            instructor: course.instructor_name,
            image:
              course.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            progress: course.progress || 0,
            totalModules: course.totalModules || 0,
            completedModules: course.completedModules || 0,
            status:
              course.status ||
              ((course.progress && course.progress > 0
                ? "active"
                : "not-started") as "active" | "completed" | "not-started"),
            level: course.level,
            duration: course.duration,
            rating: course.rating,
            studentsEnrolled: course.studentsEnrolled,
            start_date: course.start_date,
            end_date: course.end_date,
          }),
        );

        // Fetch public courses
        const publicCoursesResponse = await api.get(
          "/api/student/courses/public",
        );
        const publicCoursesData: Course[] = publicCoursesResponse.courses || [];

        console.log("Fetched public courses:", publicCoursesData);
        const transformedPublicCourses = publicCoursesData.map(
          (course: Course) => ({
            id: course.id,
            title: course.title,
            description: course.overview || "No description available",
            instructor: course.instructor_name,
            image:
              course.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
            duration: course.duration,
            price: course.price,
            start_date: course.start_date,
            end_date: course.end_date,
            is_public: course.is_public,
            features: course.features,
            curriculum: course.curriculum,
            prerequisites: course.prerequisites,
            tags: course.tags,
            mode: course.mode,
            what_you_will_learn: course.what_you_will_learn,
          }),
        );

        setEnrolledCourses(transformedEnrolledCourses);
        setFilteredEnrolledCourses(transformedEnrolledCourses);
        setPublicCourses(transformedPublicCourses);
      } catch (err: unknown) {
        console.error("Error fetching courses:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load courses";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter enrolled courses based on search term and status
  useEffect(() => {
    let filtered = enrolledCourses;

    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((course) => course.status === filterStatus);
    }

    setFilteredEnrolledCourses(filtered);
  }, [enrolledCourses, searchTerm, filterStatus]);

  // const getStatusBadge = (status?: string) => {
  //   switch (status) {
  //     case "completed":
  //       return (
  //         <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
  //           Completed
  //         </span>
  //       );
  //     case "active":
  //       return (
  //         <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
  //           In Progress
  //         </span>
  //       );
  //     default:
  //       return (
  //         <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
  //           Not Started
  //         </span>
  //       );
  //   }
  // };

  const formatDate = (dateString: string) => {
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
          <p className="mt-4 text-gray-600">Loading courses...</p>
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
                Error Loading Courses
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

  // Razorpay payment handler
  const handlePurchase = async (course: Course) => {
    const userToken = localStorage.getItem("jwt");
    if (!userToken) {
      alert("Please login to purchase a course.");
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }
    try {
      // 1. Create order on backend

      console.log("Creating Razorpay order for course:", course);
      console.log("User token:", userToken);
      console.log("Course price:", course.price);
      const userid = userToken.split(".")[1];
      const decoded = JSON.parse(atob(userid));
      console.log("Decoded user ID:", decoded.id);

      const orderRes = await fetch(
        buildUrl(API_ENDPOINTS.PAYMENT_COURSE.CREATE_ORDER),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ amount: course.price, courseId: course.id }),
        },
      );
      const { order } = await orderRes.json();
      if (!order || !order.id) throw new Error("Order creation failed");

      // 2. Open Razorpay checkout
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error(
          "Razorpay key missing. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID in your environment.",
        );
      }
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: course.title,
        description: course.description,
        image: course.image,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          let userId = undefined;
          try {
            const tokenPayload = userToken.split(".")[1];
            const decoded = JSON.parse(atob(tokenPayload));
            userId = decoded.userId || decoded.id;
          } catch (e) {
            // Fallback: userId remains undefined
          }
          if (!userId) {
            console.warn(
              "Warning: userId not provided in payment verification request",
            );
            return alert("User ID not found. Please login again.");
          }
          const verifyRes = await fetch(
            buildUrl(API_ENDPOINTS.PAYMENT_COURSE.VERIFY),
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id,
                userId,
              }),
            },
          );
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful! You are now enrolled in the course.");
            window.location.reload();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {},
        theme: { color: "#2563eb" },
      };
      // @ts-expect-error
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Payment failed. Please try again.");
    }
  };

  return (
    <div className="space-y-12 min-h-screen pb-12">
      {/* Enrolled Courses Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Enrolled Courses
            </h1>
            <p className="text-gray-600 mt-1">
              {enrolledCourses.length} course
              {enrolledCourses.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>
        </div>

        {/* Search and Filters for Enrolled Courses */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search enrolled courses, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as
                      | "all"
                      | "active"
                      | "completed"
                      | "not-started",
                  )
                }
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">In Progress</option>
                <option value="completed">Completed</option>
                <option value="not-started">Not Started</option>
              </select>
            </div>
          </div>
        </div> */}

        {/* Enrolled Courses Grid */}
        {filteredEnrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEnrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={course.image || "/hero-image.png"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {/* <div className="absolute top-3 left-3">
                    {getStatusBadge(course.status)}
                  </div> */}
                  {course.rating && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-sm flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  {course.instructor && (
                    <p className="text-sm text-gray-600 mb-3">
                      by {course.instructor}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.totalModules} modules</span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                    </div>
                    {course.level && (
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4" />
                        <span>{course.level}</span>
                      </div>
                    )}
                  </div>
                  {/* <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
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
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{course.completedModules} completed</span>
                      <span>
                        {(course.totalModules ?? 0) -
                          (course.completedModules || 0)}{" "}
                        remaining
                      </span>
                    </div>
                  </div> */}
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Started: {formatDate(course.start_date)}</p>
                    <p>Ends: {formatDate(course.end_date)}</p>
                  </div>
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {course.status === "completed"
                      ? "Review Course"
                      : course.status === "active"
                        ? "Continue Learning"
                        : "Start Course"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "No enrolled courses found"
                : "No courses enrolled"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters to find courses."
                : "Enroll in courses to start your learning journey."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link
                href="/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Public Courses Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Public Courses</h1>
            <p className="text-gray-600 mt-1">
              {publicCourses.length} course
              {publicCourses.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* Public Courses Grid */}
        {publicCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {publicCourses.map((course) => {
              // Coerce price to number to handle string/undefined/null
              const isPaid = Number(course.price) > 0;
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col min-h-[400px]"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={course.image || "/hero-image.png"}
                      alt={course.title}
                      fill
                      className="object-cover"
                      style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
                    />
                    <div className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded text-xs font-medium text-gray-700 shadow">
                      {course.mode
                        ? course.mode.charAt(0).toUpperCase() +
                          course.mode.slice(1)
                        : "Online"}
                    </div>
                    {isPaid ? (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-sm flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>${course.price}</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        Free
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-4 pt-3">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.instructor && (
                      <p className="text-sm text-gray-600 mb-2">
                        by {course.instructor}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      {course.duration && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                      )}
                      {course.level && (
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{course.level}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Starts: {formatDate(course.start_date)}</p>
                      <p>Ends: {formatDate(course.end_date)}</p>
                    </div>
                    <div className="mt-auto pt-2">
                      {isPaid ? (
                        <button
                          onClick={() => handlePurchase(course)}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Purchase Course
                        </button>
                      ) : (
                        <Link
                          href={`/courses/${course.id}`}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No public courses available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for new public courses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
