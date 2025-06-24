// Demo Configuration
// Demo settings for testing and demonstration
export const DEMO_CONFIG = {
  // Demo user info
  demoUser: {
    id: "demo-student-123",
    name: "Demo Student",
    email: "demo@example.com",
    batch: "Demo Batch 2024",
  },

  // Demo timing settings
  autoSubmitAfter: 5 * 60, // 5 minutes for demo
  showRealTimer: false, // Set to true to show actual countdown

  // Security monitoring (for demo)
  enableViolationLogging: true,
  enableCameraMonitoring: true,
  enableVideoRecording: true,

  // Console logging for demo
  enableConsoleLogging: true,
};

export default DEMO_CONFIG;
