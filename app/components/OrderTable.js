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
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? orders.map((order, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://karamonline.com/media/catalog/product/cache/509850b11aa2210ac1d2c31fec93d22f/f/s/fs232bl-swsamn-01.jpg" 
                    alt="product" 
                    className="w-15 h-15 " 
                  />
                <div className="flex flex-col">
                  <p className="text-xs font-semibold">
                    Product Name
                  </p>
                <a 
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 text-xs hover:text-blue-800 hover:underline cursor-pointer"
                >
                  {order.id}
                </a>
                </div>
                </div>
              </td>
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
                <div className="flex gap-2">
                  <a
                    onClick={() => {/* Handle accept */}}
                    className="px-3 py-1 text-xs text-white bg-primary rounded focus:outline-none"
                  >
                    Accept
                  </a>
                  <a  
                    onClick={() => {/* Handle reject */}}
                    className="px-3 py-1 text-xs text-primary border border-primary rounded focus:outline-none"
                  >
                    Reject
                  </a>
                </div>
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
        <div className="fixed inset-0 bg-gray-500/30 z-50">
          <div className="fixed inset-y-0 right-0 w-[400px] bg-gray-50 shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">Order Details</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="mdi:close" width="20" height="20" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Order Status */}
              <div className="px-6 py-4 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order #{selectedOrder.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.date}</p>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="px-6 py-4">
                <h3 className="text-xs font-medium text-gray-500 mb-4">ORDER ITEMS</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-4 bg-white rounded p-3 shadow-sm">
                      <img 
                        src="https://karamonline.com/media/catalog/product/cache/509850b11aa2210ac1d2c31fec93d22f/f/s/fs232bl-swsamn-01.jpg" 
                        alt="product" 
                        className="w-15 h-15 " 
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">SKU: {item.id}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium text-primary">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="px-6 py-4">
                <h3 className="text-xs font-medium text-gray-500 mb-4">BILL DETAILS</h3>
                <div className="bg-white rounded p-4 shadow-sm space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items total</span>
                    <span className="text-gray-800">{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery charge</span>
                    <span className="text-gray-800">{selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taxes</span>
                    <span className="text-gray-800">{selectedOrder.tax}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-800">Grand total</span>
                      <span className="text-primary">{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="px-6 py-4">
                <h3 className="text-xs font-medium text-gray-500 mb-4">DELIVERY DETAILS</h3>
                <div className="bg-white rounded p-4 shadow-sm">
                  <div className="flex gap-3 items-start">
                    <Icon icon="mdi:map-marker-outline" className="text-gray-400 mt-1" width="18" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{selectedOrder.customer.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedOrder.customer.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedOrder.customer.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)] sticky bottom-0">
              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-white py-2.5 px-4 rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                  Accept Order
                </button>
                <button className="flex-1 border border-gray-200 text-gray-600 py-2.5 px-4 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
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
