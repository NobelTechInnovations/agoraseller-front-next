'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="p-6 border border-black">
          <h2 className="text-xl font-semibold text-black mb-2">Total Categories</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>

        <div className="p-6 border border-black">
          <h2 className="text-xl font-semibold text-black mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>

        <div className="p-6 border border-black">
          <h2 className="text-xl font-semibold text-black mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>
      </div>
    </div>
  );
}
