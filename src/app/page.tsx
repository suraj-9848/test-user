"use client";

import AlumniSection from "@/components/landing/AlumniSection";
import CountSection from "@/components/landing/CollegeSection";
import FAQ from "@/components/landing/FaQSection";
import HeroSection from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import Toast from "@/components/Toast";
import { validateOAuthUser } from "@/utils/validateOAuthUser";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const page = () => {
  const { data: session, status } = useSession();
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const validateUser = async () => {
      if (status === "authenticated" && session?.jwt) {
        try {
          const result = await validateOAuthUser(session.jwt);
          
          if(result.valid) {
            
          } else {
            setToast({
              show: true,
              message: result.error?.toString() || "User validation failed",
              type: "error",
            });
          }
        } catch (error) {
          setToast({
            show: true,
            message: "Error validating user",
            type: "error",
          });
        }
      }
    };

    validateUser();
  }, [status, session]);

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
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default page;
