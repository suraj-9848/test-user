'use client';

import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, BookOpen, Users, Star, Download, CheckCircle, Lock, FileText, Video, Headphones } from 'lucide-react';
import Link from 'next/link';

const CourseDetailPage = ({ params }: { params: { id: string } }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  // Mock course data - replace with actual API call
  const course = {
    id: params.id,
    title: "Advanced React Development",
    instructor: "Dr. Sarah Johnson",
    duration: "12 weeks",
    level: "Advanced",
    rating: 4.8,
    totalStudents: 1234,
    progress: 65,
    description: "Master advanced React concepts including performance optimization, custom hooks, context API, and modern state management patterns.",
    thumbnail: "/api/placeholder/800/300",
    enrolledDate: "2024-01-15",
    completedLessons: 24,
    totalLessons: 36,
    nextDeadline: "Assignment 3 - Due in 3 days",
    skills: ["React Hooks", "Performance Optimization", "State Management", "Testing", "TypeScript"],
    modules: [
      {
        id: 1,
        title: "React Fundamentals Review",
        duration: "2 hours",
        completed: true,
        lessons: [
          { id: 1, title: "Component Lifecycle", type: "video", duration: "15 min", completed: true },
          { id: 2, title: "Props and State", type: "video", duration: "20 min", completed: true },
          { id: 3, title: "Event Handling", type: "reading", duration: "10 min", completed: true },
          { id: 4, title: "Quiz: Fundamentals", type: "quiz", duration: "5 min", completed: true }
        ]
      },
      {
        id: 2,
        title: "Advanced Hooks",
        duration: "4 hours",
        completed: false,
        lessons: [
          { id: 5, title: "useEffect Deep Dive", type: "video", duration: "25 min", completed: true },
          { id: 6, title: "Custom Hooks", type: "video", duration: "30 min", completed: true },
          { id: 7, title: "useCallback and useMemo", type: "video", duration: "20 min", completed: false },
          { id: 8, title: "Hands-on Exercise", type: "assignment", duration: "60 min", completed: false }
        ]
      },
      {
        id: 3,
        title: "Performance Optimization",
        duration: "3 hours",
        completed: false,
        lessons: [
          { id: 9, title: "React.memo and PureComponent", type: "video", duration: "18 min", completed: false },
          { id: 10, title: "Code Splitting", type: "video", duration: "22 min", completed: false },
          { id: 11, title: "Lazy Loading", type: "reading", duration: "15 min", completed: false },
          { id: 12, title: "Performance Assignment", type: "assignment", duration: "90 min", completed: false }
        ]
      }
    ],
    assignments: [
      {
        id: 1,
        title: "Build a Custom Hook",
        dueDate: "2024-02-20",
        status: "completed",
        score: 95,
        feedback: "Excellent implementation of the custom hook pattern!"
      },
      {
        id: 2,
        title: "Performance Optimization Project",
        dueDate: "2024-02-25",
        status: "submitted",
        score: null,
        feedback: null
      },
      {
        id: 3,
        title: "Final Project - React App",
        dueDate: "2024-03-05",
        status: "pending",
        score: null,
        feedback: null
      }
    ],
    announcements: [
      {
        id: 1,
        title: "Assignment 3 Guidelines Updated",
        date: "2024-02-18",
        content: "Please check the updated requirements for the final project."
      },
      {
        id: 2,
        title: "Office Hours This Week",
        date: "2024-02-15",
        content: "I'll be available for questions on Wednesday 2-4 PM EST."
      }
    ]
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'submitted': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/student/courses" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{course.instructor}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />{course.duration}</span>
                  <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" />{course.rating}</span>
                  <span>{course.totalStudents} students</span>
                </div>
                <p className="text-gray-700 mb-4">{course.description}</p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Course Progress</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Lessons:</span>
                      <span className="font-medium">{course.completedLessons}/{course.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrolled:</span>
                      <span className="font-medium">{new Date(course.enrolledDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {course.nextDeadline && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800 font-medium">Upcoming Deadline</p>
                      <p className="text-sm text-orange-700">{course.nextDeadline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'modules', label: 'Course Content' },
                { id: 'assignments', label: 'Assignments' },
                { id: 'announcements', label: 'Announcements' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Overview</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                This comprehensive course covers advanced React development techniques used in modern web applications. 
                You'll learn to build scalable, performant React applications using the latest features and best practices.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What You'll Learn</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                <li>Advanced React Hooks and custom hook patterns</li>
                <li>Performance optimization techniques</li>
                <li>State management with Context API and modern libraries</li>
                <li>Testing React components and applications</li>
                <li>TypeScript integration with React</li>
                <li>Production deployment strategies</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Solid understanding of JavaScript ES6+</li>
                <li>Basic React knowledge (components, props, state)</li>
                <li>Familiarity with modern web development tools</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow-sm">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {module.completed ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">{module.duration}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {module.lessons.filter(l => l.completed).length}/{module.lessons.length} completed
                    </div>
                  </div>
                </div>
                
                {expandedModule === module.id && (
                  <div className="border-t border-gray-200 px-6 pb-6">
                    <div className="space-y-3 mt-4">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              lesson.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {lesson.completed ? <CheckCircle className="w-4 h-4" /> : getTypeIcon(lesson.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{lesson.title}</p>
                              <p className="text-sm text-gray-600">{lesson.duration}</p>
                            </div>
                          </div>
                          <button className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            lesson.completed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}>
                            {lesson.completed ? 'Completed' : 'Start'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignments</h2>
            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                      {assignment.feedback && (
                        <p className="text-sm text-gray-700 italic">"{assignment.feedback}"</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {assignment.score && (
                        <span className="text-lg font-bold text-green-600">{assignment.score}%</span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Announcements</h2>
            <div className="space-y-6">
              {course.announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{new Date(announcement.date).toLocaleDateString()}</p>
                  <p className="text-gray-700">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
