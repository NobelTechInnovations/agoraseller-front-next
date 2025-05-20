"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChartLine, FaRupeeSign, FaShieldAlt, FaPercentage, FaTruck, FaCalculator, FaBox } from 'react-icons/fa';
import Header from "../components/Header";

export default function FeesPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with gradient and improved navigation */}
      <Header onLoginClick={() => setIsLoginOpen(true)} />


      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Payment Cycle Section */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 bg-blue-50 p-6">
              <div className="border-l-4 border-primary pl-3">
                <h3 className="text-xl font-bold text-gray-800">Payment Cycle</h3>
              </div>
              <div className="mt-6">
                <p className="text-gray-700 mb-2 text-sm flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-2"></span>Fast Cycle</p>
                <p className="text-gray-700 mb-2 text-sm flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-2"></span>7 day cycle</p>
                <p className="text-gray-700 mb-2 text-sm flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-2"></span>Flexible payout range</p>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5">
                  <p className="text-gray-700 mb-4">At Geniezy Seller, we prioritize timely payments. That&apos;s why we designed our payment cycle to be quick and convenient for our sellers.</p>
                  <p className="text-gray-700 mb-4">As a seller, your product payment will be processed as soon as an order is delivered to your customer and payment is reflected in Geniezy. Typically, you will then receive your payment in your account within 7 days.</p>
                  <p className="text-gray-700">Happy sellers are exactly what Geniezy Seller is about!</p>
                  <div className="mt-4 bg-blue-50 p-3 rounded shadow-inner">
                    <p className="text-gray-700 text-sm">To monitor payment status for the next 15 days in advance, log-in to your Geniezy Seller account to check your payment schedule.</p>
                  </div>
                </div>
                <div className="md:w-2/5 flex justify-center items-center mt-6 md:mt-0">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25"></div>
                    <img src="https://placehold.co/300x200" alt="Payment cycle illustration" className="relative w-full max-w-[200px] rounded-lg shadow-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fulfillment Type Section */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FaBox className="text-primary text-2xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Fulfillment Type</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded mb-6 shadow-inner">
              <p className="text-gray-700 mb-2">Two main strategies to fulfill customer shipment when they ship off a Market seller you choose.</p>
              <p className="text-gray-700">The fulfillment options include:</p>
            </div>
            
            <div className="mb-6 p-4 border-l-4 border-primary bg-white rounded-r-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Self-Fulfillment</h4>
              <p className="text-gray-700 mb-4">In this format, you are responsible for storing, packing, and delivery.</p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 p-4 border-l-4 border-primary bg-white rounded-r-lg shadow-sm">Non-Fulfillment by Market (NFBM)</h4>
              <div className="flex mt-4">
                <div className="w-[100px] flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-lg blur opacity-25"></div>
                    <img src="https://placehold.co/80x80" alt="NFBM illustration" className="relative h-20 object-contain rounded-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">This Non-Warehouse merchant type logic can co-connect how the different parts are connected in fulfillment to ensure cohesiveness to the products on your market marketplace platform.</p>
                  <p className="text-gray-700">Note Fulfillment by market ensures market sellers manage to deliver the item, not Geniezy.</p>
                  <p className="text-gray-700 mt-2 text-sm text-primary font-medium cursor-pointer hover:underline">Know More about Fulfillment types</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Type Section */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FaCalculator className="text-primary text-2xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Fee Type</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded mb-6 shadow-inner">
              <p className="text-gray-700 mb-2">Three types of fees you&apos;ll pay to trade doing with Geniezy&apos;s seller-friendly fee calculator.</p>
              <p className="text-gray-700">Geniezy is committed to Geniezy, but they charge only based on the category of products you sell. We believe merchants should come heavy handing back on your strategy, to ensure their own report and management control systems. It&apos;s always a good idea to get familiar with Geniezy&apos;s fees.</p>
            </div>
            
            <div className="mb-6 p-4 border-l-4 border-primary bg-white rounded-r-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Fixed Fee (Platform Opportunity)</h4>
              <p className="text-gray-700 mb-4">As a simple formula, a fixed fee is inserted to your order set with the Geniezy Platform being charges as a kind of a premium to be visible to the market. In the case it&apos;s like a fixed model where the fees will be charged based on the specific percentage of the order.</p>
              <p className="text-gray-700 mb-4">These fixed charges provide opportunities for sellers. By claiming being a fixed platform for their fees, many large merchants come to service their product portfolios, companies to write-ups selling across India scale merchants and more businesses.</p>
            </div>

            {/* Fee Table */}
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-2 font-semibold text-sm border-b pb-2 mb-2 bg-gray-50 p-2 rounded-t-lg">
                <div>Category Use</div>
                <div>Non-FSS</div>
                <div>FSS</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 mb-2 hover:bg-blue-50 p-2 transition-colors">
                <div>Fashion</div>
                <div>10</div>
                <div>15</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 mb-2 hover:bg-blue-50 p-2 transition-colors">
                <div>Medi</div>
                <div>15</div>
                <div>10</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm border-b pb-2 mb-2 hover:bg-blue-50 p-2 transition-colors">
                <div>Fresh</div>
                <div>7</div>
                <div>10</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm hover:bg-blue-50 p-2 transition-colors">
                <div>Beauty</div>
                <div>10</div>
                <div>15</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-4">Please note that this information is merely indicative in nature in line with the best of our analysis of subject to change. While it could vary between categories, and change as per market needs, this charge ensures you get the most exposure. The estimated charge for a category would vary as per the fixed platform fee listed in your order. As information (your time + value), these charges give the flexibility to work with your marketplace. And for a better experience, please contact your account manager.</p>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 p-4 border-l-4 border-primary bg-white rounded-r-lg shadow-sm">Commission Fee (Category)</h4>
              <p className="text-gray-700 mb-4 mt-4">It&apos;s a percentage that of a commission service charge applied to the total selling price of any product sold on our platform. This commission fee is tray-shaped. This platform calculates commission based on the categories of your product by Geniezy as PMS category. connecting the product to a public.</p>
              <p className="text-gray-700 mb-4">At Geniezy you can easily increase your speculation about a week. As the commissions change, the value of your service increases and your results start to look better. The fees on Geniezy change from time to time with the fixed fee. A seller may be subjected to the pre-stipulated commission rates on contents in the period mentioned.</p>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 p-4 border-l-4 border-primary bg-white rounded-r-lg shadow-sm">Shipping Fees (Weight & Location)</h4>
              <p className="text-gray-700 mb-4 mt-4">As its name implies, shipping fees are charged by weight. We only show flat fees that are local or zone shipping. The shipping fees are calculated based on the actual weight of the product for the volumetric weight. The lower weights appear to be charged at the rate of the smaller levels. For example weight, if your package weight is between 500gm to 2kg and your larger edges are all within 40cm, then your total shipping weight will be based on the actual weight.</p>
            </div>

            {/* Shipping Table */}
            <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
              <p className="text-sm text-gray-700 mb-2 p-3 bg-gray-50 font-medium">Dimension: Weight Tags | Length (cm) X Breadth (cm) X Height (cm)=2000</p>
              
              <div className="grid grid-cols-4 gap-2 font-semibold text-sm bg-gray-100 p-3">
                <div>Weight</div>
                <div>Local</div>
                <div>Zonal</div>
                <div>National</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm border-b p-3 hover:bg-blue-50 transition-colors">
                <div>0-0.5 Gram within 2 Kg</div>
                <div>5</div>
                <div>10</div>
                <div>15</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm border-b p-3 hover:bg-blue-50 transition-colors">
                <div>**Upto 500g - 1Kg</div>
                <div>20</div>
                <div>30</div>
                <div>40</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm border-b p-3 hover:bg-blue-50 transition-colors">
                <div>**Upto 500g - 2Kg</div>
                <div>25</div>
                <div>40</div>
                <div>50</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm border-b p-3 hover:bg-blue-50 transition-colors">
                <div>20kg, upto 1Kg for every 0.5kg</div>
                <div>8</div>
                <div>15</div>
                <div>20</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm border-b p-3 hover:bg-blue-50 transition-colors">
                <div>25kg, upto 1.5kg for every 1.5kg</div>
                <div>4</div>
                <div>10</div>
                <div>15</div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-sm p-3 hover:bg-blue-50 transition-colors">
                <div>30kg and ranging 1Kg every 1Kg</div>
                <div>4</div>
                <div>9</div>
                <div>15</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4">Please note that this information is merely indicative in nature in line with the best of our analysis of subject to change. While it could vary between categories, and change as per market needs, this charge ensures you get the most exposure. The estimated charge for a category would vary as per the criteria provided on the service plan page.</p>

            <div className="mt-6">
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Final Droppoint: New installed cities like cities of a total listed,</li>
                <li>Special Helicopter: new shipped beside else</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Calculate Gross Margin */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FaCalculator className="text-primary text-2xl mr-3" />
              <h3 className="text-xl font-bold text-gray-800">How to calculate your gross margin?</h3>
            </div>
            <div className="bg-blue-50 p-4 rounded mb-6 shadow-inner">
              <p className="text-gray-700 mb-4">The seller dashboard provides a comprehensive information about the system that makes it easier to understand where your margins currently stand in the store.</p>
              <p className="text-gray-700">To calculate your gross margin, use our easy to use formula below:</p>
            </div>

            <div className="mt-6 border-b pb-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg">
              <p className="font-medium text-gray-800">Total Product fees = Fixed Fee + Commission Fee + Shipping Fee (If applicable)</p>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg">
              <p className="font-medium text-gray-800">Gross Margin (assuming GST) = Selling Price of Product - Total Product Fees charged</p>
            </div>
          </div>
        </div>

        {/* Calculation Process */}
        <div className="bg-white shadow-xl rounded-lg mb-12 overflow-hidden border border-gray-200 transition-shadow hover:shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Let&apos;s understand with an example:</h3>
            
            <p className="text-gray-700 mb-4">Suppose you want to sell a product worth ₹1000 (excluding shipping) What to you as a potential fulfillment mode, the cost to set your product in Market is this computation:</p>
            
            <div className="mt-6">
              <div className="border-l-4 border-primary pl-3 mb-6 bg-white p-4 rounded-r-lg shadow-sm">
                <p className="font-medium">Step 1 - Consider Selling Price</p>
              </div>
              <p className="text-gray-700 mb-4">The selling price of the product is ₹1000 (which incl. 18% to ₹169/color) No revenue confusion, just simple selling on our calculation:</p>
              <p className="text-gray-700 mb-4">So, we take the subtotal price of the listed product as the fixed price and choose pricing less fixed price. The price of the product before is 844 prices. You&apos;re paying only GST.</p>
            </div>

            <div className="mt-6">
              <div className="border-l-4 border-primary pl-3 mb-6 bg-white p-4 rounded-r-lg shadow-sm">
                <p className="font-medium">Step 2 - Apply Commission</p>
              </div>
              <p className="text-gray-700 mb-4">Apply the commission based on the product. Here your the shaving purchase is likely a 4.4%, commission fee on the platform.</p>
              <p className="text-gray-700 mb-4">Commission = ₹38/product</p>
            </div>

            <div className="mt-6">
              <div className="border-l-4 border-primary pl-3 mb-6 bg-white p-4 rounded-r-lg shadow-sm">
                <p className="font-medium">Step 3 - Consider Logistics</p>
              </div>
              <p className="text-gray-700 mb-4">If the product weight is 1 liter for zonal, your flat fee for local may be ₹10-15.</p>
              <p className="text-gray-700 mb-4">Shipping charge = ₹15</p>
            </div>

            <div className="mt-6">
              <div className="border-l-4 border-primary pl-3 mb-6 bg-white p-4 rounded-r-lg shadow-sm">
                <p className="font-medium">Step 4 - Calculate Gross Margin</p>
              </div>
              <p className="text-gray-700 mb-4">Total Final Fees = ₹38 + ₹10 = ₹48</p>
              <p className="text-gray-700 mb-4">Gross Margin = ₹844 - ₹48 = ₹796/97%</p>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded shadow-inner">
              <p className="text-gray-700">Geniezy has the most committed team of global experts who strive to make business priorities digital commerce more accessible to businesses. Our competitive fees ensure all sellers can access a quicker selection from our marketplace, perfect business ecosystem intelligence.</p>
              <p className="text-gray-700 mt-2">Over 500 businesses and 2 million customers later, we&apos;re transforming how online retail happens in India by providing your business access to control mode of audience. Unlock maximum earnings with us, to add our success story to your case, reach out to us today at your dedicated account manager or call 1800-572-4450. Sales will address your concern in no time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-10 text-center">Popular categories to sell across India</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {Array(24).fill().map((_, i) => (
              <div key={i} className="text-sm text-gray-300 hover:text-white">
                <Link href="/" className="hover:underline transition-colors">Popular Category {i+1}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

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
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-400 text-white rounded-md font-medium transition-colors text-sm"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                <button
                  className="w-full p-3 bg-gray-400 text-white rounded-md font-medium transition-colors"
                  disabled
                >
                  Continue
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
    </div>
  );
}