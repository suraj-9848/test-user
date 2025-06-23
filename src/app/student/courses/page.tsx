"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Star,
  PlayCircle,
  Search,
  Grid3X3,
  List,
  CheckCircle,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorImage: string;
  description: string;
  image: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  duration: string;
  level: string;
  rating: number;
  studentsEnrolled: number;
  nextDeadline?: string;
  status: "active" | "completed" | "not-started";
  category: string;
  lastAccessed?: string;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        title: "Full Stack Web Development with MERN",
        instructor: "Rajesh Kumar",
        instructorImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        description:
          "Master modern web development with MongoDB, Express.js, React, and Node.js",
        image:
          "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        progress: 68,
        totalModules: 12,
        completedModules: 8,
        duration: "16 weeks",
        level: "Intermediate",
        rating: 4.8,
        studentsEnrolled: 2456,
        nextDeadline: "June 25, 2025",
        status: "active",
        category: "Web Development",
        lastAccessed: "2 hours ago",
      },
      {
        id: "2",
        title: "Data Science & Machine Learning",
        instructor: "Dr. Priya Sharma",
        instructorImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100&h=100&fit=crop&crop=face",
        description:
          "Comprehensive course covering Python, statistics, and ML algorithms",
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        progress: 45,
        totalModules: 15,
        completedModules: 7,
        duration: "20 weeks",
        level: "Advanced",
        rating: 4.9,
        studentsEnrolled: 1834,
        nextDeadline: "June 30, 2025",
        status: "active",
        category: "Data Science",
        lastAccessed: "1 day ago",
      },
      {
        id: "3",
        title: "Mobile App Development with React Native",
        instructor: "Arjun Patel",
        instructorImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        description:
          "Build cross-platform mobile applications with React Native",
        image:
          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        progress: 100,
        totalModules: 10,
        completedModules: 10,
        duration: "12 weeks",
        level: "Intermediate",
        rating: 4.7,
        studentsEnrolled: 987,
        status: "completed",
        category: "Mobile Development",
        lastAccessed: "1 week ago",
      },
      {
        id: "4",
        title: "DevOps & Cloud Computing",
        instructor: "Suresh Reddy",
        instructorImage:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
        description:
          "Learn Docker, Kubernetes, AWS, and modern DevOps practices",
        image:
          "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
        progress: 0,
        totalModules: 14,
        completedModules: 0,
        duration: "18 weeks",
        level: "Advanced",
        rating: 4.6,
        studentsEnrolled: 1245,
        nextDeadline: "July 5, 2025",
        status: "not-started",
        category: "DevOps",
        lastAccessed: "Never",
      },
      {
        id: "5",
        title: "UI/UX Design Fundamentals",
        instructor: "Neha Gupta",
        instructorImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        description:
          "Master design principles, prototyping, and user experience",
        image:
          "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=250&fit=crop",
        progress: 30,
        totalModules: 8,
        completedModules: 2,
        duration: "10 weeks",
        level: "Beginner",
        rating: 4.8,
        studentsEnrolled: 1567,
        nextDeadline: "June 28, 2025",
        status: "active",
        category: "Design",
        lastAccessed: "3 days ago",
      },
    ];

    setTimeout(() => {
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Completed
          </span>
        );
      case "not-started":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            Not Started
          </span>
        );
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 20) return "bg-yellow-500";
    return "bg-gray-300";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              My Courses
            </h1>
            <p className="text-gray-600">
              Track your progress and continue your learning journey
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {courses.filter((c) => c.status === "active").length} Active
                </span>
              </div>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {courses.filter((c) => c.status === "completed").length}{" "}
                  Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "You haven't enrolled in any courses yet"}
          </p>
          {!searchTerm && (
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          )}
        </div>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group ${
                viewMode === "list" ? "p-6" : "overflow-hidden"
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(course.status)}
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                        {course.level}
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Image
                        src={course.instructorImage}
                        alt={course.instructor}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        {course.instructor}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <span>
                          {course.completedModules}/{course.totalModules}{" "}
                          modules
                        </span>
                        <span>{course.lastAccessed}</span>
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        {course.status === "completed"
                          ? "Review"
                          : course.status === "not-started"
                            ? "Start"
                            : "Continue"}
                      </Link>
                      {course.nextDeadline && (
                        <div className="text-xs text-orange-600 font-medium">
                          Due: {course.nextDeadline}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                /* List View */
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={96}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {course.instructor}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(course.status)}
                        <span className="text-xs text-gray-500">
                          {course.level}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {course.completedModules}/{course.totalModules}{" "}
                          modules
                        </span>
                        <span>{course.progress}% complete</span>
                        <span>Last accessed: {course.lastAccessed}</span>
                      </div>
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <PlayCircle className="w-4 h-4 mr-1" />
                        {course.status === "completed"
                          ? "Review"
                          : course.status === "not-started"
                            ? "Start"
                            : "Continue"}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
