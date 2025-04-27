'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('last-month');
  
  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Return/RTO Orders</h1>
        <div className="flex items-center gap-2">
          <a 
            href="https://www.youtube.com/watch?v=your-video-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-xs text-gray-600 gap-1"
          >
            <span className="bg-red-600 text-white rounded flex items-center justify-center p-1 w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </span>
            How it works?
          </a>
          <div className="relative">
            <input 
              type="text" 
              className="border border-gray-300 rounded px-3 py-1.5 pl-9 text-xs w-[250px]"
              placeholder="Search by Order ID, SKU or AWB Number"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Choose courier partner banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center">
        <div className="mr-3 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-800">Choose your courier partner for customer returns now</h2>
          <p className="text-xs text-gray-600">
            Starting 1st Jan 2023, your Customer Returns claims will be investigated and approved only by your courier partners.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap">
          Open Courier Partner
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex text-sm">
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'return-tracking' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('return-tracking')}
          >
            Return Tracking
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'claim-tracking' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('claim-tracking')}
          >
            Claim Tracking
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'courier-partner' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('courier-partner')}
          >
            Courier Partner
          </button>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <h2 className="text-sm font-medium text-gray-800 mr-2">Summary</h2>
            <span className="text-xs text-gray-500">(31 Mar'25 - 27 Apr'25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option value="last-month">Last 1 Month</option>
                <option value="last-3-months">Last 3 Months</option>
                <option value="last-6-months">Last 6 Months</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <button className="flex items-center gap-1 text-indigo-600 border border-indigo-200 rounded px-3 py-1.5 text-xs bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3m0 0l3 3m-3-3v9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Trend
            </button>
          </div>
        </div>
        
        {/* RTO Approved Claims Box */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <h3 className="text-sm font-medium text-gray-800">RTO Approved Claims (Branded Packet)</h3>
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
            <p className="text-xs text-gray-700">
              Use Branded Packets & get up to 80% RTO claims approval
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-medium">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Performance */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <h2 className="text-sm font-medium text-gray-800 mr-2">Product Performance</h2>
            <span className="text-xs text-gray-500">(31 Mar'25 - 27 Apr'25)</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-600 mr-2">Sort by:</span>
          </div>
        </div>
        
        {/* Empty state */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-base font-medium text-gray-700 mb-1">No data as of now.</h2>
          </div>
        </div>
      </div>
    </div>
  );
} 