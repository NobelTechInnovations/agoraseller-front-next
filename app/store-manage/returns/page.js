export default function ReturnsPage() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Returns</h1>
        <p className="text-sm text-gray-600 mt-0.5">Manage product returns and refunds</p>
      </div>
      
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-3 mb-4 flex items-start">
        <div className="mr-3 bg-amber-100 p-1.5 rounded">
          <div className="w-6 h-6 flex items-center justify-center text-amber-600 text-sm">
            📦
          </div>
        </div>
        <div>
          <h2 className="text-base font-medium text-gray-800">Returnless Refunds Policy - Mandatory for all sellers!</h2>
          <p className="text-xs text-gray-600 mt-0.5">
            For select cases of damaged, defective, poor-quality, or incorrect products, only trusted users will get a refund without returning the item.
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="text-center p-8">
          <div className="mb-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-700">No Returns</h2>
          <p className="text-xs text-gray-500 mt-1">When you receive return requests, they will appear here.</p>
        </div>
      </div>
    </div>
  );
} 