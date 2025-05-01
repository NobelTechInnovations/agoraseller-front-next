'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800">Welcome back, By Jaipuri Legacy</h3>
        <p className="text-sm text-gray-600 mt-1">Manage your store, track orders, and grow your business with Agora</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Pending Orders */}
        <Link href="/store-manage/orders" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-purple-600 text-lg">📦</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-semibold mt-0.5">0</p>
            </div>
          </div>
        </Link>

        {/* Download Labels */}
        <Link href="/store-manage/orders/labels" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-lg">🏷️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Download Labels</p>
              <p className="text-xl font-semibold mt-0.5">0</p>
            </div>
          </div>
        </Link>

        {/* Out of Stock */}
        <Link href="/store-manage/inventory/out-of-stock" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-red-600 text-lg">📉</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-xl font-semibold mt-0.5">0</p>
            </div>
          </div>
        </Link>

        {/* Low Stock */}
        <Link href="/store-manage/inventory/low-stock" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-orange-600 text-lg">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-xl font-semibold mt-0.5">0</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Business Insights Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2 text-purple-600">📈</span> Business Insights
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'daily' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'weekly' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'monthly' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-gray-50 rounded-lg p-6 h-64 mb-6 flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Chart visualization will go here</p>
            <p className="text-gray-500 text-xs mt-1">Showing data from Apr 21 - Apr 27</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Views <span className="text-gray-400">(26 Apr)</span></p>
            </div>
            <p className="text-xl font-semibold">27</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Orders <span className="text-gray-400">(26 Apr)</span></p>
              <span className="text-red-500 text-xs">↓ 100.00%</span>
            </div>
            <p className="text-xl font-semibold">0</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">In Stock Listings</p>
            </div>
            <p className="text-xl font-semibold">2</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Outstanding Payments</p>
            </div>
            <p className="text-xl font-semibold">₹0</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/store-manage/analytics" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
          >
            View More Details
          </Link>
        </div>
      </div>
    </div>
  );
}
