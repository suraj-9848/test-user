// src/components/courses/CourseCard.tsx
import React from "react";
import Image from "next/image";
import { Star, Clock, Users, BookOpen, Award } from "lucide-react";
import { Course } from "../../types/index";

interface CourseCardProps {
  course: Course;
  viewMode: "grid" | "list";
  onEnrollClick: () => void;
}

export default function CourseCard({
  course,
  viewMode,
  onEnrollClick,
}: CourseCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (!course.originalPrice) return 0;
    return Math.round(
      ((course.originalPrice - course.price) / course.originalPrice) * 100
    );
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-80 h-48 lg:h-auto relative flex-shrink-0">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {course.level}
              </span>
            </div>
            {course.originalPrice && (
              <div className="absolute top-4 right-4">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {calculateDiscount()}% OFF
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 lg:p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-3">
                  <div className="flex-1">
                    <span className="text-sm text-blue-600 font-medium">
                      {course.category}
                    </span>
                    <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  <div className="xl:text-right xl:ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      {course.originalPrice && (
                        <span className="text-gray-400 line-through text-base xl:text-lg">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                      <span className="text-xl xl:text-2xl font-bold text-green-600">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 text-sm xl:text-base">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 xl:gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Image
                      src={course.instructorImage}
                      alt={course.instructor}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs xl:text-sm">
                      {course.instructor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 xl:w-4 xl:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-xs xl:text-sm">
                      {course.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span className="text-xs xl:text-sm">
                      {course.studentsEnrolled.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 xl:w-4 xl:h-4" />
                    <span className="text-xs xl:text-sm">
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 xl:gap-2 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  {course.certificateProvided && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs xl:text-sm">Certificate</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs xl:text-sm">
                      {course.curriculum.length} Modules
                    </span>
                  </div>
                </div>
                <button
                  onClick={onEnrollClick}
                  className="px-4 xl:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm xl:text-base whitespace-nowrap"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group h-full flex flex-col">
      <div className="relative h-48 sm:h-52 lg:h-48">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {course.level}
          </span>
        </div>
        {course.originalPrice && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
              {calculateDiscount()}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-xs sm:text-sm text-blue-600 font-medium">
            {course.category}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
            {course.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <Image
            src={course.instructorImage}
            alt={course.instructor}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-xs sm:text-sm text-gray-600 truncate">
            {course.instructor}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
            <span className="hidden sm:inline">
              ({course.studentsEnrolled.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {course.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            {course.originalPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                {formatPrice(course.originalPrice)}
              </span>
            )}
            <span className="text-lg sm:text-xl font-bold text-green-600">
              {formatPrice(course.price)}
            </span>
          </div>
          <button
            onClick={onEnrollClick}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm"
          >
            Enroll Now
          </button>
        </div>

        {course.certificateProvided && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
            <Award className="w-3 h-3" />
            <span>Certificate included</span>
          </div>
        )}
      </div>
    </div>
  );
}
