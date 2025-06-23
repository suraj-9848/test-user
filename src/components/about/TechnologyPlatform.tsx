"use client";

import Image from "next/image";

export default function TechnologyPlatform() {
  const platformFeatures = [
    {
      title: "Mobile Learning",
      description:
        "Access your courses anytime, anywhere with our responsive mobile platform",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Rich Course Catalog",
      description:
        "Explore a wide variety of courses across different domains to find what suits your learning goals.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-indigo-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
        </svg>
      ),
    },
    {
      title: "Progress & Analytics",
      description:
        "Track your course progress, assignment submissions, and get insights into your learning journey.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-yellow-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      title: "Collaborative Tools",
      description:
        "Work together with peers through discussion forums and group projects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Large decorative circles like AboutHero */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-yellow-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-indigo-100 rounded-full opacity-30"></div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-base font-semibold tracking-wider text-blue-600 uppercase mb-4">
            Technology
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Learning Platform
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            Powered by cutting-edge technology to provide a seamless and
            engaging learning experience.
          </p>
        </div>

        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Features Section */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              {platformFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Demo Section */}
          <div className="order-1 lg:order-2 relative">
            {/* Decorative elements around platform demo */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full opacity-50"></div>

            <div className="relative rounded-xl shadow-lg">
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                {/* Browser chrome */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-3 text-sm text-gray-600 font-medium">
                    Nirudhyog Learning Platform
                  </div>
                </div>

                {/* Platform screenshot */}
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <Image
                    src="/lms.png"
                    alt="Nirudhyog LMS Platform"
                    width={600}
                    height={400}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>

                {/* Status bar */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Live: 1,245 students online
                      </span>
                    </div>
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                      View Dashboard →
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      99.9% Uptime
                    </div>
                    <div className="text-xs text-gray-600">
                      Enterprise-grade reliability
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-blue-200 rounded-full opacity-30"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    50+
                  </div>
                  <p className="text-gray-700 font-medium">
                    Learning Tool Integrations
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-green-200 rounded-full opacity-30"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    99.9%
                  </div>
                  <p className="text-gray-700 font-medium">Platform Uptime</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-yellow-200 rounded-full opacity-30"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    24/7
                  </div>
                  <p className="text-gray-700 font-medium">Technical Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
