"use client";
import React from "react";
import { Users, Bell, Briefcase, Target } from "lucide-react";
export type TabId = "overview" | "apply" | "jobs" | "services";
export interface HiringSidebarProps {
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
}
export default function HiringSidebar({
  activeTab,
  setActiveTab,
}: HiringSidebarProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "apply", label: "Apply for Jobs", icon: Users },
    { id: "jobs", label: "Job Notifications", icon: Bell },
    { id: "services", label: "Hiring Services", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen relative pb-16 sm:pb-0">
      {/* Sidebar navigation */}
      <aside className="hidden sm:flex sticky top-0 h-screen bg-white/50 backdrop-blur-lg flex-col items-center justify-center w-20 px-2 py-8 space-y-6 shadow-lg transition-all duration-300 hover:w-48 hover:px-4 group">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "text-blue-600" : "text-gray-400"
              } hover:text-blue-600 hover:bg-blue-100`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium mt-1 opacity-0 whitespace-nowrap transition-opacity duration-200 group-hover:opacity-100">
                {tab.label}
              </span>
            </button>
          );
        })}
      </aside>
      {/* Main content area */}
      <main className="flex-1 bg-white">
        {/* Your main content goes here */}
      </main>
      {/* Mobile bottom navigation */}
      <nav className="sm:hidden fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2 max-w-5xl w-[90%] flex justify-around items-center rounded-full border border-gray-200 bg-white/82 backdrop-blur-sm px-6 py-2 shadow-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center flex-1 p-1 ${
                isActive ? "text-blue-600" : "text-gray-400"
              } hover:text-blue-600`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
