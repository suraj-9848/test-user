"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Clock, 
  FileText, 
  Trophy, 
  Search,
  Play,
  CheckCircle,
  AlertCircle,
  BookOpen,
  TrendingUp
} from "lucide-react";

interface Test {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  courseId: string;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  maxAttempts: number;
  attemptsUsed: number;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  bestScore?: number;
  lastAttemptDate?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  type: 'quiz' | 'assignment' | 'final-exam';
}

export default function StudentTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTests: Test[] = [
      {
        id: "1",
        title: "React Fundamentals Quiz",
        description: "Test your understanding of React components, props, and state management",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        duration: 30,
        totalQuestions: 25,
        passingScore: 70,
        maxAttempts: 3,
        attemptsUsed: 1,
        dueDate: "2025-06-25T23:59:59",
        status: 'in-progress',
        bestScore: 78,
        lastAttemptDate: "2025-06-15T14:30:00",
        difficulty: 'medium',
        topics: ["Components", "Props", "State", "Hooks"],
        type: 'quiz'
      },
      {
        id: "2",
        title: "JavaScript ES6+ Assessment",
        description: "Comprehensive test covering modern JavaScript features and syntax",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        duration: 45,
        totalQuestions: 30,
        passingScore: 75,
        maxAttempts: 2,
        attemptsUsed: 0,
        dueDate: "2025-06-28T23:59:59",
        status: 'not-started',
        difficulty: 'medium',
        topics: ["Arrow Functions", "Destructuring", "Promises", "Async/Await", "Modules"],
        type: 'quiz'
      },
      {
        id: "3",
        title: "Python Data Structures Final",
        description: "Final examination on Python data structures and algorithms",
        courseTitle: "Data Science & Machine Learning",
        courseId: "2",
        duration: 90,
        totalQuestions: 40,
        passingScore: 80,
        maxAttempts: 1,
        attemptsUsed: 0,
        dueDate: "2025-07-05T23:59:59",
        status: 'not-started',
        difficulty: 'hard',
        topics: ["Lists", "Dictionaries", "Sets", "Algorithms", "Complexity"],
        type: 'final-exam'
      },
      {
        id: "4",
        title: "Database Design Project",
        description: "Design and implement a relational database for an e-commerce system",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        duration: 120,
        totalQuestions: 5,
        passingScore: 75,
        maxAttempts: 2,
        attemptsUsed: 1,
        dueDate: "2025-06-30T23:59:59",
        status: 'completed',
        bestScore: 92,
        lastAttemptDate: "2025-06-14T16:45:00",
        difficulty: 'hard',
        topics: ["ER Diagrams", "Normalization", "SQL", "Indexes"],
        type: 'assignment'
      },
      {
        id: "5",
        title: "HTML/CSS Basics Quiz",
        description: "Quick assessment of HTML and CSS fundamentals",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        duration: 20,
        totalQuestions: 15,
        passingScore: 70,
        maxAttempts: 3,
        attemptsUsed: 3,
        dueDate: "2025-06-20T23:59:59",
        status: 'overdue',
        bestScore: 65,
        lastAttemptDate: "2025-06-18T10:20:00",
        difficulty: 'easy',
        topics: ["HTML Elements", "CSS Selectors", "Flexbox", "Grid"],
        type: 'quiz'
      }
    ];

    setTimeout(() => {
      setTests(mockTests);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || test.status === filterStatus;
    const matchesType = filterType === "all" || test.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />Not Started</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center"><Play className="w-3 h-3 mr-1" />In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Completed</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Overdue</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'quiz':
        return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">Quiz</span>;
      case 'assignment':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">Assignment</span>;
      case 'final-exam':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Final Exam</span>;
      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Due soon';
  };

  const canAttempt = (test: Test) => {
    return test.attemptsUsed < test.maxAttempts && test.status !== 'overdue';
  };

  const getOverallStats = () => {
    const completed = tests.filter(t => t.status === 'completed').length;
    const inProgress = tests.filter(t => t.status === 'in-progress').length;
    const overdue = tests.filter(t => t.status === 'overdue').length;
    const avgScore = tests
      .filter(t => t.bestScore !== undefined)
      .reduce((sum, t) => sum + (t.bestScore || 0), 0) / tests.filter(t => t.bestScore !== undefined).length || 0;
    
    return { completed, inProgress, overdue, avgScore };
  };

  const stats = getOverallStats();

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Cards Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Tests & Assignments</h1>
            <p className="text-gray-600">
              Track your assessments and monitor your performance
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-purple-600">{Math.round(stats.avgScore)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Type Filter */}
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
        </div>
      </div>

      {/* Tests List */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'You don\'t have any tests assigned yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                    {getStatusBadge(test.status)}
                    {getTypeBadge(test.type)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{test.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {test.courseTitle}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {test.duration} minutes
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {test.totalQuestions} questions
                    </span>
                    <span className={`font-medium ${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-sm text-gray-600 mb-1">Due: {formatDate(test.dueDate)}</div>
                  <div className={`text-sm font-medium ${
                    test.status === 'overdue' ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {getTimeRemaining(test.dueDate)}
                  </div>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-4">
                {test.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {/* Progress and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="text-sm">
                    <span className="text-gray-600">Attempts: </span>
                    <span className="font-medium">{test.attemptsUsed}/{test.maxAttempts}</span>
                  </div>
                  {test.bestScore !== undefined && (
                    <div className="text-sm">
                      <span className="text-gray-600">Best Score: </span>
                      <span className={`font-medium ${
                        test.bestScore >= test.passingScore ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {test.bestScore}%
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-gray-600">Passing: </span>
                    <span className="font-medium">{test.passingScore}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {test.status === 'completed' && (
                    <Link
                      href={`/student/tests/${test.id}/results`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      View Results
                    </Link>
                  )}
                  
                  {canAttempt(test) && (
                    <Link
                      href={`/student/tests/${test.id}/attempt`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {test.status === 'not-started' ? 'Start Test' : 'Continue'}
                    </Link>
                  )}
                  
                  {!canAttempt(test) && test.status !== 'completed' && (
                    <span className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg">
                      No attempts left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
