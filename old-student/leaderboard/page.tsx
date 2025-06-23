"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import axios from "@/lib/api/axios";

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  course: string;
  maxMarks: number;
  percentage: number;
}

export default function StudentLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/student/tests/leaderboard");
        const apiData = response.data.data || [];
        const mapped = apiData
          .sort((a: any, b: any) => b.percentage - a.percentage)
          .map((item: any, idx: number) => ({
            id: item.userName,
            name: item.userName,
            score: item.totalScore,
            rank: idx + 1,
            course: item.courseName,
            maxMarks: item.totalMaxMarks,
            percentage: item.percentage,
          }));
        setLeaderboard(mapped);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load leaderboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Box sx={{ maxWidth: 1600, mx: "auto", mt: 6, mb: 6 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: "#004AAD",
          letterSpacing: 1,
          textShadow: "0 2px 8px #e3e8f0",
        }}
      >
        Leaderboard
      </Typography>
      <Typography
        align="center"
        sx={{ mb: 4, color: "text.secondary", fontSize: "1.15rem" }}
      >
        Celebrate the top performers! Keep learning and climb the ranks.
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 4,
          boxShadow: "0 4px 24px 0 rgba(0,74,173,0.08)",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f6ff" }}>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Rank
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Score
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Max Marks
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Percentage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : leaderboard.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No leaderboard data available.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaderboard.map((entry) => (
                <TableRow
                  key={entry.id}
                  sx={{
                    bgcolor:
                      entry.rank === 1
                        ? "#fffbe6"
                        : entry.rank === 2
                        ? "#f0f6ff"
                        : entry.rank === 3
                        ? "#f9f5ff"
                        : "inherit",
                    fontWeight: entry.rank <= 3 ? 600 : 400,
                  }}
                >
                  <TableCell align="center">
                    {entry.rank <= 3 ? (
                      <Chip
                        icon={<EmojiEventsIcon />}
                        label={entry.rank}
                        sx={{
                          bgcolor:
                            entry.rank === 1
                              ? "#FFD700"
                              : entry.rank === 2
                              ? "#C0C0C0"
                              : "#CD7F32",
                          color: "#222",
                          fontWeight: 700,
                        }}
                      />
                    ) : (
                      entry.rank
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          border: entry.rank <= 3 ? "2px solid #004AAD" : "",
                        }}
                      >
                        {entry.name[0]}
                      </Avatar>
                      <Typography
                        sx={{ fontWeight: entry.rank <= 3 ? 600 : 400 }}
                      >
                        {entry.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{entry.course}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: "#004AAD" }}>
                      {entry.score}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{entry.maxMarks}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={entry.percentage.toFixed(2) + "%"}
                      color={
                        entry.percentage >= 80
                          ? "success"
                          : entry.percentage >= 50
                          ? "warning"
                          : "default"
                      }
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
