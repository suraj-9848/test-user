"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AuthSyncProvider from "@/components/AuthSyncProvider";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Hide navbar and footer on test pages for clean exam interface
  const isTestPage = pathname?.startsWith("/test");

  if (isTestPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <AuthSyncProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
      </div>
    </AuthSyncProvider>
  );
};

export default PageWrapper;
