"use client";

import React, { useState, useEffect, useRef } from "react";
import { useJWT } from "@/context/JWTContext";
import { apiGet } from "@/utils/axiosInterceptor";
import { API_ENDPOINTS } from "@/config/urls";

interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  percentage: number;
  rank?: number;
}

export default function StudentLeaderboard() {
  const { jwt } = useJWT();
  const [hydrated, setHydrated] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Hydration effect
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fetch leaderboard data
  useEffect(() => {
    if (!hydrated) return;

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (!jwt) {
      setLeaderboard([]);
      setLoading(false);
      setError("You must be signed in to view the leaderboard.");
      console.log("[Leaderboard] No JWT, not authenticated");
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("[Leaderboard] Fetching data...");

        const response = await apiGet(API_ENDPOINTS.STUDENT.LEADERBOARD, {
          signal, // Pass abort signal for cancellation
        });

        // Check if request was cancelled
        if (signal.aborted) {
          console.log("[Leaderboard] Request was cancelled");
          return;
        }

        console.log("[Leaderboard] Response received:", response);

        if (!response || !response.data) {
          throw new Error("No data received from server");
        }

        // Backend returns {message, data} structure, so we need response.data.data
        const apiData = response.data.data || response.data || [];

        console.log("[Leaderboard] Extracted data:", apiData);

        // Ensure apiData is an array before sorting
        if (!Array.isArray(apiData)) {
          console.warn("[Leaderboard] API data is not an array:", apiData);
          setLeaderboard([]);
          return;
        }

        // Handle empty leaderboard
        if (apiData.length === 0) {
          console.log("[Leaderboard] No leaderboard data available");
          setLeaderboard([]);
          return;
        }

        // Sort by score/percentage
        const sortedData = apiData.sort(
          (a: LeaderboardEntry, b: LeaderboardEntry) =>
            b.percentage - a.percentage || b.score - a.score,
        );

        // Add rank to each entry
        const dataWithRanks = sortedData.map(
          (entry: LeaderboardEntry, index: number) => ({
            ...entry,
            rank: index + 1,
          }),
        );

        setLeaderboard(dataWithRanks);
        console.log(
          "[Leaderboard] Data processed successfully:",
          dataWithRanks,
        );
      } catch (err) {
        // Don't show error if request was cancelled
        if (signal.aborted) return;

        console.error("Error fetching leaderboard:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load leaderboard";
        setError(errorMessage);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    // Cleanup function to cancel request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [jwt, hydrated]);

  // Show loading state during hydration
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
          <p className="mt-2 text-gray-600">
            See how you rank among all students based on test performance
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading leaderboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-red-600 font-medium">
                  Error loading leaderboard
                </p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-gray-400 mb-2">📊</div>
                <p className="text-gray-600">No leaderboard data available.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Complete some tests to see rankings!
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 transition-colors"
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
                          <span className="text-sm font-medium text-gray-900">
                            #{entry.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-medium">
                              {entry.userName
                                ? entry.userName[0].toUpperCase()
                                : "?"}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.userName || "Anonymous"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.score || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {Math.round((entry.percentage || 0) * 100) / 100}%
                          </div>
                          <div className="ml-3 w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, entry.percentage || 0)}%`,
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
          )}
        </div>

        {/* Footer Info */}
        {leaderboard.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Rankings are based on overall test performance across all courses
            </p>
            <p className="mt-1">
              Data updates in real-time as tests are completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
