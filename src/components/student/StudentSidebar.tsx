"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  User,
  // Settings, // Removed unused
  // Bell, // Removed unused
  X,
  Users,
} from "lucide-react";

interface StudentSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function StudentSidebar({
  isOpen,
  onToggle,
}: StudentSidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/student",
      icon: Home,
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
      name: "Profile",
      href: "/student/profile",
      icon: User,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
        fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => onToggle()}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`
                    mr-3 h-5 w-5 flex-shrink-0
                     ${active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"}
                  `}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Support section */}
            <div className="p-4 mt-auto border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Need Help?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
              Get support from our team or browse the knowledge base.
              </p>
              <a
              href="mailto:contact@nirudhyog.com"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
              contact@nirudhyog.com
              </a>
            </div>
            </div>
        </div>
      </aside>
    </>
  );
}
