"use client";
import { useState } from "react";
import CandidateForm from "@/components/hiring/CandidateForm";
import JobNotifications from "@/components/hiring/JobNotifications";
import ProSubscription from "@/components/hiring/ProSubscription";
import HiringSidebar from "@/components/hiring/HiringSidebar";
import HiringOverview from "@/components/hiring/HiringOverview";

export default function Hiring() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "apply" | "jobs" | "pro"
  >("overview");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HiringSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        {activeTab === "overview" && (
          <HiringOverview setActiveTab={setActiveTab} />
        )}
        {activeTab === "apply" && <CandidateForm />}
        {activeTab === "jobs" && <JobNotifications />}
        {activeTab === "pro" && <ProSubscription />}
      </main>
    </div>
  );
}
