'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="p-3 max-w-6xl mx-auto">
      {/* Welcome header */}
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-gray-800">Welcome back, By Jaipuri Legacy</h1>
        <p className="text-xs text-gray-600 mt-0.5">Manage and grow your business with Meesho</p>
      </div>

      {/* Returnless refunds banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-2.5 mb-4 flex items-start">
        <div className="mr-2.5 bg-amber-100 p-1.5 rounded">
          <div className="w-5 h-5 flex items-center justify-center text-amber-600 text-xs">
            📦
          </div>
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-800">Introducing Returnless Refunds Policy - Mandatory for all sellers!</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            For select cases of damaged, defective, poor-quality, or incorrect products, only trusted users will get a refund without returning the item.
          </p>
        </div>
        <Link 
          href="/store-manage/returns" 
          className="ml-auto bg-white hover:bg-gray-50 text-purple-600 px-2.5 py-1 rounded-md text-xs border border-purple-200"
        >
          View Returns
        </Link>
      </div>

      {/* To-do list section */}
      <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center mb-2.5">
          <h2 className="text-sm font-medium text-gray-800 flex items-center">
            <span className="mr-1.5 text-xs">📋</span> To do list
          </h2>
        </div>
        
        <div className="grid grid-cols-4 gap-2.5">
          {/* Pending Orders */}
          <Link href="/store-manage/orders" className="border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mr-2 text-xs">
                📦
              </div>
              <div>
                <p className="text-xs text-gray-600">Pending Orders</p>
                <p className="text-sm font-medium mt-0.5">0</p>
              </div>
              <span className="ml-auto text-gray-400 text-xs">›</span>
            </div>
          </Link>

          {/* Download Labels */}
          <Link href="/store-manage/orders/labels" className="border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2 text-xs">
                🏷️
              </div>
              <div>
                <p className="text-xs text-gray-600">Download Labels</p>
                <p className="text-sm font-medium mt-0.5">0</p>
              </div>
              <span className="ml-auto text-gray-400 text-xs">›</span>
            </div>
          </Link>

          {/* Out of Stock */}
          <Link href="/store-manage/inventory/out-of-stock" className="border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-2 text-xs">
                📉
              </div>
              <div>
                <p className="text-xs text-gray-600">Out of Stock</p>
                <p className="text-sm font-medium mt-0.5">0</p>
              </div>
              <span className="ml-auto text-gray-400 text-xs">›</span>
            </div>
          </Link>

          {/* Low Stock */}
          <Link href="/store-manage/inventory/low-stock" className="border border-gray-200 rounded-lg p-2.5 hover:shadow-sm transition-shadow">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-2 text-xs">
                📊
              </div>
              <div>
                <p className="text-xs text-gray-600">Low Stock</p>
                <p className="text-sm font-medium mt-0.5">0</p>
              </div>
              <span className="ml-auto text-gray-400 text-xs">›</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Business Insights Section */}
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-800 flex items-center">
            <span className="mr-1.5 text-xs">📈</span> Business Insights
          </h2>
          <div className="flex items-center space-x-1">
            <button 
              className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'daily' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'weekly' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-2 py-0.5 text-xs rounded-full ${activeTab === 'monthly' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Placeholder for chart */}
        <div className="border border-gray-200 rounded-lg p-2.5 h-40 mb-3 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Chart visualization will go here</p>
            <p className="text-gray-500 text-xs mt-1">Showing data from Apr 21 - Apr 27</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div className="flex justify-between mb-1">
              <p className="text-gray-500 text-xs">Views <span className="text-gray-400 text-xs">(26 Apr)</span></p>
            </div>
            <p className="text-base font-medium">27</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div className="flex justify-between mb-1">
              <p className="text-gray-500 text-xs">Orders <span className="text-gray-400 text-xs">(26 Apr)</span></p>
              <span className="text-red-500 text-xs">↓ 100.00%</span>
            </div>
            <p className="text-base font-medium">0</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div className="flex justify-between mb-1">
              <p className="text-gray-500 text-xs">In Stock Listings</p>
            </div>
            <p className="text-base font-medium">2</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-2.5">
            <div className="flex justify-between mb-1">
              <p className="text-gray-500 text-xs">Outstanding Payments</p>
            </div>
            <p className="text-base font-medium">₹0</p>
          </div>
        </div>

        <div className="mt-3 text-center">
          <Link 
            href="/store-manage/analytics" 
            className="inline-block text-purple-600 border border-purple-200 px-3 py-1 rounded-md text-xs bg-white hover:bg-gray-50"
          >
            View More Details
          </Link>
        </div>
      </div>
    </div>
  );
}
