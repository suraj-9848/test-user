"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadRazorpayScript } from "../../../utils/razorpay";
import { BookOpen } from "lucide-react";
import { COMMON_URLS } from "../../../config/urls";
import { API_ENDPOINTS, buildApiUrl } from "../../../config/urls";

// Create API wrapper for consistency
const api = {
  get: async (endpoint: string) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    const response = await fetch(`${endpoint}`, {
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
  overview?: string;
  instructor?: string;
  image?: string;
  price?: number;
  duration?: string;
  start_date?: string;
  end_date?: string;
  is_public?: boolean;
  features?: string[];
  curriculum?: string[];
  prerequisites?: string[];
  tags?: string[];
  mode?: string;
  what_you_will_learn?: string[];
  trainer?: {
    name?: string;
    bio?: string;
    avatar?: string;
    linkedin?: string;
  };
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const publicCoursesResponse = await api.get(COMMON_URLS.PUBLIC_COURSES);
        const publicCourses: Course[] = publicCoursesResponse.courses || [];
        const found = publicCourses.find((c) => c.id === id);
        if (!found) {
          setError("Course not found");
          setCourse(null);
        } else {
          setCourse(found);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  // Auto-trigger payment if returning from sign-in with pendingCourseId
  useEffect(() => {
    if (typeof window === "undefined") return;
    const userToken = localStorage.getItem("jwt");
    const pendingCourseId = localStorage.getItem("pendingCourseId");
    // Only trigger if user is authenticated, course loaded, and matches pendingCourseId
    if (userToken && course && pendingCourseId === course.id) {
      // Remove pendingCourseId to avoid repeated triggers
      localStorage.removeItem("pendingCourseId");
      // Slight delay to ensure UI is ready
      setTimeout(() => {
        handleEnroll();
      }, 500);
    }
  }, [course]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Razorpay payment handler
  const handleEnroll = async () => {
    if (!course) return;
    const userToken =
      typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (!userToken) {
      router.push("/sign-in");
      return;
    }
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }
    try {
      // 1. Create order on backend
      const orderRes = await fetch(
        buildApiUrl(API_ENDPOINTS.PAYMENT_COURSE.CREATE_ORDER),
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
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
          } catch (e) {}
          if (!userId) {
            alert("User ID not found. Please login again.");
            return;
          }
          const verifyRes = await fetch(
            buildApiUrl(API_ENDPOINTS.PAYMENT_COURSE.VERIFY),
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
            router.push("/student");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          {error || "The requested course does not exist."}
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => router.push("/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // UI rendering
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow p-8 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3 w-full flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-blue-800 mb-2">
              {course.title}
            </h1>
            <p className="text-lg text-blue-700 font-semibold">
              {course.overview}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium">
                Mode: {course.mode}
              </span>
              <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded text-xs font-medium">
                Duration: {course.duration}
              </span>
              <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-xs font-medium">
                Start: {formatDate(course.start_date)}
              </span>
              <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded text-xs font-medium">
                End: {formatDate(course.end_date)}
              </span>
            </div>
            <div className="mt-4 text-gray-600 text-base whitespace-pre-line">
              {course.description}
            </div>
            {course.features && course.features.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Key Features
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {course.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Prerequisites
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {course.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {course.what_you_will_learn &&
              course.what_you_will_learn.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-blue-700 mb-2">
                    What You Will Learn
                  </h3>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {course.what_you_will_learn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-blue-700 mb-2">
                  Modules & Curriculum
                </h3>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold border-b">
                        Module
                      </th>
                      <th className="px-4 py-2 text-left text-blue-700 font-semibold border-b">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.curriculum.map((mod, i) => {
                      const lines = mod
                        .split(/\r?\n/)
                        .map((l) => l.trim())
                        .filter(Boolean);
                      const title = lines[0] || "";
                      const points = lines.slice(1);
                      return (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                        >
                          <td className="px-4 py-2 font-semibold text-blue-600 align-top w-1/4">
                            {title}
                          </td>
                          <td className="px-4 py-2 text-gray-700 align-top">
                            {points.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {points.map((pt, idx) => (
                                  <li key={idx}>{pt}</li>
                                ))}
                              </ul>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="md:w-1/3 w-full flex flex-col items-center justify-center bg-white rounded-2xl shadow border border-blue-100 p-6">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-48 object-cover rounded-xl mb-4 border"
            />
            <span className="text-2xl font-bold text-blue-700 mb-2">
              {course.price === 0 ? "Free" : `₹${course.price}`}
            </span>
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow text-base mt-2"
              onClick={handleEnroll}
            >
              {course.price === 0 ? "Enroll for Free" : "Purchase & Enroll"}
            </button>
            <span className="text-xs text-gray-400 mt-2">
              Limited seats available
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-10 border-t pt-6 border-gray-100">
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span>
            For more details, contact our{" "}
            <a
              href="mailto:support@nirudhyog.com"
              className="text-blue-600 underline"
            >
              support team
            </a>{" "}
            or visit our{" "}
            <a
              href="https://nirudhyog.com"
              target="_blank"
              className="text-blue-600 underline"
            >
              website
            </a>
            .
          </span>
          <span className="flex items-center gap-1 text-green-600 mt-1">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            24/7 Learner Support & Privacy Protection
          </span>
        </div>
      </div>
    </div>
  );
}
