"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "@/lib/api/axios";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  start_date: string;
  end_date: string;
}

export default function StudentCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<keyof Course>("title"); // Default sort by title
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default ascending

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/student/courses");
        setCourses(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Function to sort courses
  const sortedCourses = [...courses].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    // Handle date sorting
    if (sortBy === "start_date" || sortBy === "end_date") {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }

    // Handle number sorting (e.g., progress, totalModules)
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle string sorting (e.g., title, description)
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  const handleCourseClick = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "1600px", mx: "auto" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            My Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore your learning journey
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value as keyof Course)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="start_date">Start Date</MenuItem>
              <MenuItem value="end_date">End Date</MenuItem>
              <MenuItem value="progress">Progress</MenuItem>
              <MenuItem value="totalModules">Total Modules</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              label="Order"
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {sortedCourses.map((course) => (
          <Box
            key={course.id}
            onClick={() => handleCourseClick(course.id)}
            sx={{
              p: 3,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {course.description}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Start: {formatDate(course.start_date)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              End: {formatDate(course.end_date)}
            </Typography>
            {/* <Typography variant="body2" sx={{ mb: 1 }}>
              Modules: {course.totalModules}
            </Typography>
            <Typography variant="body2">
              Progress: {course.progress}% ({course.completedModules}/
              {course.totalModules} modules)
            </Typography> */}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
