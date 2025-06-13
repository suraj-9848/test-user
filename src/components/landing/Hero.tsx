"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="bg-white my-16">
      <section className="bg-white bg-opacity-30 py-4">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-7xl leading-tight">
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                  Your Future Starts Here
                </p>
                Master In-Demand Skills from Top Instructors
              </h1>
              <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                Learn at your own pace with industry-relevant courses, hands-on
                projects, and real-time mentorship. Powered by a vibrant learner
                community.
              </p>

              <Link
                href="/courses"
                className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
              >
                Explore Courses
                <svg
                  className="w-6 h-6 ml-8 -mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Link>

              <p className="mt-5 text-gray-600">
                Already enrolled?{" "}
                <Link
                  href="#"
                  className="text-black transition-all duration-200 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>

            <div>
              <Image
                width={800}
                height={800}
                className="w-full"
                src="/hero-image.png"
                alt="Online Learning Illustration"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
