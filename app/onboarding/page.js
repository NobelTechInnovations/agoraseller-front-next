"use client";

import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-[#6800cd] mb-6">Complete Your Profile</h1>
        
        <p className="text-gray-600 mb-8">
          Your phone number has been verified successfully. Please complete your seller profile to start selling on Agora Market.
        </p>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-black mb-3">Next Steps:</h2>
            <ul className="space-y-2 list-disc pl-5 text-gray-700">
              <li>Provide your business details</li>
              <li>Upload required documents</li>
              <li>Set up your bank account</li>
              <li>Create your store profile</li>
            </ul>
          </div>
          
          <Link 
            href="/onboarding/business-details" 
            className="block w-full p-3 bg-[#6800cd] text-white rounded-md font-medium text-center hover:bg-[#5400a3] transition-colors"
          >
            Continue to Business Details
          </Link>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            Need help? <Link href="/support" className="text-[#6800cd]">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 