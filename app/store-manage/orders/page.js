'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('pending');
  
  return (
    <div className="p-3 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">Orders</h1>
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
            Learn how to process your orders?
          </a>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Orders Data
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Blue banner for download help */}
      <div className="bg-blue-100 rounded-lg p-3 mb-4 flex items-start">
        <div className="bg-yellow-400 w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
          <img 
            src="https://via.placeholder.com/50x50/FFCC00/000000?text=👤" 
            alt="Support person" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-medium text-gray-800">Cant't download labels? Don't worry!</h2>
          <p className="text-xs text-gray-600">
            Raise a Ticket | We'll download the label and send it to you | No Penalty Guaranteed
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-medium">
          Raise a Ticket
        </button>
      </div>
      
      {/* Packaging policy banner */}
      <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-purple-100 text-purple-600 p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </span>
          <p className="text-xs text-gray-700">
            As per Meesho packaging policy, all sellers must use Transparent Barcoded Packaging for their products on the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded text-xs">
            Buy Barcoded Packets
          </button>
          <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded text-xs">
            Scan Barcoded Packets
          </button>
        </div>
      </div>
      
      {/* Order Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex text-sm -mb-px">
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'on-hold' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('on-hold')}
          >
            On Hold
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'pending' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending (0)
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'ready-to-ship' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('ready-to-ship')}
          >
            Ready to Ship (1)
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'shipped' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`py-2 px-4 border-b-2 ${activeTab === 'cancelled' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>
      
      {/* Filter and Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center text-xs text-gray-500 mr-1">
          Filter by:
        </div>
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
            <option>SLA Status</option>
            <option>Within SLA</option>
            <option>Breaching SLA</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
            <option>Dispatch Date</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="relative">
          <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
            <option>Order Date</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="relative flex items-center">
          <select className="appearance-none border border-gray-300 rounded-l px-3 py-1.5 pr-8 text-xs bg-white border-r-0">
            <option>SKU ID</option>
            <option>Order ID</option>
            <option>Product Name</option>
          </select>
          <div className="pointer-events-none absolute left-0 inset-y-0 right-auto flex items-center px-14 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
          <div className="relative flex-1">
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-r px-3 py-1.5 text-xs"
              placeholder="Search"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty state */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <img 
            src="/images/empty-orders.svg" 
            alt="No orders yet" 
            className="h-20 mx-auto mb-4 opacity-70"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNNDUgMzBINTVWNzBINDVWMzBaIiBmaWxsPSIjOTRBM0IzIi8+PHBhdGggZD0iTTI1IDUwSDc1VjYwSDI1VjUwWiIgZmlsbD0iIzk0QTNCMyIvPjwvc3ZnPg==";
            }}
          />
          <h2 className="text-base font-medium text-gray-700 mb-1">No orders yet</h2>
          <p className="text-xs text-gray-500">But keep checking this section from time to time.</p>
        </div>
      </div>
    </div>
  );
} 