"use client"
import React from "react";
import AboutHeader from "../../components/about/AboutHeader";
import OurMission from "../../components/about/OurMission";
import OurTeam from "../../components/about/OurTeam";
import OurValues from "../../components/about/OurValues";
import OurJourney from "../../components/about/OurJourney";
import EducationalApproach from "../../components/about/EducationalApproach";
import TechnologyPlatform from "../../components/about/TechnologyPlatform";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "About Nirudhyog | Innovative Learning Platform",
//   description: "Learn about Nirudhyog's mission, educational approach, technology platform, and our elite instructors from top universities committed to transforming education.",
//   keywords: "Nirudhyog, learning platform, online education, LMS, edutech, educational technology, e-learning, top instructors, university professors",
// };
  
const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutHeader />
      <OurMission />
      <OurValues />
      <EducationalApproach />
      <TechnologyPlatform />
      <OurTeam />
      <OurJourney />
    </div>
  );
};

export default AboutPage;
