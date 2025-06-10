import React from "react";
import { Course } from "../../types"; 

const CourseHighlight = ({ course }: { course?: Course }) => {
  if (!course)
    return (
      <div className="w-full lg:w-1/2 lg:pl-6 bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg mt-4 lg:mt-0 flex items-center justify-center min-h-[200px] text-gray-500">
        No course to highlight.
      </div>
    );
  return (
    <div className="w-full lg:w-1/2 lg:pl-6 bg-yellow-50 p-4 sm:p-6 rounded-xl shadow-lg mt-4 lg:mt-0">
      <img
        alt={course.title}
        className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
        src={course.image}
      />
      <div className="flex items-center mb-2">
        {[...Array(Math.round(course.rating))].map((_, i) => (
          <span key={i} className="material-icons text-yellow-500 text-base sm:text-lg">
            star
          </span>
        ))}
        <span className="ml-2 text-xs sm:text-sm text-gray-600">
          {course.rating}
        </span>
        <span className="ml-1 text-xs sm:text-sm text-gray-500">
          {course.reviews} ratings
        </span>
      </div>
      <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
        {course.title}
      </h2>
      <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
        {course.description}
      </p>
      <button className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-150 mb-2 text-sm sm:text-base">
        Enroll for Free
      </button>
      <p className="text-xs text-gray-500 text-center mb-4 sm:mb-6">
        Instructor: {course.instructor.name}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <span className="material-icons text-blue-600 mt-1">school</span>
          <div>
            <h4 className="font-semibold text-gray-700 text-sm">
              {course.level} Level
            </h4>
            <p className="text-xs text-gray-500">{course.duration}</p>
          </div>
        </div>
        <div className="flex items-start space-x-2 sm:space-x-3">
          <span className="material-icons text-blue-600 mt-1">translate</span>
          <div>
            <h4 className="font-semibold text-gray-700 text-sm">
              {course.language}
            </h4>
            <p className="text-xs text-gray-500">Language</p>
          </div>
        </div>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {course.outcomes?.[0]}
      </p>
    </div>
  );
};

export default CourseHighlight;