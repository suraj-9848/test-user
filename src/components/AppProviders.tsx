"use client";

import React from "react";
import ToastProvider from "@/components/ToastProvider";
import SessionWrapper from "@/components/SessionProvider";
import PageWrapper from "@/components/landing/PageWrapper";
import { JWTProvider } from "@/context/JWTContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastProvider />
      <SessionWrapper>
        <JWTProvider>
          <PageWrapper>{children}</PageWrapper>
        </JWTProvider>
      </SessionWrapper>
    </>
  );
}
