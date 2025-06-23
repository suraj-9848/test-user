"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import axios from "@/lib/api/axios";
import { Test } from "@/types/index";

export default function StudentTests() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // --- Helpers ---
  const normalizeStatus = (test: Test): string => {
    const now = new Date();
    const start = new Date(test.startDate);
    const end = new Date(test.endDate);

    if (
      now >= start &&
      now <= end &&
      test.testStatus !== "COMPLETED" &&
      test.testStatus !== "MISSED"
    ) {
      return "ongoing";
    }

    switch (test.testStatus?.toUpperCase?.()) {
      case "UPCOMING":
        return "upcoming";
      case "COMPLETED":
        return "completed";
      case "MISSED":
        return "missed";
      default:
        return "unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "info.light";
      case "upcoming":
        return "warning.light";
      case "completed":
        return "success.light";
      case "missed":
        return "error.light";
      default:
        return "action.disabledBackground";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "info.dark";
      case "upcoming":
        return "warning.dark";
      case "completed":
        return "success.dark";
      case "missed":
        return "error.dark";
      default:
        return "text.secondary";
    }
  };

  // --- Effects ---
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/student/tests");
        setTests(response.data.data.tests || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load tests");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // --- Handlers ---
  const handleTestClick = (testId: string, status: string) => {
    if (status === "ongoing") {
      router.push(`/student/tests/${testId}/attempt`);
    } else if (status === "upcoming") {
      router.push(`/student/tests/${testId}`);
    } else if (status === "completed") {
      router.push(`/student/tests/${testId}/results`);
    }
  };

  // --- Data Separation ---
  const ongoingTests = tests.filter(
    (test) => normalizeStatus(test) === "ongoing"
  );
  const upcomingTests = tests.filter(
    (test) => normalizeStatus(test) === "upcoming"
  );
  const completedTests = tests.filter(
    (test) => normalizeStatus(test) === "completed"
  );

  // --- Render ---
  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography variant="h6">Loading tests...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1600px", mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Tests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your upcoming and past assessments
        </Typography>
      </Box>

      {/* Test Guidelines */}
      <Box
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "info.light",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" gutterBottom color="info.dark">
          Test Guidelines
        </Typography>
        <Typography variant="body2" color="info.dark">
          All tests are monitored for academic integrity. Make sure you have a
          stable internet connection before starting. Once a test is started,
          the timer cannot be paused. Good luck with your assessments!
        </Typography>
      </Box>

      {/* Ongoing Tests */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Ongoing Tests
        </Typography>
        {ongoingTests.length === 0 ? (
          <Box
            sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <Typography variant="body1" color="text.secondary">
              You have no ongoing tests at this time.
            </Typography>
          </Box>
        ) : (
          ongoingTests.map((test) => {
            const status = normalizeStatus(test);
            return (
              <Box
                key={test.id}
                sx={{
                  p: 3,
                  mb: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleTestClick(test.id, status)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{test.title}</Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      mt: { xs: 1, sm: 0 },
                      bgcolor: getStatusColor(status),
                      borderRadius: 1,
                      alignSelf: { xs: "flex-start", sm: "flex-start" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={getStatusTextColor(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {test.course?.title ?? "Unknown Course"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {test.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 3 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Start Date:{" "}
                    <Typography component="span" color="text.primary">
                      {test.startDate
                        ? new Date(test.startDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time:{" "}
                    <Typography component="span" color="text.primary">
                      {test.startDate
                        ? new Date(test.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration:{" "}
                    <Typography component="span" color="text.primary">
                      {test.durationInMinutes ?? "N/A"} minutes
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Marks:{" "}
                    <Typography component="span" color="text.primary">
                      {test.maxMarks ?? "N/A"}
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">Continue Test</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Upcoming Tests */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Upcoming Tests
        </Typography>
        {upcomingTests.length === 0 ? (
          <Box
            sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <Typography variant="body1" color="text.secondary">
              You have no upcoming tests scheduled at this time.
            </Typography>
          </Box>
        ) : (
          upcomingTests.map((test) => {
            const status = normalizeStatus(test);
            return (
              <Box
                key={test.id}
                sx={{
                  p: 3,
                  mb: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => handleTestClick(test.id, status)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{test.title}</Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      mt: { xs: 1, sm: 0 },
                      bgcolor: getStatusColor(status),
                      borderRadius: 1,
                      alignSelf: { xs: "flex-start", sm: "flex-start" },
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={getStatusTextColor(status)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {test.course?.title ?? "Unknown Course"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {test.description}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 3 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Start Date:{" "}
                    <Typography component="span" color="text.primary">
                      {test.startDate
                        ? new Date(test.startDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time:{" "}
                    <Typography component="span" color="text.primary">
                      {test.startDate
                        ? new Date(test.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration:{" "}
                    <Typography component="span" color="text.primary">
                      {test.durationInMinutes ?? "N/A"} minutes
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Marks:{" "}
                    <Typography component="span" color="text.primary">
                      {test.maxMarks ?? "N/A"}
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">Start Test</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Completed Tests */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Completed Tests
        </Typography>
        {completedTests.length === 0 ? (
          <Box
            sx={{ p: 3, border: 1, borderColor: "divider", borderRadius: 1 }}
          >
            <Typography variant="body1" color="text.secondary">
              You haven't completed any tests yet.
            </Typography>
          </Box>
        ) : (
          completedTests.map((test) => {
            const status = normalizeStatus(test);
            return (
              <Box
                key={test.id}
                sx={{
                  p: 3,
                  mb: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 1,
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => handleTestClick(test.id, status)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">{test.title}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: { xs: 1, sm: 0 },
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" color="success.main">
                      {test.maxMarks ?? "N/A"}
                    </Typography>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: getStatusColor(status),
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color={getStatusTextColor(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Course: {test.course?.title ?? "Unknown Course"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 3 },
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Date Taken:{" "}
                    <Typography component="span" color="text.primary">
                      {test.startDate
                        ? new Date(test.startDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration:{" "}
                    <Typography component="span" color="text.primary">
                      {test.durationInMinutes ?? "N/A"} minutes
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Marks:{" "}
                    <Typography component="span" color="text.primary">
                      {test.maxMarks ?? "N/A"}
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: "action.hover",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">View Results</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
