"use client";
import PageWrapper from "@/components/PageWrapper";
import CourseSearchSection from "@/components/CourseSearchSection";
import CourseSidebar from "@/components/CourseSidebar";
import CourseList from "@/components/CourseList";
import CourseHighlight from "@/components/CourseHighlight";
import LearningPathsSection from "@/components/LearningPathsSection";
import SkillQuizSection from "@/components/SkillQuizSection";

const CoursePage = () => (
  <PageWrapper>
    <div className="container mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <CourseSearchSection />
      <div className="flex flex-col md:flex-row">
        <CourseSidebar />
        <main className="w-full md:w-2/3 lg:w-3/4 p-4 sm:p-6 flex flex-col lg:flex-row">
          <CourseList />
          <CourseHighlight />
        </main>
      </div>
      <LearningPathsSection />
      <SkillQuizSection />
    </div>
  </PageWrapper>
);

export default CoursePage;
