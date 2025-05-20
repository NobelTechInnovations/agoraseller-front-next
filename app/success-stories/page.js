"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChartLine, FaRupeeSign, FaShieldAlt, FaPercentage, FaTruck, FaStar, FaQuoteLeft } from 'react-icons/fa';
import Header from "../components/Header";

export default function SuccessStoriesPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with gradient and improved navigation */}
      <Header />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <FaStar className="text-primary text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Seller Success Stories</h2>
        </div>

        {/* Featured Success Story */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-blue-50 p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary mx-auto shadow-lg relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-25"></div>
                  <img 
                    src="https://static-00.iconduck.com/assets.00/person-icon-512x483-d7q8hqj4.png" 
                    alt="Rajni Surangwani" 
                    className="w-full h-full object-cover relative"
                  />
                </div>
                <h3 className="font-bold mt-3">Rajni Surangwani, United Denim</h3>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400 mx-0.5" />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-6 relative">
              <FaQuoteLeft className="text-primary/10 text-6xl absolute top-4 left-4" />
              <div className="relative">
                <p className="text-gray-700 mb-4 pl-6 pt-4 text-lg italic">
                &quot;I joined Geniezy in 2018, and leveraged their superior logistics network. Starting small business, 
                we now generate R₹2,000 lac+ a year from overseas, with stellar marketplace support.&quot;
                </p>
              </div>
              
              <div className="w-full flex justify-center mt-6">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div 
                      key={num} 
                      className={`w-2 h-2 rounded-full transition-transform ${num === 1 ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-primary/50'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              name: "Rajesh Kumar",
              business: "Fashion Store",
              image: "https://static-00.iconduck.com/assets.00/person-icon-512x483-d7q8hqj4.png",
              text: "Joining Geniezy was the best business decision I made. My sales have increased by 300% in just 6 months!",
            },
            {
              id: 2,
              name: "Priya Sharma",
              business: "Home Decor",
              image: "https://static-00.iconduck.com/assets.00/person-icon-512x483-d7q8hqj4.png",
              text: "The seller tools provided by Geniezy make managing my business so much easier. The payments are always on time.",
            },
            {
              id: 3,
              name: "Vikram Singh",
              business: "Electronics",
              image: "https://static-00.iconduck.com/assets.00/person-icon-512x483-d7q8hqj4.png",
              text: "The reach that Geniezy provides is incredible. I&apos;m getting orders from places I never imagined I could sell to.",
            },
          ].map((t) => (
            <div key={t.id} className="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center border border-gray-200 hover:shadow-2xl transition-all hover:border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-full blur opacity-0 group-hover:opacity-25 transition-opacity"></div>
                <img src={t.image} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-2 border-primary relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{t.name}</h3>
              <p className="text-primary text-sm mb-4">{t.business}</p>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="text-yellow-400 mx-0.5 text-sm" />
                ))}
              </div>
              <FaQuoteLeft className="text-primary/10 text-3xl mb-2" />
              <p className="text-gray-700 text-center">{t.text}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-blue-50 p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Start Your Success Story Today</h3>
            <p className="text-gray-600 mb-6 max-w-2xl">Join thousands of successful sellers who have transformed their business with Geniezy. Low fees, quick payments, and dedicated support — everything you need to grow.</p>
            <Link
              href="/seller/register"
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium shadow-md hover:shadow-lg"
            >
              Register as a Seller
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-10 text-center">Popular categories to sell across India</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {Array(24).fill().map((_, i) => (
              <div key={i} className="text-sm text-gray-300 hover:text-white">
                <Link href="/" className="hover:underline transition-colors">Popular Category {i+1}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 