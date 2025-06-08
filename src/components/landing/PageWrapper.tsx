import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default PageWrapper;