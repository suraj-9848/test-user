"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Award,
  BookOpen,
  Trophy,
  Target,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";

// API Configuration
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create API wrapper for consistency
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },
};

interface ProfileStats {
  rank: number;
  score: number;
  percentage: number;
  coursesCompleted: number;
  coursesEnrolled: number;
  memberSince?: string;
}

export default function StudentProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile">("profile");
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const { data: session } = useSession();
  const { jwt } = useJWT();
  const name = session?.user?.name || "";
  const email = session?.user?.email || "";
  const avatar = session?.user?.image || "/user-placeholder.svg";

  // Always use JWT user data for display if available
  const displayName = name;
  const displayEmail = email;
  const displayAvatar = avatar;

  const [editedProfile, setEditedProfile] = useState({
    name: displayName,
    email: displayEmail,
    avatar: displayAvatar,
  });

  // Fetch profile stats from backend
  useEffect(() => {
    if (!jwt) {
      setLoading(false);
      return;
    }

    const fetchProfileStats = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch courses data
        const coursesResponse = await api.get("/api/student/courses");
        const coursesEnrolled = coursesResponse.length;
        interface Course {
          status: string;
          progress: number;
        }

        const coursesCompleted = coursesResponse.filter(
          (course: Course) =>
            course.status === "completed" || course.progress >= 100,
        ).length;

        // Try to get leaderboard data for rank and score
        let rank = 0;
        let score = 0;
        let percentage = 0;

        try {
          // TODO: Replace with dedicated user stats endpoint
          // For now, set default values - will be updated when proper endpoint is available
          rank = 0; // Default rank
          score = 0; // Default score
          percentage = 0; // Default percentage
        } catch (leaderboardError) {
          console.log("Leaderboard data not available:", leaderboardError);
        }

        setProfileStats({
          rank,
          score,
          percentage,
          coursesCompleted,
          coursesEnrolled,
          memberSince: new Date().toLocaleDateString(), // Could be from user creation date if available from backend
        });
      } catch (err: unknown) {
        console.error("Error fetching profile stats:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load profile data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [jwt, session?.user?.name, session?.user?.email]);

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
    // For now, we only update local state since we're using Google Auth
  };

  const handleCancel = () => {
    setEditedProfile({
      name: displayName,
      email: displayEmail,
      avatar: displayAvatar,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatar = e.target?.result as string;
        setEditedProfile((prev) => ({ ...prev, avatar: newAvatar }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">
                Error Loading Profile
              </h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-32"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                <Image
                  src={displayAvatar}
                  alt={editedProfile.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">{displayName}</h2>
              <div className="flex items-center space-x-6 text-blue-100">
                {profileStats && profileStats.rank > 0 && (
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>Rank #{profileStats.rank}</span>
                  </div>
                )}
                {profileStats && profileStats.score > 0 && (
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{profileStats.score} score</span>
                  </div>
                )}
                {profileStats && (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      {profileStats.coursesCompleted}/
                      {profileStats.coursesEnrolled} courses
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[{ id: "profile", label: "Profile", icon: User }].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "profile")}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                        title="Name is managed by Google Auth and cannot be edited here"
                      />
                    ) : (
                      <p className="text-gray-900">{displayName}</p>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        Name is managed by your Google account
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled
                        title="Email is managed by Google Auth and cannot be edited here"
                      />
                    ) : (
                      <p className="text-gray-900">{displayEmail}</p>
                    )}
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">
                        Email is managed by your Google account
                      </p>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Learning Statistics
                  </h3>

                  {profileStats && (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              Current Rank
                            </p>
                            <p className="text-2xl font-bold text-blue-900">
                              {profileStats.rank > 0
                                ? `#${profileStats.rank}`
                                : "Not ranked yet"}
                            </p>
                          </div>
                          <Trophy className="w-8 h-8 text-blue-600" />
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-600">
                              Test Score
                            </p>
                            <p className="text-2xl font-bold text-green-900">
                              {profileStats.score}
                            </p>
                          </div>
                          <Target className="w-8 h-8 text-green-600" />
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-yellow-600">
                              Average %
                            </p>
                            <p className="text-2xl font-bold text-yellow-900">
                              {profileStats.percentage}%
                            </p>
                          </div>
                          <Award className="w-8 h-8 text-yellow-600" />
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-600">
                              Courses Progress
                            </p>
                            <p className="text-2xl font-bold text-purple-900">
                              {profileStats.coursesCompleted}/
                              {profileStats.coursesEnrolled}
                            </p>
                          </div>
                          <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {profileStats?.memberSince ||
                        new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
