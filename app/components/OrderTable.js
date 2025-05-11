import { useState } from "react";
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

export default function OrderTable({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="relative overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-600 bg-white border border-gray-200 shadow rounded-lg">
        <thead className="bg-gray-100 text-xs uppercase text-gray-700">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">Order Date</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Payment</th>
            <th className="p-2">Items</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Weight</th>
            <th className="p-2">Fulfilment</th>
            <th className="p-2">View Product</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? orders.map((order, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2 text-blue-600">{order.id}</td>
              <td className="p-2">{order.date}</td>
              <td className="p-2">{order.amount}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-white text-xs ${order.payment === 'PREPAID' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                  {order.payment}
                </span>
              </td>
              <td className="p-2">{order.items}</td>
              <td className="p-2">{order.customer.name}</td>
              <td className="p-2">{order.weight}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${order.fulfilment === 'FULFILLED' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>
                  {order.fulfilment}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none"
                >
                  View Details
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="9" className="text-center py-8">
                <div className='text-center'>
                  <Icon icon="nonicons:not-found-16" className='text-slate-400 text-center inline' width="48" height="48" />
                </div>
                <h2 className="text-base font-medium text-gray-700 mb-1">No orders yet</h2>
                <p className="text-sm text-gray-500">But keep checking this section from time to time.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Right-side Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0  bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-[500px] bg-white shadow-xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                <Icon icon="mdi:close" width="24" height="24" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(100vh-180px)] overflow-y-auto">
              {/* Order Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Ordered Products</h3>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="border-grey-200 border  rounded-lg p-3 mb-3 bg-white">
                    <div className="flex gap-3">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">SKU: {item.id}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm">Quantity: {item.quantity}</p>
                          <p className="font-medium">{item.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Payment Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping</span>
                    <span>{selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span>{selectedOrder.tax}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Customer Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                  <p className="text-sm text-gray-600 mt-2">{selectedOrder.customer.address}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                  Accept Order
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700">
                  Reject Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

OrderTable.propTypes = {
  orders: PropTypes.array.isRequired,
};
