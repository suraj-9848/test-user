"use client";
import { useState, useEffect } from "react";
import CandidateForm from "@/components/hiring/CandidateForm";
import JobNotifications from "@/components/hiring/JobNotifications";
import ProSubscription from "@/components/hiring/ProSubscription";
import HiringSidebar from "@/components/hiring/HiringSidebar";
import HiringOverview from "@/components/hiring/HiringOverview";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Hiring() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "apply" | "jobs" | "pro"
  >("overview");

  // Handle deep-linking to tabs via query (?tab=pro) or hash (#pro)
  useEffect(() => {
    const selectTabFromLocation = () => {
      try {
        const { hash, search } = window.location;
        const params = new URLSearchParams(search);
        const tabParam = (params.get("tab") || "").toLowerCase();
        if (hash === "#pro" || tabParam === "pro") {
          setActiveTab("pro");
          return;
        }
        if (tabParam === "jobs") {
          setActiveTab("jobs");
          return;
        }
        if (tabParam === "apply") {
          setActiveTab("apply");
          return;
        }
        if (tabParam === "overview") {
          setActiveTab("overview");
          return;
        }
      } catch {}
    };

    selectTabFromLocation();
    window.addEventListener("hashchange", selectTabFromLocation);
    window.addEventListener("popstate", selectTabFromLocation);
    return () => {
      window.removeEventListener("hashchange", selectTabFromLocation);
      window.removeEventListener("popstate", selectTabFromLocation);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HiringSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-x-hidden">
        {/* Back to Dashboard header placed under floating navbar */}
        <div className="pt-24">
          <div className="max-w-7xl mx-auto px-4">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {activeTab === "overview" && (
          <HiringOverview setActiveTab={setActiveTab} />
        )}
        {activeTab === "apply" && <CandidateForm />}
        {activeTab === "jobs" && <JobNotifications />}
        {activeTab === "pro" && (
          <div>
            {/* Anchor to support #pro hash scroll */}
            <div id="pro" />
            <ProSubscription />
          </div>
        )}
      </main>
    </div>
  );
}
