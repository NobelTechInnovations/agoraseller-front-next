"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { completeBusinessProfile } from "../../services/api";

export default function BusinessDetailsPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [documentType, setDocumentType] = useState("pan");
  const [documentNumber, setDocumentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!businessName.trim()) newErrors.businessName = "Business name is required";
    if (!businessAddress.trim()) newErrors.businessAddress = "Business address is required";
    if (!pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(pincode)) newErrors.pincode = "Pincode must be 6 digits";
    
    if (documentType === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber)) {
      newErrors.documentNumber = "Enter a valid PAN number";
    } else if (documentType === "gst" && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(documentNumber)) {
      newErrors.documentNumber = "Enter a valid GST number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Get authentication token
      const authData = JSON.parse(localStorage.getItem('sellerAuth'));
      
      // Prepare the request payload
      const payload = {
        business_name: businessName,
        business_address: businessAddress,
        pincode: pincode,
        country: "IN", // Hidden default value
        currency: "INR", // Hidden default value
        language: "en", // Hidden default value
        documents: {}
      };
      
      // Add the appropriate document type
      if (documentType === "pan") {
        payload.documents.pan = documentNumber;
      } else {
        payload.documents.tax_id = documentNumber;
      }
      
      // Make the API call using the service
      const data = await completeBusinessProfile(payload, authData.token);
      
      if (data.status) {
        // Navigate to the pickup address page
        router.push("/onboarding/pickup-address");
      } else {
        setErrors({ api: data.message || "Failed to save business details. Please try again." });
      }
    } catch (error) {
      setErrors({ api: "Network error. Please try again." });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Section - Form */}
      <div className="w-full md:w-3/5 p-6 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#6800cd]">SellOnAgora</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white text-[#6800cd] flex items-center justify-center border-2 border-[#6800cd]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#6800cd] mt-1">Personal Details</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#6800cd] text-white flex items-center justify-center border-4 border-[#f5eeff]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#6800cd] mt-1">Business Details</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1">Pickup Address</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1">Bank Details</span>
            </div>
            <div className="flex-1 border-t-2 border-gray-200 self-center mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center border-2 border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1">Supplier Details</span>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Details</h2>

            <div className="space-y-4">
              {errors.api && (
                <div className="p-2 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                  {errors.api}
                </div>
              )}
              
              {/* Business Name */}
              <div>
                <label htmlFor="business-name" className="block text-xs font-medium text-gray-700 mb-1">
                  Business Name*
                </label>
                <input
                  type="text"
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className={`w-full p-2 border ${errors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
              </div>

              {/* Business Address */}
              <div>
                <label htmlFor="business-address" className="block text-xs font-medium text-gray-700 mb-1">
                  Business Address*
                </label>
                <textarea
                  id="business-address"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="Enter your business address"
                  rows="3"
                  className={`w-full p-2 border ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.businessAddress && <p className="mt-1 text-xs text-red-600">{errors.businessAddress}</p>}
              </div>

              {/* Pincode */}
              <div>
                <label htmlFor="pincode" className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode*
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter your 6-digit pincode"
                  className={`w-full p-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                  maxLength="6"
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-600">{errors.pincode}</p>}
              </div>

              {/* Document Type Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Business Identification*
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="pan"
                      type="radio"
                      name="document-type"
                      className="w-3.5 h-3.5 text-[#6800cd] border-gray-300 focus:ring-[#6800cd]"
                      checked={documentType === "pan"}
                      onChange={() => {
                        setDocumentType("pan");
                        setDocumentNumber("");
                      }}
                    />
                    <label htmlFor="pan" className="ml-2 text-xs text-gray-700">
                      PAN Number
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="gst"
                      type="radio"
                      name="document-type"
                      className="w-3.5 h-3.5 text-[#6800cd] border-gray-300 focus:ring-[#6800cd]"
                      checked={documentType === "gst"}
                      onChange={() => {
                        setDocumentType("gst");
                        setDocumentNumber("");
                      }}
                    />
                    <label htmlFor="gst" className="ml-2 text-xs text-gray-700">
                      GST Number
                    </label>
                  </div>
                </div>
              </div>

              {/* Document Number */}
              <div>
                <label htmlFor="document-number" className="block text-xs font-medium text-gray-700 mb-1">
                  {documentType === "pan" ? "PAN Number*" : "GST Number*"}
                </label>
                <input
                  type="text"
                  id="document-number"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                  placeholder={documentType === "pan" ? "Enter 10-character PAN" : "Enter 15-character GST number"}
                  className={`w-full p-2 border ${errors.documentNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                  maxLength={documentType === "pan" ? 10 : 15}
                />
                {errors.documentNumber && <p className="mt-1 text-xs text-red-600">{errors.documentNumber}</p>}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-between mt-6">
              <Link href="/onboarding" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                Back
              </Link>
              <button 
                className="px-4 py-2 bg-[#6800cd] hover:bg-[#5400a3] text-white rounded-md text-sm"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="hidden md:block md:w-2/5 bg-[#f5eeff]">
        <div className="h-full flex flex-col justify-center items-center p-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Business Verification</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Why we need your business details</h3>
                <p className="text-xs text-gray-600 mb-2">Your business information helps us verify your identity and provide a secure selling environment on Agora Market.</p>
                <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
                  <li>All information is securely stored</li>
                  <li>Verification is usually completed within 24 hours</li>
                  <li>Speeds up your onboarding process</li>
                  <li>Required for legal compliance</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-2">PAN vs GST Number</h3>
                <p className="text-xs text-gray-600 mb-2">Choose the appropriate identifier for your business type:</p>
                <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
                  <li>PAN: For individual sellers or non-registered businesses</li>
                  <li>GST: For businesses registered under GST with annual turnover above threshold</li>
                </ul>
              </div>
              
              <div className="flex justify-center mt-4">
                <Image 
                  src="/business-verification.png" 
                  alt="Business verification" 
                  width={250} 
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 