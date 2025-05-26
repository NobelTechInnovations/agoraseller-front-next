'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { format, subDays, startOfWeek, startOfMonth } from 'date-fns';
import { getSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BsTruck , BsBox, BsArrowReturnLeft, BsCashStack,BsCurrencyRupee  } from 'react-icons/bs';

export default function StoreDashboard() {

  const [activeTab, setActiveTab] = useState('daily');
  const [dashboardData, setDashboardData] = useState({
    pendingOrders: 0,
    totalOrders: 0,
    shippedOrders: 0,
    returnOrders: 0,
    totalRevenue: 0,
    totalShippingCharges: 0,
    dateRange: {
      startDate: null,
      endDate: null
    },
    chartData: {
      labels: [],
      series: {
        orderCount: [],
        revenue: [],
        returns: [],
        shipping: []
      },
      rawData: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchChartData(activeTab);
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get current month's start date
      const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      
      const session = await getSession();
      const response = await axiosInstance.get(`/v1/seller/dashboard?startDate=${currentMonthStart}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      
      if (response.data && response.data.success && response.data.data) {
        setDashboardData(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const fetchChartData = async (period) => {
    try {
      setLoading(true);
      let startDate;
      
      if (period === 'daily') {
        startDate = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      } else if (period === 'weekly') {
        startDate = format(startOfWeek(subDays(new Date(), 28)), 'yyyy-MM-dd');
      } else if (period === 'monthly') {
        startDate = format(startOfMonth(subDays(new Date(), 90)), 'yyyy-MM-dd');
      }

      const session = await getSession();
      const response = await axiosInstance.get(`/v1/seller/dashboard?startDate=${startDate}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      
      if (response.data && response.data.success && response.data.data) {
        setDashboardData(response.data.data);
      } else {
        throw new Error('Invalid chart data response format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching ${period} chart data:`, err);
      setError(`Failed to load ${period} chart data`);
      setLoading(false);
    }
  };

  // Format the chart data for display
  const getFormattedChartData = () => {
    if (!dashboardData.chartData || !dashboardData.chartData.labels) return [];
    
    return dashboardData.chartData.labels.map((label, index) => ({
      date: label,
      orders: dashboardData.chartData.series.orderCount[index] || 0,
      revenue: dashboardData.chartData.series.revenue[index] || 0,
      returns: dashboardData.chartData.series.returns[index] || 0,
      shipping: dashboardData.chartData.series.shipping[index] || 0,
    }));
  };

  return (

    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800">Welcome back, User!</h3>
        <p className="text-sm text-gray-600 mt-1">Manage your store, track orders, and grow your business with Agora</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Pending Orders */}
        <Link href="/store-manage/orders" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <BsBox className="text-gray-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-xl font-semibold mt-0.5">
                {loading ? '...' : dashboardData.pendingOrders}
              </p>
            </div>
          </div>
        </Link>

        {/* Shipped Orders */}
        <Link href="/store-manage/orders" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <BsTruck className="text-gray-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Shipped Orders</p>
              <p className="text-xl font-semibold mt-0.5">
                {loading ? '...' : dashboardData.shippedOrders}
              </p>
            </div>
          </div>
        </Link>

        {/* Return Orders */}
        <Link href="/store-manage/returns" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <BsArrowReturnLeft className="text-gray-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Orders</p>
              <p className="text-xl font-semibold mt-0.5">
                {loading ? '...' : dashboardData.returnOrders}
              </p>
            </div>
          </div>
        </Link>

        {/* Total Revenue */}
        <Link href="/store-manage/payments" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <BsCashStack className="text-gray-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-xl font-semibold mt-0.5">
                {loading ? '...' : `₹${dashboardData.totalRevenue}`}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Business Insights Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2 text-blue-600">📈</span> Business Insights
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'daily' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'weekly' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                activeTab === 'monthly' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-64 mb-4">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-sm">Loading chart data...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          ) : dashboardData?.chartData?.labels?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFormattedChartData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue' || name === 'shipping') {
                      return [`₹${value}`, name.charAt(0).toUpperCase() + name.slice(1)];
                    }
                    return [value, name.charAt(0).toUpperCase() + name.slice(1)];
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" activeDot={{ r: 8 }} name="Orders" />
                <Line type="monotone" dataKey="revenue" stroke="#16a34a" name="Revenue" />
                <Line type="monotone" dataKey="returns" stroke="#dc2626" name="Returns" />
                <Line type="monotone" dataKey="shipping" stroke="#f97316" name="Shipping" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-400 text-sm">No data available for the selected period</p>
                <p className="text-gray-500 text-xs mt-1">Business data will appear here once you have orders</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {activeTab === 'daily' ? 'The graph shows daily view of your business trends' : 
          activeTab === 'weekly' ? 'The graph shows weekly view of your business trends' : 
          'The graph shows monthly view of your business trends'}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <p className="text-xl font-semibold">
              {loading ? '...' : dashboardData.totalOrders}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
            <p className="text-xl font-semibold">
              {loading ? '...' : `₹${dashboardData.totalRevenue}`}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Shipping Charges</p>
            </div>
            <p className="text-xl font-semibold">
              {loading ? '...' : `₹${dashboardData.totalShippingCharges}`}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Return Orders</p>
            </div>
            <p className="text-xl font-semibold">
              {loading ? '...' : dashboardData.returnOrders}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link 
            href="/store-manage/analytics" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View More Details
          </Link>
        </div>
      </div>
    </div>
  );
}
