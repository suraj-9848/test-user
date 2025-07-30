"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useJWT } from "@/context/JWTContext";
import { BASE_URLS, API_ENDPOINTS, getAdminDashboardUrl } from "@/config/urls";

export default function SignIn() {
  const { data: session, status } = useSession();
  const { setJwt } = useJWT();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchangeGoogleJwt = async (googleJwt: string) => {
      try {
        setLoading(true);
        setError(null);

        // Try admin login first
        const adminResponse = await fetch(`${BASE_URLS.BACKEND}${API_ENDPOINTS.AUTH.ADMIN_LOGIN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token: googleJwt }),
        });

        if (adminResponse.ok) {
          const adminData = await adminResponse.json();
          sessionStorage.setItem('adminToken', adminData.token);
          sessionStorage.setItem('adminUser', JSON.stringify(adminData.user));
          setUserType('admin');
          
          const adminDashboardUrl = getAdminDashboardUrl();
          if (adminDashboardUrl) {
            window.location.href = adminDashboardUrl;
          } else {
            router.push('/admin');
          }
          return;
        }

        // Try student login
        const studentResponse = await fetch(`${BASE_URLS.BACKEND}${API_ENDPOINTS.AUTH.EXCHANGE}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token: googleJwt }),
        });

        if (studentResponse.ok) {
          const studentData = await studentResponse.json();
          setJwt(studentData.token);
          localStorage.setItem('jwt', studentData.token);
          setUserType('student');
          router.push('/student');
          return;
        }

        // Both failed
        const errorData = await studentResponse.json();
        setError(errorData.error || 'Authentication failed');
        
      } catch (error) {
        console.error('Authentication error:', error);
        setError('Network error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Check if user just signed in with Google
    if (status === "authenticated" && (session as any)?.id_token && !userType) {
      exchangeGoogleJwt((session as any).id_token);
    } else if (status === "unauthenticated") {
      localStorage.removeItem("jwt");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");
    }
  }, [status, session, setJwt, userType, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we verify your credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Nirudhyog</h1>
          <p className="text-gray-600">Sign in with your Google account to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
