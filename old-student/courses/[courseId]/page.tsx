"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "@/lib/api/axios";

interface Module {
  id: string;
  title: string;
  order: number;
  isLocked: boolean;
}

interface Course {
  id: string;
  title: string;
  logo?: string;
  start_date: string;
  end_date: string;
  modules: Module[];
}

function isValidCourseData(data: any): data is Course {
  return (
    data &&
    typeof data === "object" &&
    typeof data.id === "string" &&
    typeof data.title === "string" &&
    typeof data.start_date === "string" &&
    typeof data.end_date === "string" &&
    Array.isArray(data.modules) &&
    data.modules.every(
      (module: any) =>
        typeof module.id === "string" &&
        typeof module.title === "string" &&
        typeof module.order === "number" &&
        typeof module.isLocked === "boolean"
    )
  );
}

export default function CourseDetail() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/student/courses/${courseId}`);

        // console.log(
        //   "Raw API response:",
        //   JSON.stringify(response.data, null, 2)
        // );

        if (!response.data) {
          throw new Error("Course data not found");
        }

        if (!isValidCourseData(response.data)) {
          console.error("Invalid course data received:", response.data);
          throw new Error("Invalid course data format");
        }

        // Set the course data
        setCourse(response.data);
        setError("");
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load course. Please try again later.";
        setError(errorMessage);
        console.error("Error fetching course:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleBackToCourses = () => {
    router.push("/student/courses");
  };

  const handleModuleClick = (moduleId: string) => {
    if (!moduleId) {
      console.error('Module ID is undefined');
      return;
    }
    
    // Use the correct route format
    router.push(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  const handleTestClick = (testId: string) => {
    router.push(`/student/courses/${courseId}/tests/${testId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="h6" color="text.secondary">
            Loading course details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography variant="h4" color="error">
          {error || "Course Not Found"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Box
          onClick={handleBackToCourses}
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
          <Typography variant="body2">Back to My Courses</Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          {course.title}
        </Typography>
        {course.logo && (
          <Box
            component="img"
            src={course.logo}
            alt={course.title}
            sx={{
              height: 60,
              width: "auto",
              my: 2,
            }}
          />
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Start Date: {new Date(course.start_date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            End Date: {new Date(course.end_date).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Modules
        </Typography>
        {!course.modules || course.modules.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No modules available
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
            }}
          >
            {course.modules.map((module) => (
              <Box
                key={module.id}
                onClick={() => !module.isLocked && handleModuleClick(module.id)}
                sx={{
                  p: 3,
                  border: 1,
                  borderColor: module.isLocked ? "grey.300" : "divider",
                  borderRadius: 2,
                  cursor: module.isLocked ? "not-allowed" : "pointer",
                  bgcolor: module.isLocked ? "grey.100" : "background.paper",
                  position: "relative",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": module.isLocked
                    ? {}
                    : {
                        bgcolor: "action.hover",
                        transform: "translateY(-2px)",
                        boxShadow: 1,
                      },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: module.isLocked ? "text.disabled" : "text.primary",
                    }}
                  >
                    {module.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: module.isLocked
                        ? "error.light"
                        : "success.light",
                      color: module.isLocked ? "error.dark" : "success.dark",
                    }}
                  >
                    {module.isLocked ? "Locked" : "Available"}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color={module.isLocked ? "text.disabled" : "text.secondary"}
                >
                  Module {module.order}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
