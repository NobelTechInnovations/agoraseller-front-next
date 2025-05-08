'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import OrderTable from '../../components/OrderTable';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="p-3 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-3 py-2">
        <div className='flex'>
          <div className='flex items-center justify-between mr-1 pr-3 border-r-1 border-gray-400'>
            <Icon icon="system-uicons:box-open" className='text-blue-600 mr-1' width="34" height="34" />
            <h1 className="text-lg font-semibold">Orders</h1>
          </div>
          <div className="flex text-lg font-semibold -mb-px">

            <button
              className={`${activeTab === 'pending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending (0)
            </button>
            <button
              className={`${activeTab === 'ready-to-ship' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('ready-to-ship')}
            >
              Ready to Ship (1)
            </button>
            <button
              className={`${activeTab === 'shipped' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('shipped')}
            >
              Shipped
            </button>
            <button
              className={`${activeTab === 'cancelled' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
            <button
              className={`${activeTab === 'Deliverd' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('Deliverd')}
            >
              Deliverd
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">

          <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Orders Data
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center text-sm text-gray-500 mr-1">
          Filter by:
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
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
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
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
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
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
        <OrderTable />
        <div className="text-center py-8 ">
          <div className='text-center'>
            <Icon icon="nonicons:not-found-16" className='text-slate-400 text-center inline' width="48" height="48" />
          </div>
          <h2 className="text-base font-medium text-gray-700 mb-1">No orders yet</h2>
          <p className="text-sm text-gray-500">But keep checking this section from time to time.</p>
        </div>
      </div>
    </div>
  );
} 