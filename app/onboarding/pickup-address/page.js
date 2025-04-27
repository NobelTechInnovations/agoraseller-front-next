"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function PickupAddressPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  useEffect(() => {
    // Check if token exists and is valid
    const authData = localStorage.getItem('sellerAuth');
    if (!authData) {
      router.push('/onboarding');
      return;
    }
    
    try {
      const { token, expiry } = JSON.parse(authData);
      const now = new Date().getTime();
      
      if (now > expiry) {
        // Token expired
        localStorage.removeItem('sellerAuth');
        router.push('/onboarding');
      }
    } catch (error) {
      localStorage.removeItem('sellerAuth');
      router.push('/onboarding');
    }

    // Prevent going back by manipulating browser history
    window.history.pushState(null, '', window.location.href);
    const preventGoingBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    
    window.addEventListener('popstate', preventGoingBack);
    
    return () => {
      window.removeEventListener('popstate', preventGoingBack);
    };
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContinue = () => {
    // Handle form submission logic
    console.log("Form data:", formData);
    // Navigate to next page
    router.push("/onboarding/bank-details");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Form */}
      <div className="w-full md:w-3/5 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#6800cd]">SellOnAgora</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#6800cd] text-white flex items-center justify-center border-2 border-[#f5eeff]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#6800cd] mt-2">Tax Details</span>
            </div>
            <div className="flex-1 border-t-2 border-[#6800cd] self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#6800cd] text-white flex items-center justify-center border-4 border-[#f5eeff]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#6800cd] mt-2">Pickup Address</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500 mt-2">Bank Details</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500 mt-2">Supplier Details</span>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Enter Pickup Address</h2>
            <p className="text-sm text-gray-600 mb-6">
              This is the address where you'll prepare the order, and from where the order will be picked up for delivery.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="House No., Building Name, Street Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Area, Colony"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digit pincode"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City/District/Town *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    {/* Add more states as needed */}
                  </select>
                </div>
                <div>
                  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                  <input
                    type="text"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Landmark (Optional)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => router.push("/onboarding/tax-details")}
                className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-md font-medium text-center hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 p-3 bg-[#6800cd] text-white rounded-md font-medium hover:bg-[#5400a3] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="hidden md:block md:w-2/5 bg-gray-50 p-6 md:p-12">
        <div className="max-w-md mx-auto">
          <div className="mb-10">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Important Information About Your Pickup Address
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                The pickup address you provide will be used by our logistics partners to collect orders from you for delivery to customers.
              </p>
              <p>
                Make sure to provide accurate details, including landmarks, to help our delivery partners locate your address easily.
              </p>
              <p>
                This address will be visible to customers on their order tracking page.
              </p>
              <p>
                If you need to update your pickup address later, you can do so from your seller dashboard.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/delivery.png"
              alt="Delivery illustration"
              width={200}
              height={150}
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-10 p-4 border border-[#6800cd]/20 rounded-lg bg-[#f5eeff]">
            <h4 className="font-medium text-[#6800cd] mb-2">Need Help?</h4>
            <p className="text-sm text-gray-700">
              If you have any questions about setting up your pickup address, please <Link href="#" className="text-[#6800cd] font-medium">contact our support team</Link> for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 