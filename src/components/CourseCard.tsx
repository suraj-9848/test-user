// src/components/courses/CourseCard.tsx
import React from "react";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
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
  const DEFAULT_COURSE_IMAGE =
    "https://images.unsplash.com/photo-1516321310762-479a5e9490b7?w=400&h=250&fit=crop";
  const DEFAULT_TRAINER_AVATAR =
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-80 h-48 lg:h-auto relative flex-shrink-0">
            <Image
              src={course.image || DEFAULT_COURSE_IMAGE}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 p-4 lg:p-6">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {course.title}
                    </h3>
                  </div>
                  <div className="xl:text-right xl:ml-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl xl:text-2xl font-bold text-green-600">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-2 line-clamp-2 text-sm xl:text-base">
                  {course.description}
                </p>

                {/* Meta Info Row: Dates, Mode, Level */}
                <div className="flex flex-wrap items-center gap-4 mb-3 text-xs xl:text-sm text-gray-700">
                  {course.startDate && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Start:</span>
                      <span>{course.startDate}</span>
                    </span>
                  )}
                  {course.endDate && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">End:</span>
                      <span>{course.endDate}</span>
                    </span>
                  )}
                  {course.mode && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Mode:</span>
                      <span
                        className={
                          course.mode === "online"
                            ? "text-blue-600"
                            : "text-orange-600"
                        }
                      >
                        {course.mode.charAt(0).toUpperCase() +
                          course.mode.slice(1)}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 xl:gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Image
                      src={course.trainer.avatar || DEFAULT_TRAINER_AVATAR}
                      alt={`Avatar of ${course.trainer.name}`}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs xl:text-sm">
                      {course.trainer.name}
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
                  {(course.tags || []).map((tag: string) => (
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
          src={course.image || DEFAULT_COURSE_IMAGE}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300"
        />
      </div>

      <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
            {course.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-1">
          {course.description}
        </p>

        {/* Meta Info Row: Dates, Mode, Level */}
        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs sm:text-sm text-gray-700">
          {course.startDate && (
            <span className="flex items-center gap-1">
              <span className="font-medium">Start:</span>
              <span>{course.startDate}</span>
            </span>
          )}
          {course.endDate && (
            <span className="flex items-center gap-1">
              <span className="font-medium">End:</span>
              <span>{course.endDate}</span>
            </span>
          )}
          {course.mode && (
            <span className="flex items-center gap-1">
              <span className="font-medium">Mode:</span>
              <span
                className={
                  course.mode === "online" ? "text-blue-600" : "text-orange-600"
                }
              >
                {course.mode.charAt(0).toUpperCase() + course.mode.slice(1)}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Image
            src={course.trainer.avatar || DEFAULT_TRAINER_AVATAR}
            alt={`Avatar of ${course.trainer.name}`}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="text-xs sm:text-sm text-gray-600 truncate">
            {course.trainer.name}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {(course.tags || []).map((tag: string) => (
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
      </div>
    </div>
  );
}
