import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  const navigationLinks = [
    { name: 'Home', href: '/store-manage', icon: '🏠' },
    { name: 'Manage Business', href: '#', icon: '📊', isHeader: true },
    { name: 'Orders', href: '/store-manage/orders', icon: '📦' },
    { name: 'Returns', href: '/store-manage/returns', icon: '↩️' },
    { name: 'Pricing', href: '/store-manage/pricing', icon: '💰' },
    { name: 'Claims', href: '/store-manage/claims', icon: '📝' },
    { name: 'Inventory', href: '/store-manage/inventory', icon: '📋' },
    { name: 'Catalog Uploads', href: '/store-manage/catalog-uploads', icon: '📁' },
    { name: 'Image Bulk Upload', href: '/store-manage/image-upload', icon: '🖼️' },
    { name: 'Payments', href: '/store-manage/payments', icon: '💳' },
    { name: 'Quality', href: '/store-manage/quality', icon: '✅' },
    { name: 'Warehouse', href: '/store-manage/warehouse', icon: '🏭' },
    { name: 'Boost Sales', href: '#', icon: '📈', isHeader: true },
    { name: 'Influencer Marketing', href: '/store-manage/influencer-marketing', icon: '👤' },
    { name: 'Promotions', href: '/store-manage/promotions', icon: '🎯' },
    { name: 'Instant Cash', href: '/store-manage/instant-cash', icon: '💸' },
  ];

  return (
    <div className="h-screen w-[180px] bg-[#1a1a1a] text-white flex flex-col text-sm">
      {/* Store profile header */}
      <div className="p-3 flex items-center gap-2 border-b border-gray-700">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-black text-xs">
          <span>JL</span>
        </div>
        <div className="text-xs">
          <p className="font-medium">By Jaipuri Legacy</p>
        </div>
        <button className="ml-auto text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Notifications and Support */}
      <div className="flex border-b border-gray-700">
        <Link href="/store-manage/notices" className="flex-1 py-2 px-3 text-xs hover:bg-gray-800 transition-colors flex items-center gap-1.5">
          <span className="text-xs">🔔</span> Notices
        </Link>
        <Link href="/store-manage/support" className="flex-1 py-2 px-3 text-xs hover:bg-gray-800 transition-colors flex items-center gap-1.5">
          <span className="text-xs">🎧</span> Support
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto">
        {navigationLinks.map((item, index) => (
          <div key={index}>
            {item.isHeader ? (
              <div className="px-3 pt-3 pb-1 text-[10px] text-gray-400 font-medium">
                {item.name}
              </div>
            ) : (
              <Link 
                href={item.href} 
                className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-800 transition-colors"
              >
                <span className="w-4 text-center text-[11px]">{item.icon}</span>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Meesho branding */}
      <div className="p-2 border-t border-gray-700 flex items-center justify-center text-gray-400 text-[10px]">
        <span>meesho</span>
        <span className="ml-1 text-[9px]">Supplier Hub</span>
      </div>
    </div>
  );
};

export default Sidebar; 