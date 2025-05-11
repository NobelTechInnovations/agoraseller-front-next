'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import Link from 'next/link';

const PreviousPaymentsPage = () => {

    return (
        <>
        <div className="p-4">
            <div className="flex items-center gap-2 mb-6">
            <Link href="/store-manage/payments" className="text-blue-600 text-sm hover:text-blue-700">
                <Icon icon="solar:arrow-left-linear" className="cursor-pointer" width="24" height="24" />
            </Link>
            <h1 className="text-xl font-semibold">Previous Payments</h1>
            </div>
        </div>
        </>
    )
}

export default PreviousPaymentsPage;