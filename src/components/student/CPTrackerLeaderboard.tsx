"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  ExternalLink,
  Filter,
  Search,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { CPTrackerLeaderboard } from "../../types/cptracker";
import { CPTrackerAPI } from "../../services/cpTrackerAPI";

interface CPTrackerLeaderboardComponentProps {
  data: CPTrackerLeaderboard[];
  loading?: boolean;
  currentUserId?: string;
  onBatchChange?: (batchId: string) => void;
}

export default function CPTrackerLeaderboardComponent({
  data,
  loading = false,
  currentUserId,
  onBatchChange,
}: CPTrackerLeaderboardComponentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [userBatches, setUserBatches] = useState<string[]>([]);

  // Get unique batches for filter
  useEffect(() => {
    const fetchUserBatches = async () => {
      try {
        const batches = await CPTrackerAPI.getUserBatches();
        setUserBatches(batches);
      } catch (error) {
        console.error("Error fetching user batches:", error);
        setUserBatches([]);
      }
    };

    fetchUserBatches();
  }, []);

  const handleBatchChange = (value: string) => {
    setBatchFilter(value);
    if (onBatchChange) {
      onBatchChange(value);
    }
  };

  // Filter data based on search and filters
  const filteredData = data.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      (item.user.username &&
        item.user.username.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch; // Batch filtering is now handled by the parent component
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-gray-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    if (rank <= 10)
      return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    return "bg-gray-100 text-gray-700";
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Batches</option>
            {userBatches.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>

          {/* Results count */}
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            Showing {filteredData.length} results
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="w-full text-sm min-w-[1500px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-[4rem] bg-gray-50 z-10 border-r border-gray-200">
                  Student
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score
                  <br />
                  <span className="text-gray-500 normal-case text-xs">
                    LC+CF+CC Scores
                  </span>
                </th>
                {/* LeetCode Columns */}
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Contest Solved Count
                  <br />
                  <span className="text-gray-500 normal-case">LCCSC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Practice Solved Count
                  <br />
                  <span className="text-gray-500 normal-case">LCPSC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Total Solved Count
                  <br />
                  <span className="text-gray-500 normal-case">LCSC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Contests Participated
                  <br />
                  <span className="text-gray-500 normal-case">LCCP</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Recent Contest
                  <br />
                  <span className="text-gray-500 normal-case">LCRC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  Rating
                  <br />
                  <span className="text-gray-500 normal-case">LCRA</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider bg-green-50">
                  LeetCode Score
                  <br />
                  <span className="text-gray-500 normal-case text-xs">
                    LC=LCCSC*10+LCPSC*1+LCCP*1+LCRA*1
                  </span>
                </th>
                {/* CodeForces Columns */}
                <th className="px-3 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider bg-blue-50">
                  CF Rating
                  <br />
                  <span className="text-gray-500 normal-case">CFRA</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider bg-blue-50">
                  CF Problems
                  <br />
                  <span className="text-gray-500 normal-case">CFPSC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider bg-blue-50">
                  CF Contests
                  <br />
                  <span className="text-gray-500 normal-case">CFCP</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider bg-blue-50">
                  CF Score
                  <br />
                  <span className="text-gray-500 normal-case text-xs">
                    CF=CFRA*1+CFPSC*1+CFCP*10
                  </span>
                </th>
                {/* CodeChef Columns */}
                <th className="px-3 py-3 text-center text-xs font-medium text-amber-600 uppercase tracking-wider bg-amber-50">
                  CC Rating
                  <br />
                  <span className="text-gray-500 normal-case">CCRA</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-amber-600 uppercase tracking-wider bg-amber-50">
                  CC Problems
                  <br />
                  <span className="text-gray-500 normal-case">CCPSC</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-amber-600 uppercase tracking-wider bg-amber-50">
                  CC Contests
                  <br />
                  <span className="text-gray-500 normal-case">CCCP</span>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-amber-600 uppercase tracking-wider bg-amber-50">
                  CC Score
                  <br />
                  <span className="text-gray-500 normal-case text-xs">
                    CC=CCRA*1+CCPSC*1+CCCP*10
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((student) => (
                <tr
                  key={student.user.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    student.user.id === currentUserId
                      ? "bg-blue-50 ring-2 ring-blue-200"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankBadge(student.rank)}`}
                      >
                        {student.rank}
                      </div>
                      {getRankIcon(student.rank)}
                    </div>
                  </td>

                  {/* Student Info */}
                  <td className="px-4 py-3 whitespace-nowrap sticky left-[4rem] bg-white z-10 border-r border-gray-200">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.user?.username || "Unknown User"}
                          {student.user?.id === currentUserId && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Total Score */}
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-lg font-bold text-gray-900">
                        {Number(student.performance_score || 0).toFixed(0)}
                      </span>
                    </div>
                  </td>

                  {/* LeetCode Columns */}
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    {student.leetcode_contest_solved_count || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    {student.leetcode_practice_solved_count || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    {student.leetcode_total_problems || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    {student.leetcode_contests_participated || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    <div className="text-xs">
                      {student.leetcode_last_contest_name ? (
                        <>
                          <div className="font-medium">
                            {student.leetcode_last_contest_name}
                          </div>
                          {student.leetcode_last_contest_date && (
                            <div className="text-gray-500">
                              {new Date(
                                student.leetcode_last_contest_date,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50">
                    {student.leetcode_current_rating || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-green-50 font-bold">
                    {student.leetcode_score || 0}
                  </td>

                  {/* CodeForces Columns */}
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-blue-50">
                    {student.codeforces_rating || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-blue-50">
                    {student.codeforces_problems_solved || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-blue-50">
                    {student.codeforces_contests_participated || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-blue-50 font-bold">
                    {student.codeforces_score || 0}
                  </td>

                  {/* CodeChef Columns */}
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-amber-50">
                    {student.codechef_rating || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-amber-50">
                    {student.codechef_problems_solved || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-amber-50">
                    {student.codechef_contests_participated || 0}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm bg-amber-50 font-bold">
                    {student.codechef_score || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No participants found
            </h3>
            <p className="text-gray-600">
              {searchTerm || batchFilter
                ? "Try adjusting your filters to see more results."
                : "Be the first to connect your CP platforms and join the leaderboard!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
