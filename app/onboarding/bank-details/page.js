"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addBankDetails } from "../../services/api";
import OnboardingSteps from "../../components/OnboardingSteps";

export default function BankDetailsPage() {
  const router = useRouter();
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);
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
    
    if (!bankName.trim()) newErrors.bankName = "Bank name is required";
    if (!accountNumber.trim()) newErrors.accountNumber = "Account number is required";
    if (accountNumber !== confirmAccountNumber) newErrors.confirmAccountNumber = "Account numbers do not match";
    if (!accountHolderName.trim()) newErrors.accountHolderName = "Account holder name is required";
    if (!ifscCode.trim()) newErrors.ifscCode = "IFSC code is required";
    
    // Basic IFSC validation (11 characters: 4 alphabets followed by 0 and 6 alphanumeric)
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      newErrors.ifscCode = "Enter a valid IFSC code (e.g., HDFC0123456)";
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
        bank_name: bankName,
        account_number: accountNumber,
        account_holder_name: accountHolderName,
        branch_name: branchName,
        ifsc_code: ifscCode,
        is_primary: isPrimary
      };
      
      // Make the API call
      const data = await addBankDetails(payload, authData.token);
      
      if (data.status) {
        // Navigate to the dashboard page
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
            <h1 className="text-2xl font-bold text-[#6800cd]">SellOnAgora</h1>
          </div>

          {/* Progress Steps */}
          <OnboardingSteps currentStep="bank" />

          {/* Main Form */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bank Account Details</h2>

            <div className="space-y-4">
              {errors.api && (
                <div className="p-2 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                  {errors.api}
                </div>
              )}
              
              {/* Bank Name */}
              <div>
                <label htmlFor="bank-name" className="block text-xs font-medium text-gray-700 mb-1">
                  Bank Name*
                </label>
                <input
                  type="text"
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter your bank name"
                  className={`w-full p-2 border ${errors.bankName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.bankName && <p className="mt-1 text-xs text-red-600">{errors.bankName}</p>}
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="account-number" className="block text-xs font-medium text-gray-700 mb-1">
                  Account Number*
                </label>
                <input
                  type="text"
                  id="account-number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  className={`w-full p-2 border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.accountNumber && <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>}
              </div>

              {/* Confirm Account Number */}
              <div>
                <label htmlFor="confirm-account-number" className="block text-xs font-medium text-gray-700 mb-1">
                  Confirm Account Number*
                </label>
                <input
                  type="text"
                  id="confirm-account-number"
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  placeholder="Confirm your account number"
                  className={`w-full p-2 border ${errors.confirmAccountNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.confirmAccountNumber && <p className="mt-1 text-xs text-red-600">{errors.confirmAccountNumber}</p>}
              </div>

              {/* Account Holder Name */}
              <div>
                <label htmlFor="account-holder-name" className="block text-xs font-medium text-gray-700 mb-1">
                  Account Holder Name*
                </label>
                <input
                  type="text"
                  id="account-holder-name"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Enter account holder's name"
                  className={`w-full p-2 border ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                />
                {errors.accountHolderName && <p className="mt-1 text-xs text-red-600">{errors.accountHolderName}</p>}
              </div>

              {/* Branch Name */}
              <div>
                <label htmlFor="branch-name" className="block text-xs font-medium text-gray-700 mb-1">
                  Branch Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Enter branch name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label htmlFor="ifsc-code" className="block text-xs font-medium text-gray-700 mb-1">
                  IFSC Code*
                </label>
                <input
                  type="text"
                  id="ifsc-code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  placeholder="Enter IFSC code (e.g. HDFC0123456)"
                  className={`w-full p-2 border ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent text-sm`}
                  maxLength={11}
                />
                {errors.ifscCode && <p className="mt-1 text-xs text-red-600">{errors.ifscCode}</p>}
              </div>

              {/* Primary Account */}
              <div className="flex items-center">
                <input
                  id="primary-account"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-[#6800cd] border-gray-300 rounded focus:ring-[#6800cd]"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                />
                <label htmlFor="primary-account" className="ml-2 text-xs text-gray-700">
                  Set as primary account for payments
                </label>
              </div>
            </div>

            {/* Continue Button */}
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
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Why we need your bank details</h3>
                <p className="text-xs text-gray-600 mb-2">We need your bank account information to process payments for your sales on Agora Market.</p>
                <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
                  <li>Your bank details are securely stored</li>
                  <li>We use industry-standard encryption</li>
                  <li>You'll receive payments directly to your bank account</li>
                  <li>Payment settlements typically happen within 3-5 business days</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <h3 className="text-sm font-medium text-gray-800 mb-2">Tips for providing bank details</h3>
                <ul className="space-y-1 text-xs text-gray-600 list-disc list-inside">
                  <li>Enter the account holder name exactly as it appears on your bank statements</li>
                  <li>Double-check your account number to avoid payment delays</li>
                  <li>IFSC code format: First 4 letters represent bank, followed by 0 and 6 characters for branch</li>
                  <li>Only savings or current accounts are accepted</li>
                </ul>
              </div>
              
              <div className="flex justify-center mt-4">
                <Image 
                  src="/banking-secure.png" 
                  alt="Secure banking" 
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