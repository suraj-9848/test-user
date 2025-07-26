"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface StudentNavbarProps {
  onToggleSidebar: () => void;
}

export default function StudentNavbar({ onToggleSidebar }: StudentNavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  // Use session user data if available, fallback to mock
  const student = session?.user
    ? {
        name: session.user.name || "Student",
        email: session.user.email || "",
        avatar: session.user.image || "/user-placeholder.svg",
        notifications: 3,
      }
    : {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/user-placeholder.svg",
        notifications: 3,
      };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/student" className="flex items-center ml-4 lg:ml-0">
              <Image
                src="/logo.svg"
                alt="Nirudhyog"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Mobile search button */}
            <button className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/student/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/sign-in" })}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
