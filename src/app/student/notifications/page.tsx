"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  X,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  AlertCircle,
  Info,
  MoreVertical,
} from "lucide-react";

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "assignment",
      title: "Assignment Due Soon",
      message: 'Your "Advanced React Patterns" assignment is due in 2 days',
      time: "2 hours ago",
      read: false,
      course: "Advanced React Development",
      icon: BookOpen,
      color: "blue",
      action: "View Assignment",
    },
    {
      id: 2,
      type: "grade",
      title: "Grade Posted",
      message: "You received 95% on your JavaScript Fundamentals quiz",
      time: "4 hours ago",
      read: false,
      course: "JavaScript Fundamentals",
      icon: Award,
      color: "green",
      action: "View Results",
    },
    {
      id: 3,
      type: "announcement",
      title: "Course Update",
      message: "New learning materials have been added to Python Basics",
      time: "1 day ago",
      read: true,
      course: "Python Basics",
      icon: Info,
      color: "purple",
      action: "View Course",
    },
    {
      id: 4,
      type: "discussion",
      title: "Discussion Reply",
      message: "Sarah Johnson replied to your question in the React forum",
      time: "1 day ago",
      read: true,
      course: "Advanced React Development",
      icon: MessageSquare,
      color: "blue",
      action: "View Discussion",
    },
    {
      id: 5,
      type: "system",
      title: "Maintenance Notice",
      message: "Platform maintenance scheduled for Sunday 2 AM - 4 AM EST",
      time: "2 days ago",
      read: false,
      course: null,
      icon: AlertCircle,
      color: "orange",
      action: null,
    },
    {
      id: 6,
      type: "achievement",
      title: "Achievement Unlocked!",
      message:
        'You earned the "Quick Learner" badge for completing 5 lessons in one day',
      time: "3 days ago",
      read: true,
      course: null,
      icon: Award,
      color: "yellow",
      action: "View Achievements",
    },
    {
      id: 7,
      type: "reminder",
      title: "Study Reminder",
      message:
        "Don't forget to review your notes for tomorrow's Data Structures quiz",
      time: "3 days ago",
      read: true,
      course: "Data Structures & Algorithms",
      icon: Clock,
      color: "indigo",
      action: "Start Review",
    },
    {
      id: 8,
      type: "grade",
      title: "Grade Posted",
      message: "You received 88% on your CSS Layout assignment",
      time: "5 days ago",
      read: true,
      course: "Web Design Fundamentals",
      icon: Award,
      color: "green",
      action: "View Results",
    },
  ]);

  const filters = [
    { key: "all", label: "All", count: notifications.length },
    {
      key: "unread",
      label: "Unread",
      count: notifications.filter((n) => !n.read).length,
    },
    {
      key: "assignment",
      label: "Assignments",
      count: notifications.filter((n) => n.type === "assignment").length,
    },
    {
      key: "grade",
      label: "Grades",
      count: notifications.filter((n) => n.type === "grade").length,
    },
    {
      key: "announcement",
      label: "Announcements",
      count: notifications.filter((n) => n.type === "announcement").length,
    },
    {
      key: "discussion",
      label: "Discussions",
      count: notifications.filter((n) => n.type === "discussion").length,
    },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !notification.read;
    return notification.type === selectedFilter;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const getColorClasses = (color: string, read: boolean) => {
    const opacity = read ? "100" : "500";
    const bgOpacity = read ? "50" : "100";

    switch (color) {
      case "blue":
        return { icon: `text-blue-${opacity}`, bg: `bg-blue-${bgOpacity}` };
      case "green":
        return { icon: `text-green-${opacity}`, bg: `bg-green-${bgOpacity}` };
      case "purple":
        return { icon: `text-purple-${opacity}`, bg: `bg-purple-${bgOpacity}` };
      case "orange":
        return { icon: `text-orange-${opacity}`, bg: `bg-orange-${bgOpacity}` };
      case "yellow":
        return { icon: `text-yellow-${opacity}`, bg: `bg-yellow-${bgOpacity}` };
      case "indigo":
        return { icon: `text-indigo-${opacity}`, bg: `bg-indigo-${bgOpacity}` };
      default:
        return { icon: `text-gray-${opacity}`, bg: `bg-gray-${bgOpacity}` };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                Stay updated with your learning progress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Mark all as read
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm p-1">
            <div className="flex space-x-1 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === filter.key
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        selectedFilter === filter.key
                          ? "bg-blue-400 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {filter.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter((n) => !n.read).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    notifications.filter(() => {
                      const notificationDate = new Date();
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return notificationDate >= weekAgo;
                    }).length
                  }
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notifications
              </h3>
              <p className="text-gray-600">
                You&apos;re all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const Icon = notification.icon;
                const colors = getColorClasses(
                  notification.color,
                  notification.read,
                );

                return (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.read
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${colors.icon}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3
                              className={`text-sm font-medium ${
                                notification.read
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                              )}
                            </h3>
                            <p
                              className={`mt-1 text-sm ${
                                notification.read
                                  ? "text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                              <span>{notification.time}</span>
                              {notification.course && (
                                <span className="flex items-center">
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  {notification.course}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {notification.action && (
                              <button className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                {notification.action}
                              </button>
                            )}
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                title="Delete notification"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
