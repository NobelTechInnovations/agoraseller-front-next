import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { BsListTask, BsBox } from 'react-icons/bs';
import { MdInventory2, MdPayments } from 'react-icons/md';
import { IoStatsChart } from 'react-icons/io5';
import { RiAdvertisementLine } from 'react-icons/ri';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaHandshake } from 'react-icons/fa';

const Sidebar = () => {
  const navigationLinks = [
    { 
      name: 'Welcome',
      href: '/store-manage',
      icon: HiHome
    },
    {
      name: 'Listings',
      href: '/store-manage/inventory/listing',
      icon: BsListTask
    },
    {
      name: 'Inventory',
      href: '/inventory',
      icon: MdInventory2
    },
    {
      name: 'Orders',
      href: '/store-manage/orders',
      icon: BsBox,
      isActive: true
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
      href: '/store-manage/advertisement',
      icon: RiAdvertisementLine
    },
    {
      name: 'Partner Services',
      href: '/store-manage/support',
      icon: FaHandshake
    }
  ];

  return (
    <aside className="w-24 h-[calc(100vh-64px)] bg-white border-r border-gray-200">
      <nav className="flex flex-col gap-4 py-4">
        {navigationLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center justify-center px-2 py-2 text-[11px] font-medium transition-colors text-center
              ${item.isActive 
                ? 'text-blue-600' 
                : 'text-gray-700 hover:text-blue-600'}`}
          >
            <item.icon className={`w-4 h-4 mb-1 ${item.isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 