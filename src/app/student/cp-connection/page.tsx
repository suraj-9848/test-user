"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Code2,
  Trophy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Calendar,
  Medal,
} from "lucide-react";
import { CPTrackerAPI } from "../../../services/cpTrackerAPI";
import { CPTrackerProfile } from "../../../types/cptracker";
import CPTrackerConnectionForm from "../../../components/student/CPTrackerConnectionForm";
import Image from "next/image";

export default function CPConnectionPage() {
  const [profile, setProfile] = useState<CPTrackerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showConnectionForm, setShowConnectionForm] = useState(false);

  // Fetch user's CP profile
  const fetchProfile = async () => {
    try {
      const data = await CPTrackerAPI.getMyCPTracker();
      setProfile(data);

      if (!data) {
        setShowConnectionForm(true);
      }
    } catch (error: any) {
      console.error("Error fetching CP profile:", error);
      toast.error(error.message || "Failed to fetch your CP profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile connection
  const handleConnect = async (formData: any) => {
    try {
      setRefreshing(true);
      const newProfile = await CPTrackerAPI.connectCPTracker(formData);
      setProfile(newProfile);
      setShowConnectionForm(false);
      toast.success(
        "CP platforms connected successfully! Data will be updated shortly.",
      );
    } catch (error: any) {
      console.error("Error connecting CP platforms:", error);
      toast.error(error.message || "Failed to connect CP platforms");
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh profile data
  const handleRefresh = async () => {
    if (!profile) return;

    try {
      setRefreshing(true);
      await fetchProfile();
      toast.success("Profile data refreshed!");
    } catch (error: any) {
      console.error("Error refreshing profile:", error);
      toast.error(error.message || "Failed to refresh profile");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your CP Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-none">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  CP Connection
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your competitive programming platform connections
                </p>
              </div>
            </div>

            {profile && (
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
            )}
          </div>
        </div>

        {/* Content */}
        <div className="w-full">
          {!profile || showConnectionForm ? (
            <CPTrackerConnectionForm
              initialData={profile}
              onSubmit={handleConnect}
              loading={refreshing}
            />
          ) : (
            <CPTrackerProfileView
              profile={profile}
              onEdit={() => setShowConnectionForm(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Profile View Component
function CPTrackerProfileView({
  profile,
  onEdit,
}: {
  profile: CPTrackerProfile;
  onEdit: () => void;
}) {
  const getPlatformUrl = (platform: string, username?: string) => {
    if (!username) return "#";

    const urls = {
      leetcode: `https://leetcode.com/u/${username}/`,
      codeforces: `https://codeforces.com/profile/${username}`,
      codechef: `https://www.codechef.com/users/${username}`,
      atcoder: `https://atcoder.jp/users/${username}`,
    };

    return urls[platform as keyof typeof urls] || "#";
  };

  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6 w-full">
      {/* Performance Score Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Performance Score
          </h2>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            {Number(profile.performance_score || 0).toFixed(2)}
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {formatLastUpdated(profile.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* LeetCode */}
        {profile.active_platforms.includes("leetcode") &&
          profile.leetcode_username && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Image
                      src="/coding_profile_logo/leetcode.png"
                      alt="LeetCode"
                      height={200}
                      className=" h-full w-full object-cover"
                      width={200}
                    ></Image>
                  </div>
                  <h3 className="font-semibold text-gray-900">LeetCode</h3>
                </div>
                <a
                  href={getPlatformUrl("leetcode", profile.leetcode_username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contest Solved</span>
                  <span className="font-semibold">
                    {profile.leetcode_contest_solved_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Practice Solved</span>
                  <span className="font-semibold">
                    {profile.leetcode_practice_solved_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Rating</span>
                  <span className="font-semibold">
                    {profile.leetcode_current_rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contests</span>
                  <span className="font-semibold">
                    {profile.leetcode_contests_participated}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* CodeForces */}
        {profile.active_platforms.includes("codeforces") &&
          profile.codeforces_username && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Image
                      src="/coding_profile_logo/codeforces.png"
                      alt="CodeForces"
                      className=" h-full w-full object-cover"
                      height={200}
                      width={200}
                    ></Image>
                  </div>
                  <h3 className="font-semibold text-gray-900">CodeForces</h3>
                </div>
                <a
                  href={getPlatformUrl(
                    "codeforces",
                    profile.codeforces_username,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-semibold">
                    {profile.codeforces_rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Rating</span>
                  <span className="font-semibold">
                    {profile.codeforces_max_rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Problems Solved</span>
                  <span className="font-semibold">
                    {profile.codeforces_problems_solved}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* CodeChef */}
        {profile.active_platforms.includes("codechef") &&
          profile.codechef_username && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                    <Image
                      src="/coding_profile_logo/codechef.jpg"
                      alt="CodeChef"
                      height={200}
                      className=" h-full w-full object-cover"
                      width={200}
                    ></Image>
                  </div>
                  <h3 className="font-semibold text-gray-900">CodeChef</h3>
                </div>
                <a
                  href={getPlatformUrl("codechef", profile.codechef_username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-semibold">
                    {profile.codechef_rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Problems Solved</span>
                  <span className="font-semibold">
                    {profile.codechef_problems_solved}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stars</span>
                  <span className="font-semibold">
                    {profile.codechef_stars}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contests</span>
                  <span className="font-semibold">
                    {profile.codechef_contests_participated}
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Edit Profile Button */}
      <div className="text-center">
        <button
          onClick={onEdit}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          Edit Platforms
        </button>
      </div>
    </div>
  );
}
