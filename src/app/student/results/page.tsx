"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Award,
  Calendar,
  BarChart3,
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Trophy
} from "lucide-react";

interface TestResult {
  id: string;
  testTitle: string;
  courseTitle: string;
  courseId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  duration: number; // time taken in minutes
  totalQuestions: number;
  correctAnswers: number;
  completedDate: string;
  rank?: number;
  totalParticipants?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'assignment' | 'final-exam';
  topics: string[];
  timeSpent: number;
}

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  instructor: string;
  courseImage: string;
  overallProgress: number;
  overallGrade: number;
  testsCompleted: number;
  totalTests: number;
  lastActivity: string;
  certificateEligible: boolean;
  status: 'in-progress' | 'completed' | 'not-started';
}

export default function StudentResults() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'course'>('date');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockResults: TestResult[] = [
      {
        id: "1",
        testTitle: "React Fundamentals Quiz",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        score: 78,
        maxScore: 100,
        percentage: 78,
        passed: true,
        passingScore: 70,
        duration: 25,
        totalQuestions: 25,
        correctAnswers: 19,
        completedDate: "2025-06-15T14:30:00",
        rank: 8,
        totalParticipants: 45,
        difficulty: 'medium',
        type: 'quiz',
        topics: ["Components", "Props", "State", "Hooks"],
        timeSpent: 25
      },
      {
        id: "2",
        testTitle: "Database Design Project",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        score: 92,
        maxScore: 100,
        percentage: 92,
        passed: true,
        passingScore: 75,
        duration: 120,
        totalQuestions: 5,
        correctAnswers: 5,
        completedDate: "2025-06-14T16:45:00",
        rank: 3,
        totalParticipants: 45,
        difficulty: 'hard',
        type: 'assignment',
        topics: ["ER Diagrams", "Normalization", "SQL", "Indexes"],
        timeSpent: 95
      },
      {
        id: "3",
        testTitle: "HTML/CSS Basics Quiz",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        score: 65,
        maxScore: 100,
        percentage: 65,
        passed: false,
        passingScore: 70,
        duration: 20,
        totalQuestions: 15,
        correctAnswers: 10,
        completedDate: "2025-06-18T10:20:00",
        rank: 32,
        totalParticipants: 45,
        difficulty: 'easy',
        type: 'quiz',
        topics: ["HTML Elements", "CSS Selectors", "Flexbox", "Grid"],
        timeSpent: 18
      },
      {
        id: "4",
        testTitle: "Python Basics Assessment",
        courseTitle: "Data Science & Machine Learning",
        courseId: "2",
        score: 88,
        maxScore: 100,
        percentage: 88,
        passed: true,
        passingScore: 75,
        duration: 40,
        totalQuestions: 20,
        correctAnswers: 18,
        completedDate: "2025-06-12T11:15:00",
        rank: 5,
        totalParticipants: 38,
        difficulty: 'medium',
        type: 'quiz',
        topics: ["Variables", "Functions", "Lists", "Dictionaries"],
        timeSpent: 35
      },
      {
        id: "5",
        testTitle: "Machine Learning Project",
        courseTitle: "Data Science & Machine Learning",
        courseId: "2",
        score: 95,
        maxScore: 100,
        percentage: 95,
        passed: true,
        passingScore: 80,
        duration: 180,
        totalQuestions: 3,
        correctAnswers: 3,
        completedDate: "2025-06-10T18:20:00",
        rank: 1,
        totalParticipants: 38,
        difficulty: 'hard',
        type: 'assignment',
        topics: ["Linear Regression", "Data Preprocessing", "Model Evaluation"],
        timeSpent: 165
      }
    ];

    const mockCourseProgress: CourseProgress[] = [
      {
        courseId: "1",
        courseTitle: "Full Stack Web Development",
        instructor: "Rajesh Kumar",
        courseImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
        overallProgress: 68,
        overallGrade: 78,
        testsCompleted: 3,
        totalTests: 8,
        lastActivity: "2 days ago",
        certificateEligible: false,
        status: 'in-progress'
      },
      {
        courseId: "2",
        courseTitle: "Data Science & Machine Learning",
        instructor: "Dr. Priya Sharma",
        courseImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
        overallProgress: 45,
        overallGrade: 91,
        testsCompleted: 2,
        totalTests: 6,
        lastActivity: "5 days ago",
        certificateEligible: false,
        status: 'in-progress'
      },
      {
        courseId: "3",
        courseTitle: "Mobile App Development",
        instructor: "Arjun Patel",
        courseImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        overallProgress: 100,
        overallGrade: 89,
        testsCompleted: 5,
        totalTests: 5,
        lastActivity: "1 week ago",
        certificateEligible: true,
        status: 'completed'
      }
    ];

    setTimeout(() => {
      setResults(mockResults);
      setCourseProgress(mockCourseProgress);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredResults = results.filter(result => {
    const matchesCourse = filterCourse === "all" || result.courseId === filterCourse;
    const matchesType = filterType === "all" || result.type === filterType;
    return matchesCourse && matchesType;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
      case 'score':
        return b.percentage - a.percentage;
      case 'course':
        return a.courseTitle.localeCompare(b.courseTitle);
      default:
        return 0;
    }
  });

  const getGradeColor = (percentage: number, passed: boolean) => {
    if (!passed) return 'text-red-600';
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <BookOpen className="w-4 h-4" />;
      case 'assignment': return <Target className="w-4 h-4" />;
      case 'final-exam': return <Trophy className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateOverallStats = () => {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const averageScore = results.reduce((sum, r) => sum + r.percentage, 0) / totalTests || 0;
    const highestScore = Math.max(...results.map(r => r.percentage), 0);
    
    return { totalTests, passedTests, averageScore, highestScore };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Results</h1>
            <p className="text-gray-600">
              Track your test scores, grades, and overall performance
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tests Passed</p>
              <p className="text-2xl font-bold text-green-600">{stats.passedTests}</p>
              <p className="text-xs text-gray-500">
                {stats.totalTests > 0 ? Math.round((stats.passedTests / stats.totalTests) * 100) : 0}% pass rate
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(stats.averageScore)}%</p>
              <p className="text-xs text-gray-500">Grade {getGradeLetter(stats.averageScore)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Highest Score</p>
              <p className="text-2xl font-bold text-purple-600">{stats.highestScore}%</p>
              <p className="text-xs text-gray-500">Best performance</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Course Progress Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseProgress.map((course) => (
              <div key={course.courseId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-8 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={course.courseImage}
                      alt={course.courseTitle}
                      width={48}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{course.courseTitle}</h3>
                    <p className="text-xs text-gray-600">by {course.instructor}</p>
                  </div>
                  {course.certificateEligible && (
                    <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.overallProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Overall Grade</span>
                    <span className={`font-bold ${getGradeColor(course.overallGrade, course.overallGrade >= 70)}`}>
                      {course.overallGrade}% ({getGradeLetter(course.overallGrade)})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tests</span>
                    <span className="text-gray-900">{course.testsCompleted}/{course.totalTests}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Activity</span>
                    <span className="text-gray-500">{course.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Courses</option>
              {courseProgress.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseTitle}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
              <option value="final-exam">Final Exam</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'course')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
            <option value="course">Sort by Course</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      {sortedResults.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600">
            Complete some tests to see your results here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(result.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{result.testTitle}</h3>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(result.difficulty)}`}>
                      {result.difficulty}
                    </span>
                    {result.passed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {result.courseTitle}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(result.completedDate)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {result.timeSpent} min
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className={`text-3xl font-bold mb-1 ${getGradeColor(result.percentage, result.passed)}`}>
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Grade {getGradeLetter(result.percentage)}
                  </div>
                  {result.rank && result.totalParticipants && (
                    <div className="text-sm text-gray-500">
                      Rank #{result.rank} of {result.totalParticipants}
                    </div>
                  )}
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{result.correctAnswers}/{result.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{result.score}/{result.maxScore}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{result.passingScore}%</div>
                  <div className="text-sm text-gray-600">Passing Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{result.timeSpent}m</div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {result.passed ? (
                    <span className="text-green-600 font-medium">✓ Passed</span>
                  ) : (
                    <span className="text-red-600 font-medium">✗ Did not pass (minimum {result.passingScore}%)</span>
                  )}
                </div>
                <button className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
