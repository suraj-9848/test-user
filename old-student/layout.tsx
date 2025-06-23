"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { ROLES } from "@/lib/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Menu, Close, Logout as LogoutIcon } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const authChecked = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide sidebar during test attempts
  const isTestAttempt =
    pathname.includes("/tests") && pathname.includes("/attempt");

  useEffect(() => {
    if (authChecked.current) return;

    if (!loading) {
      if (!isAuthenticated || !user) {
        router.replace("/login");
        return;
      }

      if (user.userRole !== ROLES.STUDENT) {
        router.replace("/login");
        return;
      }

      authChecked.current = true;
    }
  }, [user, isAuthenticated, loading, router]);

  const toggleSidebar = () => {
    if (!isTestAttempt) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f9fafb",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      );
    }

    if (!isAuthenticated || !user || user.userRole !== ROLES.STUDENT) {
      return null;
    }

    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
        {/* Mobile Sidebar Overlay */}
        {!isTestAttempt && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 40,
              display: { lg: "none" },
              transition: "opacity 0.3s ease-in-out",
              opacity: isSidebarOpen ? 1 : 0,
              pointerEvents: isSidebarOpen ? "auto" : "none",
            }}
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        {!isTestAttempt && (
          <Box
            component="aside"
            sx={{
              position: { xs: "fixed", lg: "fixed" },
              top: 0,
              bottom: 0,
              left: 0,
              width: { xs: 280, lg: 280 },
              bgcolor: "white",
              transform: {
                xs: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                lg: "none",
              },
              transition: "transform 0.3s ease-in-out",
              zIndex: 50,
              height: "100vh",
              overflowY: "auto",
              boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Link href="/student">
                <Image
                  src="/assets/logo.svg"
                  alt="Logo"
                  width={140}
                  height={48}
                  priority
                />
              </Link>
              <Box
                component="button"
                sx={{ display: { lg: "none" }, color: "#374151" }}
                onClick={toggleSidebar}
              >
                <Close fontSize="medium" />
              </Box>
            </Box>
            <Box component="nav" sx={{ mt: 4, pb: 4 }}>
              {[
                { href: "/student", label: "Dashboard" },
                { href: "/student/courses", label: "Courses" },
                { href: "/student/tests", label: "Tests" },
                { href: "/student/leaderboard", label: "LeaderBoard" },
                { href: "/student/results", label: "Results" },
                // { href: "/student/modules", label: "Modules" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Box
                    sx={{
                      px: 4,
                      py: 2.5,
                      mx: 2,
                      my: 0.5,
                      color: "#374151",
                      borderRadius: "8px",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        color: "#1f2937",
                      },
                      transition: "background-color 0.2s, color 0.2s",
                      ...(pathname === item.href && {
                        bgcolor: "#e5e7eb",
                        color: "#1f2937",
                        fontWeight: 600,
                      }),
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                </Link>
              ))}

              <Box
                onClick={handleLogout}
                sx={{
                  px: 4,
                  py: 2.5,
                  mx: 2,
                  my: 0.5,
                  color: "#ef4444",
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#fef2f2",
                    color: "#dc2626",
                  },
                  transition: "background-color 0.2s, color 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  Logout
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            ml: { lg: isTestAttempt ? 0 : "280px" },
          }}
        >
          {!isTestAttempt && (
            <Box
              component="header"
              sx={{
                bgcolor: "white",
                display: { lg: "none" },
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 3,
                }}
              >
                <Link href="/student">
                  <Image
                    src="/assets/logo.svg"
                    alt="Logo"
                    width={120}
                    height={40}
                    priority
                  />
                </Link>
                <Box
                  component="button"
                  onClick={toggleSidebar}
                  sx={{ color: "#374151" }}
                >
                  <Menu fontSize="medium" />
                </Box>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              flex: 1,
              p: { xs: 3, md: 3 },
              maxWidth: { lg: isTestAttempt ? "100%" : "calc(1880px - 280px)" },
              width: "100%",
              mx: { xs: "auto", lg: 0 },
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    );
  };

  return renderContent();
}
