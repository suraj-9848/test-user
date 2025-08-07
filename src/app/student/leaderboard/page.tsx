"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJWT } from "@/context/JWTContext";
import { apiGet } from "@/utils/axiosInterceptor";
import { API_ENDPOINTS } from "@/config/urls";
import { getUserFromJWT } from "@/utils";

interface LeaderboardEntry {
  id: string;
  userName: string;
  courseName: string;
  score: number;
  totalScore: number;
  totalMaxMarks: number;
  percentage: number;
  rank: number;
}

interface UserPosition {
  entry: LeaderboardEntry | null;
  found: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function StudentLeaderboard() {
  const { jwt } = useJWT();
  const [hydrated, setHydrated] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userPosition, setUserPosition] = useState<UserPosition>({
    entry: null,
    found: false,
  });
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hydration effect
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    if (!hydrated) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (!jwt) {
      setLeaderboard([]);
      setUserPosition({ entry: null, found: false });
      setLoading(false);
      setError("Please sign in to view the leaderboard.");
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        // Get current user info from JWT
        const currentUser = getUserFromJWT(jwt);
        const currentUserId = currentUser?.id;

        // Fetch leaderboard data with user position if user ID is available
        const apiUrl = currentUserId
          ? `${API_ENDPOINTS.STUDENT.LEADERBOARD}?page=${currentPage}&userId=${currentUserId}&getUserPosition=true`
          : `${API_ENDPOINTS.STUDENT.LEADERBOARD}?page=${currentPage}`;

        const response = await apiGet(apiUrl, { signal });

        if (signal.aborted) return;

        if (!response || !response.data) {
          throw new Error("No data received from server");
        }

        const { data, pagination, userPosition } = response.data;

        if (!Array.isArray(data)) {
          setLeaderboard([]);
          setPagination(null);
          setUserPosition({ entry: null, found: false });
          return;
        }

        setLeaderboard(data);
        setPagination(pagination);

        // Set user position if available
        if (userPosition) {
          setUserPosition({ entry: userPosition, found: true });
        } else {
          // Check if current user is in the current page as fallback
          const userInCurrentPage = data.find(
            (entry) => entry.id === currentUserId,
          );
          setUserPosition({
            entry: userInCurrentPage || null,
            found: !!userInCurrentPage,
          });
        }
      } catch (err) {
        if (signal.aborted) return;
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load leaderboard";
        setError(errorMessage);
        setUserPosition({ entry: null, found: false });
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [jwt, hydrated, currentPage]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            🏆 Student Leaderboard
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress and see how you rank among other students based
            on test performance
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* User Position Card */}
          {userPosition.found && userPosition.entry && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    🎯 Your Position
                  </h3>
                  <p className="text-sm text-blue-700">
                    Track your current ranking among all students
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        {userPosition.entry.rank === 1 && (
                          <span className="text-3xl">🥇</span>
                        )}
                        {userPosition.entry.rank === 2 && (
                          <span className="text-3xl">🥈</span>
                        )}
                        {userPosition.entry.rank === 3 && (
                          <span className="text-3xl">🥉</span>
                        )}
                        {userPosition.entry.rank > 3 && (
                          <span className="text-2xl font-bold text-blue-600">
                            #{userPosition.entry.rank}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">Rank</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900">
                        {userPosition.entry.score}/
                        {userPosition.entry.totalMaxMarks}
                      </p>
                      <p className="text-xs text-blue-600 font-medium">Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-900">
                        {Math.round(userPosition.entry.percentage * 100) / 100}%
                      </p>
                      <p className="text-xs text-blue-600 font-medium">
                        Percentage
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-blue-700 mb-2">
                  <span>Performance</span>
                  <span>
                    {Math.round(userPosition.entry.percentage * 100) / 100}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, userPosition.entry.percentage)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 font-medium">
                    Loading leaderboard...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-red-500 text-3xl mb-4">⚠️</div>
                  <p className="text-red-600 font-semibold text-lg">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-gray-400 text-3xl mb-4">📊</div>
                  <p className="text-gray-600 font-semibold text-lg">
                    No leaderboard data available
                  </p>
                  <p className="text-gray-500 mt-2">
                    Complete some tests to see your ranking!
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leaderboard.map((entry) => (
                        <tr
                          key={entry.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {entry.rank === 1 && (
                                <span className="text-2xl mr-2">🥇</span>
                              )}
                              {entry.rank === 2 && (
                                <span className="text-2xl mr-2">🥈</span>
                              )}
                              {entry.rank === 3 && (
                                <span className="text-2xl mr-2">🥉</span>
                              )}
                              <span className="text-sm font-semibold text-gray-900">
                                #{entry.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {entry.userName || "Anonymous"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {entry.courseName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entry.score}/{entry.totalMaxMarks}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {Math.round(entry.percentage * 100) / 100}%
                              </div>
                              <div className="ml-4 w-24 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min(100, entry.percentage)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Showing {leaderboard.length} of {pagination.totalItems}{" "}
                      entries
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={!pagination.hasPreviousPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <div className="px-4 py-2 text-sm font-medium text-gray-700">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </div>
                      <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Info */}
        {leaderboard.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
            <p>
              Rankings are based on overall test performance across all courses
            </p>
            <p>Data updates in real-time as tests are completed</p>
          </div>
        )}
      </div>
    </div>
  );
}
