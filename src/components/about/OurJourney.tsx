"use client";

import Link from "next/link";

export default function OurJourney() {
  // Milestones data
  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description: "Nirudhyog was founded with a vision to bridge the gap between education and employment."
    },
    {
      year: "2021",
      title: "First Courses",
      description: "Launched our first set of courses focusing on in-demand skills in technology and business."
    },
    {
      year: "2022",
      title: "Hiring Platform",
      description: "Introduced our innovative hiring platform connecting qualified candidates with employers."
    },
    {
      year: "2023",
      title: "Community Growth",
      description: "Reached 10,000+ learners and partnered with 50+ companies for hiring solutions."
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded our course offerings and launched specialized career tracks for various industries."
    }
  ];

  return (
    <section className="py-16 bg-gray-50/50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Journey
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700 mt-4">
            From our founding to where we are today, every milestone has been guided by our commitment to empowering careers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Journey timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative z-10">
                  <div className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Year bubble - always centered on mobile, alternating sides on desktop */}
                    <div className="absolute top-0 left-0 md:left-1/2 transform -translate-y-1/2 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 border-4 border-white shadow-lg z-20">
                      <span className="text-sm font-bold text-white">{milestone.year}</span>
                    </div>
                    
                    {/* Content box */}
                    <div className={`mt-8 md:mt-0 ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-700">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Future section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              As we look to the future, we remain committed to innovation and excellence in education. 
              Our vision is to become the leading platform that connects learning with career success, 
              empowering millions to achieve their professional goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/careers" className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300">
                View Open Positions
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors duration-300">
                Contact Us
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
