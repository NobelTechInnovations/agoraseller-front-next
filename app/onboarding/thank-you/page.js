"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user arrived here legitimately
    const authData = localStorage.getItem('sellerAuth');
    if (!authData) {
      router.push('/onboarding');
      return;
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#f5eeff] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Onboarding Complete!</h1>
        <p className="text-sm text-gray-600 mb-6">Thank you for joining Agora Market. Your seller account is now being set up.</p>
        
        <div className="bg-[#f5eeff] rounded-lg p-4 mb-6">
          <h2 className="text-sm font-medium text-gray-800 mb-2">What happens next?</h2>
          <ul className="text-xs text-gray-600 space-y-2 text-left">
            <li className="flex items-start">
              <span className="w-4 h-4 bg-[#6800cd] rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</span>
              <span>Our team will verify your account details within 24-48 hours</span>
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 bg-[#6800cd] rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</span>
              <span>You'll receive an email confirmation once your account is activated</span>
            </li>
            <li className="flex items-start">
              <span className="w-4 h-4 bg-[#6800cd] rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</span>
              <span>Log in to your seller dashboard to list your first product</span>
            </li>
          </ul>
        </div>
        
        <div className="flex justify-center mb-6">
          <Image 
            src="/onboarding-complete.png" 
            alt="Onboarding complete" 
            width={200} 
            height={150}
            className="object-contain"
          />
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/store-manage" 
            className="block w-full p-2 bg-[#6800cd] hover:bg-[#5400a3] text-white rounded-md text-sm font-medium transition-colors"
          >
            Go to Seller Dashboard
          </Link>
          
          <Link 
            href="/" 
            className="block w-full p-2 bg-white hover:bg-gray-50 text-[#6800cd] border border-[#6800cd] rounded-md text-sm font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 