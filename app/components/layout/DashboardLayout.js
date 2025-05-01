'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './sidebar';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('sellerAuth');
    
    // Redirect to login/onboarding page
    router.push('/');
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar with close button */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-[240px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-[#1a1a1a]`}>
        {/* Store profile header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-black font-semibold">
              <span>JL</span>
            </div>
            <div className="text-sm text-white">
              <p className="font-bold">By Jaipuri Legacy</p>
            </div>
          </div>
          {/* Close button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-white hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <Sidebar />
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 transition-all duration-200 ease-in-out ${isSidebarOpen ? 'ml-[240px]' : 'ml-0'}`}>
        <div className=" mx-auto">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-4">
                {/* Hamburger Menu */}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-md hover:bg-gray-100"
                  aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Store Name */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm-">JL</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 text-sm">By Jaipuri Legacy</h4>
                </div>

                {/* Quick Actions */}
                <div className="hidden md:flex items-center gap-2">
                  <Link 
                    href="/store-manage/orders"
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Orders
                  </Link>
                  <Link 
                    href={`/store-manage/inventory/dfs468g/add`}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Add Products
                  </Link>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="bg-gray-50 min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto px-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 