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
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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

    // Check if admin is in the middle of authentication process
    const adminToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("adminToken")
        : null;
    const adminUser =
      typeof window !== "undefined"
        ? sessionStorage.getItem("adminUser")
        : null;

    // If admin tokens exist, allow access (admin viewing student portal)
    if (adminToken && adminUser) {
      console.log("[StudentLayout] Admin user detected, allowing access");
      setRoleAllowed(true);
      return;
    }

    // Check for ongoing authentication (NextAuth session)
    const urlParams = new URLSearchParams(window.location.search);
    const isAuthCallback =
      window.location.pathname.includes("/api/auth/") ||
      urlParams.has("code") ||
      urlParams.has("state");

    if (isAuthCallback) {
      console.log(
        "[StudentLayout] Authentication callback detected, waiting...",
      );
      setIsAuthenticating(true);
      return;
    }

    if (!jwt) {
      // Add a small delay to prevent immediate redirect during authentication
      const timeoutId = setTimeout(() => {
        if (!jwt && !sessionStorage.getItem("adminToken")) {
          console.log("[StudentLayout] No JWT found, redirecting to sign-in");
          setRoleAllowed(null);
          router.replace("/sign-in");
        }
      }, 1000); // 1 second delay to allow for authentication completion

      return () => clearTimeout(timeoutId);
    }

    const payload = decodeJwtPayload(jwt);
    console.log("[StudentLayout] JWT payload:", jwt);
    const userRole = payload?.userRole || payload?.role || payload?.user_role;
    console.log("[StudentLayout] userRole:", userRole);
    if (userRole && ["student", "admin"].includes(userRole.toLowerCase())) {
      setRoleAllowed(true);
      setIsAuthenticating(false);
    } else {
      setRoleAllowed(false);
      setIsAuthenticating(false);
    }
  }, [jwt, hydrated, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Loading...
            </h2>
            <p className="text-gray-600">Initializing application</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Authenticating...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  if (roleAllowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Validating Access...
            </h2>
            <p className="text-gray-600">Checking your permissions</p>
          </div>
        </div>
      </div>
    );
  }

  // Student layout
  return (
    <div className="min-h-screen bg-gray-50 relative ">
      {/* Hide the main navbar and footer with overlay */}
      <div className="fixed inset-0 bg-gray-50 z-[100]">
        {/* Student Navigation */}
        <StudentNavbar onToggleSidebar={toggleSidebar} />

        <div className="h-screen">
          {/* Sidebar - Fixed positioned, not part of flex */}
          <StudentSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

          {/* Main Content - Takes full width but with left margin for sidebar */}
          <main className="lg:ml-64 h-full overflow-y-auto">
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
