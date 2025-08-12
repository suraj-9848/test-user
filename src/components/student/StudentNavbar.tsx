"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FiUser, FiLogOut, FiArrowLeft } from "react-icons/fi";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  Users,
  User as UserIcon,
  Code2,
  LinkIcon,
  Briefcase,
  Crown,
} from "lucide-react";
import { useJWT } from "@/context/JWTContext";
import { getAdminDashboardUrl } from "@/config/urls";
import { getUserFromJWT } from "@/utils";
import { usePro } from "@/context/usePro";

interface StudentNavbarProps {
  onToggleSidebar?: () => void;
}

const StudentNavbar = ({ onToggleSidebar }: StudentNavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { jwt, setJwt } = useJWT();
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminViewing, setIsAdminViewing] = useState(false);
  const [adminReturnUrl, setAdminReturnUrl] = useState<string | null>(null);
  const logoutMenuRef = useRef<HTMLDivElement>(null);

  const user = getUserFromJWT(jwt);
  const { isProUser, expiresAt } = usePro();

  // Navigation items for mobile menu
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/student",
      icon: Home,
    },
    {
      icon: Briefcase,
      name: "Hiring",
      href: "/hiring?tab=jobs",
    },
    {
      icon: BookOpen,
      name: "Courses",
      href: "/student/courses",
    },
    {
      icon: Trophy,
      name: "Tests",
      href: "/student/tests",
    },
    {
      icon: BarChart3,
      name: "Results",
      href: "/student/results",
    },
    {
      icon: Users,
      name: "Leaderboard",
      href: "/student/leaderboard",
    },

    {
      icon: Code2,
      name: "CP Connection",
      href: "/student/cp-connection",
    },
    {
      icon: LinkIcon,
      name: "CP Leaderboard",
      href: "/student/cp-leaderboard",
    },
    {
      name: "Profile",
      href: "/student/profile",
      icon: UserIcon,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium text-xs">
                    {user?.username ? user.username[0].toUpperCase() : "A"}
                  </span>
                )}
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

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 w-full">
        <div className="flex items-center justify-between h-16 min-w-0 px-6">
          {/* Left side - Hamburger Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo/Branding */}
            <Link href="/student" className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md flex-shrink-0">
                <img src="/favicon.ico" alt="" />
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                Nirudhyog
              </span>
            </Link>
          </div>

          {/* User Profile & Logout - Right Side */}
          <div className="relative flex-shrink-0 ml-auto" ref={logoutMenuRef}>
            <button
              onClick={() => setIsLogoutMenuOpen(!isLogoutMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              <div className="relative">
                {user?.profile_picture ? (
                  <img
                    src={user.profile_picture}
                    alt="Profile"
                    className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ${
                      isProUser ? "ring-yellow-400" : "ring-gray-200"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ring-2 ${
                      isProUser
                        ? "ring-yellow-400 bg-yellow-500/80"
                        : "ring-gray-200 bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  >
                    <span className="text-white font-medium text-sm">
                      {user?.username ? user.username[0].toUpperCase() : "S"}
                    </span>
                  </div>
                )}
                {isProUser && (
                  <div
                    className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-800 rounded-full p-[2px] border border-yellow-300 shadow-sm"
                    title={
                      expiresAt
                        ? `Pro until ${new Date(expiresAt).toLocaleDateString()}`
                        : "Pro active"
                    }
                  >
                    <Crown className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.username || "Student"}
              </span>
            </button>

            {/* Logout Dropdown */}
            {isLogoutMenuOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                {/* User Info Section */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt="Profile"
                          className={`w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-2 ${
                            isProUser ? "ring-yellow-400" : "ring-gray-200"
                          }`}
                        />
                      ) : (
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ring-2 ${
                            isProUser
                              ? "ring-yellow-400 bg-yellow-500/80"
                              : "ring-gray-200 bg-gradient-to-r from-blue-500 to-purple-500"
                          }`}
                        >
                          <span className="text-white font-semibold text-lg">
                            {user?.username
                              ? user.username[0].toUpperCase()
                              : "S"}
                          </span>
                        </div>
                      )}
                      {isProUser && (
                        <div
                          className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-800 rounded-full p-[2px] border border-yellow-300 shadow-sm"
                          title={
                            expiresAt
                              ? `Pro until ${new Date(expiresAt).toLocaleDateString()}`
                              : "Pro active"
                          }
                        >
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate flex items-center gap-2">
                        {user?.username || "Student"}
                        {isProUser && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                            <Crown className="w-3 h-3" /> Pro
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {user?.email || "No email"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/student/profile"
                    className="flex items-center gap-3 w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsLogoutMenuOpen(false)}
                  >
                    <FiUser className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">View Profile</span>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`lg:hidden bg-white border-t border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen
              ? "opacity-100 scale-y-100 max-h-[90vh]"
              : "opacity-0 scale-y-95 max-h-0 overflow-hidden"
          }`}
          style={{ minHeight: 0 }}
        >
          <div className="flex flex-col h-[60vh] min-h-[320px] max-h-[60vh] overflow-y-auto px-4 py-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`
                    group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`
                    mr-4 h-6 w-6 flex-shrink-0
                     ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}
                  `}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Need Help?
              </h3>
              <a
                href="mailto:contact@nirudhyog.com"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                contact@nirudhyog.com
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default StudentNavbar;
