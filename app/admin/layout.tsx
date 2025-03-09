'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import Navbar from '@/app/components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdminAuthenticated } = useAdminAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Admin layout mounted, auth status:", isAdminAuthenticated);
    
    // Check authentication immediately
    if (!isAdminAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push('/admin/login');
    } else {
      console.log("Authenticated, showing admin content");
      setIsLoading(false);
    }
    
    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      console.log("Safety timeout triggered");
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(safetyTimer);
  }, [isAdminAuthenticated, router]);

  // Show admin content immediately if authenticated
  if (isAdminAuthenticated && isLoading) {
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {children}
    </div>
  );
}