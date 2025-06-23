"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Calendar,
  AlertCircle,
  PlayCircle,
  Target,
  Award,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function StudentDashboard() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState("Good day");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Use session user data if available, fallback to mock
  const student = session?.user
    ? {
        name: session.user.name || "Student",
        avatar: session.user.image || "/user-placeholder.svg",
        streak: 7,
        points: 2450,
        rank: 12,
      }
    : {
        name: "John Doe",
        avatar: "/user-placeholder.svg",
        streak: 7,
        points: 2450,
        rank: 12,
      };

  const stats = [
    {
      label: "Courses Enrolled",
      value: "5",
      change: "+2 this month",
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600",
      trend: "up",
    },
    {
      label: "Hours Learned",
      value: "87",
      change: "+12 this week",
      icon: Clock,
      color: "bg-green-50 text-green-600",
      trend: "up",
    },
    {
      label: "Tests Completed",
      value: "24",
      change: "+3 this week",
      icon: Trophy,
      color: "bg-purple-50 text-purple-600",
      trend: "up",
    },
    {
      label: "Average Grade",
      value: "85%",
      change: "+5% improvement",
      icon: TrendingUp,
      color: "bg-orange-50 text-orange-600",
      trend: "up",
    },
  ];

  const activeCourses = [
    {
      id: 1,
      title: "Full Stack Web Development",
      instructor: "Rajesh Kumar",
      progress: 68,
      totalModules: 12,
      completedModules: 8,
      nextDeadline: "May 15, 2025",
      image:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      status: "active",
    },
    {
      id: 2,
      title: "Data Science & Analytics",
      instructor: "Dr. Priya Sharma",
      progress: 45,
      totalModules: 10,
      completedModules: 4,
      nextDeadline: "May 18, 2025",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      status: "active",
    },
    {
      id: 3,
      title: "Mobile App Development",
      instructor: "Arjun Patel",
      progress: 23,
      totalModules: 8,
      completedModules: 2,
      nextDeadline: "May 22, 2025",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      status: "new",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "React Components Assignment",
      course: "Full Stack Web Development",
      dueDate: "May 12, 2025",
      type: "assignment",
      priority: "high",
    },
    {
      id: 2,
      title: "Database Design Quiz",
      course: "Full Stack Web Development",
      dueDate: "May 14, 2025",
      type: "test",
      priority: "medium",
    },
    {
      id: 3,
      title: "Python Fundamentals Test",
      course: "Data Science & Analytics",
      dueDate: "May 16, 2025",
      type: "test",
      priority: "medium",
    },
    {
      id: 4,
      title: "Final Project Submission",
      course: "Mobile App Development",
      dueDate: "May 20, 2025",
      type: "project",
      priority: "high",
    },
  ];

  const recentAchievements = [
    {
      id: 1,
      title: "JavaScript Master",
      description: "Completed all JavaScript modules with 90%+ score",
      icon: Award,
      date: "2 days ago",
      type: "skill",
    },
    {
      id: 2,
      title: "7-Day Streak",
      description: "Maintained daily learning for a week",
      icon: Target,
      date: "Today",
      type: "streak",
    },
    {
      id: 3,
      title: "Top 20 Learner",
      description: "Ranked in top 20 among all students",
      icon: Trophy,
      date: "5 days ago",
      type: "rank",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return ClipboardList;
      case "test":
        return Trophy;
      case "project":
        return Target;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-24 -translate-x-24"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {greeting}, {student.name}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              Ready to continue your learning journey? You&apos;re doing great!
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-sm">{student.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="text-sm">Rank #{student.rank}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-sm">{student.points} points</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={student.avatar}
                alt={student.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Continue Learning
                </h2>
                <Link
                  href="/student/courses"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {activeCourses.map((course) => (
                <div
                  key={course.id}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        {course.status === "new" && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        by {course.instructor}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>
                            {course.completedModules}/{course.totalModules}{" "}
                            modules
                          </span>
                          <span>Due: {course.nextDeadline}</span>
                        </div>
                        <Link
                          href={`/student/courses/${course.id}`}
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Continue
                        </Link>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Tasks
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {upcomingTasks.slice(0, 4).map((task) => {
                const TypeIcon = getTypeIcon(task.type);
                return (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(task.priority)}`}
                    >
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {task.course}
                      </p>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/student/assignments"
                className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Tasks →
              </Link>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Achievements
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {recentAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {achievement.description}
                      </p>
                      <span className="text-xs text-gray-400">
                        {achievement.date}
                      </span>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/student/achievements"
                className="block w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Achievements →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
