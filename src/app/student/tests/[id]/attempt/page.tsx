'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Flag,
  Eye,
  EyeOff,
  Save,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const TestAttemptPage = ({ params }: { params: { id: string } }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock test data - replace with actual API call
  const test = {
    id: params.id,
    title: "JavaScript Fundamentals - Final Assessment",
    course: "JavaScript Fundamentals",
    duration: 60, // minutes
    totalQuestions: 25,
    passingScore: 70,
    instructions: [
      "Read each question carefully before answering",
      "You can navigate between questions using the navigation panel",
      "Flag questions you want to review later",
      "Submit your test before the time runs out",
      "Once submitted, you cannot make changes"
    ],
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 'var x = 5;',
        points: 2
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Float', 'Number'],
        correctAnswer: 'Float',
        points: 2
      },
      {
        id: 3,
        type: 'multiple-select',
        question: 'Which of the following are valid JavaScript operators? (Select all that apply)',
        options: ['++', '--', '===', '!==', '<>', '&&'],
        correctAnswer: ['++', '--', '===', '!==', '&&'],
        points: 3
      },
      {
        id: 4,
        type: 'text',
        question: 'Write a JavaScript function that returns the sum of two numbers.',
        placeholder: 'function sum(a, b) { ... }',
        correctAnswer: 'function sum(a, b) { return a + b; }',
        points: 5
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'What does the "typeof" operator return for an array?',
        options: ['array', 'object', 'Array', 'list'],
        correctAnswer: 'object',
        points: 2
      }
      // Add more questions as needed
    ]
  };

  // Timer effect
  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionIndex: number, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would typically send the answers to your API
    console.log('Submitting answers:', answers);
  };

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) {
      return 'answered';
    }
    if (flaggedQuestions.has(index)) {
      return 'flagged';
    }
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'flagged': return 'bg-yellow-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your answers have been submitted successfully. Results will be available shortly.
          </p>
          <Link
            href="/student/tests"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestionData = test.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/student/tests"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{test.title}</h1>
                <p className="text-sm text-gray-600">{test.course}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{answeredCount}/{test.totalQuestions}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flag className="w-4 h-4 text-yellow-500" />
                  <span>{flaggedCount}</span>
                </div>
              </div>
              
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              
              <button
                onClick={() => setShowReview(!showReview)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showReview ? 'Hide' : 'Review'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Question Navigation Sidebar */}
          {showReview && (
            <div className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {test.questions.map((_, index) => {
                    const status = index === currentQuestion ? 'current' : getQuestionStatus(index);
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-colors ${getStatusColor(status)}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Flagged ({flaggedCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span>Not Answered ({test.totalQuestions - answeredCount})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {test.totalQuestions}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                    {currentQuestionData.points} points
                  </span>
                </div>
                
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  <span>{flaggedQuestions.has(currentQuestion) ? 'Flagged' : 'Flag'}</span>
                </button>
              </div>

              {/* Question Content */}
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  {currentQuestionData.question}
                </h2>

                {/* Multiple Choice */}
                {currentQuestionData.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {currentQuestionData.options?.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${currentQuestion}`}
                          value={option}
                          checked={answers[currentQuestion] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Multiple Select */}
                {currentQuestionData.type === 'multiple-select' && (
                  <div className="space-y-3">
                    {currentQuestionData.options?.map((option, index) => (
                      <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option}
                          checked={Array.isArray(answers[currentQuestion]) && (answers[currentQuestion] as string[]).includes(option)}
                          onChange={(e) => {
                            const currentAnswers = (answers[currentQuestion] as string[]) || [];
                            if (e.target.checked) {
                              handleAnswerChange(currentQuestion, [...currentAnswers, option]);
                            } else {
                              handleAnswerChange(currentQuestion, currentAnswers.filter(a => a !== option));
                            }
                          }}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Input */}
                {currentQuestionData.type === 'text' && (
                  <textarea
                    value={(answers[currentQuestion] as string) || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  
                  {currentQuestion === test.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Test</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAttemptPage;
