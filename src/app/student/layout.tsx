"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useJWT } from "@/context/JWTContext";
import { decodeJwtPayload } from "../../../utils/jwt";
import StudentNavbar from "@/components/student/StudentNavbar";
import StudentSidebar from "@/components/student/StudentSidebar";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { jwt } = useJWT();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [roleAllowed, setRoleAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Hydrate JWT from localStorage if needed
    const syncJwt = () => {
      setHydrated(true);
    };
    syncJwt();
    window.addEventListener("storage", syncJwt);
    window.addEventListener("visibilitychange", syncJwt);
    return () => {
      window.removeEventListener("storage", syncJwt);
      window.removeEventListener("visibilitychange", syncJwt);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!jwt) {
      setRoleAllowed(null);
      router.replace("/sign-in");
      return;
    }
    const payload = decodeJwtPayload(jwt);
    console.log("[StudentLayout] JWT payload:", jwt);
    const userRole = payload?.userRole || payload?.role || payload?.user_role;
    console.log("[StudentLayout] userRole:", userRole);
    if (userRole && ["student", "admin"].includes(userRole.toLowerCase())) {
      setRoleAllowed(true);
    } else {
      setRoleAllowed(false);
    }
  }, [jwt, hydrated, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!hydrated) return null;
  if (!jwt) return null;
  if (roleAllowed === false) {
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
  if (roleAllowed === null) return null;

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
