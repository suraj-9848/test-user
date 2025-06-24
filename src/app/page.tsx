"use client";

import AlumniSection from "@/components/landing/AlumniSection";
import CountSection from "@/components/landing/CollegeSection";
import FAQ from "@/components/landing/FaQSection";
import HeroSection from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import Toast from "@/components/Toast";
// import { validateOAuthUser } from "../../utils/auth"; // Function deprecated

import React, { useState } from "react";

const Page = () => {
  // const { data: session, status } = useSession(); // Removed for now
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // User validation moved to backend auth - deprecated

  const closeToast = () => {
    setToast({ show: false, message: "", type: "success" });
  };

  return (
    <div>
      <HeroSection />
      <Testimonials />
      <CountSection />
      <AlumniSection />
      <FAQ />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default Page;
