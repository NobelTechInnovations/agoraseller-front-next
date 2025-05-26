import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';


export default function InventoryPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium mb-2">Products</h2>
                    <p className="text-sm text-gray-600">
                        View and manage all products in your inventory.
                    </p>
                    <Link href="/store-manage/inventory/products" className="text-blue-500 hover:text-blue-600">
                        View Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
