"use client";

import Image from "next/image";
import Link from "next/link";

export default function OurTeam() {
  // Team member data
  const founder = {
    name: "Nethaji Pusapati",
    role: "Founder & CEO | Nirudhyog",
    bio: "While most people wait for perfect conditions to start, Nethaji Pusapati built Nirudhyog from scratch in February 2024 with just one belief — if students get the right guidance and opportunities at the right time, they can change their entire career story.\\n\\nA 21-year-old entrepreneur, career mentor, and ex-army aspirant turned startup founder, Nethaji leads everything at Nirudhyog — from college partnerships, training modules, student mentorship, to placement drives.\\n\\nHe’s not a suit-and-tie CEO sitting in an office. He’s the guy who’s in your college canteen, career seminars, training labs, and LinkedIn DMs making things happen.\\n\\nUnder his leadership:\\n→ 17000+ students trained (offline + online)\\n→ 20+ engineering colleges partnered across Telugu states\\n→ Technical training, career roadmap sessions, and placement prep programs launched\\n\\nAnd this is just Year 1.",
    image: "/ceo.jpeg", // Updated image path
    socials: {
      linkedin: "https://www.linkedin.com/in/nethaji-pusapati/", // Example, replace with actual
      twitter: "#", // Example, replace with actual
    },
  };

  // Split bio into paragraphs
  const bioParagraphs = founder.bio.split('\\n').filter(p => p.trim() !== '');

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 text-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-indigo-50 rounded-full opacity-40 blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Our Founder
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700 mt-4">
            The visionary leader steering Nirudhyog towards empowering careers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl overflow-hidden relative border border-gray-100">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-3 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-start gap-8 md:gap-12 relative">
              {/* Image Section */}
              <div className="w-full md:w-2/5 lg:w-1/3 flex-shrink-0">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] shadow-lg group">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex justify-center space-x-3">
                        {founder.socials.linkedin && (
                          <Link href={founder.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/15 backdrop-blur-sm hover:bg-blue-600 text-white transition-all duration-300 ring-1 ring-white/20 hover:ring-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                            </svg>
                            <span className="sr-only">LinkedIn</span>
                          </Link>
                        )}
                        {founder.socials.twitter && founder.socials.twitter !== "#" && (
                          <Link href={founder.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/15 backdrop-blur-sm hover:bg-sky-500 text-white transition-all duration-300 ring-1 ring-white/20 hover:ring-sky-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                            <span className="sr-only">Twitter</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content Section */}
              <div className="md:w-3/5 lg:w-2/3 text-gray-800 md:pl-8 lg:pl-10 mt-6 md:mt-0">
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{founder.name}</h3>
                    <p className="text-blue-600 font-medium mb-6 pb-4 border-b border-gray-100">
                      {founder.role}
                    </p>
                  </div>

                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    {bioParagraphs.map((paragraph, pIndex) => {
                      if (paragraph.toLowerCase().includes("under his leadership:")) {
                        return (
                          <div key={pIndex} className="mt-6 mb-3">
                            <h4 className="inline-flex items-center font-semibold text-gray-800">
                              <span className="bg-blue-50 px-4 py-2 rounded-full">{paragraph}</span>
                            </h4>
                          </div>
                        );
                      }
                      if (paragraph.startsWith('→')) {
                        return (
                          <div key={pIndex} className="flex items-start pl-2 py-2 transition-all duration-300 hover:bg-slate-50 rounded-lg">
                            <span className="text-blue-500 mr-3 text-lg flex-shrink-0">→</span>
                            <span className="flex-1 text-gray-700">{paragraph.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      if (paragraph.toLowerCase().includes("and this is just year 1.")) {
                        return (
                          <div key={pIndex} className="mt-6">
                            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md relative overflow-hidden">
                              <div className="absolute inset-0 opacity-10">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                  <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                                  <path d="M0,0 L100,100 M100,0 L0,100" fill="none" stroke="currentColor" strokeWidth="1" />
                                </svg>
                              </div>
                              <p className="text-center text-white font-semibold relative">{paragraph}</p>
                            </div>
                          </div>
                        );
                      }
                      return <p key={pIndex} className="mb-3 text-gray-700">{paragraph}</p>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
