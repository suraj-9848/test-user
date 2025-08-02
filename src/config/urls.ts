// Centralized URL configuration for Student Frontend (LMS)

// Base URLs
export const BASE_URLS = {
  BACKEND: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000",
  FRONTEND: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001",
  ADMIN_DASHBOARD:
    process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "http://localhost:3002",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PAYMENT: {
    CREATE_ORDER: "/api/payment/create-order",
    VERIFY: "/api/payment/verify",
  },
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    EXCHANGE: "/api/auth/exchange",
    ADMIN_LOGIN: "/api/auth/admin-login",
    REFRESH: "/api/auth/refresh",
    VERIFY: "/api/auth/verify",
    LOGOUT: "/api/auth/logout",
    LOGOUT_ALL: "/api/auth/logout-all",
    ME: "/api/auth/me",
  },

  // Student Routes
  STUDENT: {
    PROFILE: "/api/student/profile",
    DASHBOARD: "/api/student/dashboard",
    COURSES: "/api/student/courses",
    COURSE_BY_ID: (id: string) => `/api/student/courses/${id}`,
    COURSE_MODULES: (courseId: string) =>
      `/api/student/courses/${courseId}/modules`,

    // Test related endpoints
    TESTS: "/api/student/tests",
    TEST_DETAILS: (testId: string) => `/api/student/tests/${testId}`,
    TEST_ATTEMPT: (testId: string) => `/api/student/tests/${testId}/attempt`,
    TEST_RESULTS: "/api/student/test-results",

    // Modules
    MODULES: "/api/student/modules",
    MODULE_BY_ID: (id: string) => `/api/student/modules/${id}`,
    MODULE_CONTENT: (moduleId: string) =>
      `/api/student/modules/${moduleId}/content`,
    MODULE_COMPLETE: (moduleId: string) =>
      `/api/student/modules/${moduleId}/complete`,
    MODULE_MCQ: (moduleId: string) => `/api/student/modules/${moduleId}/mcq`,

    // Progress
    PROGRESS: {
      OVERVIEW: "/api/student/progress/overview",
      COURSE: (courseId: string) => `/api/student/progress/courses/${courseId}`,
      MODULE: (moduleId: string) => `/api/student/progress/modules/${moduleId}`,
    },

    // Assignments
    ASSIGNMENTS: "/api/student/assignments",
    ASSIGNMENT_BY_ID: (id: string) => `/api/student/assignments/${id}`,
    ASSIGNMENT_SUBMIT: (assignmentId: string) =>
      `/api/student/assignments/${assignmentId}/submit`,
    ASSIGNMENT_UPLOAD: "/api/student/assignments/upload",

    // Batches
    BATCHES: "/api/student/batches",
    BATCH_BY_ID: (id: string) => `/api/student/batches/${id}`,

    // Leaderboard
    LEADERBOARD: "/api/student/tests/leaderboard",
    LEADERBOARD_COURSE: (courseId: string) =>
      `/api/student/leaderboard/courses/${courseId}`,

    // Session Progress
    SESSION_PROGRESS: "/api/student/session-progress",
    SESSION_PROGRESS_UPDATE: "/api/student/session-progress/update",
  },

  // Public Routes (no authentication required)
  PUBLIC: {
    COURSES: "/api/public/courses",
    ANNOUNCEMENTS: "/api/public/announcements",
    ABOUT: "/api/public/about",
  },

  // Course Management (for enrolled courses)
  COURSES: {
    LIST: "/api/courses",
    BY_ID: (id: string) => `/api/courses/${id}`,
    MODULES: (courseId: string) => `/api/courses/${courseId}/modules`,
    MODULE_BY_ID: (courseId: string, moduleId: string) =>
      `/api/courses/${courseId}/modules/${moduleId}`,
    ENROLL: (courseId: string) => `/api/courses/${courseId}/enroll`,
  },

  // User Management
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE_PROFILE: "/api/users/profile",
    CHANGE_PASSWORD: "/api/users/change-password",
  },

  // File Upload
  UPLOAD: {
    GENERAL: "/api/upload",
    PROFILE_IMAGE: "/api/upload/profile-image",
    ASSIGNMENT: "/api/upload/assignment",
  },

  // Hiring Portal (student view)
  HIRING: {
    JOBS: "/api/hiring/jobs",
    JOB_BY_ID: (id: string) => `/api/hiring/jobs/${id}`,
    APPLY: (jobId: string) => `/api/hiring/jobs/${jobId}/apply`,
    MY_APPLICATIONS: "/api/hiring/my-applications",
    APPLICATION_BY_ID: (id: string) => `/api/hiring/applications/${id}`,
  },
} as const;

