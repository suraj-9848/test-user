'use client'

import { useState } from 'react';
import { Question, TestAnswer, QuestionType } from '@/types/test';
import { CheckCircle, Circle, Square, CheckSquare } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  answer: TestAnswer;
  onAnswerChange: (questionId: string, selectedOptions: string[], textAnswer?: string) => void;
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswerChange
}: QuestionRendererProps) {
  const [textValue, setTextValue] = useState(answer.textAnswer || '');

  const handleOptionChange = (optionId: string, isMultiSelect: boolean = false) => {
    let newSelectedOptions: string[];

    if (isMultiSelect) {
      // For multiple select questions
      if (answer.selectedOptions.includes(optionId)) {
        newSelectedOptions = answer.selectedOptions.filter(id => id !== optionId);
      } else {
        newSelectedOptions = [...answer.selectedOptions, optionId];
      }
    } else {
      // For single select questions (MCQ, True/False)
      newSelectedOptions = [optionId];
    }

    onAnswerChange(question.id, newSelectedOptions);
  };

  const handleTextChange = (value: string) => {
    setTextValue(value);
    onAnswerChange(question.id, [], value);
  };

  const renderMCQOptions = () => {
    if (!question.options) return null;

    return (
      <div className="space-y-3">
        {question.options
          .sort((a, b) => a.optionOrder - b.optionOrder)
          .map((option) => {
            const isSelected = answer.selectedOptions.includes(option.id);
            return (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionChange(option.id)}
              >
                <div className="flex items-center space-x-3">
                  {isSelected ? (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-900">{option.optionText}</span>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderMultipleSelectOptions = () => {
    if (!question.options) return null;

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600 mb-4">
          Select all that apply:
        </p>
        {question.options
          .sort((a, b) => a.optionOrder - b.optionOrder)
          .map((option) => {
            const isSelected = answer.selectedOptions.includes(option.id);
            return (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionChange(option.id, true)}
              >
                <div className="flex items-center space-x-3">
                  {isSelected ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-900">{option.optionText}</span>
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  const renderTrueFalseOptions = () => {
    const options = [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' }
    ];

    return (
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = answer.selectedOptions.includes(option.id);
          return (
            <div
              key={option.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleOptionChange(option.id)}
            >
              <div className="flex items-center space-x-3">
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-gray-900 font-medium">{option.text}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTextInput = (isLongAnswer: boolean = false) => {
    const placeholder = isLongAnswer 
      ? 'Write your detailed answer here...'
      : 'Write your short answer here...';

    if (isLongAnswer) {
      return (
        <div className="space-y-2">
          <textarea
            value={textValue}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none min-h-[200px] resize-vertical"
            rows={8}
          />
          <div className="text-right text-sm text-gray-500">
            {textValue.length} characters
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        />
        <div className="text-right text-sm text-gray-500">
          {textValue.length} characters
        </div>
      </div>
    );
  };

  const getQuestionTypeLabel = () => {
    switch (question.questionType) {
      case QuestionType.MCQ:
        return 'Multiple Choice (Select one)';
      case QuestionType.MULTIPLE_SELECT:
        return 'Multiple Select (Select all that apply)';
      case QuestionType.TRUE_FALSE:
        return 'True/False';
      case QuestionType.SHORT_ANSWER:
        return 'Short Answer';
      case QuestionType.LONG_ANSWER:
        return 'Long Answer';
      default:
        return 'Question';
    }
  };

  const renderQuestionContent = () => {
    switch (question.questionType) {
      case QuestionType.MCQ:
        return renderMCQOptions();
      case QuestionType.MULTIPLE_SELECT:
        return renderMultipleSelectOptions();
      case QuestionType.TRUE_FALSE:
        return renderTrueFalseOptions();
      case QuestionType.SHORT_ANSWER:
        return renderTextInput(false);
      case QuestionType.LONG_ANSWER:
        return renderTextInput(true);
      default:
        return <div className="text-gray-500">Unsupported question type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {getQuestionTypeLabel()}
          </span>
          <span className="text-sm text-gray-500">
            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
          </span>
        </div>
        
        <div className="prose max-w-none">
          <div 
            className="text-lg text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.questionText }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-6">
        {renderQuestionContent()}
      </div>

      {/* Answer Status */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {(answer.selectedOptions.length > 0 || answer.textAnswer) ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Answered</span>
              </>
            ) : (
              <>
                <Circle className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Not answered</span>
              </>
            )}
          </div>
          
          <div className="text-gray-500">
            Question {question.order} of {/* This would be passed from parent */}
          </div>
        </div>
      </div>
    </div>
  );
}