'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function ProductListing() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  // Sample data - replace with actual data from your API
  const products = [
    {
      id: 'PRD001',
      image: 'https://via.placeholder.com/150',
      name: 'Classic White T-Shirt',
      category: 'Apparel',
      createdDate: '2024-03-15',
      status: 'LIVE',
      price: '₹599.00',
    },
    {
      id: 'PRD002',
      image: 'https://via.placeholder.com/150',
      name: 'Denim Jeans',
      category: 'Apparel',
      createdDate: '2024-03-14',
      status: 'DRAFT',
      price: '₹1,299.00',
    },
    // Add more sample products as needed
  ];

  // Sample statistics - replace with actual data
  const statistics = {
    totalProducts: 150,
    liveProducts: 120,
    draftProducts: 30,
  };

  return (
    <div className="p-3 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-3 py-2">
        <div className='flex'>
          <div className='flex items-center justify-between mr-1 pr-3 border-r-1 border-gray-400'>
            <Icon icon="system-uicons:box-open" className='text-blue-600 mr-1' width="34" height="34" />
            <h1 className="text-lg font-semibold">Products</h1>
          </div>
          <div className="flex text-lg font-semibold -mb-px space-x-4">
            <button
              className={`${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('all')}
            >
              All ({statistics.totalProducts})
            </button>
            <button
              className={`${activeTab === 'live' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('live')}
            >
              Live ({statistics.liveProducts})
            </button>
            <button
              className={`${activeTab === 'draft' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft ({statistics.draftProducts})
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
            Export Products
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-gray-500 mr-1">
            Filter by:
          </div>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
              <option>Category</option>
              <option>Apparel</option>
              <option>Electronics</option>
              <option>Home & Living</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
              <option>Status</option>
              <option>Live</option>
              <option>Draft</option>
              <option>Under Review</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-l px-3 py-1.5 pr-8 text-xs bg-white border-r-0">
                <option>Product ID</option>
                <option>Product Name</option>
                <option>Category</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-r px-3 py-1.5 text-xs"
                placeholder="Search products..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <table className="min-w-full text-sm text-left text-gray-600 bg-white border border-gray-200 shadow rounded-lg">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Created Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Price</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-2">
                  <div className="flex items-center">
                    <div className="relative group">
                      <div className="h-10 w-10 rounded-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-2 bg-gray-800 rounded-md shadow-lg text-white text-xs">
                        <p className="font-medium">{product.name}</p>
                        <p className="mt-1">Category: {product.category}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 text-gray-500">
                  {new Date(product.createdDate).toLocaleDateString()}
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.status === 'LIVE' 
                      ? 'bg-green-200 text-green-700'
                      : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-2 text-gray-900">{product.price}</td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none mr-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {/* Handle edit */}}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side Drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 overflow-hidden z-50">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedProduct(null)} />
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-96">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  {/* Header */}
                  <div className="px-4 py-6 bg-gray-50 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        <span className="sr-only">Close panel</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative flex-1 px-4 py-6 sm:px-6">
                    <div className="absolute inset-0 px-4 py-6 sm:px-6">
                      <div className="h-full">
                        <div className="mb-6">
                          <img
                            src={selectedProduct.image}
                            alt={selectedProduct.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <dl className="space-y-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Product Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedProduct.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Category</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedProduct.category}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedProduct.status}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Price</dt>
                            <dd className="mt-1 text-sm text-gray-900">{selectedProduct.price}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              {new Date(selectedProduct.createdDate).toLocaleDateString()}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
