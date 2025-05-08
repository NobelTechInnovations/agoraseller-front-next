'use client';
import { signOut } from "next-auth/react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();



    const handleLogout = () => {
        signOut({
            callbackUrl: "/admin/login", // Redirect here after logout
        });
    };


    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Categories', path: '/admin/dashboard/category' },
        { name: 'Attributes', path: '/admin/dashboard/attributes' },
        // Add more menu items as needed
    ];

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar */}
            <div className="w-64 border-r border-black">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-black mb-8">Admin Panel</h1>
                    <nav>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`block px-4 py-2 rounded-none border border-black ${pathname === item.path
                                                ? 'bg-black text-white'
                                                : 'text-black hover:bg-gray-100'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleLogout()} className="block px-4 py-2 rounded-none border border-black text-black hover:bg-gray-100">Logout</button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    );
} 