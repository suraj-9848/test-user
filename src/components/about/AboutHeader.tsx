"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutHeader() {
  return (
    <section className="relative py-16 pt-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 to-white"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply opacity-70 animate-blob"></div>
        <svg className="absolute top-0 left-0 w-full h-auto opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="1000" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-blue-50 border border-blue-100">
              <span className="text-sm font-medium text-blue-600">Transforming Education</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-tight">
              We&apos;re on a mission to
              <span className="relative inline-block mx-2">
                <span className="relative z-10 text-blue-600">redefine</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 -z-10"></span>
              </span>
              education
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
              Nirudhyog bridges the gap between learning and career success through innovative training, personalized mentorship, and direct connections to employment opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link 
                href="/courses" 
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center"
              >
                Explore Our Courses
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="#our-story" 
                className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-300"
              >
                Our Story
              </Link>
            </div>
            
            {/* Stats with animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto lg:mx-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">10,000+</div>
                <p className="text-gray-600 text-sm">Students Trained</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <p className="text-gray-600 text-sm">Hiring Partners</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
                <p className="text-gray-600 text-sm">Specialized Courses</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-1">85%</div>
                <p className="text-gray-600 text-sm">Placement Rate</p>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="flex-1 relative">
            <div className="relative z-10">
              <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-yellow-400 to-pink-400 rounded-2xl transform rotate-3 opacity-10"></div>
              <div className="absolute -bottom-10 -right-10 w-full h-full bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-2xl transform -rotate-3 opacity-10"></div>
              
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="pt-12 pb-6 px-6">
                  <Image
                    src="/images/companies/image 97.svg"
                    alt="Students collaborating"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-sm"
                  />
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">Our Learning Approach</h3>
                      <p className="text-sm text-gray-600">Personalized, interactive & industry-focused</p>
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-${i*100} to-indigo-${i*100} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                          {i}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-16 -right-12 bg-white p-4 rounded-lg shadow-lg transform rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 110-2h7.586l-3.293-3.293A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute bottom-16 -left-10 bg-white p-3 rounded-lg shadow-lg transform -rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Divider with accent */}
      <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-r from-blue-50 via-white to-blue-50"></div>
    </section>
  );
}
