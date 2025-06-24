"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// API Configuration
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create API helper
const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
      post: async (endpoint: string, data?: unknown) => {
    const token = localStorage.getItem('jwt');
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
};

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  type: string;
}

interface MCQData {
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
}

interface SubmissionResponse {
  success: boolean;
  score?: number;
  passed?: boolean;
  message?: string;
}

export default function MCQTest() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const moduleId = params.moduleId as string;

  const [mcq, setMCQ] = useState<MCQData | null>(null);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  // const [isSubmitting, setIsSubmitting] = useState(false); // Removed for now
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds

  useEffect(() => {
    if (!courseId || !moduleId) {
      setError("Invalid course or module ID");
      setLoading(false);
      return;
    }

    const fetchMCQData = async () => {
      try {
        setLoading(true);
        setError("");
        const mcqData: MCQData = await api.get(`/api/student/modules/${moduleId}/mcq`);
        
        if (!mcqData.questions || mcqData.questions.length === 0) {
          throw new Error("No questions available");
        }
        
        setMCQ(mcqData);
      } catch (err: unknown) {
        console.error("Error fetching MCQ data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load MCQ";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQData();
  }, [courseId, moduleId]);

  const handleSubmit = async () => {
    if (!mcq || Object.keys(responses).length !== mcq.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
             // setIsSubmitting(true);
      const submissionData: SubmissionResponse = await api.post("/api/student/mcq/submit", {
        moduleId,
        answers: responses,
        timeSpent: timeLeft,
      });
      
      if (submissionData.success) {
        // Handle successful submission
        router.push(`/student/courses/${courseId}/modules/${moduleId}`);
      }
    } catch (err: unknown) {
      console.error("Error submitting MCQ:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit MCQ";
      setError(errorMessage);
         } finally {
       // setIsSubmitting(false);
     }
  };

  // Timer effect
  useEffect(() => {
    if (results || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, results, handleSubmit]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleResponseChange = (questionIndex: number, option: string) => {
    setResponses((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleBack = () => {
    router.push(`/student/courses/${courseId}/modules/${moduleId}`);
  };

  if (!courseId || !moduleId) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Invalid Parameters</h3>
              <p className="text-red-700 mt-1">Invalid course or module ID</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading MCQ test...</p>
        </div>
      </div>
    );
  }

  if (error && !mcq) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Test</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={handleBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mcq) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Test Not Available</h2>
        <p className="text-gray-600 mb-6">The MCQ test for this module is not available at the moment.</p>
        <button 
          onClick={handleBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Module
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Module
            </button>
          </div>
          
          {!results && (
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className={`text-lg font-mono font-bold ${
                timeLeft < 300 ? 'text-red-600' : 'text-orange-600'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Module MCQ Test</h1>
          <p className="text-gray-600">
            Answer all questions to complete this module. Passing score: {mcq.passingScore}%
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className={`rounded-xl p-6 shadow-sm border ${
          results.passed 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            
            <h2 className={`text-2xl font-bold mb-2 ${
              results.passed ? 'text-green-800' : 'text-red-800'
            }`}>
              {results.passed ? 'Congratulations! You Passed!' : 'Test Failed'}
            </h2>
            
            <p className={`text-lg mb-4 ${
              results.passed ? 'text-green-700' : 'text-red-700'
            }`}>
              Your Score: <span className="font-bold">{Math.round(results.score)}%</span>
            </p>
            
            <p className={`mb-6 ${
              results.passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {results.passed 
                ? 'You have successfully completed this module!'
                : `You need ${mcq.passingScore}% to pass. Keep studying and try again!`
              }
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBack}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Module
              </button>
              {!results.passed && (
                <button
                  onClick={() => {
                    setResults(null);
                    setResponses({});
                    setTimeLeft(1800);
                    setError("");
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retake Test
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      {!results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p className="text-gray-600 mt-1">
              Progress: {Object.keys(responses).length} of {mcq.questions.length} questions answered
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {mcq.questions.map((question, questionIndex) => (
              <div key={question.id} className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {questionIndex + 1}. {question.question}
                  </h3>
                </div>

                <div className="space-y-3">
                                      {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        responses[questionIndex] === option.text
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={option.text}
                        checked={responses[questionIndex] === option.text}
                        onChange={() => handleResponseChange(questionIndex, option.text)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-900">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {Object.keys(responses).length} of {mcq.questions.length} questions completed
              </div>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(responses).length !== mcq.questions.length}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  Object.keys(responses).length === mcq.questions.length
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
