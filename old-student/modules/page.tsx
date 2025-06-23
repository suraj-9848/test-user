"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { studentApi } from "@/services/studentApi";
import type { Module } from "@/types/student";

export default function ModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const courses = await studentApi.getCourses();
        const allModules: Module[] = [];
        
        for (const course of courses) {
          const courseDetails = await studentApi.getCourse(course.id);
          allModules.push(...courseDetails.modules);
        }
        
        setModules(allModules);
      } catch (err) {
        setError("Failed to load modules");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1400px", mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        All Modules
      </Typography>

      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
        {modules.map((module, index) => (
          <Box
            key={module.id}
            sx={{
              p: 2,
              borderBottom: index !== modules.length - 1 ? 1 : 0,
              borderColor: "divider",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={() => module.isReleased && router.push(`/student/modules/${module.id}`)}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="subtitle1">{module.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {module.courseTitle}
                </Typography>
              </Box>
              <Box sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: module.isReleased ? "success.light" : "action.disabledBackground",
                borderRadius: 1,
              }}>
                <Typography variant="body2">
                  {module.isReleased ? "Available Now" : `Release: ${module.releaseDate}`}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}