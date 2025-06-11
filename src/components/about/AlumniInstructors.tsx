"use client";

import Image from "next/image";

export default function AlumniInstructors() {
  // Top colleges/institutions data
  const topColleges = [
    {
      name: "Indian Institute of Technology (IIT)",
      logo: "/images/companies/image 90.svg",
      instructors: 12,
      expertise: ["Computer Science", "AI & Machine Learning", "Data Engineering"]
    },
    {
      name: "Indian Institute of Management (IIM)",
      logo: "/images/companies/image 91.svg",
      instructors: 8,
      expertise: ["Business Administration", "Leadership", "Management"]
    },
    {
      name: "Massachusetts Institute of Technology (MIT)",
      logo: "/images/companies/image 92.svg",
      instructors: 6,
      expertise: ["Computer Science", "Software Engineering", "Robotics"]
    },
    {
      name: "Stanford University",
      logo: "/images/companies/image 93.svg",
      instructors: 5,
      expertise: ["AI Research", "Product Design", "Data Science"]
    },
    {
      name: "Harvard University",
      logo: "/images/companies/image 94.svg",
      instructors: 4,
      expertise: ["Business Strategy", "Economics", "Finance"]
    },
    {
      name: "National Institute of Technology (NIT)",
      logo: "/images/companies/image 96.svg",
      instructors: 10,
      expertise: ["Engineering", "Technology", "Computer Applications"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50/50 overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-yellow-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Learn from the Best
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            Our instructors come from world-renowned institutions and bring years of academic and industry experience
          </p>
        </div>

        {/* Colleges and institutions */}
        <div className="bg-white rounded-xl p-8 shadow-md mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Our Instructors Come From Top Institutions
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topColleges.map((college, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center mb-3 bg-gray-50 rounded-lg p-3">
                  <Image 
                    src={college.logo}
                    alt={college.name}
                    width={80}
                    height={80}
                    className="max-h-16 object-contain"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center">{college.name}</p>
                <p className="text-sm text-blue-600 text-center">{college.instructors} instructors</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