// Full URL builders
export const buildUrl = (
  endpoint: string,
  baseUrl: string = BASE_URLS.BACKEND,
): string => {
  return `${baseUrl}${endpoint}`;
};

export const buildAuthUrl = (endpoint: string): string => {
  return buildUrl(endpoint, BASE_URLS.BACKEND);
};

export const buildApiUrl = (endpoint: string): string => {
  return buildUrl(endpoint, BASE_URLS.BACKEND);
};

// Domain mapping for unified login redirects
export const DOMAIN_MAPPINGS = {
  LMS_TO_ADMIN: {
    localhost: "localhost:3002",
    "lms-stg.nirudhyog.com": "admin-stg.nirudhyog.com",
    "lms-dev.nirudhyog.com": "admin-dev.nirudhyog.com",
    "lms.nirudhyog.com": "admin.nirudhyog.com",
  },
  ADMIN_TO_LMS: {
    localhost: "localhost:3001",
    "admin-stg.nirudhyog.com": "lms-stg.nirudhyog.com",
    "admin-dev.nirudhyog.com": "lms-dev.nirudhyog.com",
    "admin.nirudhyog.com": "lms.nirudhyog.com",
  },
} as const;

// Helper function to get admin dashboard URL from current LMS URL
export const getAdminDashboardUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const currentHost = window.location.hostname;
  const currentPort = window.location.port;
  const currentProtocol = window.location.protocol;

  console.log("[getAdminDashboardUrl] Current location:", {
    currentHost,
    currentPort,
    currentProtocol,
    fullHost: window.location.host,
  });

  // Check if we have a direct mapping
  const adminHost =
    DOMAIN_MAPPINGS.LMS_TO_ADMIN[
      currentHost as keyof typeof DOMAIN_MAPPINGS.LMS_TO_ADMIN
    ];

  if (adminHost) {
    const adminUrl = `${currentProtocol}//${adminHost}`;
    console.log("[getAdminDashboardUrl] Using mapped URL:", adminUrl);
    return adminUrl;
  }

  // Enhanced localhost handling with port consideration
  if (currentHost === "localhost") {
    const adminUrl = `${currentProtocol}//localhost:3002`;
    console.log("[getAdminDashboardUrl] Using localhost fallback:", adminUrl);
    return adminUrl;
  }

  // Additional fallback for development/staging environments
  if (currentHost.includes("lms-") || currentHost.includes("student-")) {
    const adminHost = currentHost
      .replace("lms-", "admin-")
      .replace("student-", "admin-");
    const adminUrl = `${currentProtocol}//${adminHost}`;
    console.log(
      "[getAdminDashboardUrl] Using pattern-based fallback:",
      adminUrl,
    );
    return adminUrl;
  }

  console.warn(
    "[getAdminDashboardUrl] No admin URL found for host:",
    currentHost,
  );
  return null;
};

// Helper function to get LMS URL from current admin dashboard URL
export const getLMSUrl = (): string | null => {
  if (typeof window === "undefined") return null;

  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;

  const lmsHost =
    DOMAIN_MAPPINGS.ADMIN_TO_LMS[
      currentHost as keyof typeof DOMAIN_MAPPINGS.ADMIN_TO_LMS
    ];

  if (lmsHost) {
    return `${currentProtocol}//${lmsHost}`;
  }

  return null;
};

// Export commonly used URLs
export const COMMON_URLS = {
  // Authentication URLs
  STUDENT_LOGIN: buildAuthUrl(API_ENDPOINTS.AUTH.EXCHANGE),
  ADMIN_LOGIN: buildAuthUrl(API_ENDPOINTS.AUTH.ADMIN_LOGIN),
  REFRESH_TOKEN: buildAuthUrl(API_ENDPOINTS.AUTH.REFRESH),
  LOGOUT: buildAuthUrl(API_ENDPOINTS.AUTH.LOGOUT),

  // Student URLs
  STUDENT_COURSES: buildApiUrl(API_ENDPOINTS.STUDENT.COURSES),
  STUDENT_TESTS: buildApiUrl(API_ENDPOINTS.STUDENT.TESTS),
  STUDENT_PROFILE: buildApiUrl(API_ENDPOINTS.STUDENT.PROFILE),
  STUDENT_DASHBOARD: buildApiUrl(API_ENDPOINTS.STUDENT.DASHBOARD),
  LEADERBOARD: buildApiUrl(API_ENDPOINTS.STUDENT.LEADERBOARD),

  // Public URLs
  PUBLIC_COURSES: buildApiUrl(API_ENDPOINTS.PUBLIC.COURSES),

  // Hiring URLs
  JOBS: buildApiUrl(API_ENDPOINTS.HIRING.JOBS),
  MY_APPLICATIONS: buildApiUrl(API_ENDPOINTS.HIRING.MY_APPLICATIONS),
} as const;
