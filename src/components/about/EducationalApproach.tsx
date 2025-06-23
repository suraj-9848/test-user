"use client";

export default function EducationalApproach() {
  // Educational features
  const educationalFeatures = [
    {
      title: "Personalized Learning Paths",
      description:
        "Our adaptive learning system creates customized paths based on individual strengths, weaknesses, and learning pace.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-blue-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: "Interactive Curriculum",
      description:
        "Engage with our interactive lessons, quizzes, simulations, and real-world projects that make learning practical and effective.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-purple-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      title: "Expert Instructors",
      description:
        "Learn from industry practitioners and academic experts who bring real-world experience to their teaching.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics and progress reports that help you stay on track.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-red-600"
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
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Large decorative circles like AboutHero */}
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-green-100 rounded-full opacity-30"></div>

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-base font-semibold tracking-wider text-blue-600 uppercase mb-4">
            Education
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Educational Approach
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            We combine cutting-edge technology with proven teaching
            methodologies to deliver an exceptional learning experience.
          </p>
        </div>

        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 max-w-6xl mx-auto mb-16">
          {/* Features Section */}
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="mb-4 p-3 bg-blue-50 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="order-1 lg:order-2 relative">
            {/* Decorative elements around stats */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-green-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 rounded-full opacity-50"></div>

            <div className="relative">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                  Our Learner Success
                </h3>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">92%</p>
                        <p className="text-sm text-gray-600 font-medium">
                          Course Completion Rate
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 text-yellow-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-yellow-600">
                          4.8/5
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          Average Student Satisfaction
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating achievement badge */}
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-xl font-bold">17K+</div>
                  <div className="text-xs opacity-90">Students Trained</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Framework Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Our Learning Framework
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Assessment</h4>
              <p className="text-gray-700 text-sm">
                Evaluate your current knowledge and skill level
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Customization
              </h4>
              <p className="text-gray-700 text-sm">
                Tailor learning paths to your goals and needs
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Engagement</h4>
              <p className="text-gray-700 text-sm">
                Learn through interactive content and real-world projects
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mastery</h4>
              <p className="text-gray-700 text-sm">
                Demonstrate and apply your skills in real scenarios
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
