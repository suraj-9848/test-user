"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Crown,
  Star,
  Target,
  Award,
  BookOpen,
  Clock
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  rank: number;
  previousRank?: number;
  name: string;
  avatar: string;
  points: number;
  coursesCompleted: number;
  averageScore: number;
  hoursLearned: number;
  badgeCount: number;
  isCurrentUser?: boolean;
  joinedDate: string;
  lastActive: string;
  streak: number;
}

export default function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [category, setCategory] = useState<'points' | 'courses' | 'hours'>('points');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: "1",
        rank: 1,
        previousRank: 2,
        name: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=100&h=100&fit=crop&crop=face",
        points: 4850,
        coursesCompleted: 8,
        averageScore: 94,
        hoursLearned: 156,
        badgeCount: 15,
        joinedDate: "2024-09-15",
        lastActive: "2 hours ago",
        streak: 28
      },
      {
        id: "2",
        rank: 2,
        previousRank: 1,
        name: "Arjun Patel",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        points: 4720,
        coursesCompleted: 7,
        averageScore: 91,
        hoursLearned: 142,
        badgeCount: 13,
        joinedDate: "2024-08-22",
        lastActive: "1 day ago",
        streak: 15
      },
      {
        id: "3",
        rank: 3,
        previousRank: 4,
        name: "Sneha Reddy",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        points: 4350,
        coursesCompleted: 6,
        averageScore: 89,
        hoursLearned: 134,
        badgeCount: 12,
        joinedDate: "2024-10-05",
        lastActive: "5 hours ago",
        streak: 21
      },
      {
        id: "4",
        rank: 4,
        previousRank: 3,
        name: "Rahul Kumar",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        points: 4180,
        coursesCompleted: 6,
        averageScore: 87,
        hoursLearned: 128,
        badgeCount: 11,
        joinedDate: "2024-07-18",
        lastActive: "3 hours ago",
        streak: 12
      },
      {
        id: "5",
        rank: 5,
        name: "Kavya Nair",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        points: 3950,
        coursesCompleted: 5,
        averageScore: 85,
        hoursLearned: 118,
        badgeCount: 9,
        joinedDate: "2024-11-12",
        lastActive: "1 hour ago",
        streak: 8
      },
      // Add more entries...
      {
        id: "12",
        rank: 12,
        previousRank: 15,
        name: "John Doe", // Current user
        avatar: "/user.jpg",
        points: 2450,
        coursesCompleted: 3,
        averageScore: 82,
        hoursLearned: 87,
        badgeCount: 6,
        isCurrentUser: true,
        joinedDate: "2024-01-15",
        lastActive: "Now",
        streak: 7
      }
    ];

    // Add more mock entries to fill the leaderboard
    for (let i = 6; i <= 20; i++) {
      if (i === 12) continue; // Skip as we already have the current user
      
      mockLeaderboard.push({
        id: i.toString(),
        rank: i,
        previousRank: i + Math.floor(Math.random() * 3) - 1,
        name: `Student ${i}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face`,
        points: 4000 - (i * 150) + Math.floor(Math.random() * 100),
        coursesCompleted: Math.max(1, 8 - Math.floor(i / 3)),
        averageScore: Math.max(65, 95 - Math.floor(i / 2)),
        hoursLearned: Math.max(20, 150 - (i * 5)),
        badgeCount: Math.max(1, 15 - i),
        joinedDate: "2024-01-15",
        lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
        streak: Math.max(0, 30 - i)
      });
    }

    setTimeout(() => {
      setLeaderboard(mockLeaderboard.sort((a, b) => a.rank - b.rank));
      setLoading(false);
    }, 1000);
  }, [timeFrame, category]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-gray-400" />;
    
    if (current < previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (current > previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    if (rank <= 10) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const currentUser = leaderboard.find(entry => entry.isCurrentUser);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600">
              See how you rank among your peers and track your progress
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'weekly' | 'monthly' | 'all-time')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="all-time">All Time</option>
            </select>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'points' | 'courses' | 'hours')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="points">By Points</option>
              <option value="courses">By Courses</option>
              <option value="hours">By Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current User Stats */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Your Current Ranking</h2>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Rank #{currentUser.rank}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>{currentUser.points} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{currentUser.coursesCompleted} courses completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{currentUser.hoursLearned} hours learned</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">{currentUser.averageScore}%</div>
              <div className="text-sm text-blue-100">Average Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaderboard.slice(0, 3).map((entry, index) => (
            <div
              key={entry.id}
              className={`relative p-6 rounded-xl text-center ${
                index === 0 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200' 
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200'
                  : 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200'
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Crown className="w-8 h-8 text-yellow-500" />
                </div>
              )}
              
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <Image
                    src={entry.avatar}
                    alt={entry.name}
                    width={80}
                    height={80}
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(entry.rank)}`}>
                    {entry.rank}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{entry.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{entry.points} points</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{entry.coursesCompleted} courses</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{entry.averageScore}% avg</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Full Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {leaderboard.map((entry) => (
            <div
              key={entry.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                entry.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadgeColor(entry.rank)}`}>
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                    </div>
                    <div className="flex flex-col items-center">
                      {getRankChange(entry.rank, entry.previousRank)}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={entry.avatar}
                        alt={entry.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">You</span>
                        )}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Joined {new Date(entry.joinedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Last active: {entry.lastActive}</span>
                        {entry.streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center space-x-1 text-orange-600">
                              <span>🔥</span>
                              <span>{entry.streak} day streak</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{entry.points}</div>
                    <div className="text-gray-600">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{entry.coursesCompleted}</div>
                    <div className="text-gray-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{entry.averageScore}%</div>
                    <div className="text-gray-600">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{entry.hoursLearned}</div>
                    <div className="text-gray-600">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900">{entry.badgeCount}</div>
                    <div className="text-gray-600">Badges</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievement Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Reach Top 10</h3>
                <p className="text-sm text-green-700">
                  {currentUser && currentUser.rank > 10 
                    ? `${currentUser.rank - 10} ranks to go!`
                    : 'Achieved! 🎉'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">3000 Points</h3>
                <p className="text-sm text-blue-700">
                  {currentUser && currentUser.points < 3000 
                    ? `${3000 - currentUser.points} points to go!`
                    : 'Achieved! 🎉'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">5 Courses</h3>
                <p className="text-sm text-purple-700">
                  {currentUser && currentUser.coursesCompleted < 5 
                    ? `${5 - currentUser.coursesCompleted} courses to go!`
                    : 'Achieved! 🎉'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
