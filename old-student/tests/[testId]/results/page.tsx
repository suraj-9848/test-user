"use client";
import {
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  Alert,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/api/axios"; // Using the configured axios instance

interface SubmissionResponse {
  questionId: string;
  questionText: string;
  type: string;
  answer: string | null;
  score: number;
  maxMarks: number;
  evaluationStatus: string;
  evaluatorComments: string | null;
  options?: { id: string; text: string; correct: boolean }[];
}

interface Submission {
  submissionId: string;
  testId: string;
  testTitle: string;
  submittedAt: string;
  status: string;
  mcqScore: number;
  totalMcqMarks: number;
  mcqPercentage: number;
  totalScore: number | null;
  maxMarks: number;
  percentage: number | null;
  passed: boolean;
  responses: SubmissionResponse[];
}

export default function ResultsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const testId = params.testId as string;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/student/tests/${testId}/results`);
        setSubmissions(response.data.data.submissions);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchResults();
    }
  }, [testId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (submissions.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Test Results
        </Typography>
        <Alert severity="info">No submissions found for this test.</Alert>
      </Box>
    );
  }

  // Get the latest submission (first one in the array)
  const latestSubmission = submissions[0];

  const mcqResponses: SubmissionResponse[] = [];
  const descriptiveResponses: SubmissionResponse[] = [];
  const codeResponses: SubmissionResponse[] = [];

  latestSubmission.responses.forEach((response) => {
    if (response.type === "MCQ") {
      mcqResponses.push(response);
    } else if (response.type === "DESCRIPTIVE") {
      descriptiveResponses.push(response);
    } else if (response.type === "CODE") {
      codeResponses.push(response);
    }
  });

  // Calculate MCQ stats locally
  const mcqScore = mcqResponses.reduce((sum, r) => sum + (r.score || 0), 0);
  const totalMcqMarks = mcqResponses.reduce(
    (sum, r) => sum + (r.maxMarks || 0),
    0
  );
  const mcqPercentage =
    totalMcqMarks > 0 ? (mcqScore / totalMcqMarks) * 100 : 0;

  const getSelectedOptionText = (response: SubmissionResponse) => {
    if (!response.answer || !response.options) return "No answer selected";
    let answerArr: string[] = [];
    if (Array.isArray(response.answer)) {
      answerArr = response.answer;
    } else if (typeof response.answer === "string") {
      answerArr = response.answer.split(",").map((s) => s.trim());
    }
    // Map IDs to option text
    const optionMap: { [key: string]: string } = {};
    response.options.forEach((opt) => {
      optionMap[opt.id] = opt.text;
    });
    const selectedTexts = answerArr.map((id) => optionMap[id]).filter(Boolean);
    return selectedTexts.length > 0
      ? selectedTexts.join(", ")
      : "No answer selected";
  };

  const getCorrectOptionText = (response: SubmissionResponse) => {
    if (!response.options) return "";
    const correctOptions = response.options.filter((opt) => opt.correct);
    return correctOptions.length > 0
      ? correctOptions.map((opt) => opt.text).join(", ")
      : "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderAnswer = (response: SubmissionResponse) => {
    if (response.type === "MCQ") {
      let answerArr: string[] = [];
      if (Array.isArray(response.answer)) {
        answerArr = response.answer;
      } else if (typeof response.answer === "string") {
        // Try to parse as JSON array, fallback to comma split
        try {
          const parsed = JSON.parse(response.answer);
          if (Array.isArray(parsed)) {
            answerArr = parsed;
          } else {
            answerArr = response.answer.split(",").map((s) => s.trim());
          }
        } catch {
          answerArr = response.answer.split(",").map((s) => s.trim());
        }
      }
      // Map IDs to option text
      const optionMap: { [key: string]: string } = {};
      response.options?.forEach((opt) => {
        optionMap[opt.id] = opt.text;
      });
      return (
        <ul>
          {answerArr.map((id) => (
            <li key={id}>{optionMap[id] || id}</li>
          ))}
        </ul>
      );
    }
    // For other types
    return <span>{response.answer}</span>;
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Test Results
      </Typography>

      {/* Overall Statistics */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {latestSubmission.testTitle} - Overall Performance
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  MCQ Score
                </Typography>
                <Typography variant="h4">
                  {mcqScore}/{totalMcqMarks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {mcqPercentage.toFixed(1)}%
                </Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  Overall Status
                </Typography>
                <Chip
                  label={latestSubmission.status}
                  color={
                    latestSubmission.status === "FULLY_EVALUATED"
                      ? "success"
                      : "warning"
                  }
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Submitted: {formatDate(latestSubmission.submittedAt)}
                </Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* MCQ Section */}
      {mcqResponses.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              MCQ Results
              <Chip label="Auto Evaluated" color="success" size="small" />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {mcqResponses.map((response, index) => (
              <Card
                key={response.questionId}
                sx={{
                  mb: 2,
                  backgroundColor: response.score > 0 ? "#e8f5e8" : "#ffebee",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        Question {index + 1}
                      </Typography>
                      <Typography
                        variant="body1"
                        gutterBottom
                        dangerouslySetInnerHTML={{
                          __html: response.questionText.replace(/<[^>]+>/g, ""),
                        }}
                      />
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "#2e7d32" }}
                        >
                          Correct Answer: {getCorrectOptionText(response)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: "right", minWidth: 120 }}>
                      <Typography
                        variant="h6"
                        color={
                          response.score > 0 ? "success.main" : "error.main"
                        }
                      >
                        {response.score}/{response.maxMarks}
                      </Typography>
                      <Chip
                        label={response.score > 0 ? "Correct" : "Incorrect"}
                        color={response.score > 0 ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Descriptive Section */}
      {descriptiveResponses.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              Descriptive Questions
              <Chip label="Manual Evaluation" color="warning" size="small" />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {descriptiveResponses.map((response, index) => (
              <Card key={response.questionId} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Question {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    dangerouslySetInnerHTML={{
                      __html: response.questionText.replace(/<[^>]+>/g, ""),
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Your Answer: {response.answer || "No answer provided"}
                    </Typography>
                    <Typography variant="body2" component="span" sx={{ mt: 1 }}>
                      Evaluation Status:
                      <Chip
                        label={response.evaluationStatus}
                        color={
                          response.evaluationStatus === "EVALUATED"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    {response.evaluatorComments && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        Comments: {response.evaluatorComments}
                      </Typography>
                    )}
                    {response.evaluationStatus === "EVALUATED" && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontWeight: "bold" }}
                      >
                        Score: {response.score}/{response.maxMarks}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Code Section */}
      {codeResponses.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              Code Questions
              <Chip label="Manual Evaluation" color="warning" size="small" />
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {codeResponses.map((response, index) => (
              <Card key={response.questionId} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Question {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    dangerouslySetInnerHTML={{
                      __html: response.questionText.replace(/<[^>]+>/g, ""),
                    }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Your Code:
                    </Typography>
                    <Paper sx={{ p: 2, mt: 1, backgroundColor: "#f5f5f5" }}>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {response.answer || "No code submitted"}
                      </Typography>
                    </Paper>
                    <Typography variant="body2" component="span" sx={{ mt: 2 }}>
                      Evaluation Status:
                      <Chip
                        label={response.evaluationStatus}
                        color={
                          response.evaluationStatus === "EVALUATED"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    {response.evaluatorComments && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontStyle: "italic" }}
                      >
                        Comments: {response.evaluatorComments}
                      </Typography>
                    )}
                    {response.evaluationStatus === "EVALUATED" && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, fontWeight: "bold" }}
                      >
                        Score: {response.score}/{response.maxMarks}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Previous Attempts */}
      {submissions.length > 1 && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Previous Attempts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {submissions.slice(1).map((submission, index) => (
              <Paper key={submission.submissionId} sx={{ p: 2, mb: 1 }}>
                <Typography variant="body1">
                  Attempt {index + 2} - Submitted:{" "}
                  {formatDate(submission.submittedAt)}
                </Typography>
                <Typography variant="body2">
                  MCQ Score: {submission.mcqScore}/{submission.totalMcqMarks} (
                  {submission.mcqPercentage.toFixed(1)}%)
                </Typography>
              </Paper>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
