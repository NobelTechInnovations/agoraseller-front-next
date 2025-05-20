"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ onLoginClick }) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
          
            <span className="text-xl font-bold text-white"> Seller Hub <span className="text-xs text-secondary ">by Geniezy</span></span>
          </Link>
          <nav className="hidden md:flex space-x-8 ml-12">
            {/* <Link href="/learn" className="text-white/90 hover:text-white transition-colors">Learn</Link> */}
            <Link href="/fees" className="text-white/90 hover:text-white transition-colors">Fees & Commission</Link>
            {/* <Link href="/grow" className="text-white/90 hover:text-white transition-colors">Grow with Us</Link> */}
            <Link href="/success-stories" className="text-white/90 hover:text-white transition-colors">Success Stories</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onLoginClick}
            className="text-white hover:text-white/80 font-medium"
          >
            Login
          </button>
          <Link
            href="/seller/login"
            className="bg-white text-primary px-5 py-2 rounded-md hover:bg-gray-100 transition-colors font-bold"
          >
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  </header>
  );
} 
 