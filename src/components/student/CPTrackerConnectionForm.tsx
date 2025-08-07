"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Code2, ExternalLink, Loader2, Check, AlertCircle } from "lucide-react";

interface CPTrackerConnectionFormData {
  leetcode_username: string;
  codeforces_username: string;
  codechef_username: string;
  atcoder_username: string;
}

interface CPTrackerConnectionFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function CPTrackerConnectionForm({
  initialData,
  onSubmit,
  loading = false,
}: CPTrackerConnectionFormProps) {
  const [formData, setFormData] = useState<CPTrackerConnectionFormData>({
    leetcode_username: initialData?.leetcode_username || "",
    codeforces_username: initialData?.codeforces_username || "",
    codechef_username: initialData?.codechef_username || "",
    atcoder_username: initialData?.atcoder_username || "",
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    initialData?.active_platforms || [],
  );

  const [errors, setErrors] = useState<Partial<CPTrackerConnectionFormData>>(
    {},
  );

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        leetcode_username: initialData.leetcode_username || "",
        codeforces_username: initialData.codeforces_username || "",
        codechef_username: initialData.codechef_username || "",
        atcoder_username: initialData.atcoder_username || "",
      });
      setSelectedPlatforms(initialData.active_platforms || []);
    }
  }, [initialData]);

  const platforms = [
    {
      key: "leetcode",
      name: "LeetCode",
      icon: "LC",
      color: "bg-orange-500",
      description: "Track your algorithm problem solving",
      placeholder: "Enter your LeetCode username",
      profileUrl: "https://leetcode.com/u/",
      profileUrlSuffix: "/",
      comingSoon: false,
    },
    {
      key: "codeforces",
      name: "CodeForces",
      icon: "CF",
      color: "bg-blue-600",
      description: "Monitor competitive programming contests",
      placeholder: "Enter your CodeForces handle",
      profileUrl: "https://codeforces.com/profile/",
      profileUrlSuffix: "",
      comingSoon: false,
    },
    {
      key: "codechef",
      name: "CodeChef",
      icon: "CC",
      color: "bg-amber-600",
      description: "Track contests and problems",
      placeholder: "Enter your CodeChef username",
      profileUrl: "https://www.codechef.com/users/",
      profileUrlSuffix: "",
      comingSoon: false,
    },
    {
      key: "atcoder",
      name: "AtCoder",
      icon: "AT",
      color: "bg-green-600",
      description: "Japanese competitive programming (Coming Soon)",
      placeholder: "Coming Soon...",
      profileUrl: "https://atcoder.jp/users/",
      profileUrlSuffix: "",
      comingSoon: true,
    },
  ];

  const handleInputChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [`${platform}_username`]: value,
    }));

    // Clear error when user starts typing
    if (errors[`${platform}_username` as keyof CPTrackerConnectionFormData]) {
      setErrors((prev) => ({
        ...prev,
        [`${platform}_username`]: undefined,
      }));
    }
  };

  const handlePlatformToggle = (platform: string) => {
    // Check if platform is coming soon (AtCoder)
    const platformConfig = platforms.find((p) => p.key === platform);
    if (platformConfig?.comingSoon) {
      toast.error(`${platformConfig.name} is coming soon!`);
      return;
    }

    // Check if user is trying to disconnect an already connected platform
    if (initialData && initialData.active_platforms?.includes(platform)) {
      const existingUsername = initialData[`${platform}_username`];
      if (existingUsername && selectedPlatforms.includes(platform)) {
        toast.error(
          `You cannot disconnect ${platformConfig?.name}. Contact admin to make changes.`,
        );
        return;
      }
    }

    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        // Remove platform
        const newSelected = prev.filter((p) => p !== platform);

        // Clear the username when platform is deselected
        setFormData((prevData) => ({
          ...prevData,
          [`${platform}_username`]: "",
        }));

        return newSelected;
      } else {
        // Add platform
        return [...prev, platform];
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CPTrackerConnectionFormData> = {};

    // Check that at least one platform is selected
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return false;
    }

    // Validate usernames for selected platforms (exclude coming soon platforms)
    selectedPlatforms.forEach((platform) => {
      const platformConfig = platforms.find((p) => p.key === platform);
      if (platformConfig?.comingSoon) return; // Skip validation for coming soon platforms

      const usernameKey =
        `${platform}_username` as keyof CPTrackerConnectionFormData;
      const username = formData[usernameKey];

      if (!username || username.trim().length === 0) {
        newErrors[usernameKey] = `${platform} username is required`;
      } else if (username.trim().length < 3) {
        newErrors[usernameKey] =
          `${platform} username must be at least 3 characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...formData,
      active_platforms: selectedPlatforms.filter((platform) => {
        const platformConfig = platforms.find((p) => p.key === platform);
        return !platformConfig?.comingSoon; // Exclude coming soon platforms
      }),
    };

    // Clean up usernames for non-selected platforms and coming soon platforms
    platforms.forEach((platform) => {
      if (!selectedPlatforms.includes(platform.key) || platform.comingSoon) {
        const usernameKey =
          `${platform.key}_username` as keyof CPTrackerConnectionFormData;
        submissionData[usernameKey] = "";
      }
    });

    try {
      await onSubmit(submissionData);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Code2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Connect Your CP Platforms
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Link your competitive programming accounts to track your progress
            across platforms. Select the platforms you use and enter your
            usernames.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.key);
              const usernameKey =
                `${platform.key}_username` as keyof CPTrackerConnectionFormData;
              const hasError = errors[usernameKey];
              const isAlreadyConnected =
                initialData?.active_platforms?.includes(platform.key) &&
                initialData[usernameKey];
              const isComingSoon = platform.comingSoon;

              return (
                <div
                  key={platform.key}
                  className={`relative p-6 border-2 rounded-xl transition-all ${
                    isComingSoon
                      ? "border-gray-200 bg-gray-50 opacity-60"
                      : isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Coming Soon Badge */}
                  {isComingSoon && (
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                      Coming Soon
                    </div>
                  )}

                  {/* Already Connected Badge */}
                  {isAlreadyConnected && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                      <Check className="h-3 w-3" />
                      <span>Connected</span>
                    </div>
                  )}

                  {/* Platform Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center ${isComingSoon ? "opacity-50" : ""}`}
                      >
                        <span className="text-white font-bold text-sm">
                          {platform.icon}
                        </span>
                      </div>
                      <div>
                        <h3
                          className={`font-semibold ${isComingSoon ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {platform.name}
                        </h3>
                        <p
                          className={`text-sm ${isComingSoon ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {platform.description}
                        </p>
                      </div>
                    </div>

                    {/* Platform Toggle */}
                    {!isComingSoon && (
                      <button
                        type="button"
                        onClick={() => handlePlatformToggle(platform.key)}
                        disabled={isAlreadyConnected}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isSelected ? "bg-blue-600" : "bg-gray-300"
                        } ${isAlreadyConnected ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isSelected ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Username Input */}
                  {isSelected && !isComingSoon && (
                    <div>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData[usernameKey]}
                          onChange={(e) =>
                            handleInputChange(platform.key, e.target.value)
                          }
                          placeholder={platform.placeholder}
                          disabled={isAlreadyConnected}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            hasError
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-300 focus:border-blue-500"
                          } ${isAlreadyConnected ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                        {formData[usernameKey] && (
                          <a
                            href={`${platform.profileUrl}${formData[usernameKey]}${platform.profileUrlSuffix}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title={`Visit ${platform.name} profile`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      {hasError && (
                        <div className="flex items-center space-x-2 mt-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">{hasError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Make sure your profiles are public for data collection
                  </li>
                  <li>Data will be updated automatically via scheduled jobs</li>
                  <li>
                    <strong>
                      Once connected, platforms cannot be disconnected.
                    </strong>{" "}
                    Contact admin for changes.
                  </li>
                  <li>
                    You can add new platforms anytime, but cannot modify
                    existing connections
                  </li>
                  <li>
                    Performance scores are calculated based on all connected
                    platforms
                  </li>
                  <li>AtCoder integration is coming soon!</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading || selectedPlatforms.length === 0}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {loading
                  ? "Connecting..."
                  : initialData
                    ? "Update Connections"
                    : "Connect Platforms"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
