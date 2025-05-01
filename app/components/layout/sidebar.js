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
    <div className="fixed top-0 left-0 h-screen w-[240px] bg-[#1a1a1a] text-white flex flex-col">
      {/* Store profile header */}
      <div className="p-4 flex items-center gap-2 border-b border-gray-700">
        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-black font-semibold">
          <span>JL</span>
        </div>
        <div className="text-sm">
          <p className="font-bold">By Jaipuri Legacy</p>
        </div>
        <button className="ml-auto text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Notifications and Support */}
      <div className="flex border-b border-gray-700">
        <Link href="/store-manage/notices" className="flex-1 py-2.5 px-4 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
          <span>🔔</span> Notices
        </Link>
        <Link href="/store-manage/support" className="flex-1 py-2.5 px-4 text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
          <span>🎧</span> Support
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto py-1">
        {navigationLinks.map((item, index) => (
          <div key={index}>
            {item.isHeader ? (
              <div className="px-4 pt-3 pb-1 text-xs text-gray-400 font-bold">
                {item.name}
              </div>
            ) : (
              <Link 
                href={item.href} 
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-800 transition-colors font-medium"
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Meesho branding */}
      <div className="p-2 border-t border-gray-700 flex items-center justify-center text-gray-400 text-xs">
        <span className="font-medium">AgoraSeller</span>
        <span className="ml-1 text-[10px]">Supplier Hub</span>
      </div>
    </div>
  );
};

export default Sidebar; 