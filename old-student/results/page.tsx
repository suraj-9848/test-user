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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState, useRef } from "react";
import axios from "@/lib/api/axios";

interface Test {
  id: string;
  title: string;
  description: string;
  maxMarks: number;
  passingMarks: number;
  durationInMinutes: number;
  startDate: string;
  endDate: string;
  maxAttempts: number;
  testStatus: string;
  course: {
    id: string;
    title: string;
  };
}

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

type SubmissionsByTest = {
  [testId: string]: Submission[];
};

export default function AllResultsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [submissionsByTest, setSubmissionsByTest] = useState<SubmissionsByTest>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState<string | "ALL">("ALL");
  const testSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestsAndResults = async () => {
      try {
        // Fetch all tests
        const testsRes = await axios.get("/student/tests/");
        const testList: Test[] = testsRes.data.data.tests || [];
        setTests(testList);

        // Fetch submissions for each test in parallel
        const submissionsMap: SubmissionsByTest = {};
        await Promise.all(
          testList.map(async (test) => {
            try {
              const res = await axios.get(`/student/tests/${test.id}/results`);
              submissionsMap[test.id] = res.data.data.submissions || [];
              // Sort by latest first
              submissionsMap[test.id].sort(
                (a: Submission, b: Submission) =>
                  new Date(b.submittedAt).getTime() -
                  new Date(a.submittedAt).getTime()
              );
            } catch (err) {
              submissionsMap[test.id] = [];
            }
          })
        );
        setSubmissionsByTest(submissionsMap);
      } catch (error) {
        console.error("Error fetching tests or results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestsAndResults();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCorrectOptionText = (response: SubmissionResponse) => {
    if (!response.options) return "";
    const correctOptions = response.options.filter((opt) => opt.correct);
    return correctOptions.length > 0
      ? correctOptions.map((opt) => opt.text).join(", ")
      : "";
  };

  // Filter tests based on dropdown
  const filteredTests =
    selectedTestId === "ALL"
      ? tests
      : tests.filter((t) => String(t.id) === selectedTestId);

  if (loading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading results...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        All Test Results
      </Typography>

      {/* Sticky Test Selector */}
      <Box
        ref={testSelectorRef}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          pb: 2,
          mb: 3,
          borderBottom: "1px solid #eee",
        }}
      >
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel id="test-select-label">Select Test</InputLabel>
          <Select
            labelId="test-select-label"
            value={selectedTestId}
            label="Select Test"
            onChange={(e) => setSelectedTestId(e.target.value as string)}
            size="small"
          >
            <MenuItem value="ALL">All Tests</MenuItem>
            {tests.map((test) => (
              <MenuItem key={test.id} value={String(test.id)}>
                {test.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredTests.length === 0 ? (
        <Alert severity="info">No tests found.</Alert>
      ) : (
        filteredTests
          .slice()
          .sort((a, b) => {
            // Sort by latest submission date (descending)
            const aSubs = submissionsByTest[String(a.id)] || [];
            const bSubs = submissionsByTest[String(b.id)] || [];
            const aDate = aSubs[0]
              ? new Date(aSubs[0].submittedAt).getTime()
              : 0;
            const bDate = bSubs[0]
              ? new Date(bSubs[0].submittedAt).getTime()
              : 0;
            return bDate - aDate;
          })
          .map((test) => {
            const submissions = submissionsByTest[String(test.id)] || [];
            const latestSubmission = submissions[0];

            return (
              <Card
                key={test.id}
                sx={{
                  mb: 4,
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {test.title}
                    <Chip
                      label={test.testStatus}
                      color={test.testStatus === "ONGOING" ? "info" : "default"}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                  >
                    {test.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Course: <b>{test.course.title}</b>
                    {" | "}Max Marks: <b>{test.maxMarks}</b>
                    {" | "}Passing: <b>{test.passingMarks}</b>
                    {" | "}Duration: <b>{test.durationInMinutes} min</b>
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {submissions.length === 0 ? (
                    <Alert severity="info">No submissions for this test.</Alert>
                  ) : (
                    <Accordion
                      defaultExpanded
                      TransitionProps={{ unmountOnExit: true }}
                      sx={{
                        borderRadius: 2,
                        boxShadow: "none",
                        border: "1px solid #eee",
                        mb: 2,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ background: "#f9f9f9", borderRadius: 2 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography component="span">
                            Latest Attempt:{" "}
                            {formatDate(latestSubmission.submittedAt)}
                          </Typography>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor:
                                latestSubmission.status === "FULLY_EVALUATED"
                                  ? "success.light"
                                  : "warning.light",
                              color:
                                latestSubmission.status === "FULLY_EVALUATED"
                                  ? "success.main"
                                  : "warning.main",
                              fontWeight: 500,
                              fontSize: 13,
                              display: "inline-block",
                            }}
                          >
                            {latestSubmission.status}
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            MCQ Score:{" "}
                            <b>
                              {latestSubmission.mcqScore}/
                              {latestSubmission.totalMcqMarks}
                            </b>{" "}
                            ({latestSubmission.mcqPercentage.toFixed(1)}%)
                          </Typography>
                          <Typography variant="body2">
                            Submitted:{" "}
                            {formatDate(latestSubmission.submittedAt)}
                          </Typography>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: latestSubmission.passed
                                ? "success.light"
                                : "error.light",
                              color: latestSubmission.passed
                                ? "success.main"
                                : "error.main",
                              fontWeight: 500,
                              fontSize: 13,
                              mt: 1,
                            }}
                          >
                            {latestSubmission.passed ? "Passed" : "Failed"}
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {/* Show MCQ/Descriptive/Code breakdown */}
                        {latestSubmission.responses.map((response, idx) => (
                          <Paper
                            key={response.questionId}
                            sx={{
                              p: 2,
                              mb: 2,
                              backgroundColor:
                                response.type === "MCQ"
                                  ? response.score > 0
                                    ? "#e8f5e8"
                                    : "#ffebee"
                                  : "#f5f5f5",
                              borderRadius: 2,
                              boxShadow: "none",
                              border: "1px solid #eee",
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                              Q{idx + 1}:{" "}
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: response.questionText.replace(
                                    /<[^>]+>/g,
                                    ""
                                  ),
                                }}
                              />
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Type: <b>{response.type}</b>
                            </Typography>
                            {response.type === "MCQ" && (
                              <>
                                <Typography variant="body2">
                                  Correct Answer:{" "}
                                  {getCorrectOptionText(response)}
                                </Typography>
                                <Typography variant="body2">
                                  Your Answer:{" "}
                                  {(() => {
                                    if (!response.answer || !response.options)
                                      return "No answer selected";
                                    let answerArr: string[] = [];
                                    if (Array.isArray(response.answer)) {
                                      answerArr = response.answer;
                                    } else if (
                                      typeof response.answer === "string"
                                    ) {
                                      answerArr = response.answer
                                        .split(",")
                                        .map((s) => s.trim());
                                    }
                                    // Map IDs to option text
                                    const optionMap: { [key: string]: string } =
                                      {};
                                    response.options.forEach((opt) => {
                                      optionMap[opt.id] = opt.text;
                                    });
                                    const selectedTexts = answerArr
                                      .map((id) => optionMap[id])
                                      .filter(Boolean);
                                    return selectedTexts.length > 0
                                      ? selectedTexts.join(", ")
                                      : "No answer selected";
                                  })()}
                                </Typography>
                              </>
                            )}
                            {response.type === "DESCRIPTIVE" && (
                              <>
                                <Typography variant="body2">
                                  Your Answer:{" "}
                                  {response.answer || "No answer provided"}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor:
                                      response.evaluationStatus === "EVALUATED"
                                        ? "success.light"
                                        : "warning.light",
                                    color:
                                      response.evaluationStatus === "EVALUATED"
                                        ? "success.main"
                                        : "warning.main",
                                    fontWeight: 500,
                                    fontSize: 13,
                                    mt: 1,
                                  }}
                                >
                                  {response.evaluationStatus}
                                </Box>
                                {response.evaluatorComments && (
                                  <Typography
                                    variant="body2"
                                    sx={{ fontStyle: "italic" }}
                                  >
                                    Comments: {response.evaluatorComments}
                                  </Typography>
                                )}
                              </>
                            )}
                            {response.type === "CODE" && (
                              <>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Your Code:
                                </Typography>
                                <Paper
                                  sx={{ p: 1, backgroundColor: "#fafafa" }}
                                >
                                  <Typography
                                    variant="body2"
                                    component="pre"
                                    sx={{ fontFamily: "monospace" }}
                                  >
                                    {response.answer || "No code submitted"}
                                  </Typography>
                                </Paper>
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1,
                                    bgcolor:
                                      response.evaluationStatus === "EVALUATED"
                                        ? "success.light"
                                        : "warning.light",
                                    color:
                                      response.evaluationStatus === "EVALUATED"
                                        ? "success.main"
                                        : "warning.main",
                                    fontWeight: 500,
                                    fontSize: 13,
                                    mt: 1,
                                  }}
                                >
                                  {response.evaluationStatus}
                                </Box>
                                {response.evaluatorComments && (
                                  <Typography
                                    variant="body2"
                                    sx={{ fontStyle: "italic" }}
                                  >
                                    Comments: {response.evaluatorComments}
                                  </Typography>
                                )}
                              </>
                            )}
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Score: {response.score}/{response.maxMarks}
                            </Typography>
                          </Paper>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* Previous Attempts */}
                  {submissions.length > 1 && (
                    <Accordion
                      TransitionProps={{ unmountOnExit: true }}
                      sx={{
                        borderRadius: 2,
                        boxShadow: "none",
                        border: "1px solid #eee",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ background: "#f9f9f9", borderRadius: 2 }}
                      >
                        <Typography>Previous Attempts</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {submissions.slice(1).map((submission, idx) => (
                          <Paper
                            key={submission.submissionId}
                            sx={{ p: 2, mb: 2 }}
                          >
                            <Typography variant="body2">
                              Attempt {idx + 2} - Submitted:{" "}
                              {formatDate(submission.submittedAt)}
                            </Typography>
                            <Typography variant="body2">
                              MCQ Score: {submission.mcqScore}/
                              {submission.totalMcqMarks} (
                              {submission.mcqPercentage.toFixed(1)}%)
                            </Typography>
                            <Box
                              sx={{
                                display: "inline-block",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: submission.passed
                                  ? "success.light"
                                  : "error.light",
                                color: submission.passed
                                  ? "success.main"
                                  : "error.main",
                                fontWeight: 500,
                                fontSize: 13,
                                mt: 1,
                              }}
                            >
                              {submission.passed ? "Passed" : "Failed"}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            {/* Show evaluation for each response */}
                            {submission.responses.map((response, rIdx) => (
                              <Paper
                                key={response.questionId}
                                sx={{
                                  p: 2,
                                  mb: 2,
                                  backgroundColor:
                                    response.type === "MCQ"
                                      ? response.score > 0
                                        ? "#e8f5e8"
                                        : "#ffebee"
                                      : "#f5f5f5",
                                }}
                              >
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                  Q{rIdx + 1}:{" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: response.questionText.replace(
                                        /<[^>]+>/g,
                                        ""
                                      ),
                                    }}
                                  />
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Type: <b>{response.type}</b>
                                </Typography>
                                {response.type === "MCQ" && (
                                  <>
                                    <Typography variant="body2">
                                      Correct Answer:{" "}
                                      {getCorrectOptionText(response)}
                                    </Typography>
                                    <Typography variant="body2">
                                      Your Answer:{" "}
                                      {(() => {
                                        if (
                                          !response.answer ||
                                          !response.options
                                        )
                                          return "No answer selected";
                                        let answerArr: string[] = [];
                                        if (Array.isArray(response.answer)) {
                                          answerArr = response.answer;
                                        } else if (
                                          typeof response.answer === "string"
                                        ) {
                                          answerArr = response.answer
                                            .split(",")
                                            .map((s) => s.trim());
                                        }
                                        // Map IDs to option text
                                        const optionMap: {
                                          [key: string]: string;
                                        } = {};
                                        response.options.forEach((opt) => {
                                          optionMap[opt.id] = opt.text;
                                        });
                                        const selectedTexts = answerArr
                                          .map((id) => optionMap[id])
                                          .filter(Boolean);
                                        return selectedTexts.length > 0
                                          ? selectedTexts.join(", ")
                                          : "No answer selected";
                                      })()}
                                    </Typography>
                                  </>
                                )}
                                {response.type === "DESCRIPTIVE" && (
                                  <>
                                    <Typography variant="body2">
                                      Your Answer:{" "}
                                      {response.answer || "No answer provided"}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor:
                                          response.evaluationStatus ===
                                          "EVALUATED"
                                            ? "success.light"
                                            : "warning.light",
                                        color:
                                          response.evaluationStatus ===
                                          "EVALUATED"
                                            ? "success.main"
                                            : "warning.main",
                                        fontWeight: 500,
                                        fontSize: 13,
                                        mt: 1,
                                      }}
                                    >
                                      {response.evaluationStatus}
                                    </Box>
                                    {response.evaluatorComments && (
                                      <Typography
                                        variant="body2"
                                        sx={{ fontStyle: "italic" }}
                                      >
                                        Comments: {response.evaluatorComments}
                                      </Typography>
                                    )}
                                  </>
                                )}
                                {response.type === "CODE" && (
                                  <>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      Your Code:
                                    </Typography>
                                    <Paper
                                      sx={{ p: 1, backgroundColor: "#fafafa" }}
                                    >
                                      <Typography
                                        variant="body2"
                                        component="pre"
                                        sx={{ fontFamily: "monospace" }}
                                      >
                                        {response.answer || "No code submitted"}
                                      </Typography>
                                    </Paper>
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor:
                                          response.evaluationStatus ===
                                          "EVALUATED"
                                            ? "success.light"
                                            : "warning.light",
                                        color:
                                          response.evaluationStatus ===
                                          "EVALUATED"
                                            ? "success.main"
                                            : "warning.main",
                                        fontWeight: 500,
                                        fontSize: 13,
                                        mt: 1,
                                      }}
                                    >
                                      {response.evaluationStatus}
                                    </Box>
                                    {response.evaluatorComments && (
                                      <Typography
                                        variant="body2"
                                        sx={{ fontStyle: "italic" }}
                                      >
                                        Comments: {response.evaluatorComments}
                                      </Typography>
                                    )}
                                  </>
                                )}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  Score: {response.score}/{response.maxMarks}
                                </Typography>
                              </Paper>
                            ))}
                          </Paper>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            );
          })
      )}
    </Box>
  );
}
