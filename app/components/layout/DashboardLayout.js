'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './sidebar';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';


export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('sellerAuth');
    signOut({ callbackUrl: '/' });
  };

  const navigationItems = [
    { name: 'Home', href: '/store-manage' },
    { name: 'Orders', href: '/store-manage/orders' },

    {
      name: 'Listing', href: '/store-manage/inventory/listing',
      items: [
        { name: 'Product Listing', href: '/store-manage/inventory/listing' },
        { name: 'Add Product', href: `/store-manage/inventory/${btoa(session?.user?.id)}/add` },
        { name: 'Warehouse', href: '/store-manage/warehouse' },
        { name: 'Inventory Excel', href: '/store-manage/inventory-excel' },
        { name: 'View All', href: '/store-manage/listings' }
      ]
    },
    { name: 'Returns', href: '/store-manage/returns' },
    { name: 'Payments', href: '/store-manage/payments' },
    { name: 'Advertisement', href: '/store-manage/advertisement' },
    {
      name: 'Reports',
      items: [
        { name: 'Return Report', href: '/store-manage/reports/returns' },
        { name: 'Sale Revenue', href: '/store-manage/reports/revenue' }
      ]
    },
    {
      name: 'Support',
      items: [
        { name: 'FAQs', href: '/store-manage/support/faqs' },
        { name: 'Raise Ticket', href: '/store-manage/support/ticket' }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with close button */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-[240px] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out bg-[#1a1a1a]`}>
        {/* Store profile header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">

            <div className="text-sm text-white">
              <p className="font-bold">ByJaipuri Legacy</p>
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
            <div className="px-4 py-3 flex items-center justify-between">
              {/* Left section: Store info */}
              <div className="flex items-center gap-4">
                {/* Store Name */}
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.freepnglogos.com/uploads/flipkart-logo-png/flipkart-com-logo-internet-ltd-state-of-kerala-10.png"
                    alt="logo"
                    width={120}
                    height={50}
                  />

                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-gray-800">By Jaipuri Legacy</h4>
                    <span className="text-xs text-dark bg-gray-300 px-2 py-0.5 rounded-sm">Jaipur</span>
                  </div>
                </div>
              </div>

              {/* Middle section: Navigation */}
              <nav className="flex items-center gap-1 flex-1 ml-5">

                <Link
                  href={`/store-manage/inventory/${btoa(session?.user?.id)}/add`}
                  className="px-4 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >

                  Add Product
                </Link>

                {navigationItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => item.items && setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href || '#'}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1"
                    >
                      {item.name}
                      {item.items && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>


                    {/* Dropdown menu */}
                    {item.items && activeDropdown === index && (
                      <div className="absolute left-0  w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                        {item.items.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                ))}


              </nav>

              {/* Right section: Actions */}
              <div className="flex items-center gap-4">
                {/* Add Product Button */}
                <Link
                  href={`/store-manage/inventory/dfs468g/add`}
                  className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  Raise Ticket
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">Store Admin</span>
                      <span className="text-xs text-gray-500">ID: STORE123456</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/store-manage/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Account
                      </Link>
                      <Link
                        href="/store-manage/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
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