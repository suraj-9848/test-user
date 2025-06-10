"use client";

import React from "react";
import { Course } from "../../types"; 

const CourseList = ({ courses }: { courses: Course[] }) => (
  <div className="w-full lg:w-1/2 lg:pr-6 space-y-4 sm:space-y-6 mb-6 lg:mb-0">
    {courses.length === 0 ? (
      <div className="text-gray-500 text-center py-8">No courses found.</div>
    ) : (
      courses.map((course) => (
        <div
          key={course.id}
          className="flex items-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 course-card"
        >
          <img
            alt={course.title}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover mr-3 sm:mr-4"
            src={course.image}
          />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {course.instructor.name}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
);

export default CourseList;