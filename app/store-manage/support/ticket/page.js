'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../../utils/axios';
import { getSession } from 'next-auth/react';

const RaiseTicketPage = () => {
  const router = useRouter();
  const [queryType, setQueryType] = useState('');
  const [subQueryType, setSubQueryType] = useState('');
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query types and their sub-options
  const queryTypes = {
    'order': {
      label: 'Order Related',
      subQueries: [
        'Order Delayed',
        'Order Cancellation',
        'Wrong Item Received',
        'Item Missing',
        'Order Not Received'
      ]
    },
    'product': {
      label: 'Product Related',
      subQueries: [
        'Product Quality Issue',
        'Product Specification',
        'Product Availability',
        'Product Price',
        'Product Images'
      ]
    },
    'payment': {
      label: 'Payment Related',
      subQueries: [
        'Payment Failed',
        'Refund Status',
        'Payment Declined',
        'Double Payment',
        'Payment Method Issue'
      ]
    },
    'account': {
      label: 'Account Related',
      subQueries: [
        'Login Issues',
        'Profile Update',
        'Account Verification',
        'Password Reset',
        'Account Security'
      ]
    },
    'other': {
      label: 'Other',
      subQueries: [
        'Technical Issue',
        'Suggestion',
        'Complaint',
        'Feedback',
        'General Inquiry'
      ]
    }
  };

  // Common questions that will auto-select appropriate options
  const commonQuestions = [
    {
      text: "I want to know status of my delivery",
      queryType: "order",
      subQuery: "Order Delayed"
    },
    {
      text: "I want to know status of my payment",
      queryType: "payment",
      subQuery: "Payment Status"
    },
    {
      text: "I want to raise ticket for changing my details",
      queryType: "account",
      subQuery: "Profile Update"
    },
    {
      text: "I received a damaged product",
      queryType: "product",
      subQuery: "Product Quality Issue"
    },
    {
      text: "I want to cancel my order",
      queryType: "order",
      subQuery: "Order Cancellation"
    },
    {
      text: "My refund is pending",
      queryType: "payment",
      subQuery: "Refund Status"
    }
  ];

  const handleQuestionClick = (question) => {
    setQueryType(question.queryType);
    setSubQueryType(question.subQuery);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!queryType) newErrors.queryType = "Please select a subject";
    if (!subQueryType) newErrors.subQueryType = "Please select your concern";
    if (!message) newErrors.message = "Please enter your message";
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    // Validate Order ID or Product ID based on query type
    if (queryType === 'order' && !orderId) {
      newErrors.orderId = "Please enter the order ID";
    }
    if (queryType === 'product' && !productId) {
      newErrors.productId = "Please enter the product ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const session = await getSession();
      
      const payload = {
        subject: queryTypes[queryType].label,
        relatedConcern: subQueryType,
        message: message,
        phoneNumber: phone || undefined
      };

      // Add optional fields based on query type
      if (queryType === 'order' && orderId) {
        payload.orderId = orderId;
      }
      
      if (queryType === 'product' && productId) {
        payload.productId = productId;
      }

      const response = await axiosInstance.post('/v1/seller/support/query', payload, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (response.data.success) {
        alert('Ticket submitted successfully!');
        router.push('/store-manage/support');
      } else {
        alert('Failed to submit ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('An error occurred while submitting your ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Raise a Support Ticket</h3>
        <div className="bg-blue-100 p-4 rounded-sm">
          <p className="text-sm text-gray-600">
            <b>Note:</b> Please provide complete details about your issue to help us assist you better. Our support team will respond within 24-48 hours.
          </p>
        </div>
      </div>

      <div className="flex gap-6 bg-white">
        {/* Main Form - Half Width */}
        <div className="w-1/2">
          <div className=" p-6">
            <form onSubmit={handleSubmit}>
              {/* Subject (Query Type) */}
              <div className="mb-4">
                <label htmlFor="queryType" className="block font-bold text-sm text-gray-700 mb-1">
                  Subject*
                </label>
                <select
                  id="queryType"
                  value={queryType}
                  onChange={(e) => {
                    setQueryType(e.target.value);
                    setSubQueryType('');
                  }}
                  className={`block w-full border ${errors.queryType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                >
                  <option value="">Select Subject</option>
                  {Object.entries(queryTypes).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.queryType && <p className="mt-1 text-sm text-red-600">{errors.queryType}</p>}
              </div>

              {/* Related Concern (Sub Query Type) */}
              <div className="mb-4">
                <label htmlFor="subQueryType" className="block font-bold text-sm text-gray-700 mb-1">
                  Related Concern*
                </label>
                <select
                  id="subQueryType"
                  value={subQueryType}
                  onChange={(e) => setSubQueryType(e.target.value)}
                  className={`block w-full border ${errors.subQueryType ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  disabled={!queryType}
                >
                  <option value="">Select Your Concern</option>
                  {queryType && queryTypes[queryType].subQueries.map((subQuery) => (
                    <option key={subQuery} value={subQuery}>{subQuery}</option>
                  ))}
                </select>
                {errors.subQueryType && <p className="mt-1 text-sm text-red-600">{errors.subQueryType}</p>}
              </div>

              {/* Order ID - Show only for order related queries */}
              {queryType === 'order' && (
                <div className="mb-4">
                  <label htmlFor="orderId" className="block font-bold text-sm text-gray-700 mb-1">
                    Order ID*
                  </label>
                  <input
                    type="text"
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={`block w-full border ${errors.orderId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                    placeholder="Enter Order ID"
                  />
                  {errors.orderId && <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>}
                </div>
              )}

              {/* Product ID - Show only for product related queries */}
              {queryType === 'product' && (
                <div className="mb-4">
                  <label htmlFor="productId" className="block font-bold text-sm text-gray-700 mb-1">
                    Product ID*
                  </label>
                  <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className={`block w-full border ${errors.productId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                    placeholder="Enter Product ID"
                  />
                  {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
                </div>
              )}

              {/* Message Box */}
              <div className="mb-4">
                <label htmlFor="message" className="block font-bold text-sm text-gray-700 mb-1">
                  Message*
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className={`block w-full border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  placeholder="Please describe your issue in detail..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
              </div>

              {/* Phone Number for Callback */}
              <div className="mb-6">
                <label htmlFor="phone" className="block font-bold text-sm text-gray-700 mb-1">
                  Phone Number (for callback)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`block w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                  placeholder="Enter your 10-digit phone number"
                  maxLength="10"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Common Questions Section - Half Width */}
        <div className="w-1/2">
          <div className=" p-6 rounded-lg border border-gray-300">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Find More Help</h4>
            <div className="space-y-2">
                <ul>
              {commonQuestions.map((question, index) => (
                <li
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="w-full text-left rounded-md hover:bg-gray-50 hover:underline hover:cursor-pointer p-1 text-sm text-gray-700 transition-colors"
                >
                  {question.text}
                </li>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseTicketPage;
