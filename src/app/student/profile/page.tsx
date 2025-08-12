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
  Crown,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useJWT } from "@/context/JWTContext";
import {
  subscriptionService,
  ProPlan,
  ProSubscription,
} from "@/services/subscriptionService";
import { usePro } from "@/context/usePro";

// API Configuration
const BACKEND_BASE_URL =
  (process.env.NEXT_PUBLIC_BACKEND_BASE_URL as string) ||
  "http://localhost:3000";

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

  // Pro subscription state (in-dashboard)
  const [plans, setPlans] = useState<ProPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<ProSubscription | null>(null);
  const [proLoading, setProLoading] = useState<boolean>(true);
  const [proError, setProError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  // Unknown flag to hide CTAs until status is known
  const [proUnknown, setProUnknown] = useState<boolean>(true);
  // Track Pro status and expiry for UI (local cache fallback)
  const [isProUserLocal, setIsProUserLocal] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isProUser") === "1";
  });
  const [proExpiresAtLocal, setProExpiresAtLocal] = useState<string | null>(
    () => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("proExpiresAt") || null;
    },
  );

  // Global Pro context (source of truth)
  const { isProUser: isProUserCtx, expiresAt: proExpiresAtCtx } = usePro();

  const proActive =
    isProUserCtx || isProUserLocal || currentSubscription?.status === "active";
  const proActiveUI =
    proActive || (proError?.toLowerCase().includes("already pro") ?? false);
  const proExpiresDisplay = proExpiresAtCtx || proExpiresAtLocal || undefined;

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
        const data = await api.get("/api/student/dashboard/stats");
        setProfileStats(data?.data || null);
      } catch (err) {
        console.error("Error fetching profile stats:", err);
        setError("Failed to load profile stats");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileStats();
  }, [jwt]);

  // Fetch Pro info (plans + current subscription)
  useEffect(() => {
    const loadPro = async () => {
      setProLoading(true);
      setProUnknown(true);
      setProError(null);
      try {
        // Always fetch public plans
        const availablePlans = await subscriptionService.getAvailablePlans();
        setPlans(availablePlans);

        // Always fetch current subscription (uses credentials/cookies under the hood)
        const sub = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(sub.subscription);
        setIsProUserLocal(!!sub.isProUser);
        setProExpiresAtLocal(
          sub.expiresAt || sub.subscription?.expiresAt || null,
        );
      } catch (e: any) {
        console.warn("Pro section load failed:", e?.message || e);
        setProError("Unable to load Pro details right now.");
      } finally {
        setProLoading(false);
        setProUnknown(false);
      }
    };

    loadPro();
    // Optionally refresh when tab becomes visible
    const onVis = () => {
      if (document.visibilityState === "visible") {
        loadPro();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Keep local cache in sync with global context
  useEffect(() => {
    try {
      setIsProUserLocal(!!isProUserCtx);
      if (proExpiresAtCtx) setProExpiresAtLocal(proExpiresAtCtx);
    } catch {}
  }, [isProUserCtx, proExpiresAtCtx]);

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

  // Subscribe from dashboard (compact flow)
  const subscribeToPlan = async (plan: ProPlan) => {
    // If status unknown, refresh first to avoid duplicate order errors
    if (proUnknown) {
      try {
        const sub = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(sub.subscription);
        setIsProUserLocal(!!sub.isProUser);
        setProExpiresAtLocal(
          sub.expiresAt || sub.subscription?.expiresAt || null,
        );
      } catch {}
    }

    // Do not allow purchase if already Pro
    if (proActiveUI) {
      const expiryText =
        proExpiresAtCtx || currentSubscription?.expiresAt
          ? new Date(
              (proExpiresAtCtx || currentSubscription!.expiresAt) as string,
            ).toLocaleDateString()
          : "current period";
      setProError(`You're already Pro (expires on ${expiryText}).`);
      return;
    }

    try {
      setProcessingPlanId(plan.id);
      setProError(null);
      const subscription = await subscriptionService.processPayment(plan);
      setCurrentSubscription(subscription);
      // Reload pro details
      const sub = await subscriptionService.getCurrentSubscription();
      setCurrentSubscription(sub.subscription);
      setIsProUserLocal(!!sub.isProUser);
      setProExpiresAtLocal(
        sub.expiresAt || sub.subscription?.expiresAt || null,
      );
      // Clear flags
      sessionStorage.removeItem("selectedPlanAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");
    } catch (err: any) {
      console.error("Profile subscribe error:", err);
      const msg: string = err?.message || "";
      if (
        msg.toLowerCase().includes("already") &&
        msg.toLowerCase().includes("subscription")
      ) {
        try {
          const sub = await subscriptionService.getCurrentSubscription();
          setCurrentSubscription(sub.subscription);
          setIsProUserLocal(!!sub.isProUser);
          setProExpiresAtLocal(
            sub.expiresAt || sub.subscription?.expiresAt || null,
          );
          const expiryText =
            sub.expiresAt || sub.subscription?.expiresAt
              ? new Date(
                  (sub.expiresAt || sub.subscription!.expiresAt) as string,
                ).toLocaleDateString()
              : "current period";
          setProError(`You're already Pro (expires on ${expiryText}).`);
        } catch (_) {
          setProError("You're already Pro.");
        }
      } else {
        setProError(err?.message || "Payment failed. Please try again.");
      }
    } finally {
      setProcessingPlanId(null);
    }
  };

  const alreadyProBanner =
    (!currentSubscription && (isProUserCtx || isProUserLocal)) ||
    currentSubscription?.status === "active" ? (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Pro Active</h3>
              <p className="text-sm text-gray-600">
                {proExpiresAtCtx || currentSubscription?.expiresAt
                  ? `Expires on ${new Date(
                      (proExpiresAtCtx ||
                        currentSubscription!.expiresAt) as string,
                    ).toLocaleDateString()}`
                  : "Current period"}
              </p>
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            ACTIVE
          </div>
        </div>
      </div>
    ) : null;

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
              {/* Show Pro badge if active */}
              {proActiveUI && (
                <span className="inline-flex items-center bg-yellow-400/20 border border-yellow-300/40 text-yellow-100 px-3 py-1 rounded-full mr-2">
                  <Crown className="w-4 h-4 mr-1 text-yellow-300" />
                  Pro Active
                </span>
              )}
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
              <div
                className={
                  `w-24 h-24 rounded-full overflow-hidden border-4 ` +
                  (proActiveUI
                    ? "ring-2 ring-yellow-400 border-yellow-300"
                    : "border-white/20")
                }
              >
                <Image
                  src={displayAvatar}
                  alt={editedProfile.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {proActiveUI && (
                <div className="absolute -top-1 -right-1 bg-yellow-100 text-yellow-800 rounded-full p-[2px] border border-yellow-300 shadow-sm">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}
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

      {/* Make following sections scrollable within page layout */}
      <div className="space-y-6 pb-24">
        {/* Pro subscription section inside dashboard */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Nirudhyog Pro
                </h3>
              </div>

              {currentSubscription ? (
                <p className="text-gray-700">
                  You have an active Pro subscription. Expires on
                  <span className="font-medium">
                    {" "}
                    {new Date(
                      currentSubscription.expiresAt,
                    ).toLocaleDateString()}
                  </span>
                  .
                </p>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Get the competitive edge with these Pro benefits:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> 24-Hour
                      Early Job Access
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> Premium
                      Profile Badge
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> Priority
                      Support
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> Advanced
                      Analytics
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> Resume
                      Review
                    </li>
                    <li className="flex items-center">
                      <Zap className="w-4 h-4 text-blue-500 mr-2" /> Enhanced
                      Profile
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Plans / CTA */}
            <div className="w-full md:w-96">
              {proLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : proActiveUI ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                    Pro is active. Expires on
                    <span className="ml-1 font-medium">
                      {" "}
                      {new Date(
                        (proExpiresDisplay ||
                          currentSubscription?.expiresAt) as string,
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              ) : proUnknown ? (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700">
                  Checking your Pro status...
                </div>
              ) : (
                <div className="space-y-3">
                  {proError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                      {proError}
                    </div>
                  )}
                  {(plans || []).length === 0 ? (
                    <div className="text-gray-500">
                      No plans available right now.
                    </div>
                  ) : (
                    (plans || []).map((plan) => (
                      <div
                        key={plan.id}
                        className="border rounded-xl p-4 hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {plan.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {plan.duration_months} month
                              {plan.duration_months > 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {plan.currency} {plan.price}
                            </div>
                            <button
                              disabled={
                                processingPlanId === plan.id ||
                                proActiveUI ||
                                proUnknown
                              }
                              onClick={() => subscribeToPlan(plan)}
                              className="mt-2 inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                              title={
                                proUnknown
                                  ? "Checking your Pro status..."
                                  : proActiveUI
                                    ? "You already have an active Pro subscription"
                                    : undefined
                              }
                            >
                              {processingPlanId === plan.id
                                ? "Processing..."
                                : proUnknown
                                  ? "Checking..."
                                  : proActiveUI
                                    ? "Already Pro"
                                    : "Go Pro"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Link to full Pro page in Hiring if needed */}
                  <a
                    href="/hiring?tab=pro"
                    className="block text-sm text-blue-600 hover:underline text-right"
                  >
                    See full Pro details
                  </a>
                </div>
              )}
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
    </div>
  );
}
