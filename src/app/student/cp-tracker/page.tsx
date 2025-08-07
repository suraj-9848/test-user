"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CPTrackerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new CP Connection page
    router.replace("/student/cp-connection");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirecting to CP Connection...</p>
      </div>
    </div>
  );
}
