'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios';
import { getSession } from 'next-auth/react';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('last-month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('most-recent');
  const [returnStats, setReturnStats] = useState({
    summary: {
      totalDelivered: 0,
      totalReturned: 0,
      totalRTO: 0,
      returnRate: 0,
      rtoRate: 0
    },
    productPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturnStatistics = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const response = await axiosInstance.get('/v1/seller/return/statistics',
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.data.success) {
          setReturnStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching return statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnStatistics();
  }, []);

  const products = [
    {
      id: '533960497',
      name: 'Blue Cotton Kurti',
      image: 'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/24971794/2023/9/14/806bec13-9078-4d8a-8096-586583ef050b1694676454411KALINIWomenLimeGreenFloralEmbroideredRegularThreadWorkKurtiw1.jpg',
      ordersDelivered: 2,
      returns: 2,
      returnRate: '100.00%',
      category: 'Women',
      dualPricing: true
    },
    {
      id: '535960156',
      name: 'Aagam Petite Women Dupatta Sets',
      image: 'https://cdn.sareeka.com/image/cache/data2023/plain-cotton-designer-kurti-256633-1000x1375.jpg',
      ordersDelivered: 1,
      returns: 0,
      returnRate: '0.00%',
      category: 'Women',
      dualPricing: true
    },
    {
      id: '537340841',
      name: 'Mocha Blossom Embroidered Suit Set',
      image: 'https://mybudgetstore.in/cdn/shop/files/IMG_4471.jpg?v=1739511109',
      ordersDelivered: 0,
      returns: 0,
      returnRate: '0.00%',
      category: 'Women',
      dualPricing: true
    },
    {
      id: '534760497',
      name: 'Casual Shirt & Wide-Leg Pant Set',
      image: 'https://www.sujatra.com/cdn/shop/files/SN05AUG-0074copy_1024x1024.jpg?v=1691817425',
      ordersDelivered: 1,
      returns: 0,
      returnRate: '0.00%',
      category: 'Women',
      dualPricing: true
    }
  ];
  
  return (
    <div className="p-3 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-3 py-2">
        <div className="flex">
          <div className="flex items-center justify-between mr-1 pr-3 border-r border-gray-400">
            <Icon icon="solar:box-minimalistic-broken" className="text-blue-600 mr-1" width="34" height="34" />
            <h1 className="text-lg font-semibold">Return/RTO Orders</h1>
          </div>
          <div className="flex text-sm font-medium -mb-px">
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === 'return-tracking' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
              onClick={() => setActiveTab('return-tracking')}
            >
              Return Tracking
            </button>
            <button
              className={`px-4 py-2 border-b-2 ${activeTab === 'claim-tracking' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
              onClick={() => setActiveTab('claim-tracking')}
            >
              Claim Tracking
            </button>
            
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="relative">
            <input 
              type="text" 
              className="border border-gray-300 rounded px-3 py-1.5 pl-9 text-xs w-[250px]"
              placeholder="Search by Order ID, SKU or AWB Number"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon icon="solar:magnifer-linear" className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <a 
            href="#" 
            className="flex items-center text-xs text-gray-600 gap-1"
          >
            <span className="bg-red-600 text-white rounded flex items-center justify-center p-1 w-5 h-5">
              <Icon icon="solar:play-linear" width="12" height="12" />
            </span>
            How it works?
          </a>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6 shadow rounded-lg px-3 py-2 border-gray-300 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <h2 className="text-sm font-medium text-gray-800 mr-2">Summary</h2>
            <span className="text-xs text-gray-500">(03 Apr 25 - 10 May 25)</span>
          </div>
          <div className="flex items-center gap-2 ">
            <select 
              className="border border-gray-300 rounded px-3 py-1.5 text-xs"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              <option value="last-month">Last 1 Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
            </select>
            <button className="flex items-center gap-1 text-blue-600 text-xs">
              <Icon icon="solar:graph-new-linear" width="16" height="16" />
              View Trend
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
          {/* Customer Return Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-600 mb-2">Customer Return Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{loading ? "..." : `${returnStats.summary.returnRate.toFixed(2)}%`}</span>
              <span className="text-red-500 text-sm">↑ {loading ? "..." : `${returnStats.summary.returnRate.toFixed(2)}%`}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {loading 
                ? "Loading..." 
                : `${returnStats.summary.totalReturned} orders returned out of ${returnStats.summary.totalDelivered} delivered`}
            </p>
          </div>

          {/* Courier Return Rate */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-600 mb-2">Courier Return (RTO) Rate</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">{loading ? "..." : `${returnStats.summary.rtoRate.toFixed(2)}%`}</span>
              <span className="text-gray-500 text-sm">{loading ? "..." : `${returnStats.summary.rtoRate.toFixed(2)}%`}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {loading 
                ? "Loading..." 
                : `${returnStats.summary.totalRTO} RTO orders out of ${returnStats.summary.totalDelivered + returnStats.summary.totalRTO} dispatched`}
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dual Pricing Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-600 mb-3">Dual Pricing - Customer Return Rate</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Wrong/Defective Return Price</p>
                <span className="text-xl font-semibold text-red-500">100.00%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">AgooraPrice</p>
                <span className="text-xl font-semibold text-green-500">0.00%</span>
              </div>
            </div>
          </div>

          {/* RTO Claims */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm text-gray-600">RTO Approved Claims (Branded Packet)</h3>
              <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center">
              <p className="text-xs text-gray-700">
                Use Branded Packets & get up to 80% RTO claims approval
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="mb-4 shadow rounded-lg px-3 py-2 border-gray-300 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-sm font-medium text-gray-800 mr-2">Product Performance</h2>
            <span className="text-xs text-gray-500">(03 Apr 25 - 10 May 25)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Filter by:</span>
              <select 
                className="border border-gray-300 rounded px-3 py-1.5 text-xs"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Category</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
              </select>
              <select 
                className="border border-gray-300 rounded px-3 py-1.5 text-xs"
                value={selectedPerformance}
                onChange={(e) => setSelectedPerformance(e.target.value)}
              >
                <option value="all">Performance</option>
                <option value="high-returns">High Returns</option>
                <option value="low-returns">Low Returns</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Sort by:</span>
              <select 
                className="border border-gray-300 rounded px-3 py-1.5 text-xs"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="most-recent">Most Recent Order</option>
                <option value="highest-returns">Highest Returns</option>
                <option value="lowest-returns">Lowest Returns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg  border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Details</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Orders Delivered</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Customer Return</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">What Changed</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading product performance data...
                  </td>
                </tr>
              ) : returnStats.productPerformance && returnStats.productPerformance.length > 0 ? (
                returnStats.productPerformance.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">Product ID: {product.id}</div>
                          <div className="text-sm text-gray-500">Category: {product.category}</div>
                          {product.dualPricing && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Dual Pricing Enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-900">{product.ordersDelivered}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-sm text-gray-900">{product.returnRate}</span>
                        <span className="text-xs text-gray-500">{product.returns} Returns</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.returns > 0 ? (
                        <div className="flex flex-col items-center">
                          <span className="text-red-500 text-sm font-medium">{product.returnRate}</span>
                          <span className="text-xs text-gray-500">Returns increased compared to the last month</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No product performance data available
                  </td>
                </tr>
              )}

              {/* Fallback to static products if API returns no product performance data */}
              {!loading && (!returnStats.productPerformance || returnStats.productPerformance.length === 0) && products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">Product ID: {product.id}</div>
                        <div className="text-sm text-gray-500">Category: {product.category}</div>
                        {product.dualPricing && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Dual Pricing Enabled
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-900">{product.ordersDelivered}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-900">{product.returnRate}</span>
                      <span className="text-xs text-gray-500">{product.returns} Returns</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.returns > 0 ? (
                      <div className="flex flex-col items-center">
                        <span className="text-red-500 text-sm font-medium">{product.returnRate}</span>
                        <span className="text-xs text-gray-500">Returns increased compared to the last month</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 