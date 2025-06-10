import React from "react";

const CourseSearchSection = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <section className="p-4 sm:p-6 md:p-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg m-2 sm:m-4 md:m-6 shadow-lg">
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
        Find Your Perfect Course
      </h2>
      <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto">
        Explore thousands of courses in various fields. Start your learning
        journey today!
      </p>
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <input
            className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-full shadow-md text-gray-800 focus:ring-4 focus:ring-blue-300 focus:outline-none transition duration-150"
            placeholder="Search for courses, e.g., 'Web Development'"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <button
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-1.5 sm:py-2 px-4 sm:px-6 rounded-full shadow-md transition duration-150 text-sm sm:text-base"
            tabIndex={-1}
            type="button"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default CourseSearchSection;
