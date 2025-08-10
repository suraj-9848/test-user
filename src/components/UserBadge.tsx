// components/UserBadge.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { usePro } from "@/context/usePro";

interface UserBadgeProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const UserBadge: React.FC<UserBadgeProps> = ({ user }) => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";
  const { isProUser, expiresAt, refresh } = usePro();

  // Eagerly sync Pro on mount (useful after checkout)
  useEffect(() => {
    refresh().catch(() => {});
    const onVis = () => {
      if (document.visibilityState === "visible") {
        refresh().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refresh]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group"
      >
        <div className="relative">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile"
              width={32}
              height={32}
              className={`rounded-full object-cover ring-2 ${
                isProUser ? "ring-yellow-400" : "ring-gray-200"
              } group-hover:ring-violet-300 transition-all duration-200`}
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-full ${
                isProUser
                  ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                  : "bg-gradient-to-br from-violet-500 to-indigo-500"
              } flex items-center justify-center text-white font-semibold text-sm ring-2 ${
                isProUser ? "ring-yellow-400" : "ring-gray-200"
              } group-hover:ring-violet-300 transition-all duration-200`}
            >
              {userInitial}
            </div>
          )}
          {/* Online dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          {/* Pro crown overlay */}
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
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50 animate-scale-in">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {userInitial}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  {isProUser && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                      <Crown className="w-3 h-3" /> Pro
                    </span>
                  )}
                </div>
                <p className="text-xs break-all text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <button
              onClick={() => router.push("/student/profile")}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
            >
              <FiUser className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
              View Profile
            </button>
            <button
              onClick={() => router.push("/student")}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
            >
              <FiSettings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-gray-500" />
              Dashboard
            </button>
          </div>
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 group"
            >
              <FiLogOut />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadge;
