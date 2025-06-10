"use client";
import React, { useState } from "react";
import CourseSearchSection from "@/components/CourseSearchSection";
import CourseSidebar from "@/components/CourseSidebar";
import CourseList from "@/components/CourseList";
import CourseHighlight from "@/components/CourseHighlight";
import LearningPathsSection from "@/components/LearningPathsSection";
import SkillQuizSection from "@/components/SkillQuizSection";
import { courses as allCourses } from "../../../sample_data/courses";
import { Course } from "../../../types/index";

const CoursePage = () => {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filter logic
  const filteredCourses = allCourses.filter((course: Course) => {
    const q = search.toLowerCase();
    return (
      course.title.toLowerCase().includes(q) ||
      course.instructor.name.toLowerCase().includes(q) ||
      course.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <CourseSearchSection value={search} onChange={setSearch} />
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden flex justify-between items-center px-4 mb-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Filters
        </button>
        <span className="text-gray-600 text-sm">
          {filteredCourses.length} courses
        </span>
      </div>
      <div className="flex flex-col md:flex-row">
        <CourseSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="w-full md:w-2/3 lg:w-3/4 p-4 sm:p-6 flex flex-col lg:flex-row">
          <CourseList courses={filteredCourses} />
          <CourseHighlight course={filteredCourses[0]} />
        </main>
      </div>
      <LearningPathsSection />
      <SkillQuizSection />
    </div>
  );
};

export default CoursePage;