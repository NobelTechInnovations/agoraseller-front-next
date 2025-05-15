'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import axiosInstance from '../../../utils/axios';
import { getSession } from 'next-auth/react';
import { format } from 'date-fns';

const DuePaymentsPage = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [paymentData, setPaymentData] = useState({
    total_net_order_amount: 0,
    total_net_ads_cost: 0,
    total_net_referral_earning: 0,
    total_amount: 0,
    total_return_shipping_charges: 0,
    total_shipping_charges: 0,
    payments: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1
    }
  });
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPaymentDetails(currentPage);
  }, [currentPage]);

  const fetchPaymentDetails = async (page) => {
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axiosInstance.get('/v1/seller/payment/details', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          page,
          limit: 10
        }
      });
      
      if (response.data.success) {
        setPaymentData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePaymentDetails = async (paymentId) => {
    try {
      setLoadingDetails(prev => ({ ...prev, [paymentId]: true }));
      const session = await getSession();
      const response = await axiosInstance.get(`/v1/seller/payment/details/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        }
      });
      
      if (response.data.success) {
        setPaymentDetails(prev => ({ 
          ...prev, 
          [paymentId]: response.data.data 
        }));
      }
    } catch (error) {
      console.error(`Error fetching details for payment ${paymentId}:`, error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [paymentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const toggleRowExpansion = (paymentId) => {
    const newExpandedRows = new Set(expandedRows);
    
    if (expandedRows.has(paymentId)) {
      newExpandedRows.delete(paymentId);
    } else {
      newExpandedRows.add(paymentId);
      // Fetch payment details only when expanding the row
      if (!paymentDetails[paymentId]) {
        fetchSinglePaymentDetails(paymentId);
      }
    }
    
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/store-manage/payments" className="text-blue-600 text-sm hover:text-blue-700">
          <Icon icon="solar:arrow-left-linear" className="cursor-pointer" width="24" height="24" />
        </Link>
        <h1 className="text-xl font-semibold">Total Outstanding Payments</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Net Order Amount</span>
            <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
          </div>
          <p className="text-xl font-semibold">
            {loading ? '...' : formatCurrency(paymentData.total_net_order_amount)}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Net Ads Cost</span>
          </div>
          <p className="text-xl font-semibold">
            {loading ? '...' : formatCurrency(paymentData.total_net_ads_cost)}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Shipping & Return Charges</span>
          </div>
          <p className="text-xl font-semibold">
            {loading ? '...' : formatCurrency(paymentData.total_shipping_charges + paymentData.total_return_shipping_charges)}
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Amount</span>
            <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
          </div>
          <p className="text-xl font-semibold">
            {loading ? '...' : formatCurrency(paymentData.total_amount)}
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Loading payment data...</p>
          </div>
        ) : paymentData.payments.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No payment data available</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Order Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Shipping</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Return Fees</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Ads Cost</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Net Amount</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.payments.map((payment, index) => (
                <>
                  <tr key={payment.details} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(payment.payment_date)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payment.order_amount)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payment.shipping_charges)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      {payment.return_count > 0 ? (
                        <span className="flex items-center justify-end">
                          {formatCurrency(payment.return_shipping_charges)}
                          <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-1 rounded-full">{payment.return_count}</span>
                        </span>
                      ) : (
                        formatCurrency(0)
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(payment.ads_cost)}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(payment.net_amount)}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status === 'pending' ? 'Pending' : 
                         payment.status === 'paid' ? 'Paid' : payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRowExpansion(payment.details)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(payment.details) && (
                    <tr className="bg-gray-50">
                      <td colSpan="8" className="px-4 py-3">
                        <div className="p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h4>
                          {loadingDetails[payment.details] ? (
                            <div className="bg-white p-4 rounded border border-gray-200 text-center">
                              <p className="text-gray-500">Loading order details...</p>
                            </div>
                          ) : paymentDetails[payment.details] ? (
                            <div className="bg-white p-4 rounded border border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                                  <p className="text-sm text-gray-800">{paymentDetails[payment.details].payment_id}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Payment Date</p>
                                  <p className="text-sm text-gray-800">{formatDate(paymentDetails[payment.details].payment_date)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Status</p>
                                  <p className="text-sm">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      paymentDetails[payment.details].status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      paymentDetails[payment.details].status === 'paid' ? 'bg-green-100 text-green-800' : 
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {paymentDetails[payment.details].status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Order Amount</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].order_amount)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Shipping Charges</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].shipping_charges)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Return Shipping</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].return_shipping_charges)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Ads Cost</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].ads_cost)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Referral Earnings</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].referral_earnings)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Net Amount</p>
                                  <p className="text-sm font-medium text-gray-800">
                                    {formatCurrency(paymentDetails[payment.details].net_amount)}
                                  </p>
                                </div>
                              </div>
                              
                              <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">Orders</h5>
                              {paymentDetails[payment.details].orders && paymentDetails[payment.details].orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order Number</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                                        <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Type</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Shipping</th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Date</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {paymentDetails[payment.details].orders.map((order) => (
                                        <tr key={order.order_id}>
                                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                                            {order.order_number}
                                          </td>
                                          <td className="px-3 py-2 text-xs text-gray-700 max-w-[150px] truncate">
                                            {order.product_name || "Unknown Product"}
                                          </td>
                                          <td className={`px-3 py-2 whitespace-nowrap text-xs text-right ${order.amount < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                                            {formatCurrency(order.amount)}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                              order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                              order.status === 'returned' ? 'bg-red-100 text-red-800' : 
                                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                              'bg-gray-100 text-gray-800'
                                            }`}>
                                              {order.status}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-center text-xs">
                                            {order.is_return ? (
                                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                                Return
                                              </span>
                                            ) : (
                                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                                Order
                                              </span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-gray-700">
                                            {formatCurrency(order.shipping_charge || 0)}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-gray-700">
                                            {order.is_return ? formatDate(order.return_date) : formatDate(order.delivery_date)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500">No orders found for this payment</p>
                              )}
                            </div>
                          ) : (
                            <div className="bg-white p-4 rounded border border-gray-200 text-center">
                              <p className="text-gray-500">Error loading details. Please try again.</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && paymentData.pagination.pages > 1 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon icon="solar:arrow-left-linear" width="16" height="16" />
            </button>
            
            {Array.from({ length: paymentData.pagination.pages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, paymentData.pagination.pages))}
              disabled={currentPage === paymentData.pagination.pages}
              className={`px-3 py-1 rounded border ${
                currentPage === paymentData.pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Icon icon="solar:arrow-right-linear" width="16" height="16" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuePaymentsPage;
