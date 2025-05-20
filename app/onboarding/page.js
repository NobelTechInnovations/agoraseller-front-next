"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { registerSeller } from "../services/api";
import OnboardingSteps from "../components/OnboardingSteps";
import { getSession } from "next-auth/react";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState("enrolment");
  const [enrolmentID, setEnrolmentID] = useState("");
  const [provideDetailsLater, setProvideDetailsLater] = useState(false);

  // Personal details form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(searchParams.get("verify") || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await getSession();
      if (!session.user.isNewUser) router.push('/store-manage');
      setPhone(session?.user?.phone)
    };
    fetchUser();
  }, []);

  // Check for verified phone from sessionStorage if not in URL params
  useEffect(() => {
    if (!phone) {
      const verifiedPhone = sessionStorage.getItem('verified_phone');
      if (verifiedPhone) {
        setPhone(verifiedPhone);
      }
    }
  }, [phone]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const data = await registerSeller({
        name,
        email,
        phone,
        password
      });

      if (data.success) {
        // Save token to localStorage with expiration
        const tokenData = {
          token: data.data.token,
          expiry: new Date().getTime() + (2 * 24 * 60 * 60 * 1000) // 2 days in milliseconds
        };
        localStorage.setItem('sellerAuth', JSON.stringify(tokenData));

        // Navigate to the business details page
        router.push("/onboarding/business-details");
      } else {
        // Handle API error
        setErrors({ api: data.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      setErrors({ api: "Network error. Please try again." });
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
          <OnboardingSteps currentStep="personal" />

          {/* Main Form */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>

            <form onSubmit={handleRegistration} className="space-y-3">
              {errors.api && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {errors.api}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                  placeholder="Your verified phone number"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password*
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-[#6800cd] focus:border-transparent`}
                  placeholder="Create a password (min. 8 characters)"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className={`w-full p-2 bg-[#6800cd] hover:bg-[#5400a3] text-white rounded-md font-medium transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Section - Info */}
      <div className="hidden md:block md:w-2/5 bg-[#f5eeff]">
        <div className="h-full flex flex-col justify-center items-center p-6">
          <div className="max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Why sell on Geniezy Market?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">No commission selling</h3>
                  <p className="text-xs text-gray-600">Sell your products without paying any commission on Geniezy Market</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Easy payments</h3>
                  <p className="text-xs text-gray-600">Get your payments deposited directly to your bank account</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Quick onboarding</h3>
                  <p className="text-xs text-gray-600">Start selling in just 24 hours with minimal documentation</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">Wide customer reach</h3>
                  <p className="text-xs text-gray-600">Reach millions of customers across India</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Image
                src="/sellingbenefits.png"
                alt="Benefits of selling on Geniezy"
                width={350}
                height={200}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}