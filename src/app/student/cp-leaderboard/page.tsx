"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Trophy, Loader2, RefreshCw } from "lucide-react";
import { CPTrackerAPI } from "../../../services/cpTrackerAPI";
import {
  CPTrackerProfile,
  CPTrackerLeaderboard,
} from "../../../types/cptracker";
import CPTrackerLeaderboardComponent from "../../../components/student/CPTrackerLeaderboard";

export default function CPTrackerLeaderboardPage() {
  const [profile, setProfile] = useState<CPTrackerProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<CPTrackerLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("");

  // Fetch user's CP profile
  const fetchProfile = async () => {
    try {
      const data = await CPTrackerAPI.getMyCPTracker();
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching CP profile:", error);
      // Don't show error toast for profile fetch in leaderboard page
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async (batchId?: string) => {
    try {
      setLoading(true);
      const data = await CPTrackerAPI.getCPTrackerLeaderboard({
        limit: 100,
        sortBy: "performance_score",
        sortOrder: "desc",
        batch: batchId || undefined,
      });
      setLeaderboard(data);
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      toast.error(error.message || "Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  // Handle batch change
  const handleBatchChange = async (batchId: string) => {
    setSelectedBatch(batchId);
    await fetchLeaderboard(batchId);
  };

  // Refresh leaderboard data
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProfile();
      await fetchLeaderboard(selectedBatch);
      toast.success("Leaderboard data refreshed!");
    } catch (error: any) {
      console.error("Error refreshing leaderboard:", error);
      toast.error(error.message || "Failed to refresh leaderboard");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading CP Tracker Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  CP Tracker Leaderboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Competitive programming rankings across all platforms
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="w-full">
          <CPTrackerLeaderboardComponent
            data={leaderboard}
            loading={loading}
            currentUserId={profile?.user_id}
            onBatchChange={handleBatchChange}
          />
        </div>
      </div>
    </div>
  );
}
