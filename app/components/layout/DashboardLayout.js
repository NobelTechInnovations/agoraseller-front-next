'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import NProgress from 'nprogress';
import RouteProgress from '../RouteProgress';
import axiosInstance from '../../utils/axios';
import { getSession } from 'next-auth/react';

export default function DashboardLayout({ children }) {

  const router = useRouter();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [storeId, setStoreId] = useState('');

  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          const response = await axiosInstance.get('/v1/seller/accounts/profile', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          if (response.data.success && response.data.data.business_details) {
            setBusinessName(response.data.data.business_details.business_name || '');
            setOwnerName(response.data.data.personal.name || '');
            setStoreId(String(response.data.data.personal.id).slice(-6).toUpperCase() || session.user?.phone);
          }
        }
      } catch (error) {
        console.error('Error fetching business name:', error);
      }
    };

    fetchBusinessName();
  }, []);
  
  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('sellerAuth');
    signOut({ callbackUrl: '/' });
  };

  const navigationItems = [

    {
      name: 'Add Product', href: `/store-manage/inventory/${btoa(session?.user?.id)}/add`,
    },
    { name: 'Returns', href: '/store-manage/returns' },
    {
      name: 'Reports',
      items: [
        { 
          name: 'Return Report', 
          href: '/store-manage/reports/returns',
          onClick: () => {
            const downloadReturnReport = async () => {
              try {
                const session = await getSession();
                const response = await axiosInstance.get('/v1/seller/dashboard/returns-report',  {
                  headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                  },
                });
                
                const blob = new Blob([response.data], { 
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'geniezy-return-report.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error('Error downloading return report:', error);
              }
            };
            downloadReturnReport();
          }
        },
        { 
          name: 'Sale Revenue', 
          href: '/store-manage/reports/revenue',
          onClick: () => {
            const downloadSalesReport = async () => {
              try {
                const session = await getSession();
                const response = await axiosInstance.get('/v1/seller/dashboard/sales-report', {
                  responseType: 'blob',
                  headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                  },
                });
                
                const blob = new Blob([response.data], { 
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Geniezy-sales-report.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              } catch (error) {
                console.error('Error downloading sales report:', error);
              }
            };
            downloadSalesReport();
          }
        }
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
    <>
      <RouteProgress />
      <div className="min-h-screen bg-gray-50">
        {/* Full width header */}
        <header className="w-full h-16 bg-white border-b border-gray-200 fixed top-0 left-0 z-30">
          <div className="px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-500 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/store-manage" className="flex items-center gap-3">
                <img src="/logo2.png" alt="Seller Hub Logo" className="h-8 w-auto" />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">Seller</span>
                  <span className="text-sm text-gray-600">| {businessName || 'Unknown Store'}</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex space-x-6">
                {navigationItems.map((item, index) => (
                  <div key={index} className="relative group">
                    {item.items ? (
                      <>
                        <a
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
                        >
                          {item.name}
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </a>
                        {activeDropdown === item.name && (
                          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            {item.items.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                onClick={subItem.onClick}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex flex-col items-end gap-1"
                >
                  <span className="text-sm font-medium text-gray-800">{ownerName}</span>
                  <span className="text-xs text-gray-600">Store ID: {storeId}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="pt-16 flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20 pt-16`}>
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 ${isSidebarOpen ? 'ml-24' : 'ml-0'}`}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 