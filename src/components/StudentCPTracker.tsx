"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  User,
  Star,
  Activity,
  Calendar,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";
import { apiGet, apiPost, handleApiResponse } from "../utils/apiClient";
import { API_ENDPOINTS, buildApiUrl } from "../config/urls";

interface PlatformData {
  username: string;
  problems_solved: number;
  rating: number;
  max_rating: number;
  contest_rating: number;
  global_ranking: number;
  country_ranking: number;
  last_active: Date | null;
  profile_verified: boolean;
  total_contests: number;
  best_rank: number;
  acceptance_rate: number;
}

interface CPTrackerProfile {
  id: string;
  leetcode_username: string | null;
  codeforces_username: string | null;
  codechef_username: string | null;
  atcoder_username: string | null;
  leetcode_data: PlatformData | null;
  codeforces_data: PlatformData | null;
  codechef_data: PlatformData | null;
  atcoder_data: PlatformData | null;
  is_active: boolean;
  performance_score: number;
  first_edit_completed: boolean;
  active_platforms: string[];
  last_updated: Date;
}

interface EditFormData {
  leetcode_username: string;
  codeforces_username: string;
  codechef_username: string;
  atcoder_username: string;
  reason: string;
}

export default function StudentCPTracker() {
  const [profile, setProfile] = useState<CPTrackerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    leetcode_username: "",
    codeforces_username: "",
    codechef_username: "",
    atcoder_username: "",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await apiGet(API_ENDPOINTS.CP_TRACKER.MY_PROFILE);
      const data = await handleApiResponse(response);

      setProfile(data.data);

      // Pre-fill edit form if profile exists
      if (data.data) {
        setEditFormData({
          leetcode_username: data.data.leetcode_username || "",
          codeforces_username: data.data.codeforces_username || "",
          codechef_username: data.data.codechef_username || "",
          atcoder_username: data.data.atcoder_username || "",
          reason: "",
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      // If 404, no profile exists yet - this is expected for new users
      if (error.message.includes("404")) {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile?.first_edit_completed) {
      // First time setup
      setSubmitting(true);
      try {
        const profileData = {
          leetcode_username: editFormData.leetcode_username.trim() || null,
          codeforces_username: editFormData.codeforces_username.trim() || null,
          codechef_username: editFormData.codechef_username.trim() || null,
          atcoder_username: editFormData.atcoder_username.trim() || null,
        };

        const response = await apiPost(
          API_ENDPOINTS.CP_TRACKER.UPDATE,
          profileData,
        );
        await handleApiResponse(response);

        alert("Profile updated successfully!");
        await loadProfile();
        setShowEditForm(false);
      } catch (error: any) {
        console.error("Error updating profile:", error);
        alert(`Error updating profile: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Request edit approval
      if (!editFormData.reason.trim()) {
        alert("Please provide a reason for the change");
        return;
      }

      setSubmitting(true);
      try {
        const response = await apiPost(
          API_ENDPOINTS.CP_TRACKER.REQUEST_EDIT,
          editFormData,
        );
        await handleApiResponse(response);

        alert(
          "Edit request submitted successfully! Please wait for admin approval.",
        );
        setShowEditForm(false);
        setEditFormData((prev) => ({ ...prev, reason: "" }));
      } catch (error: any) {
        console.error("Error submitting edit request:", error);
        alert(`Error submitting edit request: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      leetcode: "🟡",
      codeforces: "🔴",
      codechef: "🟤",
      atcoder: "🟣",
    };
    return icons[platform] || "⭐";
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPlatformUrl = (platform: string, username: string) => {
    const urls: Record<string, string> = {
      leetcode: `https://leetcode.com/u/${username}`,
      codeforces: `https://codeforces.com/profile/${username}`,
      codechef: `https://www.codechef.com/users/${username}`,
      atcoder: `https://atcoder.jp/users/${username}`,
    };
    return urls[platform];
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mr-3" />
            <span className="text-gray-600">Loading your CP profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && !showEditForm) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Setup Your CP Profile
            </h2>
            <p className="text-gray-600 mb-6">
              Configure your competitive programming platform accounts to start
              tracking your progress.
            </p>
            <button
              onClick={() => setShowEditForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Setup Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                My CP Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Track your competitive programming progress across platforms
              </p>
            </div>

            <button
              onClick={() => setShowEditForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" />
              {profile?.first_edit_completed
                ? "Request Edit"
                : "Update Profile"}
            </button>
          </div>
        </div>

        {profile && (
          <>
            {/* Status Banner */}
            {profile.first_edit_completed && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">
                      Profile Locked
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      You've completed your initial setup. Any further changes
                      require admin approval.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.performance_score}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Performance Score
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {profile.active_platforms.length}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Active Platforms
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {[
                      profile.leetcode_data,
                      profile.codeforces_data,
                      profile.codechef_data,
                      profile.atcoder_data,
                    ]
                      .filter(Boolean)
                      .reduce(
                        (sum, data) => sum + (data?.problems_solved || 0),
                        0,
                      )}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Total Problems
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      [
                        profile.leetcode_data,
                        profile.codeforces_data,
                        profile.codechef_data,
                        profile.atcoder_data,
                      ]
                        .filter(Boolean)
                        .reduce((sum, data) => sum + (data?.rating || 0), 0) /
                        profile.active_platforms.length,
                    ) || 0}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              </div>
            </div>

            {/* Platform Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* LeetCode */}
              {profile.leetcode_username && profile.leetcode_data && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getPlatformIcon("leetcode")}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          LeetCode
                        </h3>
                        <p className="text-gray-600">
                          @{profile.leetcode_username}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getPlatformUrl(
                        "leetcode",
                        profile.leetcode_username,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Problems Solved</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.leetcode_data.problems_solved}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.leetcode_data.rating}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CodeForces */}
              {profile.codeforces_username && profile.codeforces_data && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getPlatformIcon("codeforces")}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          CodeForces
                        </h3>
                        <p className="text-gray-600">
                          @{profile.codeforces_username}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getPlatformUrl(
                        "codeforces",
                        profile.codeforces_username,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.codeforces_data.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Max Rating</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.codeforces_data.max_rating}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CodeChef */}
              {profile.codechef_username && profile.codechef_data && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getPlatformIcon("codechef")}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          CodeChef
                        </h3>
                        <p className="text-gray-600">
                          @{profile.codechef_username}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getPlatformUrl(
                        "codechef",
                        profile.codechef_username,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.codechef_data.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Problems Solved</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.codechef_data.problems_solved}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* AtCoder */}
              {profile.atcoder_username && profile.atcoder_data && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getPlatformIcon("atcoder")}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          AtCoder
                        </h3>
                        <p className="text-gray-600">
                          @{profile.atcoder_username}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getPlatformUrl("atcoder", profile.atcoder_username)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.atcoder_data.rating}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Problems Solved</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {profile.atcoder_data.problems_solved}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Last Updated Info */}
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">
                <Calendar className="h-4 w-4 inline mr-1" />
                Last updated: {formatDate(profile.last_updated)}
              </p>
            </div>
          </>
        )}

        {/* Edit Form Modal/Overlay */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile?.first_edit_completed
                    ? "Request Profile Edit"
                    : "Setup Your CP Profile"}
                </h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Platform input fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-lg">🟡</span>
                      LeetCode Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.leetcode_username}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          leetcode_username: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Your LeetCode username"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-lg">🔴</span>
                      CodeForces Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.codeforces_username}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          codeforces_username: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Your CodeForces username"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-lg">🟤</span>
                      CodeChef Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.codechef_username}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          codechef_username: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Your CodeChef username"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-lg">🟣</span>
                      AtCoder Username
                    </label>
                    <input
                      type="text"
                      value={editFormData.atcoder_username}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          atcoder_username: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Your AtCoder username"
                    />
                  </div>
                </div>

                {/* Reason field for edit requests */}
                {profile?.first_edit_completed && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Change
                    </label>
                    <textarea
                      value={editFormData.reason}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Please explain why you need to update your profile"
                      required
                    />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting
                      ? "Submitting..."
                      : profile?.first_edit_completed
                        ? "Request Edit"
                        : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
