import AlumniSection from "@/components/landing/AlumniSection";
import CountSection from "@/components/landing/CollegeSection";
import FAQ from "@/components/landing/FaQSection";
import HeroSection from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import React from "react";

const page = () => {
  return (
    <div>
      <HeroSection />
      <Testimonials />
      <CountSection />
      <AlumniSection />
      <FAQ />
    </div>
  );
};

export default page;
