"use client";

import Image from "next/image";
import Link from "next/link";

export default function OurTeam() {
  // Team members data
  const teamMembers = [
    {
      name: "Anjali Sharma",
      role: "Founder & CEO",
      bio: "10+ years in education technology and career development.",
      image: "/user.jpg",
      socials: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Rahul Patel",
      role: "Chief Learning Officer",
      bio: "Education expert with background in curriculum design.",
      image: "/user.jpg",
      socials: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Priya Gupta",
      role: "Head of Hiring Solutions",
      bio: "15+ years connecting talent with opportunities.",
      image: "/user.jpg",
      socials: {
        linkedin: "#",
        twitter: "#",
      },
    },
    {
      name: "Vikram Singh",
      role: "Technical Director",
      bio: "Expert in educational technology and learning platforms.",
      image: "/user.jpg",
      socials: {
        linkedin: "#",
        twitter: "#",
      },
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Our Leadership Team
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700 mt-4">
            Experienced professionals dedicated to transforming education and empowering careers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {teamMembers.map((member, index) => (
            <div key={index} className="group">
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-center space-x-4">
                      <Link href={member.socials.linkedin} className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-blue-600 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                      </Link>
                      <Link href={member.socials.twitter} className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-blue-400 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
