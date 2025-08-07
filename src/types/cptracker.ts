// CPTracker related types for frontend

export interface CPTrackerProfile {
  id: string;
  user_id: string;

  // Platform usernames
  leetcode_username?: string;
  codeforces_username?: string;
  codechef_username?: string;
  atcoder_username?: string;

  // Active platforms
  active_platforms: string[];

  // LeetCode stats
  leetcode_total_problems: number;
  leetcode_easy_solved: number;
  leetcode_medium_solved: number;
  leetcode_hard_solved: number;
  leetcode_current_rating: number;
  leetcode_highest_rating: number;
  leetcode_contests_participated: number;

  // Detailed LeetCode metrics for new scoring
  leetcode_contest_solved_count: number; // LCCSC
  leetcode_practice_solved_count: number; // LCPSC

  leetcode_last_contest_date?: string;
  leetcode_last_contest_name?: string;
  leetcode_last_updated?: string;

  // CodeForces stats
  codeforces_handle?: string;
  codeforces_rating: number;
  codeforces_max_rating: number;
  codeforces_rank?: string;
  codeforces_contests_participated: number;
  codeforces_problems_solved: number;
  codeforces_last_updated?: string;

  // CodeChef stats
  codechef_rating: number;
  codechef_highest_rating: number;
  codechef_stars?: string;
  codechef_contests_participated: number;
  codechef_problems_solved: number;
  codechef_last_updated?: string;

  // AtCoder stats
  atcoder_rating: number;
  atcoder_highest_rating: number;
  atcoder_color?: string;
  atcoder_contests_participated: number;
  atcoder_problems_solved: number;
  atcoder_last_updated?: string;

  // Overall metrics
  performance_score: number;
  is_active: boolean;

  // Timestamps
  created_at: string;
  updated_at: string;

  // User info (for leaderboard)
  user?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    batch_id: string;
  };
}

export interface CPTrackerConnection {
  leetcode_username?: string;
  codeforces_username?: string;
  codechef_username?: string;
  atcoder_username?: string;
  active_platforms: string[];
}

export interface CPTrackerLeaderboard {
  rank: number;
  user: {
    id: string;
    username: string;
    profile_picture?: string;
  };
  performance_score: number;

  // Platform-specific scores
  leetcode_score: number;
  codeforces_score: number;
  codechef_score: number;
  atcoder_score: number;

  // Detailed LeetCode metrics - using correct database field names
  leetcode_total_problems: number;
  leetcode_contest_solved_count: number; // LCCSC
  leetcode_practice_solved_count: number; // LCPSC
  leetcode_current_rating: number; // LCRA
  leetcode_contests_participated: number; // LCCP
  leetcode_last_contest_name?: string;
  leetcode_last_contest_date?: string;

  // CodeForces metrics - using correct database field names
  codeforces_rating: number;
  codeforces_contests_participated: number;
  codeforces_problems_solved: number;

  // CodeChef metrics - using correct database field names
  codechef_rating: number;
  codechef_contests_participated: number;
  codechef_problems_solved: number;

  // AtCoder metrics - using correct database field names
  atcoder_rating: number;
  atcoder_contests_participated: number;
  atcoder_problems_solved: number;

  platforms_connected: number;
  last_updated: string;
}

export interface CPTrackerStats {
  totalProfiles: number;
  activeProfiles: number;
  recentlyUpdated: number;
  needsUpdate: number;
}

export interface CPTrackerUpdateResult {
  success: number;
  failed: number;
  total: number;
}

export interface CronJobStatus {
  name: string;
  running: boolean;
  schedule: string;
}

// Platform-specific interfaces
export interface PlatformStats {
  platform: "leetcode" | "codeforces" | "codechef" | "atcoder";
  username: string;
  rating: number;
  maxRating: number;
  problemsSolved: number;
  contestsParticipated: number;
  lastUpdated?: string;
}

// API Response types
export interface CPTrackerApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Form validation types
export interface CPTrackerFormData {
  leetcode_username: string;
  codeforces_username: string;
  codechef_username: string;
  atcoder_username: string;
}

export interface CPTrackerFormErrors {
  leetcode_username?: string;
  codeforces_username?: string;
  codechef_username?: string;
  atcoder_username?: string;
  general?: string;
}

// Component Props types
export interface CPTrackerConnectionFormProps {
  initialData?: CPTrackerProfile;
  onSubmit: (data: CPTrackerConnection) => Promise<void>;
  loading?: boolean;
}

export interface CPTrackerLeaderboardProps {
  data: CPTrackerLeaderboard[];
  loading?: boolean;
  currentUserId?: string;
}

export interface CPTrackerCardProps {
  profile: CPTrackerProfile;
  showEditButton?: boolean;
  onEdit?: () => void;
  onRefresh?: () => void;
}

// Filter and Sort types
export interface LeaderboardFilters {
  batch?: string;
  platform?: string;
  sortBy?:
    | "performance_score"
    | "leetcode_total_problems"
    | "codeforces_rating"
    | "updated_at";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface BatchInfo {
  id: string;
  name: string;
  studentCount: number;
}

// Admin Management types
export interface CPTrackerManagementProps {
  stats: CPTrackerStats;
  cronJobs: CronJobStatus[];
  onTriggerUpdate: (type: "all" | "batch", batchId?: string) => Promise<void>;
  onManageCronJob: (jobName: string, action: "start" | "stop") => Promise<void>;
}
