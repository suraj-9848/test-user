"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineGoogle } from "react-icons/ai";

const SignIn = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <div className="min-h-screen px-6 bg-white py-24 md:py-2 flex items-center justify-center md:px-4">
      <div className="w-full  max-w-5xl   md:min-h-[65vh] grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-black/10">
        
        {/* Left Panel (Student Info) */}
        <div className="bg-white text-black flex flex-col justify-center p-10">
          <div className="mb-8">
            <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold">N</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Welcome Student
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Access your courses, track your learning, and manage your academic progress—all in one elegant space.
          </p>

          <div className="mt-10 bg-gray-100 p-5 rounded-xl">
            <p className="text-sm italic text-gray-600 mb-2">
              “A smarter way to learn.”
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold text-sm">
                S
              </div>
              <div>
                <p className="text-sm font-semibold">Student Portal</p>
                <p className="text-xs text-gray-500">Nirudhuyog LMS</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (Sign-In) */}
        <div className="bg-blue-900 min-h-[400px] text-white flex flex-col items-center justify-center px-10">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Sign In
          </h1>
          <p className="text-sm text-gray-300 text-center mb-6">
            Use your college email to continue
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full max-w-xs flex items-center justify-center gap-3 py-2 px-4 bg-white text-black rounded-lg shadow hover:bg-gray-100 transition"
          >
            <AiOutlineGoogle size={20} />
            <span className="font-medium">Continue with Google</span>
          </button>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Trouble signing in?{" "}
            <span className="underline cursor-pointer hover:text-white">
              Contact admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
