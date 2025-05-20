import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Sidebar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const navigationLinks = [
    { name: 'Home', href: '/store-manage', icon: '🏠' },
    { name: 'Manage Business', href: '#', icon: '📊', isHeader: true },
    { name: 'Orders', href: '/store-manage/orders', icon: '📦' },
    { name: 'Returns', href: '/store-manage/returns', icon: '↩️' },
    { 
      name: 'Listing', 
      href: '#', 
      icon: '📋',
      submenu: [
        { name: 'Warehouse', href: '/store-manage/warehouse' },
        { name: 'Inventory Excel', href: '/store-manage/inventory-excel' },
        { name: 'View All', href: '/store-manage/listings' }
      ]
    },
    { name: 'Payments', href: '/store-manage/payments', icon: '💳' },
    { name: 'Advertisement', href: '/store-manage/advertisement', icon: '📢' },
    { 
      name: 'Reports', 
      href: '#', 
      icon: '📊',
      submenu: [
        { name: 'Return Report', href: '/store-manage/reports/returns' },
        { name: 'Sale Revenue', href: '/store-manage/reports/revenue' }
      ]
    },
    { 
      name: 'Support', 
      href: '#', 
      icon: '🎧',
      submenu: [
        { name: 'FAQs', href: '/store-manage/support/faqs' },
        { name: 'Raise Ticket', href: '/store-manage/support/ticket' }
      ]
    }
  ];

  const toggleSubmenu = (index) => {
    setExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="h-full overflow-y-auto bg-[#1a1a1a] text-white">
      {/* Navigation links */}
      <nav className="py-2">
        {navigationLinks.map((item, index) => (
          <div key={index}>
            {item.isHeader ? (
              <div className="px-4 pt-3 pb-1 text-xs text-gray-400 font-bold">
                {item.name}
              </div>
            ) : (
              <>
                {item.submenu ? (
                  <div>
                    <button 
                      onClick={() => toggleSubmenu(index)}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-800 transition-colors font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center">{item.icon}</span>
                        {item.name}
                      </div>
                      <svg 
                        className={`w-4 h-4 transition-transform ${expandedMenus[index] ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedMenus[index] && (
                      <div className="bg-gray-800">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link 
                            key={subIndex}
                            href={subItem.href}
                            className="block pl-12 pr-4 py-2 text-sm hover:bg-gray-700 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
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
              </>
            )}
          </div>
        ))}
      </nav>

      {/* GeniezySeller branding */}
      <div className="p-4 mt-auto border-t border-gray-700 flex items-center justify-center text-gray-400 text-xs">
        <span className="font-medium">GeniezySeller</span>
        <span className="ml-1 text-[10px]">Supplier Hub</span>
      </div>
    </div>
  );
};

export default Sidebar; 