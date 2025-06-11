"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AboutHeader() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['first.e4d1fbde.svg', 'second.4fe17835.svg', 'third.3e25901b.svg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-16 pt-32 overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-70 animate-blob filter blur-xl animation-delay-2000"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-70 animate-blob filter blur-xl animation-delay-4000"></div>
        <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply opacity-70 animate-blob filter blur-xl"></div>
        
        {/* Enhanced grid pattern */}
        <svg className="absolute top-0 left-0 w-full h-auto opacity-[0.03]" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
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
          {/* Enhanced content section */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block px-4 py-1.5 mb-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white transform hover:scale-105 transition-transform duration-300">
              <span className="text-sm font-medium">Transforming Education</span>
            </div>
            
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">We&apos;re on a mission to</span>
              <span className="relative inline-block mx-2">
                <span className="relative z-10 text-indigo-600 font-extrabold">redefine</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-yellow-200 -z-10 transform -rotate-2"></span>
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">education</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none backdrop-blur-sm">
              Nirudhyog bridges the gap between learning and career success through innovative training, personalized mentorship, and direct connections to employment opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link 
                href="/courses" 
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
              >
                Explore Our Courses
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="#our-journey" 
                className="px-8 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
              >
                Journey
              </Link>
            </div>
            
            {/* Enhanced stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto lg:mx-0">
              {[
                { number: "17", suffix: "k+", label: "Students Trained" },
                { number: "7.5", suffix: "k+", label: "Students Placed" },
                { number: "50", suffix: "+", label: "Partner Companies" },
                { number: "100", suffix: "%", label: "Career Support" }
              ].map((stat, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-indigo-50 p-4 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    <span>{stat.number}</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-gray-600 text-sm group-hover:text-indigo-600 transition-colors duration-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Enhanced visual element */}
          <div className="flex-1 relative">
            <div className="relative z-10">
              <div className="absolute -top-10 -left-10 w-full h-full bg-gradient-to-br from-yellow-400 to-pink-400 rounded-2xl transform rotate-3 opacity-20 blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-full h-full bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-2xl transform -rotate-3 opacity-20 blur-xl"></div>
              
              <div className="relative bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-indigo-50 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="pt-12 pb-6 px-6">
                  <Image
                    src={`/images/learning/${images[currentImageIndex]}`}
                    alt="Learning approach visualization"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
                  />
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Our Learning Approach</h3>
                      <p className="text-sm text-gray-600">Personalized, interactive & industry-focused</p>
                    </div>
                    <div className="flex -space-x-1">
                      {[1, 2, 3].map((num, i) => (
                        <div 
                          key={i}
                          className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold transform hover:scale-110 transition-all duration-300 hover:z-10 ${
                            i === currentImageIndex 
                              ? 'bg-gradient-to-br from-indigo-600 to-blue-600 scale-110 z-10' 
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50'
                          }`}
                          onClick={() => setCurrentImageIndex(i)}
                          style={{ cursor: 'pointer' }}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating elements */}
              <div className="absolute top-16 -right-12 bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 110-2h7.586l-3.293-3.293A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute bottom-16 -left-10 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.666 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom divider */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50"></div>
    </section>
  );
}
