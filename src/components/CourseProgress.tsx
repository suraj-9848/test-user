import React from "react";
import { CheckCircle, Clock, BookOpen, Award } from "lucide-react";

interface CourseProgressProps {
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  timeSpent: string;
  nextLesson: string;
  instructor: string;
  certificateEarned?: boolean;
}

export default function CourseProgress({
  title,
  progress,
  totalLessons,
  completedLessons,
  timeSpent,
  nextLesson,
  instructor,
  certificateEarned = false,
}: CourseProgressProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">Instructor: {instructor}</p>
        </div>
        {certificateEarned && (
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">
              Certified
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Lessons</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {completedLessons}/{totalLessons}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">
              Time Spent
            </span>
          </div>
          <p className="text-sm font-bold text-gray-900">{timeSpent}</p>
        </div>
      </div>

      {/* Next Lesson */}
      {progress < 100 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Next Lesson</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {nextLesson}
              </p>
            </div>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Completed Badge */}
      {progress === 100 && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Course Completed!</span>
          </div>
        </div>
      )}
    </div>
  );
}
