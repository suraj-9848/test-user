"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "@/lib/api/axios";
import { Test } from "@/types/index";

export default function TestDetail() {
  const router = useRouter();
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // --- Helpers ---
  const normalizeStatus = (test: Test): string => {
    const now = new Date();
    const start = test.startDate ? new Date(test.startDate) : null;
    const end = test.endDate ? new Date(test.endDate) : null;

    if (
      start &&
      end &&
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime()) &&
      now >= start &&
      now <= end &&

      test.status &&
      test.status.toUpperCase() === "ONGOING"
      
    ) {
      return "ongoing";
    }

    const status = test.status;
    if (!status || typeof status !== "string") {
      return "unknown";
    }

    switch (status.toUpperCase()) {
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
    if (!testId) {
      setError("Invalid test ID");
      setLoading(false);
      return;
    }

    const fetchTest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/student/tests/${testId}`);
        if (process.env.NODE_ENV === "development") {
          console.log("TestDetail API Response:", response.data); // Debug log
        }
        const testData = response.data.data?.test;
        if (!testData) {
          throw new Error("Test data not found in response");
        }
        if (!testData.id || !testData.title) {
          if (process.env.NODE_ENV === "development") {
            console.log("Missing fields:", {
              id: testData.id,
              title: testData.title,
            }); // Debug log
          }
          throw new Error("Incomplete test data: missing id or title");
        }
        setTest(testData);
      } catch (err: any) {
        if (process.env.NODE_ENV === "development") {
          console.error("Fetch Error:", err); // Debug log
        }
        setError(
          err.message || "Unable to load test details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [testId]);

  // --- Handlers ---
  const handleStartTest = () => {
    if (testId) {
      router.push(`/student/tests/${testId}/attempt`);
    }
  };

  // --- Render ---
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading test details...
        </Typography>
      </Box>
    );
  }

  if (error || !test) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto", textAlign: "center" }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error || "Test not found"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/student/tests")}
        >
          Back to Tests
        </Button>
      </Box>
    );
  }

  const status = normalizeStatus(test);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1600px", mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {test.title ?? "Unknown Test"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Course: {test.course?.title ?? "Unknown Course"}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          mb: 4,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="h6">Test Details</Typography>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: getStatusColor(status),
              borderRadius: 1,
              alignSelf: { xs: "flex-start", sm: "flex-start" },
            }}
          >
            <Typography variant="body2" color={getStatusTextColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {test.description ?? "No description available"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 3 },
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Start Date:{" "}
            <Typography component="span" color="text.primary">
              {test.startDate && !isNaN(new Date(test.startDate).getTime())
                ? new Date(test.startDate).toLocaleDateString()
                : "N/A"}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Time:{" "}
            <Typography component="span" color="text.primary">
              {test.startDate && !isNaN(new Date(test.startDate).getTime())
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
              {test.durationInMinutes ?? "N/A"}{" "}
              {test.durationInMinutes ? "minutes" : ""}
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 3 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Max Marks:{" "}
            <Typography component="span" color="text.primary">
              {test.maxMarks ?? "N/A"}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Passing Marks:{" "}
            <Typography component="span" color="text.primary">
              {test.passingMarks ?? "N/A"}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Max Attempts:{" "}
            <Typography component="span" color="text.primary">
              {test.maxAttempts ?? "N/A"}
            </Typography>
          </Typography>
        </Box>
      </Box>

      {(status === "upcoming" || status === "ongoing") && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartTest}
            disabled={
              status === "upcoming" &&
              !!test.startDate &&
              new Date(test.startDate) > new Date()
            }
          >
            {status === "ongoing" ? "Continue Test" : "Start Test"}
          </Button>
        </Box>
      )}
    </Box>
  );
}
