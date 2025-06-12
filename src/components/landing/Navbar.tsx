"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Hiring", href: "/hiring" },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/about" },
  ];

  return (
    <header>
      <nav className="fixed top-4 left-1/2 z-50 transform -translate-x-1/2 max-w-5xl w-[90%] md:w-full flex items-center justify-between rounded-full border border-gray-200 bg-white/82 backdrop-blur-sm px-6 py-2 md:py-5 shadow-md">
        <div className="flex items-center gap-2 text-lg font-bold text-blue-600">
          <Image src="/logo.svg" alt="logo" width={100} height={60} />
        </div>

        <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-base font-medium text-gray-800">
          {links.map(({ name, href }) => (
            <li key={name} className="relative">
              <Link
                href={href}
                className="group relative inline-block hover:text-blue-600 transition duration-300 ease-in-out will-change-transform transform hover:scale-110"
              >
                {name}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/signin"
            className="relative text-base font-medium text-gray-800 hover:text-blue-600 transition duration-300 ease-in-out will-change-transform transform hover:scale-105"
          >
            Sign in
          </Link>
          <Link href="/signup">
            <span className="rounded-md bg-blue-500 px-4 py-2.5 text-base font-medium text-white shadow-md transition duration-300 ease-in-out will-change-transform transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg cursor-pointer">
              Sign up
            </span>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-gray-300 text-gray-700 bg-white/50 backdrop-blur-md"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        className={clsx(
          "md:hidden fixed top-[72px] left-0 w-full z-40 transition-all duration-300 ease-in-out px-4",
          isOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md p-4 space-y-4 shadow-md">
          {links.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block text-base font-medium text-gray-800 hover:text-blue-600 transition duration-300 ease-in-out transform will-change-transform"
            >
              {name}
            </Link>
          ))}

          <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
            <Link href="/signup" onClick={() => setIsOpen(false)}>
              <span className="block w-full text-center rounded-xl bg-blue-500 py-2.5 text-white font-semibold text-base shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg cursor-pointer">
                Sign up
              </span>
            </Link>
            <Link href="/signin" onClick={() => setIsOpen(false)}>
              <span className="block w-full text-center rounded-xl border border-gray-300 py-2.5 text-gray-800 font-semibold text-base transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 cursor-pointer">
                Sign in
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
