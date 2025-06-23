"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

// Sample data
const upcomingModules = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    courseTitle: "Web Development Fundamentals",
    releaseDate: "May 12, 2025",
    isReleased: false,
  },
  {
    id: 2,
    title: "CSS Layouts & Flexbox",
    courseTitle: "Web Development Fundamentals",
    releaseDate: "May 15, 2025",
    isReleased: false,
  },
  {
    id: 3,
    title: "Arrays & Objects",
    courseTitle: "JavaScript Essentials",
    releaseDate: "Today",
    isReleased: true,
  },
];

const activeCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    progress: 45,
    totalModules: 12,
    completedModules: 5,
    nextDeadline: "May 12, 2025",
  },
  {
    id: 2,
    title: "JavaScript Essentials",
    progress: 30,
    totalModules: 10,
    completedModules: 3,
    nextDeadline: "May 11, 2025",
  },
  {
    id: 3,
    title: "Database Design & SQL",
    progress: 15,
    totalModules: 8,
    completedModules: 1,
    nextDeadline: "May 20, 2025",
  },
];

const upcomingTests = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals Quiz",
    courseTitle: "Web Development Fundamentals",
    date: "May 12, 2025",
    duration: "30 minutes",
  },
  {
    id: 2,
    title: "JavaScript Basics Assessment",
    courseTitle: "JavaScript Essentials",
    date: "May 14, 2025",
    duration: "45 minutes",
  },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good day");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleCourseClick = (courseId: number) => {
    router.push(`/student/courses/${courseId}`);
  };

  const handleModuleClick = (moduleId: number) => {
    router.push(`/student/modules/${moduleId}`);
  };

  const handleTestClick = (testId: number) => {
    router.push(`/student/tests/${testId}`);
  };

  return (
    // <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: "1400px", mx: "auto" }}>
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h4" gutterBottom>
    //       {greeting}, John
    //     </Typography>
    //     <Typography variant="body1" color="text.secondary">
    //       Here's your learning progress for today
    //     </Typography>
    //   </Box>


    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h5" sx={{ mb: 2 }}>
    //       Your Courses
    //     </Typography>

    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: { xs: "column", md: "row" },
    //         gap: 2,
    //       }}
    //     >
    //       {activeCourses.map((course) => (
    //         <Box
    //           key={course.id}
    //           sx={{
    //             flex: 1,
    //             p: 2,
    //             border: 1,
    //             borderColor: "divider",
    //             borderRadius: 1,
    //             cursor: "pointer",
    //             transition: "transform 0.2s, box-shadow 0.2s",
    //             "&:hover": {
    //               boxShadow: 3,
    //               transform: "translateY(-4px)",
    //             },
    //           }}
    //           onClick={() => handleCourseClick(course.id)}
    //         >
    //           <Typography variant="h6" gutterBottom>
    //             {course.title}
    //           </Typography>

    //           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
    //             {course.completedModules} of {course.totalModules} modules
    //             completed
    //           </Typography>

    //           {/* Progress bar */}
    //           <Box sx={{ mb: 2 }}>
    //             <Box
    //               sx={{
    //                 width: "100%",
    //                 height: 8,
    //                 bgcolor: "background.paper",
    //                 borderRadius: 5,
    //                 border: 1,
    //                 borderColor: "divider",
    //               }}
    //             >
    //               <Box
    //                 sx={{
    //                   width: `${course.progress}%`,
    //                   height: "100%",
    //                   bgcolor: "primary.main",
    //                   borderRadius: 5,
    //                 }}
    //               />
    //             </Box>
    //           </Box>

    //           <Typography variant="body2">
    //             Next deadline: {course.nextDeadline}
    //           </Typography>
    //         </Box>
    //       ))}
    //     </Box>
    //   </Box>

    //   {/* Upcoming Modules */}
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h5" sx={{ mb: 2 }}>
    //       Upcoming Modules
    //     </Typography>

    //     <Box
    //       sx={{
    //         border: 1,
    //         borderColor: "divider",
    //         borderRadius: 1,
    //       }}
    //     >
    //       {upcomingModules.map((module, index) => (
    //         <Box
    //           key={module.id}
    //           sx={{
    //             p: 2,
    //             borderBottom: index !== upcomingModules.length - 1 ? 1 : 0,
    //             borderColor: "divider",
    //             cursor: "pointer",
    //             "&:hover": { bgcolor: "action.hover" },
    //           }}
    //           onClick={() => module.isReleased && handleModuleClick(module.id)}
    //         >
    //           <Box
    //             sx={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Box>
    //               <Typography variant="subtitle1">{module.title}</Typography>
    //               <Typography variant="body2" color="text.secondary">
    //                 {module.courseTitle}
    //               </Typography>
    //             </Box>
    //             <Box
    //               sx={{
    //                 px: 1.5,
    //                 py: 0.5,
    //                 bgcolor: module.isReleased
    //                   ? "success.light"
    //                   : "action.disabledBackground",
    //                 borderRadius: 1,
    //               }}
    //             >
    //               <Typography
    //                 variant="body2"
    //                 color={
    //                   module.isReleased
    //                     ? "success.contrastText"
    //                     : "text.secondary"
    //                 }
    //               >
    //                 {module.isReleased
    //                   ? "Available Now"
    //                   : `Release: ${module.releaseDate}`}
    //               </Typography>
    //             </Box>
    //           </Box>
    //         </Box>
    //       ))}
    //     </Box>
    //   </Box>

    //   {/* Upcoming Tests */}
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h5" sx={{ mb: 2 }}>
    //       Upcoming Tests
    //     </Typography>

    //     <Box
    //       sx={{
    //         border: 1,
    //         borderColor: "divider",
    //         borderRadius: 1,
    //       }}
    //     >
    //       {upcomingTests.map((test, index) => (
    //         <Box
    //           key={test.id}
    //           sx={{
    //             p: 2,
    //             borderBottom: index !== upcomingTests.length - 1 ? 1 : 0,
    //             borderColor: "divider",
    //             cursor: "pointer",
    //             "&:hover": { bgcolor: "action.hover" },
    //           }}
    //           onClick={() => handleTestClick(test.id)}
    //         >
    //           <Box
    //             sx={{
    //               display: "flex",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //             }}
    //           >
    //             <Box>
    //               <Typography variant="subtitle1">{test.title}</Typography>
    //               <Typography variant="body2" color="text.secondary">
    //                 {test.courseTitle}
    //               </Typography>
    //             </Box>
    //             <Box sx={{ textAlign: "right" }}>
    //               <Typography variant="body2">{test.date}</Typography>
    //               <Typography variant="body2" color="text.secondary">
    //                 Duration: {test.duration}
    //               </Typography>
    //             </Box>
    //           </Box>
    //         </Box>
    //       ))}
    //     </Box>
    //   </Box>
    // </Box>
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh"
    }}>
      Welcome to Student Dashboard
    </Box>
  );
}
