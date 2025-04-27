import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#6800cd]">SellOnAgora</h1>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-black">Welcome to SellOnAgora</h2>
            <p className="text-gray-600 mt-1">Create your account to start selling</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter Mobile Number" 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-[#6800cd] text-white rounded-r-md font-medium hover:bg-[#5400a3] transition-colors">
                  Send OTP
                </button>
              </div>
              <p className="text-red-500 text-sm mt-1">This field is required.</p>
            </div>

            <div>
              <input 
                type="text" 
                placeholder="Enter OTP" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6800cd] focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="whatsapp-updates" 
                className="h-4 w-4 text-[#6800cd] focus:ring-[#6800cd] border-gray-300 rounded"
              />
              <label htmlFor="whatsapp-updates" className="ml-2 block text-sm text-gray-700">
                I want to receive important updates on WhatsApp
              </label>
            </div>

            <button className="w-full p-3 bg-[#6800cd] text-white rounded-md font-medium hover:bg-[#5400a3] transition-colors">
              Create Account
            </button>

            <p className="text-xs text-center text-gray-600">
              By clicking you agree to our{" "}
              <Link href="#" className="text-[#6800cd]">Terms & Conditions</Link>
              {" "}and{" "}
              <Link href="#" className="text-[#6800cd]">Privacy Policy</Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              Already a user?{" "}
              <Link href="#" className="text-[#6800cd] font-medium">Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Info Graphics */}
      <div className="w-full md:w-1/2 bg-gray-50 p-6 md:p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold text-black mb-8">
            Grow your business faster by selling on SellOnAgora
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#f5eeff] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-black">11 lakh+</h3>
                <p className="text-sm text-gray-600">Suppliers are selling commission-free</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#f5eeff] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-black">19000+</h3>
                <p className="text-sm text-gray-600">Pincodes supported for delivery</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#f5eeff] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-black">Crore of</h3>
                <p className="text-sm text-gray-600">Customers buy across India</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#f5eeff] flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-black">700+</h3>
                <p className="text-sm text-gray-600">Categories to sell</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-lg font-semibold text-black mb-4">All you need to sell on SellOnAgora is:</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#f5eeff] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Tax Details</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center ml-9">
                  <span className="w-1 h-1 rounded-full bg-gray-700 mr-2"></span>
                  <span className="text-gray-700">Enrolment ID/UIN</span>
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">For Non-GST sellers</span>
                  <span className="ml-1 text-xs bg-[#6800cd] text-white px-2 py-0.5 rounded">New</span>
                </div>
              </div>

              <div>
                <div className="flex items-center ml-9">
                  <span className="w-1 h-1 rounded-full bg-gray-700 mr-2"></span>
                  <span className="text-gray-700">GSTIN</span>
                  <span className="ml-2 text-xs text-gray-500">Regular & Composition GST sellers</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-[#f5eeff] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6800cd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Bank Account</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Image
              src="/store.png"
              alt="Store illustration"
              width={200}
              height={150}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
