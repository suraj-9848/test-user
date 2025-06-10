"use client";

import Image from "next/image";

export default function AboutHeader() {
  return (
    <section className="relative pt-24 pb-16 bg-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            About Nirudhyog
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-xl text-gray-700">
            Empowering students and job seekers with the skills, knowledge, and connections they need to thrive in today's competitive job market.
          </p>
        </div>          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-blue-100 rounded-xl transform rotate-3 opacity-60"></div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-yellow-100 rounded-xl transform -rotate-3 opacity-60"></div>
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/hero-image.png"
                alt="About Nirudhyog"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-700">
                Nirudhyog is a comprehensive career development platform dedicated to preparing students and job seekers for successful careers. We bridge the gap between education and employment through industry-relevant training, mentorship, and direct connections to hiring opportunities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <p className="text-gray-700">Students Trained</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-700">Hiring Partners</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <p className="text-gray-700">Specialized Courses</p>
              </div>
              
              <div className="bg-white p-5 rounded-xl shadow-md text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                <p className="text-gray-700">Placement Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
