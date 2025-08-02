// courses/page.tsx
"use client";
import { useState, useEffect, useMemo } from "react";
import { Star, Users, BookOpen, X, TrendingUp, Award } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import CourseStats from "@/components/CourseStats";
import { COMMON_URLS } from "../../config/urls";
import { useRouter } from "next/navigation";
import { Course } from "../../../types/index";

// Default images
const DEFAULT_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1516321310762-479a5e9490b7?w=400&h=250&fit=crop";
const DEFAULT_TRAINER_AVATAR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("All Durations");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "new">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch public courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await fetch(COMMON_URLS.PUBLIC_COURSES);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        // Map API response to Course interface
        const mappedCourses: Course[] = data.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description || "",
          overview: course.overview,
          trainer: {
            name: course.trainer_name,
            bio: course.trainer_bio,
            avatar: course.trainer_avatar || DEFAULT_TRAINER_AVATAR,
            linkedin: course.trainer_linkedin || "",
          },
          price: course.price,
          duration: course.duration,
          image: course.logo || DEFAULT_COURSE_IMAGE,
          instructor: course.instructor_name,
          lastUpdated:
            course.lastUpdated || new Date().toISOString().split("T")[0],
          tags: course.tags || [],
          startDate: course.start_date,
          endDate: course.end_date,
          mode: course.mode,
          features: course.features || [],
          curriculum: course.curriculum || [],
          prerequisites: course.prerequisites || [],
          whatYouWillLearn: course.what_you_will_learn || [],
          is_public: course.is_public,
        }));
        setFilteredCourses(mappedCourses);
      } catch (err) {
        setError("Error fetching courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Memoized filter function
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
          const weeks = parseInt(course.duration.split(" ")[0]) || 0;
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
    setFilteredCourses(filterCourses(filteredCourses));
  }, [filterCourses]);

  const handleEnrollClick = (course: Course) => {
    router.push(`/courses/${course.id}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setSelectedDuration("All Durations");
    setSelectedPrice("All Prices");
    setSortBy("popularity");
    setActiveTab("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
        {(() => {
          const tagSet = new Set<string>();
          filteredCourses.forEach((course) =>
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

        {filteredCourses.length > 12 && (
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-6 py-2 sm:px-8 sm:py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
              Load More Courses
            </button>
          </div>
        )}

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
      </div>
    </div>
  );
}
