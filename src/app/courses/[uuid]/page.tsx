"use client";
import { useParams, useRouter } from "next/navigation";
import { courses } from "../../../../sample_data/course";
import { BookOpen } from "lucide-react";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params?.uuid as string;
  const course = courses.find((c) => c.uuid === uuid);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Course Not Found
        </h2>
        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => router.push("/courses")}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <>
      {/* White top section to blend with navbar */}
      <div className="w-full h-20 bg-blue-50" />
      <div className="w-full min-h-[calc(100vh-5rem)] bg-gradient-to-br from-blue-50 to-white py-12 px-2 md:px-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Enhanced Hero Section */}
          <section className="flex flex-col md:flex-row gap-10 md:gap-16 mb-12 items-center md:items-start bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 md:p-10 shadow-lg border border-blue-100">
            {/* Left: Headline, subheadline, badges, info */}
            <div className="md:w-3/5 w-full flex flex-col gap-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 flex items-center gap-3">
                {course.title}
              </h1>
              <p className="text-lg md:text-2xl text-blue-700 font-semibold mt-2">
                Unlock your potential with hands-on learning from industry
                experts.
              </p>
              <p className="text-base text-gray-600 mt-1">
                Master in-demand skills, get certified, and accelerate your
                career with our comprehensive course.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-medium">
                  Mode: {course.mode}
                </span>
                {/* Location badge removed: 'location' property does not exist on Course type */}
                <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded text-xs font-medium">
                  Duration: {course.duration}
                </span>
                {course.startDate && (
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-xs font-medium">
                    Start: {new Date(course.startDate).toLocaleDateString()}
                  </span>
                )}
                {course.endDate && (
                  <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded text-xs font-medium">
                    End: {new Date(course.endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            {/* Right: Course image, price, CTA */}
            <div className="md:w-2/5 w-full flex flex-col items-center justify-center bg-white rounded-2xl shadow border border-blue-100 p-6">
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-xl mb-4 border"
                />
              )}
              <div className="flex flex-col items-center w-full">
                <span className="text-2xl font-bold text-blue-700 mb-2">
                  {course.price === 0 ? "Free" : `₹${course.price}`}
                </span>
                {course.originalPrice &&
                  course.price !== course.originalPrice && (
                    <span className="text-sm text-red-500 line-through mb-2">
                      ₹{course.originalPrice}
                    </span>
                  )}
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition shadow text-base mt-2"
                  onClick={() => alert("Enrollment confirmed!")}
                >
                  Confirm Enroll
                </button>
                <span className="text-xs text-gray-400 mt-2">
                  Limited seats available
                </span>
              </div>
            </div>
          </section>

          {/* Overview Section */}
          <div className="bg-white rounded-2xl shadow p-8 mb-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="12" fill="#2563eb" opacity="0.12" />
                <path
                  d="M7 13l3 3 7-7"
                  stroke="#2563eb"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Why Choose This Course?
            </h2>
            <ul className="list-disc pl-6 text-gray-700 text-base space-y-2 mb-4">
              <li>100% Satisfaction Guarantee – or your money back</li>
              <li>Trusted by thousands of learners and top companies</li>
              <li>Expert, background-verified trainers</li>
              <li>Secure payment & privacy protection</li>
              <li>Certificate of Completion for every learner</li>
              <li>24/7 support for all enrolled students</li>
            </ul>
            <h3 className="text-xl font-bold text-blue-700 mb-1 mt-6">
              Course Overview
            </h3>
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {course.overview}
            </p>
            <div className="mt-4 text-gray-600 text-sm">
              {course.description}
            </div>
          </div>
          {/* What You Will Learn, Modules, Features, Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 items-stretch">
            {/* What You Will Learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 h-full flex flex-col col-span-1">
                <h3 className="font-semibold text-blue-700 mb-2">
                  What You Will Learn
                </h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                  {course.whatYouWillLearn.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Features */}
            {course.features && course.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 h-full flex flex-col col-span-1">
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
            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 h-full flex flex-col col-span-1">
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
            {/* Modules / Curriculum - Table Format */}
            {course.curriculum && course.curriculum.length > 0 && (
              <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 col-span-1 md:col-span-3 overflow-x-auto">
                <h3 className="font-semibold text-blue-700 mb-4">
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
                      const [title, ...descArr] = mod.split(":");
                      const desc = descArr.join(":").trim();
                      const points = desc
                        .split(/\n|;/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      return (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                        >
                          <td className="px-4 py-2 font-semibold text-blue-600 align-top w-1/4">
                            {title}
                          </td>
                          <td className="px-4 py-2 text-gray-700 align-top">
                            {points.length > 1 ? (
                              <ul className="list-disc pl-5 space-y-1">
                                {points.map((pt, idx) => (
                                  <li key={idx}>{pt}</li>
                                ))}
                              </ul>
                            ) : (
                              desc
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Trainer Information */}
          <section className="flex flex-col items-center justify-center gap-8 mb-12">
            <article className="bg-white rounded-2xl shadow p-8 flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl border border-blue-100 transition hover:shadow-lg">
              <div className="flex-shrink-0">
                <img
                  src={course.trainer.avatar}
                  alt={`Trainer: ${course.trainer.name}`}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-blue-500 object-cover shadow-sm"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-1 w-full justify-between">
                  <span className="font-bold text-2xl text-gray-900">
                    {course.trainer.name}
                  </span>
                  {/* Always show LinkedIn button, fallback to '#' if not present */}
                  <a
                    href={"linkedin" in course.trainer && typeof course.trainer.linkedin === "string" && course.trainer.linkedin ? course.trainer.linkedin : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition border border-blue-700 shadow-md"
                    aria-label={`View ${course.trainer.name} on LinkedIn`}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                    </svg>
                    LinkedIn
                  </a>
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="12"
                        fill="#2563eb"
                        opacity="0.15"
                      />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Verified Trainer
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold text-gray-800">Bio:</span>{" "}
                  {course.trainer.bio}
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="text-lg text-blue-700 font-semibold">
                    <span className="font-semibold text-blue-900">Experience:</span>{" "}
                    12+ years in MERN stack, 2000+ students mentored
                  </div>
                </div>
              </div>
            </article>
          </section>

          {/* Footer Action */}
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
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="#22c55e"
                    opacity="0.15"
                  />
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
            <button
              className="px-10 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow text-base"
              onClick={() => alert("Enrollment confirmed!")}
            >
              Confirm Enroll
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
