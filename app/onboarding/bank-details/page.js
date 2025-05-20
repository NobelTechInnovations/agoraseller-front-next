"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addBankDetails } from "../../services/api";
import OnboardingSteps from "../../components/OnboardingSteps";

export default function BankDetailsPage() {
  const router = useRouter();
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // useEffect(() => {
  //   // Check if token exists and is valid
  //   const authData = localStorage.getItem('sellerAuth');
  //   if (!authData) {
  //     router.push('/onboarding');
  //     return;
  //   }
    
  //   try {
  //     const { token, expiry } = JSON.parse(authData);
  //     const now = new Date().getTime();
      
  //     if (now > expiry) {
  //       // Token expired
  //       localStorage.removeItem('sellerAuth');
  //       router.push('/onboarding');
  //     }
  //   } catch (error) {
  //     localStorage.removeItem('sellerAuth');
  //     router.push('/onboarding');
  //   }
  // }, [router]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!accountName.trim()) {
      newErrors.accountName = "Account holder name is required";
    }
    
    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{9,18}$/.test(accountNumber)) {
      newErrors.accountNumber = "Account number must be 9-18 digits";
    }
    
    if (accountNumber !== confirmAccountNumber) {
      newErrors.confirmAccountNumber = "Account numbers don't match";
    }
    
    if (!ifscCode.trim()) {
      newErrors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      newErrors.ifscCode = "Invalid IFSC code format";
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
        account_holder_name: accountName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        bank_name: bankName
      };
      
      // Make the API call using the service
      const data = await addBankDetails(payload);
      console.log(data);
      if (data.success) {
        
        // Navigate to the thank you page after successful submission
        router.push("/onboarding/thank-you");
      } else {
        setErrors({ api: data.message || "Failed to save bank details. Please try again." });
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
            <h1 className="text-2xl font-bold text-[#6800cd]">SellOnGeniezy</h1>
          </div>

          {/* Progress Steps */}
          <OnboardingSteps currentStep="bank" />

          {/* Main Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-xl font-semibold mb-6">Bank Account Details</h2>
            
            {errors.api && (
              <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {errors.api}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Account Holder Name */}
              <div>
                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={`w-full p-2 border ${errors.accountName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd]`}
                />
                {errors.accountName && <p className="mt-1 text-xs text-red-500">{errors.accountName}</p>}
              </div>
              
              {/* Account Number */}
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className={`w-full p-2 border ${errors.accountNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd]`}
                />
                {errors.accountNumber && <p className="mt-1 text-xs text-red-500">{errors.accountNumber}</p>}
              </div>
              
              {/* Confirm Account Number */}
              <div>
                <label htmlFor="confirmAccountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Account Number *
                </label>
                <input
                  type="text"
                  id="confirmAccountNumber"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  className={`w-full p-2 border ${errors.confirmAccountNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd]`}
                />
                {errors.confirmAccountNumber && <p className="mt-1 text-xs text-red-500">{errors.confirmAccountNumber}</p>}
              </div>
              
              {/* IFSC Code */}
              <div>
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className={`w-full p-2 border ${errors.ifscCode ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd]`}
                />
                {errors.ifscCode && <p className="mt-1 text-xs text-red-500">{errors.ifscCode}</p>}
                {ifscCode && !errors.ifscCode && (
                  <p className="mt-1 text-xs text-gray-500">Bank: {bankName || "Retrieving bank name..."}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Link href="/onboarding/business-details" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                Back
              </Link>
              <button 
                className="px-4 py-2 bg-[#6800cd] hover:bg-[#5400a3] text-white rounded-md text-sm"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="hidden md:block md:w-2/5 bg-[#f5eeff]">
        <div className="h-full flex flex-col justify-center items-center p-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Information</h2>
            <p className="text-sm text-gray-600 mb-8">
              We need your bank details to process payments for your sales. Your bank information is secured with 
              bank-grade encryption and never shared with third parties.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Secure Information</h3>
                  <p className="text-xs text-gray-600">Your bank details are encrypted and securely stored</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Fast Payments</h3>
                  <p className="text-xs text-gray-600">Receive your payments directly in your bank account</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Transaction History</h3>
                  <p className="text-xs text-gray-600">View all your transaction history in your seller dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 