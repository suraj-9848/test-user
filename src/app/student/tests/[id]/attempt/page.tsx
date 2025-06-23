'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TestAttemptPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main tests page since TestInterface handles the full experience
    router.replace('/student/tests');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Redirecting to tests...</p>
      </div>
    </div>
  );
};

export default TestAttemptPage;
