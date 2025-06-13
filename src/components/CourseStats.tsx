import React from 'react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

export default function CourseStats() {
  const stats = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      label: "Active Students",
      value: "17,000+",
      growth: "+12% this month",
      color: "bg-blue-50 border-blue-100"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      label: "Courses Available",
      value: "150+",
      growth: "+5 new courses",
      color: "bg-green-50 border-green-100"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      label: "Certificates Issued",
      value: "13,600+",
      growth: "+8% completion rate",
      color: "bg-purple-50 border-purple-100"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      label: "Success Rate",
      value: "94%",
      growth: "Industry leading",
      color: "bg-orange-50 border-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`${stat.color} border rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {stat.icon}
            </div>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {stat.label}
            </p>
            <p className="text-xs text-gray-500">
              {stat.growth}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}