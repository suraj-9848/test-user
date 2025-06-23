"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import axios from "@/lib/api/axios";

interface Question {
  questionId?: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

interface MCQ {
  id: string;
  questions: Question[];
  passingScore: number;
}

export default function MCQTest() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.modulesId as string;

  const [mcq, setMCQ] = useState<MCQ | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Invalid course or module ID");
      setLoading(false);
      return;
    }

    const fetchMCQ = async () => {
      try {
        const response = await axios.get(`/student/modules/${moduleId}/mcq`);
        if (!response.data.questions?.length) {
          setError("No questions found in MCQ");
          setLoading(false);
          return;
        }

        // Normalize API data to match expected format
        const formattedQuestions = response.data.questions.map((q: any) => ({
          questionId: q.questionId,
          text: q.text,
          options: q.options.map((opt: any) => opt.text), // Extract 'text' from option objects
          correctOptionIndex: q.correctOptionIndex,
        }));

        const formattedMCQ: MCQ = {
          id: response.data.id,
          questions: formattedQuestions,
          passingScore: response.data.passingScore,
        };

        setMCQ(formattedMCQ);
      } catch (err: any) {
        // Handle specific error cases
        if (err.response?.status === 401) {
          setError("Please log in to access the MCQ");
        } else if (err.response?.status === 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError(err.response?.data?.message || "Failed to load MCQ");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMCQ();
  }, [courseId, moduleId]);

  const handleResponseChange = (questionIndex: number, option: string) => {
    if (results) return;
    setResponses((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    if (!mcq || Object.keys(responses).length !== mcq.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    let score = 0;
    mcq.questions.forEach((q, i) => {
      // Compare selected option with the correct option using correctOptionIndex
      if (responses[i] === q.options[q.correctOptionIndex]) {
        score++;
      }
    });

    const percentage = (score / mcq.questions.length) * 100;
    const passed = percentage >= mcq.passingScore;
    setResults({ score: percentage, passed });
    setError(""); // Clear any previous errors
  };

  const handleBack = () => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading MCQ...
        </Typography>
      </Box>
    );
  }

  if (error || !mcq) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          {error || "Unable to load MCQ."}
        </Typography>
        <Button variant="outlined" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Module
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 4 }}>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Back to Module
      </Button>
      <Typography variant="h4" gutterBottom>
        MCQ Test
      </Typography>

      {results && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Your Score: {results.score.toFixed(2)}%
          </Typography>
          <Typography variant="body1">
            Passing Score: {mcq.passingScore}%
          </Typography>
          <Typography
            variant="body1"
            color={results.passed ? "success.main" : "error"}
          >
            {results.passed ? "You Passed 🎉" : "You Did Not Pass 😢"}
          </Typography>
        </Box>
      )}

      {mcq.questions.map((q, index) => (
        <Box
          key={index}
          sx={{
            mb: 3,
            p: 2,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Q{index + 1}: {q.text}
          </Typography>
          {q.options.map((opt, i) => {
            const selected = responses[index] === opt;
            const correct = results && i === q.correctOptionIndex;
            const incorrect = results && selected && !correct;

            return (
              <Box
                key={i}
                onClick={() => handleResponseChange(index, opt)}
                sx={{
                  mt: 1,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: selected ? "primary.main" : "grey.300",
                  bgcolor: correct
                    ? "success.light"
                    : incorrect
                    ? "error.light"
                    : selected
                    ? "primary.light"
                    : "background.paper",
                  cursor: results ? "not-allowed" : "pointer",
                  "&:hover": {
                    bgcolor: results ? undefined : "action.hover",
                  },
                }}
              >
                <Typography variant="body2">{opt}</Typography>
              </Box>
            );
          })}
        </Box>
      ))}

      {!results && (
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Test
        </Button>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
