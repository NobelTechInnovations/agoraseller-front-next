"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { sendOTP, verifyOTP } from "./services/api";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import { signIn } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { FaStore, FaChartLine, FaRupeeSign, FaShieldAlt, FaPercentage, FaTruck } from 'react-icons/fa';
import { BsCashStack, BsPhone } from 'react-icons/bs';
import { MdSupportAgent } from 'react-icons/md';
import Header from "./components/Header";

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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Array of testimonials
  const testimonials = [
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
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

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
        // Auto-fill OTP if it exists in response
        if (data.data?.otp) {
          setOtp(data.data.otp);
        }
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
      const result = await signIn('credentials', {
        redirect: false,
        phone: phoneNumber,
        otp: otp,
        auth: 'seller'
      });


      if (result.error) {
        setError(result.error);
      } else {
        const session = await getSession();
        const { user } = session;
        if (user.isNewUser) {
          router.push('/onboarding');
        }else{
          router.push('/store-manage');
        }
       
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with gradient and improved navigation */}
      <Header onLoginClick={() => setIsLoginOpen(true)} />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-[#f0f6ff] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Become a Seller on <span className="text-primary">Geniezy Market</span> and reach 50 Crore+ customers
                </h1>
                <p className="text-lg text-gray-600">
                  Join India&apos;s fastest growing e-commerce platform and transform your business today.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link
                    href="/seller/register"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg text-center"
                  >
                    Register Now
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-md hover:bg-[#f4f7ff] transition-colors font-medium text-lg text-center"
                  >
                    Learn More
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square">
                      <span className="text-primary font-bold">14L+</span>
                    </div>
                    <div>
                      <p className="font-medium">Seller community</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square">
                      <span className="text-primary font-bold">24×7</span>
                    </div>
                    <div>
                      <p className="font-medium">Online Business</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square">
                      <span className="text-primary font-bold">7</span>
                    </div>
                    <div>
                      <p className="font-medium">days* payment</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square">
                      <span className="text-primary font-bold">19k+</span>
                    </div>
                    <div>
                      <p className="font-medium">Pincodes served</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden md:block">
                <Image 
                  src="/main_img.png" 
                  alt="Geniezy Seller Success" 
                  width={600} 
                  height={500}
                  className="rounded-lg shadow-xl object-cover"
                  priority
                />
                <div className="absolute top-5 right-5 bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="text-primary rounded-full bg-primary/10 p-2 mb-2">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium">3 Orders Picked Up</p>
                  </div>
                </div>
                <div className="absolute bottom-5 right-5 bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-gray-100">
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-bold">₹8,500</p>
                    <p className="text-sm text-gray-700">Seller Payout Received</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Sell on Geniezy?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of businesses that have transformed their growth story with Geniezy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#f4f7ff] rounded-lg flex items-center justify-center mb-6">
                  <FaStore className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Low Cost Selling</h3>
                <p className="text-gray-600">
                  Start selling online with minimal investment. No listing fees and competitive commission rates.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#f4f7ff] rounded-lg flex items-center justify-center mb-6">
                  <FaChartLine className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Growth Opportunities</h3>
                <p className="text-gray-600">
                  Access to 50 Crore+ customers nationwide and exclusive marketing tools to boost your sales.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#f4f7ff] rounded-lg flex items-center justify-center mb-6">
                  <BsCashStack className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Payments</h3>
                <p className="text-gray-600">
                  Get paid within 7 days of order delivery with our secure payment system.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-[#f4f7ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Start Selling on Geniezy</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow these simple steps to launch your online business
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Register</h3>
                <p className="text-gray-600">Create your seller account with basic details</p>
                {/* Connector Line (visible on desktop) */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary"></div>
              </div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">List Products</h3>
                <p className="text-gray-600">Upload your products with images and descriptions</p>
                {/* Connector Line (visible on desktop) */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary"></div>
              </div>
              
              <div className="text-center relative">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Receive Orders</h3>
                <p className="text-gray-600">Get notified when customers place orders</p>
                {/* Connector Line (visible on desktop) */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary"></div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">4</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ship & Get Paid</h3>
                <p className="text-gray-600">Ship products and receive payments within 7 days</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link
                href="/seller/register"
                className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition-colors font-medium text-lg"
              >
                Start Selling Today
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Seller Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from sellers who transformed their business with Geniezy
              </p>
            </div>
            
            <div className="relative bg-[#f4f7ff] rounded-2xl p-8 md:p-12 shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full -ml-20 -mb-20"></div>
              
              <div className="relative z-10">
                <div key={testimonials[currentTestimonial].id} className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                    <img 
                      src={testimonials[currentTestimonial].image || "https://via.placeholder.com/150"} 
                      alt={testimonials[currentTestimonial].name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-6 text-primary">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-2xl">★</span>
                      ))}
                    </div>
                    <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6">
                      &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                    </blockquote>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].business}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-10 space-x-2">
                {testimonials.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-primary' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* More Features Section */}
        <section className="py-20 bg-gradient-to-b from-white to-[#f4f7ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful tools and support to help your business grow
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <FaRupeeSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Commission</h3>
                <p className="text-gray-600">
                  Pay only when you sell. Our competitive commission rates ensure you maximize profits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <FaShieldAlt className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Protection</h3>
                <p className="text-gray-600">
                  Our Seller Protection Fund ensures safety for legitimate business transactions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <MdSupportAgent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support</h3>
                <p className="text-gray-600">
                  Get access to dedicated account managers and 24/7 customer support.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <FaPercentage className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Special Promotions</h3>
                <p className="text-gray-600">
                  Participate in special events and promotions to boost your sales and visibility.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <FaTruck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Shipping</h3>
                <p className="text-gray-600">
                  Use our logistics partners for hassle-free shipping at discounted rates.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center bg-[#f4f7ff] text-primary rounded-full p-3 min-w-12 min-h-12 aspect-square mb-4">
                  <BsPhone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mobile App</h3>
                <p className="text-gray-600">
                  Manage your business on the go with our user-friendly seller mobile app.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Selling?</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
              Join thousands of successful sellers on Geniezy and take your business to the next level
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/seller/register"
                className="inline-block bg-white text-primary px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-bold text-lg"
              >
                Register Now
              </Link>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors font-medium text-lg"
              >
                Existing Seller? Login
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Login Modal */}
      {isLoginOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40" onClick={() => setIsLoginOpen(false)}></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 pointer-events-auto shadow-2xl transform transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Seller Login</h2>
                <button
                  onClick={() => setIsLoginOpen(false)}
                  className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter 10-15 digit number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={otpSent || loading}
                    />
                    <button
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 ${
                        loading ? 'bg-gray-400' : isValidPhone(phoneNumber) ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-400'
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">One-Time Password (OTP)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter OTP sent to your phone"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary text-sm font-medium hover:text-primary-dark"
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
                
                {otpSent && (
                  <div className="flex items-center">
                    <input
                      id="whatsapp-updates"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={whatsappUpdates}
                      onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    />
                    <label htmlFor="whatsapp-updates" className="ml-2 block text-sm text-gray-600">
                      Receive updates on WhatsApp
                    </label>
                  </div>
                )}

                <button
                  className={`w-full p-3 ${
                    otpSent && otp ? 'bg-primary hover:bg-primary-dark' : 'bg-gray-400'
                  } text-white rounded-md font-medium transition-colors`}
                  onClick={handleContinue}
                  disabled={!otpSent || !otp || verifying}
                >
                  {verifying ? 'Verifying...' : 'Continue'}
                </button>

                <p className="text-xs text-center text-gray-600">
                  By continuing, you agree to our{" "}
                  <Link href="#" className="text-primary hover:underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-center text-gray-600">
                  New to Geniezy?{" "}
                  <Link
                    href="/seller/register"
                    className="text-primary font-medium hover:underline"
                    onClick={() => setIsLoginOpen(false)}
                  >
                    Register as a Seller
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">GeniezySeller Hub</h3>
              <p className="text-gray-400 mb-4">
                Your gateway to online selling success in India&apos;s fastest growing marketplace.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/fees" className="text-gray-400 hover:text-white transition-colors">Fees & Commissions</Link></li>
                <li><Link href="/learn" className="text-gray-400 hover:text-white transition-colors">Learn to Sell</Link></li>
                <li><Link href="/success-stories" className="text-gray-400 hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/policies" className="text-gray-400 hover:text-white transition-colors">Policies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
              <p className="text-gray-400">Download our app:</p>
              <div className="flex space-x-2 mt-2">
                <Link href="#" className="block">
                  <Image 
                    src="/app-store.png" 
                    alt="Download on App Store" 
                    width={120} 
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
                <Link href="#" className="block">
                  <Image 
                    src="/play-store.png" 
                    alt="Get it on Google Play" 
                    width={135} 
                    height={40}
                    className="h-10 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Geniezy Market. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
