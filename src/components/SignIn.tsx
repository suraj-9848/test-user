"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AiOutlineGoogle } from "react-icons/ai";
import {
  
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { validateOAuthUser } from "../../utils/auth";

const SignIn = () => {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (status === "authenticated" && session?.jwt) {
        const result = await validateOAuthUser(session.jwt);
        console.log("validateOAuthUser result:", result); // Debug log
        if (
          result.valid &&
          result.data?.user?.userRole &&
          result.data.user.userRole.toLowerCase() === "student"
        ) {
          router.push("/student");
        } else {
          router.push("/"); // fallback for other roles
        }
      }
    };
    checkAndRedirect();
  }, [status, session, router]);

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/sign-in", // Redirect back to sign-in page so role check runs
    });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-50 rounded-full translate-x-1/2 translate-y-1/2 opacity-60"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-100 rounded-full opacity-40"></div>
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-blue-50 rounded-full opacity-50"></div>
      <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-purple-50 rounded-full opacity-30"></div>
      <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-purple-100 rounded-full opacity-50"></div>

      <div className="relative z-10 min-h-screen px-6 py-8 md:py-6 flex items-center justify-center md:px-4">
        <div className="w-full max-w-5xl md:min-h-[50vh] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-blue-100 bg-white">
          {/* Left Panel (Student Info) */}
          <div className="bg-white text-slate-800 flex flex-col justify-center p-8 lg:p-12 relative">
            {/* Logo and branding */}
            <div className="mb-6">
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">  
                <span className="text-xl font-bold">N</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                  Nirudhyog LMS
                </span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <h2 className="text-xl lg:text-2xl font-semibold mb-3 text-slate-800">
              Ready to continue your learning journey?
            </h2>

            <p className="text-base text-slate-600 leading-relaxed mb-6">
              Access your personalized courses, track your progress, and connect
              with mentors—all in one powerful learning platform.
            </p>

            {/* Features list */}

            {/* Testimonial card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-semibold text-base shadow-lg">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 italic mb-2 leading-relaxed text-sm">
                   &ldquo;Nirudhyog transformed my learning experience. The structured approach and expert guidance helped me land my dream job at Microsoft.&rdquo;

                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        Sarah Kumar
                      </p>
                      <p className="text-xs text-slate-500">
                        Software Engineer at Microsoft
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-yellow-400 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Sign-In) */}
          <div className="bg-slate-900 min-h-[400px] text-white flex flex-col items-center justify-center px-8 lg:px-12 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-16 left-8 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/4 right-1/4 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/4 w-10 h-10 border-2 border-white rounded-full"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sign In</h2>
                <p className="text-slate-300 text-base">
                  Continue your learning journey
                </p>
              </div>

              {/* Sign in button */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full group relative flex items-center justify-center gap-3 py-3 px-6 bg-white text-slate-900 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-white hover:border-blue-100"
              >
                <div className="absolute inset-0 bg-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <AiOutlineGoogle size={20} />
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-slate-700"></div>
                <span className="px-4 text-slate-400 text-sm">
                  Secure & Private
                </span>
                <div className="flex-1 h-px bg-slate-700"></div>
              </div>

              {/* Additional info */}
              <div className="text-center space-y-3">
                <p className="text-slate-400 text-xs">
                  By signing in, you agree to our{" "}
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline">
                    Privacy Policy
                  </span>
                </p>

                <p className="text-slate-400 text-xs">
                  Need help?{" "}
                  <span className="text-blue-400 hover:text-blue-300 cursor-pointer underline font-medium">
                    Contact Support
                  </span>
                </p>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
