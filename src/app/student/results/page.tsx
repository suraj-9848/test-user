"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  FileText,
  Star,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useJWT } from "@/context/JWTContext";

// API Configuration
const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

// Create API wrapper for consistency
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
  }
};

interface TestResult {
  id: string;
  title: string;
  courseName?: string;
  course?: { title: string };
  courseId: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  status: string;
  submittedAt?: string;
  completedAt?: string;
  duration?: string;
  questionsTotal?: number;
  questionsCorrect?: number;
  attempted?: boolean;
}

export default function ResultsPage() {
  const { jwt } = useJWT();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  useEffect(() => {
    if (!jwt) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/api/student/tests");
        
        // Handle different response structures
        let testResults: TestResult[];
        if (Array.isArray(response)) {
          testResults = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          testResults = response.data;
        } else if (response && response.tests && Array.isArray(response.tests)) {
          testResults = response.tests;
        } else {
          console.warn("Unexpected API response structure:", response);
          testResults = [];
        }
        
        // Filter only tests that have been attempted/completed
        const completedTests = testResults.filter((test: TestResult) => 
          test.status === "completed" || test.attempted === true
        );
        
        setResults(completedTests);
      } catch (err: unknown) {
        console.error("Error fetching results:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load results";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [jwt]);

  // Filter results based on status
  const filteredResults = results.filter(result => {
    if (filter === "all") return true;
    if (filter === "passed") return (result.percentage || 0) >= 50;
    if (filter === "failed") return (result.percentage || 0) < 50;
    return true;
  });

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 50) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Passed</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Failed</span>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error Loading Results</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Results</h1>
          <p className="text-gray-600 mt-1">
            View your performance and track your progress
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
                <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
              <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tests Passed</p>
              <p className="text-2xl font-bold text-green-600">
                  {results.filter(r => (r.percentage || 0) >= 50).length}
              </p>
            </div>
              <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {results.length > 0 
                    ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / results.length)
                    : 0
                  }%
              </p>
            </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by result:</span>
          <div className="flex space-x-2">
            {[
              { key: "all", label: "All Tests" },
              { key: "passed", label: "Passed" },
              { key: "failed", label: "Failed" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as "all" | "passed" | "failed")}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === option.key
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-600">
                        Course: {result.courseName || result.course?.title || "Unknown"}
                      </p>
                    </div>
                    {result.percentage !== undefined && getStatusBadge(result.percentage)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {result.score !== undefined && result.maxScore !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Score</p>
                        <p className="font-medium text-gray-900">
                          {result.score}/{result.maxScore}
                        </p>
                  </div>
                    )}
                    
                    {result.percentage !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Percentage</p>
                        <p className={`font-medium ${getScoreColor(result.percentage)}`}>
                          {result.percentage}%
                        </p>
                  </div>
                    )}

                    {result.questionsCorrect !== undefined && result.questionsTotal !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="font-medium text-gray-900">
                          {result.questionsCorrect}/{result.questionsTotal}
                        </p>
                </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500">Completed</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(result.completedAt || result.submittedAt)}
                      </p>
                  </div>
                  </div>

                  {result.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Duration: {result.duration}
                    </div>
                  )}
              </div>

                <Link
                  href={`/student/tests/${result.id}/results`}
                  className="ml-4 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === "all" 
              ? "No test results available" 
              : `No ${filter} tests found`
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === "all"
              ? "Complete some tests to see your results here."
              : "Try changing the filter to see different results."
            }
          </p>
          {filter === "all" && (
            <Link
              href="/student/tests"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take a Test
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
