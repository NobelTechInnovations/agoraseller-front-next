'use client';

import { useRouter } from 'next/navigation';
import Sidebar from './sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  
  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('sellerAuth');
    
    // Redirect to login/onboarding page
    router.push('/');
  };
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[220px] flex-1 overflow-auto bg-gray-50 relative">
        {/* Logout button */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={handleLogout}
            className="bg-white hover:bg-gray-100 text-gray-700 font-medium py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
        
        {children}
      </main>
    </div>
  );
} 