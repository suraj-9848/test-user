"use client";

import { useEffect, useState, useRef } from "react";
import { useJWT } from "@/context/JWTContext";
import { useRouter } from "next/navigation";
// No need to import clearJwtEverywhere, we'll handle auth differently

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

interface LeaderboardEntry {
  userName: string;
  totalScore: number;
  percentage: number;
  courseName: string;
  totalMaxMarks: number;
  rank: number;
}

// interface LeaderboardResponse {
//   data: LeaderboardEntry[];
// }

export default function StudentLeaderboard() {
  const { jwt, setJwt } = useJWT();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const hasRedirected = useRef(false);
  const hasTriedRefresh = useRef(false);

  // Helper to clear JWT from all storage
  const clearJwtEverywhere = () => {
    setJwt(null);
    try {
      localStorage.removeItem("jwt"); // In case your context uses this
    } catch {}
    // If you use cookies for JWT, clear them here as well
    // document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Sync JWT from localStorage on tab focus or storage change, and set hydrated
  useEffect(() => {
    const syncJwtFromStorage = () => {
      const storedJwt = localStorage.getItem("jwt");
      if (storedJwt && storedJwt !== jwt) {
        setJwt(storedJwt);
      } else if (!storedJwt && jwt) {
        setJwt(null);
      }
      setHydrated(true);
      console.log("[Leaderboard] Hydrated, JWT:", storedJwt);
    };
    syncJwtFromStorage(); // run on mount
    window.addEventListener("storage", syncJwtFromStorage);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        syncJwtFromStorage();
      }
    });
    return () => {
      window.removeEventListener("storage", syncJwtFromStorage);
      window.removeEventListener("visibilitychange", syncJwtFromStorage);
    };
  }, [jwt, setJwt]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    if (!jwt) {
      setLeaderboard([]); // clear data
      setLoading(false);
      setError("You must be signed in to view the leaderboard.");
      console.log("[Leaderboard] No JWT, not authenticated");
      return;
    }
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/student/tests/leaderboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("[Leaderboard] Response status:", response.status);
        if (response.status === 304) {
          // Not Modified: do not update leaderboard, just stop loading
          setLoading(false);
          return;
        }
        if (response.status === 401) {
          if (!hasTriedRefresh.current) {
            hasTriedRefresh.current = true;
            const refreshRes = await fetch("/api/auth/refresh", {
              method: "POST",
              credentials: "include",
            });
            if (refreshRes.ok) {
              const { token: newToken } = await refreshRes.json();
              if (newToken) {
                setJwt(newToken);
                localStorage.setItem("jwt", newToken);
                await fetchLeaderboard();
                return;
              }
            }
          }
          // If refresh fails, clear and hard redirect
          clearJwtEverywhere();
          hasTriedRefresh.current = false;
          setError("Session expired. Please sign in again.");
          setTimeout(() => {
            if (
              window.location.pathname !== "/sign-in" &&
              window.location.pathname !== "/student/leaderboard"
            ) {
              window.location.replace("/sign-in");
            }
          }, 1200); // Show error for 1.2s before redirect
          return;
        }
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data = await response.json();
        if (cancelled) return;
        console.log("[Leaderboard] Data received:", data);
        const apiData = data.data || [];
        const sortedData = apiData.sort(
          (a: LeaderboardEntry, b: LeaderboardEntry) =>
            b.percentage - a.percentage,
        );
        const dataWithRanks = sortedData.map(
          (entry: LeaderboardEntry, index: number) => ({
            ...entry,
            rank: index + 1,
          }),
        );
        setLeaderboard(dataWithRanks);
      } catch (err: unknown) {
        console.error("Error fetching leaderboard:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load leaderboard";
        setError(errorMessage);

        // Error handling without clearJwtEverywhere call
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    return () => {
      cancelled = true;
      hasRedirected.current = false;
      hasTriedRefresh.current = false;
    };
  }, [jwt, setJwt, router, hydrated]);

  if (!hydrated) {
    return null; // or a loading spinner
  }

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 32,
          color: "#004AAD",
          marginBottom: 12,
        }}
      >
        Leaderboard
      </h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: 24,
          color: "#555",
          fontSize: 18,
        }}
      >
        Celebrate the top performers! Keep learning and climb the ranks.
      </p>
      <div
        style={{
          overflowX: "auto",
          borderRadius: 12,
          boxShadow: "0 4px 24px 0 rgba(0,74,173,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f6ff" }}>
              <th
                style={{
                  padding: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Rank
              </th>
              <th style={{ padding: 12, fontWeight: 700 }}>Student</th>
              <th style={{ padding: 12, fontWeight: 700 }}>Course</th>
              <th
                style={{
                  padding: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Score
              </th>
              <th
                style={{
                  padding: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Max Marks
              </th>
              <th
                style={{
                  padding: 12,
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  <span>Loading...</span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", color: "red", padding: 32 }}
                >
                  {error}
                </td>
              </tr>
            ) : leaderboard.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                  No leaderboard data available.
                </td>
              </tr>
            ) : (
              leaderboard.map((entry) => (
                <tr
                  key={entry.userName}
                  style={{
                    background:
                      entry.rank === 1
                        ? "#fffbe6"
                        : entry.rank === 2
                          ? "#f0f6ff"
                          : entry.rank === 3
                            ? "#f9f5ff"
                            : "inherit",
                    fontWeight: entry.rank <= 3 ? 600 : 400,
                  }}
                >
                  <td style={{ textAlign: "center", padding: 12 }}>
                    {entry.rank <= 3 ? (
                      <span
                        style={{
                          display: "inline-block",
                          minWidth: 36,
                          padding: "4px 12px",
                          borderRadius: 16,
                          background:
                            entry.rank === 1
                              ? "#FFD700"
                              : entry.rank === 2
                                ? "#C0C0C0"
                                : "#CD7F32",
                          color: "#222",
                          fontWeight: 700,
                        }}
                      >
                        {entry.rank}
                      </span>
                    ) : (
                      entry.rank
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#e3e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 18,
                          border:
                            entry.rank <= 3 ? "2px solid #004AAD" : undefined,
                          color: "#004AAD",
                        }}
                      >
                        {entry.userName[0]}
                      </div>
                      <span
                        style={{
                          fontWeight: entry.rank <= 3 ? 600 : 400,
                        }}
                      >
                        {entry.userName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}>{entry.courseName}</td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: 12,
                      fontWeight: 600,
                      color: "#004AAD",
                    }}
                  >
                    {entry.totalScore}
                  </td>
                  <td style={{ textAlign: "center", padding: 12 }}>
                    {entry.totalMaxMarks}
                  </td>
                  <td style={{ textAlign: "center", padding: 12 }}>
                    <span
                      style={{
                        display: "inline-block",
                        minWidth: 60,
                        padding: "4px 10px",
                        borderRadius: 16,
                        background:
                          entry.percentage >= 80
                            ? "#d1fae5"
                            : entry.percentage >= 50
                              ? "#fef9c3"
                              : "#f3f4f6",
                        color:
                          entry.percentage >= 80
                            ? "#059669"
                            : entry.percentage >= 50
                              ? "#b45309"
                              : "#374151",
                        fontWeight: 600,
                      }}
                    >
                      {entry.percentage.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
