'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios';
import { getSession } from 'next-auth/react';
import S3Image from '../../components/S3Image';

export default function ReturnsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('last-month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');
  const [sortBy, setSortBy] = useState('most-recent');
  const [returnStats, setReturnStats] = useState({
    summary: {
      totalShipped: 0,
      totalDelivered: 0,
      totalReturned: 0,
      totalRTO: 0,
      totalOrders: 0,
      returnRate: 0,
      rtoRate: 0
    },
    productPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailsLoading, setProductDetailsLoading] = useState(false);
  const [productDetails, setProductDetails] = useState(null);

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

  // Function to fetch product details
  const fetchProductDetails = async (productId) => {
    try {
      setProductDetailsLoading(true);
      const session = await getSession();
      const response = await axiosInstance.get(`/v1/seller/return/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setProductDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setProductDetailsLoading(false);
    }
  };

  // Function to handle showing product details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    fetchProductDetails(product.productId);
  };

  // Function to close the product details modal
  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
    setProductDetails(null);
  };

  // Function to render the orders table
  const renderOrdersTable = (orders, title) => {
    if (!orders || orders.length === 0) {
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
          <p className="text-sm text-gray-500">No orders found</p>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {order.customer_id?.name || 'N/A'}<br />
                    <span className="text-xs">{order.customer_email}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-center text-gray-500">
                    ₹{order.final_amount}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'returned' ? 'bg-red-100 text-red-800' :
                        order.status === 'rto' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'}`
                    }>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
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

      {/* Main Content - Conditionally render based on activeTab */}
      {activeTab === 'overview' ? (
        <>
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
                    : `${returnStats.summary.totalRTO} RTO orders out of ${returnStats.summary.totalShipped} dispatched`}
                </p>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Success Product Performance Rate */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm text-gray-600 mb-3">Success Product Performance Rate</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">  </p>
                    <span className="text-xl font-semibold text-green-500 ">{returnStats.summary.totalDelivered*100}%</span>
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
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Orders Delivered</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Customer Return</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">What Changed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        Loading product performance data...
                      </td>
                    </tr>
                  ) : returnStats.productPerformance && returnStats.productPerformance.length > 0 ? (
                    returnStats.productPerformance.map((product) => (
                      <tr key={product.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <S3Image
                                src={product.image}
                                alt={product.name}
                                width={64}
                                height={64}
                                className="h-full w-full"
                                objectFit="cover"
                              />

                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">Product ID: {product.agora_product_id}</div>
                              <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-900">{product.totalOrders}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-900">{product.totalDelivered}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm text-gray-900">{product.returnRate}%</span>
                            <span className="text-xs text-gray-500">{product.totalReturned} Returns</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            onClick={() => handleViewDetails(product)}
                          >
                            View Details
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {product.totalReturned > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="text-red-500 text-sm font-medium">{product.returnRate}%</span>
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
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No product performance data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        // Return Tracking Tab - Empty for now
        <div className="bg-white rounded-lg shadow border border-gray-300 p-6 text-center">
          <div className="py-12">
            <Icon icon="solar:chart-line-bold-duotone" className="mx-auto mb-4 text-blue-500" width="64" height="64" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Return Tracking</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Track all your return orders and their statuses in one place.
              This feature is coming soon.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
              Coming Soon
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductDetails && (
        <div className="fixed inset-0 z-50 overflow-auto bg-opacity-75 flex">
          <div className="relative p-6 bg-white w-full max-w-full h-full m-auto rounded-lg shadow-xl">
            {/* Close button */}
            <button 
              onClick={closeProductDetails}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="solar:close-circle-bold" width="24" height="24" />
            </button>
            
            {/* Modal content */}
            <div className="mt-2 max-w-7xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">Product Return Details</h3>
              
              {productDetailsLoading ? (
                <div className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">Loading product details...</p>
                </div>
              ) : productDetails ? (
                <>
                  {/* Product Info */}
                  <div className="flex mb-4 pb-4 border-b border-gray-200">
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                      <S3Image 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        width={96} 
                        height={96} 
                        className="h-full w-full" 
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-800">{selectedProduct.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                      <p className="text-sm text-gray-600">Product ID: {selectedProduct.agora_product_id}</p>

                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Total Orders</p>
                      <p className="text-lg font-semibold">{productDetails.totalOrders}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Orders Shipped</p>
                      <p className="text-lg font-semibold">{productDetails.totalShipped}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Orders Delivered</p>
                      <p className="text-lg font-semibold">{productDetails.totalDelivered}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Returns</p>
                      <p className="text-lg font-semibold text-red-600">{productDetails.totalReturned}</p>
                    </div>
                  </div>
                  
                  {/* Order tables */}
                  <div className="mt-6">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex">
                        <button className="mr-8 py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                          All Orders ({productDetails.totalOrders})
                        </button>
                      </nav>
                    </div>
                    
                    {/* Render the different order types */}
                    {renderOrdersTable(productDetails.shippedOrders, "Shipped Orders")}
                    {renderOrdersTable(productDetails.deliveredOrders, "Delivered Orders")}
                    {renderOrdersTable(productDetails.returnedOrders, "Returned Orders")}
                    {renderOrdersTable(productDetails.rtoOrders, "RTO Orders")}
                  </div>
                </>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-gray-600">No product details available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 