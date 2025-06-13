"use client";

import Image from "next/image";
import Link from "next/link";

export default function OurAlumni() {
  // Alumni data
  const alumni = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "/images/companies/google.svg",
      quote: "Nirudhyog helped me build the technical and soft skills that made me stand out to recruiters.",
      year: "Class of 2023"
    },
    {
      name: "Rahul Patel",
      role: "Data Scientist at Microsoft",
      image: "/images/companies/microsoft.svg",
      quote: "The specialized training in data science accelerated my career path and helped me land my dream job.",
      year: "Class of 2022"
    },
    {
      name: "Ananya Desai",
      role: "Product Manager at JPMorgan Chase",
      image: "/images/companies/jpmorgan.svg",
      quote: "The mentorship and career guidance I received were invaluable for my transition into product management.",
      year: "Class of 2023"
    },
    {
      name: "Vivek Kumar",
      role: "Full Stack Developer at Infosys",
      image: "/images/companies/infosys.svg",
      quote: "The practical projects and industry-focused curriculum prepared me for real-world challenges.",
      year: "Class of 2021"
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-yellow-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-blue-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Alumni Success
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700">
            Meet some of our outstanding alumni who have transformed their careers through Nirudhyog&apos;s programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {alumni.map((person, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                    <Image 
                      src={person.image}
                      alt={person.role}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-blue-600">{person.role}</p>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-700 border-l-4 border-blue-600 pl-4 py-2 mb-3">
                  &quot;{person.quote}&quot;
                </blockquote>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">{person.year}</span>
                  <div className="flex space-x-1">
                    {Array(5).fill(0).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/success-stories" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
              View More Success Stories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <p className="mt-6 text-gray-600">
            Join our growing network of successful professionals and build your career with us.
          </p>
        </div>
      </div>
    </section>
  );
}
