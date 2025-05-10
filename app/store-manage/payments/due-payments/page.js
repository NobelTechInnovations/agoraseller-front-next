'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import Link from 'next/link';

const DuePaymentsPage = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Sample data - replace with actual data from your API
  const duePayments = [
    {
      id: '1',
      paymentDate: '23 May 2025',
      orderAmount: -162,
      adsCost: 0,
      referrals: 0,
      netAmount: -162,
      subPayments: [
        { orderId: 'ORD001', amount: -82, dueDate: '23 May 2025' },
        { orderId: 'ORD002', amount: -80, dueDate: '23 May 2025' },
      ]
    },
    {
      id: '2',
      paymentDate: '22 May 2025',
      orderAmount: -172,
      adsCost: 0,
      referrals: 0,
      netAmount: -172,
      subPayments: [
        { orderId: 'ORD003', amount: -172, dueDate: '22 May 2025' },
      ]
    },
    // Add more payment data as needed
  ];

  const toggleRowExpansion = (paymentId) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(paymentId)) {
      newExpandedRows.delete(paymentId);
    } else {
      newExpandedRows.add(paymentId);
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
          <p className="text-xl font-semibold">₹5,577.26</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Net Ads Cost</span>
          </div>
          <p className="text-xl font-semibold">₹0</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Net Referral Earning</span>
          </div>
          <p className="text-xl font-semibold">₹0</p>
        </div>
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm text-gray-600">Total Amount</span>
            <Icon icon="solar:info-circle-linear" className="text-gray-400" width="16" height="16" />
          </div>
          <p className="text-xl font-semibold">₹5,577.26</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Payment Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Order Amount</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Ads Cost</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Referrals</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Net Amount</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {duePayments.map((payment) => (
              <>
                <tr key={payment.id} className="border-t border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-600">{payment.paymentDate}</td>
                  <td className="px-4 py-3 text-sm text-right">{`₹${payment.orderAmount}`}</td>
                  <td className="px-4 py-3 text-sm text-right">{`₹${payment.adsCost}`}</td>
                  <td className="px-4 py-3 text-sm text-right">{`₹${payment.referrals}`}</td>
                  <td className="px-4 py-3 text-sm text-right">{`₹${payment.netAmount}`}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleRowExpansion(payment.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
                {expandedRows.has(payment.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan="6" className="px-4 py-3">
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Payments</h4>
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Order ID</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Due Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payment.subPayments.map((subPayment, index) => (
                              <tr key={index} className="border-t border-gray-200">
                                <td className="px-3 py-2 text-xs text-gray-600">{subPayment.orderId}</td>
                                <td className="px-3 py-2 text-xs text-right">{`₹${subPayment.amount}`}</td>
                                <td className="px-3 py-2 text-xs text-right">{subPayment.dueDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DuePaymentsPage;
