import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiHome } from 'react-icons/hi';
import { BsListTask, BsBox, BsPlusCircle } from 'react-icons/bs';
import { MdInventory2, MdPayments, MdWarehouse } from 'react-icons/md';
import { IoStatsChart } from 'react-icons/io5';
import { RiAdvertisementLine } from 'react-icons/ri';
import { FaHandshake } from 'react-icons/fa';

const Sidebar = () => {
  const pathname = usePathname();
  const [hoveredMenu, setHoveredMenu] = useState(null);

  const navigationLinks = [
    { 
      name: 'Welcome',
      href: '/store-manage',
      icon: HiHome
    },
    {
      name: 'Listings',
      href: '/store-manage/inventory/listing',
      icon: BsListTask,
      subMenu: [
        {
          name: 'All Listings',
          href: '/store-manage/inventory/listing',
          icon: BsListTask
        },
        {
          name: 'Add Product',
          href: '/store-manage/inventory/add',
          icon: BsPlusCircle
        }
      ]
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: MdInventory2
    },
    {
      name: 'Orders',
      href: '/store-manage/orders',
      icon: BsBox
    },
    {
      name: 'Payments',
      href: '/store-manage/payments',
      icon: MdPayments
    },
    {
      name: 'Return Ratio',
      href: '/store-manage/returns',
      icon: IoStatsChart
    },
    {
      name: 'Advertising',
      href: '/store-manage/',
      icon: RiAdvertisementLine
    },
    {
      name: 'Partner Services',
      href: '/store-manage/support',
      icon: FaHandshake,
      subMenu: [
        {
          name: 'Support',
          href: '/store-manage/support',
          icon: FaHandshake
        },
        {
          name: 'Warehouse',
          href: '/store-manage/warehouse',
          icon: MdWarehouse
        }
      ]
    }
  ];

  const isActiveRoute = (href, subMenu = []) => {
    if (pathname === href) return true;
    if (subMenu.some(item => pathname === item.href)) return true;
    return pathname.startsWith(href + '/');
  };

  return (
    <aside className="w-24 h-[calc(100vh-64px)] bg-white border-r border-gray-200">
      <nav className="flex flex-col gap-4 py-4">
        {navigationLinks.map((item, index) => {
          const isActive = isActiveRoute(item.href, item.subMenu || []);
          
          return (
            <div 
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredMenu(item.name)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center px-2 py-2 text-[11px] font-medium transition-colors text-center
                  ${isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-700 hover:text-blue-600'}`}
              >
                <item.icon className={`w-4 h-4 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                {item.name}
              </Link>

              {/* Submenu */}
              {item.subMenu && hoveredMenu === item.name && (
                <div className="absolute left-24 top-0 w-50 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                  {item.subMenu.map((subItem, subIndex) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors
                          ${isSubActive
                            ? 'hover:bg-gray-50'
                            : 'hover:bg-gray-50'}`}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 