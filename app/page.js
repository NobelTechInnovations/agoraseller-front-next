"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sendOTP, verifyOTP } from "./services/api";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

export default function Home() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);

  // Validate phone number (10-15 digits)
  const isValidPhone = (phone) => {
    return /^\d{10,15}$/.test(phone);
  };

  // Handle send OTP
  const handleSendOTP = async () => {
    if (!isValidPhone(phoneNumber)) {
      setError("Please enter a valid 10-15 digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await sendOTP(phoneNumber);
      if (data.success) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
        setOtpSent(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleContinue = async () => {
    if (!otp || otp.trim().length === 0) {
      setError("Please enter the OTP");
      return;
    }

    setVerifying(true);
    setError("");

    try {
      const data = await verifyOTP(phoneNumber, otp);

      const secretKey = "24_agora_secret";
      const encryptedPhone = CryptoJS.AES.encrypt(phoneNumber, secretKey).toString();

      if (data.success) {
        if(data.data.isNewUser){
          sessionStorage.setItem('verified_phone', phoneNumber);
          router.push(`/onboarding`);
        }else{
          router.push(`/store-manage`);
        }
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="ml-2 text-xl font-bold text-[#6800cd]">AgoraSeller Hub</span>
              </Link>
              <nav className="hidden md:flex space-x-8 ml-12">
                <Link href="/learn" className="text-gray-700 hover:text-[#6800cd]">Learn</Link>
                <Link href="/fees" className="text-gray-700 hover:text-[#6800cd]">Fees and Commission</Link>
                <Link href="/grow" className="text-gray-700 hover:text-[#6800cd]">Grow with Us</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="text-gray-700 hover:text-[#6800cd] font-medium"
              >
                Login
              </button>
              <Link
                href="/seller/login"
                className="bg-[#6800cd] text-white px-4 py-2 rounded-md hover:bg-[#5400a3] transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                Become a Seller on Agora Market and sell to 50 Crore+ customers
              </h1>
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5eeff] flex items-center justify-center">
                    <span className="text-[#6800cd] font-bold">14L+</span>
                  </div>
                  <div>
                    <p className="font-medium">Seller community</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5eeff] flex items-center justify-center">
                    <span className="text-[#6800cd] font-bold">24×7</span>
                  </div>
                  <div>
                    <p className="font-medium">Online Business</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5eeff] flex items-center justify-center">
                    <span className="text-[#6800cd] font-bold">7</span>
                  </div>
                  <div>
                    <p className="font-medium">days* payment</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#f5eeff] flex items-center justify-center">
                    <span className="text-[#6800cd] font-bold">19k+</span>
                  </div>
                  <div>
                    <p className="font-medium">Pincodes served</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              
            </div>
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {isLoginOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 " onClick={() => setIsLoginOpen(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 pointer-events-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Login</h2>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter Mobile Number" 
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={otpSent || loading}
                    />
                    <button 
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 ${
                        loading ? 'bg-gray-400' : isValidPhone(phoneNumber) ? 'bg-[#6800cd] hover:bg-[#5400a3]' : 'bg-gray-400'
                      } text-white rounded-md font-medium transition-colors text-sm`}
                      onClick={handleSendOTP}
                      disabled={!isValidPhone(phoneNumber) || loading || otpSent}
                    >
                      {loading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                    </button>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                {otpSent && (
                  <div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6800cd] text-sm font-medium"
                        onClick={() => {
                          setOtp("");
                          setOtpSent(false);
                          handleSendOTP();
                        }}
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  className={`w-full p-3 ${
                    otpSent && otp ? 'bg-[#6800cd] hover:bg-[#5400a3]' : 'bg-gray-400'
                  } text-white rounded-md font-medium transition-colors`}
                  onClick={handleContinue}
                  disabled={!otpSent || !otp || verifying}
                >
                  {verifying ? 'Verifying...' : 'Continue'}
                </button>

                <p className="text-xs text-center text-gray-600">
                  By continuing, you agree to our{" "}
                  <Link href="#" className="text-[#6800cd]">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-[#6800cd]">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
