export default function OrdersPage() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-600 mt-0.5">Manage your orders and shipments</p>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="text-center p-8">
          <div className="mb-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-700">No Orders Yet</h2>
          <p className="text-xs text-gray-500 mt-1">When you receive orders, they will appear here.</p>
        </div>
      </div>
    </div>
  );
} 