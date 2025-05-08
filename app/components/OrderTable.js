import { useState } from "react";

export default function OrderTable() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: 'ITL00010',
      date: '2/3/2023',
      amount: '₹800.00',
      payment: 'PREPAID',
      items: 1,
      customer: 'Kishor Ravat',
      weight: 'SS',
      fulfilment: 'UNFULFILLED',
    },
    {
      id: 'ITL00011',
      date: '2/3/2023',
      amount: '₹230.00',
      payment: 'PREPAID',
      items: 1,
      customer: 'Praveen Kumar',
      weight: '0.6 KG',
      fulfilment: 'UNFULFILLED',
    },
  ];

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
          {orders.map((row, index) => (
            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
              <td className="p-2 text-blue-600">{row.id}</td>
              <td className="p-2">{row.date}</td>
              <td className="p-2">{row.amount}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-white text-xs ${row.payment === 'PREPAID' ? 'bg-blue-500' : 'bg-yellow-500'}`}>
                  {row.payment}
                </span>
              </td>
              <td className="p-2">{row.items}</td>
              <td className="p-2">{row.customer}</td>
              <td className="p-2">{row.weight}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${row.fulfilment === 'FULFILLED' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'}`}>
                  {row.fulfilment}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => setSelectedOrder(row)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Right-side Drawer */}
      {selectedOrder && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white border-l border-gray-300 shadow-lg z-50 transition-transform duration-300 ease-in-out">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div><strong>Order ID:</strong> {selectedOrder.id}</div>
            <div><strong>Date:</strong> {selectedOrder.date}</div>
            <div><strong>Amount:</strong> {selectedOrder.amount}</div>
            <div><strong>Payment:</strong> {selectedOrder.payment}</div>
            <div><strong>Items:</strong> {selectedOrder.items}</div>
            <div><strong>Customer:</strong> {selectedOrder.customer}</div>
            <div><strong>Weight:</strong> {selectedOrder.weight}</div>
            <div><strong>Fulfilment:</strong> {selectedOrder.fulfilment}</div>
          </div>
        </div>
      )}
    </div>
  );
}
