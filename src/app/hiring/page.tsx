"use client";
import { useState } from "react";
import CandidateForm from "@/components/hiring/CandidateForm";
import JobNotifications from "@/components/hiring/JobNotifications";
import HiringServices from "@/components/hiring/HiringServices";
import HiringSidebar from "@/components/hiring/HiringSidebar";
import HiringOverview from "@/components/hiring/HiringOverview";

export default function Hiring() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "apply" | "jobs" | "services"
  >("overview");
  return (
    <div className="flex min-h-screen">
      <HiringSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 bg-white">
        {activeTab === "overview" && (
          <HiringOverview setActiveTab={setActiveTab} />
        )}
        {activeTab === "apply" && <CandidateForm />}
        {activeTab === "jobs" && <JobNotifications />}
        {activeTab === "services" && <HiringServices />}
      </main>
    </div>
  );
}
