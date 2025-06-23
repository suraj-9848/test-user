"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "@/lib/api/axios";

interface DayContent {
  id: string;
  content: string;
  dayNumber: number;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  days: DayContent[];
  mcqAttempted: boolean;
  mcqAccessible: boolean;
}

interface Course {
  id: string;
  title: string;
}

interface ModuleResult {
  testScore: number;
  minimumPassMarks: number;
  passed: boolean;
}

export default function ModuleDetail() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.modulesId as string;

  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [moduleResult, setModuleResult] = useState<ModuleResult | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Invalid course or module ID");
      setLoading(false);
      return;
    }

    const fetchModuleAndContent = async () => {
      try {
        setLoading(true);
        // Fetch module details
        const moduleResponse = await axios.get(`/student/modules/${moduleId}`);
        if (!moduleResponse.data) throw new Error("Module data not found");

        const moduleData = moduleResponse.data;

        // Fetch course details
        const courseResponse = await axios.get(`/student/courses/${courseId}`);
        if (!courseResponse.data) throw new Error("Course data not found");

        // Mark all days as completed and fetch completion status
        const daysWithCompletion = await Promise.all(
          moduleData.days.map(async (day: DayContent) => {
            try {
              // Mark day as completed
              await axios.patch(`/student/day-contents/${day.id}/complete`);
              return { ...day, completed: true };
            } catch (err) {
              console.warn(`Failed to mark day ${day.id} as completed:`, err);
              // Proceed with completed status to avoid blocking
              return { ...day, completed: true };
            }
          })
        );

        setModule({
          ...moduleData,
          days: daysWithCompletion,
          mcqAccessible: true, // Ensure MCQ is accessible
        });
        setCourse(courseResponse.data);

        // Fetch module result (test score & pass status)
        try {
          const resultResponse = await axios.get(
            `/student/modules/${moduleId}/mcq/results`
          );
          if (resultResponse.data && resultResponse.data.score != null) {
            setModuleResult({
              testScore: resultResponse.data.score,
              minimumPassMarks: resultResponse.data.minimumPassMarks,
              passed: resultResponse.data.passed,
            });
          } else {
            setModuleResult(null);
          }
        } catch (err: any) {
          console.warn(
            "No MCQ results found:",
            err.response?.data?.message || err.message
          );
          setModuleResult(null);
        }

        setError("");
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to load module";
        setError(errorMessage);
        console.error("Error fetching module:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleAndContent();
  }, [courseId, moduleId]);

  const handleBackToCourse = () => {
    router.push(`/student/courses/${courseId}`);
  };

  const handleTakeMCQ = () => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}/mcq`);
  };

  if (!courseId || !moduleId) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography variant="h4" color="error">
          Invalid course or module ID
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="h6" color="text.secondary">
            Loading module details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!module || !course) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography variant="h4" color="error">
          {error || "Module or Course Not Found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Box
          onClick={handleBackToCourse}
          sx={{
            display: "inline-block",
            p: 1,
            mb: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography variant="body2">Back to {course.title}</Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {module.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {module.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Duration: {module.duration}
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Day Content
        </Typography>
        {module.days.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No day content available
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {module.days.map((day) => (
              <Box
                key={day.id}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  bgcolor: day.completed ? "success.light" : "background.paper",
                }}
              >
                <Typography variant="h6">Day {day.dayNumber}</Typography>
                <Box
                  sx={{
                    mb: 2,
                    "& h1": { fontSize: "1.5rem", fontWeight: "bold", mt: 2 },
                    "& h2": { fontSize: "1.25rem", fontWeight: "bold", mt: 2 },
                    "& h3": { fontSize: "1.1rem", fontWeight: "bold", mt: 2 },
                    "& p": { lineHeight: 1.6 },
                    "& pre": {
                      bgcolor: "grey.900",
                      p: 2,
                      borderRadius: 1,
                      overflowX: "auto",
                    },
                    "& code": {
                      fontFamily: "primary",
                    },
                    "& ul, & ol": { pl: 4, lineHeight: 1.6 },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {day.content}
                  </ReactMarkdown>
                </Box>
                <Typography variant="body2">
                  Status: {day.completed ? "Completed" : "Not Completed"}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          MCQ Test
        </Typography>
        <Box
          onClick={handleTakeMCQ}
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            cursor: "pointer",
            bgcolor: "background.paper",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Typography variant="body1" color="text.primary">
            {module.mcqAttempted ? "Retake MCQ Test" : "Take MCQ Test"}
          </Typography>
        </Box>
      </Box>

      {moduleResult && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            MCQ Test Results
          </Typography>
          <Typography variant="body1">
            Score: {moduleResult.testScore} / {moduleResult.minimumPassMarks}
          </Typography>
          <Typography variant="body1">
            Status: {moduleResult.passed ? "Passed" : "Failed"}
          </Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
    </Box>
  );
}
