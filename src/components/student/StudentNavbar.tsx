"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiLogOut, FiArrowLeft } from "react-icons/fi";
import { useJWT } from "@/context/JWTContext";
import { getAdminDashboardUrl } from "@/config/urls";
import { getUserFromJWT } from "@/utils";

interface StudentNavbarProps {
  onToggleSidebar?: () => void;
}

const StudentNavbar = ({ onToggleSidebar }: StudentNavbarProps) => {
  const router = useRouter();
  const { jwt, setJwt } = useJWT();
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [isAdminViewing, setIsAdminViewing] = useState(false);
  const [adminReturnUrl, setAdminReturnUrl] = useState<string | null>(null);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  const user = getUserFromJWT(jwt);

  // Check if admin is viewing as student
  useEffect(() => {
    const adminViewing =
      sessionStorage.getItem("admin_viewing_as_student") === "true";
    const returnUrl = sessionStorage.getItem("admin_return_url");
    setIsAdminViewing(adminViewing);
    setAdminReturnUrl(returnUrl);
  }, []);

  const handleLogout = async () => {
    try {
      const { clearTokensAndRedirect } = await import(
        "@/utils/axiosInterceptor"
      );
      await clearTokensAndRedirect();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: manually clear everything including NextAuth
      try {
        const { signOut } = await import("next-auth/react");
        await signOut({ redirect: false });
      } catch (signOutError) {
        console.error("NextAuth signOut error:", signOutError);
      }

      setJwt(null);
      localStorage.removeItem("jwt");
      sessionStorage.clear();
      router.push("/sign-in");
    }
  };

  const handleReturnToAdmin = () => {
    const adminUrl =
      adminReturnUrl || getAdminDashboardUrl() || "http://localhost:3002";

    // Clear the admin viewing session
    sessionStorage.removeItem("admin_viewing_as_student");
    sessionStorage.removeItem("admin_return_url");

    // Redirect back to admin dashboard
    window.location.href = adminUrl;
  };

  // Close logout menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        logoutMenuRef.current &&
        !logoutMenuRef.current.contains(event.target as Node)
      ) {
        setIsLogoutMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Admin Viewing Banner */}
      {isAdminViewing && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1">
                <FiUser className="h-3 w-3" />
              </div>
              <span className="font-medium">
                You are viewing as a Student (Admin Mode)
              </span>
            </div>
            <button
              onClick={handleReturnToAdmin}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md text-xs font-medium transition-colors"
            >
              <FiArrowLeft className="h-3 w-3" />
              Return to Admin Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Simplified Navigation - Just Logo and Profile */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Branding */}
            <div className="flex items-center">
              <Link href="/student" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  Nirudhyog
                </span>
                <span className="ml-2 text-sm text-gray-500 font-medium">
                  Student
                </span>
              </Link>
            </div>

            {/* User Profile & Logout */}
            <div className="relative" ref={logoutMenuRef}>
              <button
                onClick={() => setIsLogoutMenuOpen(!isLogoutMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt={user.username || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ${user?.profile_picture ? "hidden" : ""}`}
                >
                  <span className="text-white font-medium text-sm">
                    {user?.username ? user.username[0].toUpperCase() : "S"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || "Student"}
                </span>
              </button>

              {/* Logout Dropdown */}
              {isLogoutMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.username || "Student"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.email || "No email"}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default StudentNavbar;
