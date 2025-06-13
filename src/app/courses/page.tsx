"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  Users,
  BookOpen,
  X,
  TrendingUp,
  Award,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import {
  courses,
  categories,
  levels,
  durations,
  priceRanges,
} from "../../../sample_data/course";
import { Course } from "../../../types/index";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import CourseStats from "@/components/CourseStats";
import EnrollmentModal from "@/components/EnrollmentModal";

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "new">("all");

  // Sample ongoing courses for demonstration
  const ongoingCourses = [
    {
      title: "React Advanced Patterns",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      timeSpent: "12h 30m",
      nextLesson: "Higher Order Components",
      instructor: "Sarah Johnson",
      certificateEarned: false,
    },
    {
      title: "Python Data Science",
      progress: 100,
      totalLessons: 32,
      completedLessons: 32,
      timeSpent: "28h 45m",
      nextLesson: "",
      instructor: "Dr. Michael Chen",
      certificateEarned: true,
    },
    {
      title: "UI/UX Design Fundamentals",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      timeSpent: "8h 15m",
      nextLesson: "Color Theory in Design",
      instructor: "Emily Rodriguez",
      certificateEarned: false,
    },
  ];

  // Filter courses based on selected criteria
  useEffect(() => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory
      );
    }

    // Level filter
    if (selectedLevel !== "All Levels") {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    // Duration filter
    if (selectedDuration !== "All Durations") {
      filtered = filtered.filter((course) => {
        const weeks = parseInt(course.duration.split(" ")[0]);
        switch (selectedDuration) {
          case "1-8 weeks":
            return weeks <= 8;
          case "9-16 weeks":
            return weeks >= 9 && weeks <= 16;
          case "17+ weeks":
            return weeks >= 17;
          default:
            return true;
        }
      });
    }

    // Price filter
    if (selectedPrice !== "All Prices") {
      filtered = filtered.filter((course) => {
        switch (selectedPrice) {
          case "Free":
            return course.price === 0;
          case "₹1-₹10,000":
            return course.price > 0 && course.price <= 10000;
          case "₹10,001-₹20,000":
            return course.price > 10000 && course.price <= 20000;
          case "₹20,000+":
            return course.price > 20000;
          default:
            return true;
        }
      });
    }

    // Tab filter
    switch (activeTab) {
      case "trending":
        filtered = filtered.filter((course) => course.studentsEnrolled > 1000);
        break;
      case "new":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filtered = filtered.filter(
          (course) => new Date(course.lastUpdated) > thirtyDaysAgo
        );
        break;
      default:
        break;
    }

    // Sort courses
    switch (sortBy) {
      case "popularity":
        filtered.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedDuration,
    selectedPrice,
    sortBy,
    activeTab,
  ]);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowEnrollment(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedLevel("All Levels");
    setSelectedDuration("All Durations");
    setSelectedPrice("All Prices");
    setSortBy("popularity");
    setActiveTab("all");
  };

  const featuredCourses = courses
    .filter((course) => course.rating >= 4.5)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16 sm:py-20 lg:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Transform Your Career with
            <br />
            <span className="text-yellow-300 relative">
              Expert-Led Courses
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-300 rounded-full transform rotate-1"></div>
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Join thousands of learners advancing their skills with
            industry-recognized courses. Learn from experts, build real
            projects, and earn certificates.
          </p>

          {/* Hero Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 text-sm sm:text-base mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">50,000+ Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">150+ Courses</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-medium">4.8 Rating</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Award className="w-5 h-5" />
              <span className="font-medium">Certified</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Start Learning Today
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Platform Statistics */}
        <CourseStats />

        {/* Enhanced Search and Filter Section */}
        <CourseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedPriceRange={selectedPrice}
          onPriceRangeChange={setSelectedPrice}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCourses={filteredCourses.length}
        />

        {/* Course Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              {
                key: "all",
                label: "All Courses",
                count: filteredCourses.length,
              },
              {
                key: "trending",
                label: "Trending",
                icon: <TrendingUp className="w-4 h-4" />,
              },
              {
                key: "new",
                label: "New Releases",
                icon: <Star className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm ||
          selectedCategory !== "All Categories" ||
          selectedLevel !== "All Levels" ||
          selectedPrice !== "All Prices") && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-700">
                Active Filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "All Categories" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("All Categories")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedLevel !== "All Levels" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {selectedLevel}
                  <button onClick={() => setSelectedLevel("All Levels")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedPrice !== "All Prices" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {selectedPrice}
                  <button onClick={() => setSelectedPrice("All Prices")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {filteredCourses.length} Course
              {filteredCourses.length !== 1 ? "s" : ""} Found
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {activeTab === "trending" && "Most popular courses"}
              {activeTab === "new" && "Latest course releases"}
              {activeTab === "all" && "All available courses"}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="font-bold text-gray-900">4.7</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Free Courses</p>
              <p className="font-bold text-gray-900">
                {filteredCourses.filter((c) => c.price === 0).length}
              </p>
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        <div
          className={`
          ${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }
        `}
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewMode={viewMode}
              onEnrollClick={() => handleEnrollClick(course)}
            />
          ))}
        </div>

        {/* Load More Button */}
        {filteredCourses.length > 12 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Load More Courses
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any courses matching your criteria. Try adjusting
              your filters or browse our featured courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Browse All Courses
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollment && selectedCourse && (
        <EnrollmentModal
          course={selectedCourse}
          isOpen={showEnrollment}
          onClose={() => {
            setShowEnrollment(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
