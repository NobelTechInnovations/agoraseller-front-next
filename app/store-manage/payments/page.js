'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSession } from 'next-auth/react';
export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [timePeriod, setTimePeriod] = useState('last-month');
  const [paymentData, setPaymentData] = useState({
    payments_to_date: 0,
    total_outstanding_payment: 0,
    next_payment: {
      amount: 0,
      date: new Date(),
    },
    last_payment: {
      amount: 0,
    },
    payment_trends: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const response = await axiosInstance.get('/v1/seller/payment/summary',
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (response.data.success) {
          setPaymentData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching payment summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentSummary();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-3 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-3 py-2">
        <div className='flex'>
          <div className='flex items-center justify-between mr-1 pr-3 border-r-1 border-gray-400'>
            <Icon icon="solar:hand-money-linear" className='text-blue-600 mr-1' width="34" height="34" />
            <h1 className="text-lg font-semibold">Payments</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1">
            <Icon icon="solar:download-linear" className='mr-1' width="14" height="14" />
            Download
            <Icon icon="solar:alt-arrow-down-linear" width="14" height="14" />
          </button>
        </div>
      </div>

      {/* Payment Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Payments to Date Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <h2 className="text-sm text-gray-600">Payments to Date</h2>
              <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
            </div>
            <button className="text-blue-600 text-sm hover:text-blue-700">View Details</button>
          </div>
          <p className="text-2xl font-semibold mb-3">
            {loading ? '...' : formatCurrency(paymentData.payments_to_date)}
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <span>Last Payment: {loading ? '...' : formatCurrency(paymentData.last_payment.amount)}</span>
            <Icon icon="solar:alt-arrow-right-linear" className="mx-2" width="16" height="16" />
          </div>
        </div>

        {/* Outstanding Payment Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <h2 className="text-sm text-gray-600">Total Outstanding Payment</h2>
              <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
            </div>
            <Link href="/store-manage/payments/due-payments" className="text-blue-600 text-sm hover:text-blue-700">View Details</Link>
          </div>
          <p className="text-2xl font-semibold mb-3">
            {loading ? '...' : formatCurrency(paymentData.total_outstanding_payment)}
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <span>Next Payment: {loading ? '...' : formatCurrency(paymentData.next_payment.amount)}</span>
            <span className="mx-2">•</span>
            <span className="text-gray-500">Due on {loading ? '...' : formatDate(paymentData.next_payment.date)}</span>
            <Icon icon="solar:alt-arrow-right-linear" className="mx-2" width="16" height="16" />
          </div>
        </div>
      </div>

      {/* Payments Over Time Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-gray-800">Payments over time</h2>
          <div className="flex items-center gap-2">
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

        {/* Chart Area */}
        <div className="h-64 mb-2">
          {loading ? (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-sm">Loading payment data...</p>
            </div>
          ) : paymentData.payment_trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={paymentData.payment_trends.map(item => ({
                  date: item._id,
                  amount: item.total
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line type="monotone" dataKey="amount" stroke="#2563eb" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-gray-400 text-sm">No payment data available</p>
                <p className="text-gray-500 text-xs mt-1">Payment trends will appear here once you have payments</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {activeTab === 'daily' ? 'The graph shows daily view of your payment trends' : 
           activeTab === 'weekly' ? 'The graph shows weekly view of your payment trends' : 
           'The graph shows monthly view of your payment trends'}
        </p>
      </div>

      {/* Additional Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Compensation & Recoveries */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-medium text-gray-800">Compensation & Recoveries</h2>
              <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
            </div>
            <button className="text-blue-600 text-sm hover:text-blue-700">View Details</button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Compensations</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Recoveries</span>
              <span>₹0</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center text-sm font-medium">
                <span>Total</span>
                <span>₹0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ads Cost */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-medium text-gray-800">Ads Cost</h2>
              <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
            </div>
            <button className="text-blue-600 text-sm hover:text-blue-700">View Details</button>
          </div>
          <div className="text-center py-4">
            <Icon icon="solar:chart-2-linear" className="mx-auto mb-2 text-blue-600" width="48" height="48" />
            <p className="text-sm text-gray-600 mb-2">You have not spent on Ads in the last 30 days</p>
            <p className="text-xs text-gray-500">More than 2 Lac sellers have run Ads to grow their business</p>
            <button className="mt-3 text-blue-600 text-sm hover:text-blue-700">Try Ads</button>
          </div>
        </div>

        {/* Other Links */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-3">Other Links</h2>
          <div className="space-y-3">
            <Link href="/store-manage/referral-payments" className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg group">
              <span className="text-sm text-gray-600 group-hover:text-gray-900">Referral Payments</span>
              <Icon icon="solar:alt-arrow-right-linear" className="text-gray-400 group-hover:text-gray-600" width="16" height="16" />
            </Link>
            <Link href="/store-manage/support/ticket" className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg group">
              <span className="text-sm text-gray-600 group-hover:text-gray-900">Have a query?</span>
              <Icon icon="solar:alt-arrow-right-linear" className="text-gray-400 group-hover:text-gray-600" width="16" height="16" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
