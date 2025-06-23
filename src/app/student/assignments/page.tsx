"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Plus,
  Target,
  Flag,
  Users
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  courseId: string;
  instructor: string;
  dueDate: string;
  submittedDate?: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  type: 'individual' | 'group';
  maxScore: number;
  score?: number;
  feedback?: string;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: string;
  }[];
  submissions: {
    id: string;
    fileName: string;
    submittedAt: string;
    status: 'pending' | 'reviewed';
  }[];
  estimatedTime: number; // in hours
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  requirements: string[];
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [sortBy, setSortBy] = useState<'dueDate' | 'status' | 'course'>('dueDate');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "E-commerce Website Development",
        description: "Build a complete e-commerce website using React, Node.js, and MongoDB with user authentication, product catalog, shopping cart, and payment integration.",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        instructor: "Rajesh Kumar",
        dueDate: "2025-06-30T23:59:59",
        status: 'in-progress',
        priority: 'high',
        type: 'individual',
        maxScore: 100,
        attachments: [
          {
            id: "1",
            name: "Project Requirements.pdf",
            url: "/requirements.pdf",
            type: "pdf",
            size: "2.5 MB"
          },
          {
            id: "2",
            name: "Starter Code.zip",
            url: "/starter-code.zip",
            type: "zip",
            size: "15.2 MB"
          }
        ],
        submissions: [],
        estimatedTime: 40,
        difficulty: 'hard',
        topics: ["React", "Node.js", "MongoDB", "Authentication", "Payment Integration"],
        requirements: [
          "Responsive design with mobile-first approach",
          "User registration and login functionality",
          "Product search and filtering",
          "Shopping cart with persistent storage",
          "Secure payment processing",
          "Admin panel for product management",
          "Unit tests with 80% coverage"
        ]
      },
      {
        id: "2",
        title: "Machine Learning Model for Price Prediction",
        description: "Develop a machine learning model to predict house prices using various features. Include data preprocessing, feature engineering, model training, and evaluation.",
        courseTitle: "Data Science & Machine Learning",
        courseId: "2",
        instructor: "Dr. Priya Sharma",
        dueDate: "2025-07-05T23:59:59",
        status: 'not-started',
        priority: 'medium',
        type: 'individual',
        maxScore: 100,
        attachments: [
          {
            id: "3",
            name: "Housing Dataset.csv",
            url: "/housing-data.csv",
            type: "csv",
            size: "8.7 MB"
          },
          {
            id: "4",
            name: "Data Dictionary.xlsx",
            url: "/data-dictionary.xlsx",
            type: "xlsx",
            size: "45 KB"
          }
        ],
        submissions: [],
        estimatedTime: 25,
        difficulty: 'medium',
        topics: ["Machine Learning", "Data Preprocessing", "Feature Engineering", "Model Evaluation"],
        requirements: [
          "Exploratory data analysis with visualizations",
          "Data cleaning and preprocessing",
          "Feature engineering and selection",
          "Multiple ML algorithms comparison",
          "Model evaluation and validation",
          "Jupyter notebook with clear documentation"
        ]
      },
      {
        id: "3",
        title: "Mobile App UI/UX Design",
        description: "Design a complete mobile application interface for a fitness tracking app including wireframes, mockups, and interactive prototype.",
        courseTitle: "UI/UX Design Fundamentals",
        courseId: "3",
        instructor: "Neha Gupta",
        dueDate: "2025-06-25T23:59:59",
        submittedDate: "2025-06-20T14:30:00",
        status: 'graded',
        priority: 'low',
        type: 'individual',
        maxScore: 100,
        score: 92,
        feedback: "Excellent design work! The user flow is intuitive and the visual hierarchy is well-executed. Minor suggestion: consider adding more micro-interactions to enhance user engagement.",
        attachments: [
          {
            id: "5",
            name: "Design Brief.pdf",
            url: "/design-brief.pdf",
            type: "pdf",
            size: "1.2 MB"
          }
        ],
        submissions: [
          {
            id: "1",
            fileName: "Fitness App Design.figma",
            submittedAt: "2025-06-20T14:30:00",
            status: 'reviewed'
          }
        ],
        estimatedTime: 20,
        difficulty: 'medium',
        topics: ["UI Design", "UX Research", "Prototyping", "User Testing"],
        requirements: [
          "User persona and journey mapping",
          "Wireframes for key screens",
          "High-fidelity mockups",
          "Interactive prototype",
          "Design system documentation",
          "Usability testing report"
        ]
      },
      {
        id: "4",
        title: "Team Project: Social Media Analytics Dashboard",
        description: "Collaborate in teams to build a comprehensive analytics dashboard for social media metrics. Each team member should contribute to different components.",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        instructor: "Rajesh Kumar",
        dueDate: "2025-06-22T23:59:59",
        status: 'overdue',
        priority: 'high',
        type: 'group',
        maxScore: 100,
        attachments: [
          {
            id: "6",
            name: "Team Guidelines.pdf",
            url: "/team-guidelines.pdf",
            type: "pdf",
            size: "980 KB"
          },
          {
            id: "7",
            name: "API Documentation.pdf",
            url: "/api-docs.pdf",
            type: "pdf",
            size: "3.1 MB"
          }
        ],
        submissions: [],
        estimatedTime: 60,
        difficulty: 'hard',
        topics: ["Team Collaboration", "API Integration", "Data Visualization", "Real-time Updates"],
        requirements: [
          "Team formation and role assignment",
          "Git workflow with proper branching",
          "Real-time data visualization",
          "Responsive dashboard design",
          "API integration for social media platforms",
          "Team presentation and demo"
        ]
      },
      {
        id: "5",
        title: "Database Design and Implementation",
        description: "Design and implement a relational database for a library management system with proper normalization and indexing.",
        courseTitle: "Full Stack Web Development",
        courseId: "1",
        instructor: "Rajesh Kumar",
        dueDate: "2025-06-18T23:59:59",
        submittedDate: "2025-06-17T16:45:00",
        status: 'submitted',
        priority: 'medium',
        type: 'individual',
        maxScore: 100,
        attachments: [
          {
            id: "8",
            name: "Database Requirements.pdf",
            url: "/db-requirements.pdf",
            type: "pdf",
            size: "1.8 MB"
          }
        ],
        submissions: [
          {
            id: "2",
            fileName: "Library Database Design.sql",
            submittedAt: "2025-06-17T16:45:00",
            status: 'pending'
          }
        ],
        estimatedTime: 15,
        difficulty: 'medium',
        topics: ["Database Design", "SQL", "Normalization", "Indexing"],
        requirements: [
          "ER diagram with proper relationships",
          "Normalized database schema",
          "SQL scripts for table creation",
          "Sample data insertion",
          "Query optimization with indexes",
          "Documentation of design decisions"
        ]
      }
    ];

    setTimeout(() => {
      setAssignments(mockAssignments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
    const matchesCourse = filterCourse === "all" || assignment.courseId === filterCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'status':
        const statusOrder = { 'overdue': 0, 'in-progress': 1, 'not-started': 2, 'submitted': 3, 'graded': 4 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'course':
        return a.courseTitle.localeCompare(b.courseTitle);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full flex items-center"><Clock className="w-3 h-3 mr-1" />Not Started</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center"><Edit className="w-3 h-3 mr-1" />In Progress</span>;
      case 'submitted':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center"><Upload className="w-3 h-3 mr-1" />Submitted</span>;
      case 'graded':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Graded</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full flex items-center"><AlertCircle className="w-3 h-3 mr-1" />Overdue</span>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOverallStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'graded').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const overdue = assignments.filter(a => a.status === 'overdue').length;
    
    return { total, completed, inProgress, overdue };
  };

  const stats = getOverallStats();
  const uniqueCourses = [...new Set(assignments.map(a => ({ id: a.courseId, title: a.courseTitle })))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">
              Track your assignments, submissions, and deadlines
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
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
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

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
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
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
                placeholder="Search assignments..."
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
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Course Filter */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="status">Sort by Status</option>
            <option value="course">Sort by Course</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      {sortedAssignments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'You don\'t have any assignments yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`bg-white rounded-xl shadow-sm border-l-4 border border-gray-100 hover:shadow-md transition-shadow ${getPriorityColor(assignment.priority)}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      {getStatusBadge(assignment.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(assignment.difficulty)}`}>
                        {assignment.difficulty}
                      </span>
                      {assignment.type === 'group' && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Group
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm">{assignment.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {assignment.courseTitle}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        ~{assignment.estimatedTime} hours
                      </span>
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {assignment.maxScore} points
                      </span>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {assignment.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Attachments */}
                    {assignment.attachments.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                        <div className="space-y-1">
                          {assignment.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 text-sm">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                {attachment.name}
                              </span>
                              <span className="text-gray-500">({attachment.size})</span>
                              <Download className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Score and Feedback */}
                    {assignment.status === 'graded' && assignment.score !== undefined && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800">Grade</span>
                          <span className="text-lg font-bold text-green-600">
                            {assignment.score}/{assignment.maxScore} ({Math.round((assignment.score / assignment.maxScore) * 100)}%)
                          </span>
                        </div>
                        {assignment.feedback && (
                          <div>
                            <p className="text-sm font-medium text-green-800 mb-1">Feedback:</p>
                            <p className="text-sm text-green-700">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-6">
                    <div className="text-sm text-gray-600 mb-1">Due: {formatDate(assignment.dueDate)}</div>
                    <div className={`text-sm font-medium ${
                      assignment.status === 'overdue' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {getTimeRemaining(assignment.dueDate)}
                    </div>
                    {assignment.submittedDate && (
                      <div className="text-xs text-gray-500 mt-2">
                        Submitted: {formatDate(assignment.submittedDate)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Instructor: {assignment.instructor}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/student/assignments/${assignment.id}`}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Link>
                    
                    {(assignment.status === 'not-started' || assignment.status === 'in-progress') && (
                      <Link
                        href={`/student/assignments/${assignment.id}/submit`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {assignment.status === 'not-started' ? 'Start Assignment' : 'Continue'}
                      </Link>
                    )}
                    
                    {assignment.status === 'submitted' && (
                      <span className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg">
                        Awaiting Review
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
