"use client";

import React from "react";

interface TestsLayoutProps {
  children: React.ReactNode;
}

export default function TestsLayout({ children }: TestsLayoutProps) {
  // Render tests in isolation without student navbar or sidebar
  return <>{children}</>;
}
