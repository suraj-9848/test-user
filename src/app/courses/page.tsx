"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Users,
  BookOpen,
  X,
  TrendingUp,
  Award,
  Router,
} from "lucide-react";
import { courses } from "../../../sample_data/course";
import { Course } from "../../../types/index";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import CourseStats from "@/components/CourseStats";
import EnrollmentModal from "@/components/EnrollmentModal";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "new">("all");
  const router = useRouter();
  // Memoized filter function to optimize performance
  const filterCourses = useMemo(
    () => (courses: Course[]) => {
      let filtered = [...courses];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.instructor
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        );
      }

      // Tag filters
      if (selectedTags.length > 0) {
        filtered = filtered.filter((course) =>
          selectedTags.every((tag) => course.tags.includes(tag)),
        );
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
            case "₹0-₹2,000":
              return course.price > 0 && course.price <= 2000;
            case "₹2,001-₹10,000":
              return course.price > 2000 && course.price <= 10000;
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
          filtered = filtered.filter(
            (course) => (course.studentsEnrolled ?? 0) > 1000,
          );
          break;
        case "new":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filtered = filtered.filter(
            (course) => new Date(course.lastUpdated) > thirtyDaysAgo,
          );
          break;
      }

      // Sort courses
      switch (sortBy) {
        case "popularity":
          return filtered.sort(
            (a, b) => (b.studentsEnrolled ?? 0) - (a.studentsEnrolled ?? 0),
          );
        case "price-low":
          return filtered.sort((a, b) => a.price - b.price);
        case "price-high":
          return filtered.sort((a, b) => b.price - a.price);
        case "newest":
          return filtered.sort(
            (a, b) =>
              new Date(b.lastUpdated).getTime() -
              new Date(a.lastUpdated).getTime(),
          );
        default:
          return filtered;
      }
    },
    [
      searchTerm,
      selectedDuration,
      selectedPrice,
      sortBy,
      activeTab,
      selectedTags,
    ],
  );

  useEffect(() => {
    setFilteredCourses(filterCourses(courses));
  }, [filterCourses]);

  const handleEnrollClick = (course: Course) => {
    // Navigate to course details page using uuid
    router.push(`/courses/${course.uuid}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedDuration("All Durations");
    setSelectedPrice("All Prices");
    setSortBy("popularity");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-36">
      {/* Hero Section */}
      <section className="relative bg-white py-8 sm:py-12 lg:py-16 px-4 md:px-6 border-b border-gray-100">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-gray-900">
            Transform Your Career with
            <br />
            <span className="relative text-blue-600">
              Expert-Led Courses
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-600 rounded-full transform rotate-1"></div>
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners advancing their skills with
            industry-recognized courses.
          </p>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 justify-center">
            {[
              { icon: Users, text: "50,000+ Students" },
              { icon: BookOpen, text: "150+ Courses" },
              { icon: Star, text: "4.8 Rating", className: "fill-current" },
              { icon: Award, text: "Certified" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-2"
              >
                <stat.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 ${
                    stat.className || ""
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium text-blue-800">
                  {stat.text}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/sign-in")}
            className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Learning Today
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <CourseStats />

        {/* Derive all unique tags from courses */}
        {(() => {
          const tagSet = new Set<string>();
          courses.forEach((course) =>
            (course.tags || []).forEach((tag) => tagSet.add(tag)),
          );
          const tags = Array.from(tagSet).sort();
          return (
            <CourseFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              tags={tags}
              selectedPriceRange={selectedPrice}
              onPriceRangeChange={setSelectedPrice}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalCourses={filteredCourses.length}
            />
          );
        })()}

        {/* Course Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
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
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "trending")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
                {typeof tab.count === "number" && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm ||
          selectedTags.length > 0 ||
          selectedPrice !== "All Prices") && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-sm font-medium text-blue-700">
                Active Filters:
              </span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: &ldquo;{searchTerm}&rdquo;
                  <button onClick={() => setSearchTerm("")}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() =>
                      setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
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

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6"
              : "space-y-4 sm:space-y-6"
          }
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

        {/* Load More */}
        {filteredCourses.length > 12 && (
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-6 py-2 sm:px-8 sm:py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Load More Courses
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
              We couldn&apos;t find any courses matching your criteria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className="px-6 py-2 sm:py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Browse All Courses
              </button>
            </div>
          </div>
        )}

        {/* EnrollmentModal removed: navigation is now used for enroll */}
      </div>
    </div>
  );
}
