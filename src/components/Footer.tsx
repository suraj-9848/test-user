"use client";

import Image from "next/image";
import Link from "next/link";

import { MessageCircle, Instagram, Linkedin, Youtube } from "lucide-react";
export default function Footer() {
  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Hiring", href: "/hiring" },
    { name: "About us", href: "/about-us" },
    { name: "Blogs", href: "/blogs" },
  ];

  // Social links with corresponding icons

  const socialLinks = [
    {
      name: "Whatsapp",
      link: "https://chat.whatsapp.com/KuaphYb8hwiITWbp1bNtpo",
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/trailbliz",
      icon: <Instagram className="w-6 h-6" />,
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/company/trailbliz/",
      icon: <Linkedin className="w-6 h-6" />,
    },
    {
      name: "YouTube",
      link: "https://www.youtube.com/@trailbliz",
      icon: <Youtube className="w-6 h-6" />,
    },
  ];

  return (
    <footer className="bg-gray-950 w-full text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {/* Logo, Social Media Icons vertical */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Image
              width={120}
              height={36}
              src="/logo.svg"
              alt="Logo"
              className="h-9 w-auto"
            />
            <p className="mt-6 text-sm leading-relaxed text-gray-400 max-w-md">
              Empowering careers, fostering growth, and building future-ready
              professionals through collaborative learning and innovative
              solutions.
            </p>

            <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mt-8 mb-4">
              Follow Us
            </h4>
            <ul className="flex space-x-6">
              {socialLinks.map(({ name, link, icon }) => (
                <li key={name}>
                  <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-gray-300 hover:text-white transition"
                  >
                    {icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links vertical */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-6">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-y-2">
              {quickLinks.map(({ name, href }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm text-gray-300 max-w-xs">
              <li className="flex items-start gap-2 flex-wrap">
                <span className="font-bold shrink-0">Email:</span>
                <span className="break-words">contact@nirudhyog.com</span>
              </li>

              <li className="flex items-start gap-2 flex-wrap">
                <span className="font-bold shrink-0">Phone:</span>
                <span className="break-words">+91 81213 98942</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-6">
              Subscribe to newsletter
            </h4>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Text */}
        <hr className="border-gray-700 mt-16 mb-8" />
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Trailbliz. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
