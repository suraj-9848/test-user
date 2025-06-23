"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Award,
  BookOpen,
  Trophy,
  Target,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth: string;
  location: string;
  bio: string;
  joinedDate: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  totalPoints: number;
  currentRank: number;
  skills: string[];
  interests: string[];
  achievements: Achievement[];
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: "public" | "private" | "friends";
      showProgress: boolean;
      showAchievements: boolean;
    };
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: string;
}

export default function StudentProfile() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "preferences" | "achievements"
  >("profile");

  // Always use session user data for name, email, avatar if available
  const userName = session?.user?.name || "John Doe";
  const userEmail = session?.user?.email || "john.doe@example.com";
  const userAvatar = session?.user?.image || "/user.jpg";

  // Mock profile data - replace with actual API call
  const [profile, setProfile] = useState<StudentProfile>({
    id: "1",
    name: userName,
    email: userEmail,
    phone: "+91 9876543210",
    avatar: userAvatar,
    dateOfBirth: "1995-08-15",
    location: "Bangalore, India",
    bio: "Passionate full-stack developer with a keen interest in modern web technologies and machine learning. Always eager to learn new skills and take on challenging projects.",
    joinedDate: "2024-01-15",
    coursesEnrolled: 5,
    coursesCompleted: 2,
    totalPoints: 2450,
    currentRank: 12,
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "MongoDB"],
    interests: [
      "Web Development",
      "AI/ML",
      "Mobile Apps",
      "DevOps",
      "UI/UX Design",
    ],
    achievements: [
      {
        id: "1",
        title: "JavaScript Master",
        description: "Completed all JavaScript modules with 90%+ score",
        icon: "🏆",
        earnedDate: "2025-06-10",
        category: "skill",
      },
      {
        id: "2",
        title: "7-Day Streak",
        description: "Maintained daily learning for a week",
        icon: "🔥",
        earnedDate: "2025-06-17",
        category: "streak",
      },
      {
        id: "3",
        title: "Top 20 Learner",
        description: "Ranked in top 20 among all students",
        icon: "⭐",
        earnedDate: "2025-06-12",
        category: "rank",
      },
    ],
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
      privacy: {
        profileVisibility: "public",
        showProgress: true,
        showAchievements: true,
      },
    },
  });

  // Always use session user data for display, even if profile state is not updated
  profile.name = userName;
  profile.email = userEmail;
  profile.avatar = userAvatar;

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (
    field: "skills" | "interests",
    value: string[],
  ) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferenceChange = (
    category: "notifications" | "privacy",
    field: string,
    value: boolean | string,
  ) => {
    setEditedProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // Here you would typically make an API call to save the profile
  };

  const handleCancel = () => {
    setEditedProfile(profile);
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

  const addSkill = (skill: string) => {
    if (skill && !editedProfile.skills.includes(skill)) {
      handleArrayChange("skills", [...editedProfile.skills, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleArrayChange(
      "skills",
      editedProfile.skills.filter((skill) => skill !== skillToRemove),
    );
  };

  const addInterest = (interest: string) => {
    if (interest && !editedProfile.interests.includes(interest)) {
      handleArrayChange("interests", [...editedProfile.interests, interest]);
    }
  };

  const removeInterest = (interestToRemove: string) => {
    handleArrayChange(
      "interests",
      editedProfile.interests.filter(
        (interest) => interest !== interestToRemove,
      ),
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                  src={editedProfile.avatar}
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
              <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Rank #{profile.currentRank}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>{profile.totalPoints} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {profile.coursesCompleted}/{profile.coursesEnrolled} courses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "profile", label: "Personal Info", icon: User },
              { id: "preferences", label: "Preferences", icon: Shield },
              { id: "achievements", label: "Achievements", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "profile" | "preferences" | "achievements",
                    )
                  }
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
                      />
                    ) : (
                      <p className="text-gray-900">{profile.name}</p>
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
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editedProfile.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formatDate(profile.dateOfBirth)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.location}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedProfile.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {formatDate(profile.joinedDate)}
                    </p>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedProfile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <input
                        type="text"
                        placeholder="Add a skill and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addSkill(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedProfile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {interest}
                          {isEditing && (
                            <button
                              onClick={() => removeInterest(interest)}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                    {isEditing && (
                      <input
                        type="text"
                        placeholder="Add an interest and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addInterest(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notification Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notification Preferences
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.email}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications",
                            "email",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Email notifications
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.push}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications",
                            "push",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Push notifications
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.notifications.sms}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "notifications",
                            "sms",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        SMS notifications
                      </span>
                    </label>
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Privacy Settings
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={
                        editedProfile.preferences.privacy.profileVisibility
                      }
                      onChange={(e) =>
                        handlePreferenceChange(
                          "privacy",
                          "profileVisibility",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editedProfile.preferences.privacy.showProgress}
                        onChange={(e) =>
                          handlePreferenceChange(
                            "privacy",
                            "showProgress",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Show my progress to others
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          editedProfile.preferences.privacy.showAchievements
                        }
                        onChange={(e) =>
                          handlePreferenceChange(
                            "privacy",
                            "showAchievements",
                            e.target.checked,
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Show my achievements to others
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  My Achievements
                </h3>
                <div className="text-sm text-gray-600">
                  {profile.achievements.length} achievement
                  {profile.achievements.length !== 1 ? "s" : ""} earned
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(achievement.earnedDate)}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                            {achievement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {profile.achievements.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No achievements yet
                  </h3>
                  <p className="text-gray-600">
                    Keep learning and completing courses to earn your first
                    achievement!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
