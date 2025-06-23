"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentNavbar from "@/components/student/StudentNavbar";
import StudentSidebar from "@/components/student/StudentSidebar";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/sign-in");
    }
  }, [session, status, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // DEBUG: Log session to see what is actually present
  console.log("SESSION OBJECT:", session);

  // If loading, show nothing (or a spinner)
  if (status === "loading") return null;
  // If not authenticated, don't render children (redirect will happen)
  if (!session) return null;
  // If authenticated but not a student, show access denied
  if ((session.user as { userRole?: string })?.userRole !== "student") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You do not have permission to access the student dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Student layout
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hide the main navbar and footer with overlay */}
      <div className="fixed inset-0 bg-gray-50 z-[100]">
        {/* Student Navigation */}
        <StudentNavbar onToggleSidebar={toggleSidebar} />

        <div className="flex h-screen">
          {/* Sidebar */}
          <StudentSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

          {/* Main Content */}
          <main className="flex-1 lg:ml-64 pt-16 overflow-y-auto">
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </div>
  );
}
