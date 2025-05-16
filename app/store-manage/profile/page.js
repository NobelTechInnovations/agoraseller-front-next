'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    personal: {
      name: '',
      email: '',
      phone: '',
      status: '',
      profile_complete: false
    },
    bank_details: [],
    business_details: {
      _id: '',
      seller_id: '',
      business_name: '',
      business_address: '',
      pincode: '',
      currency: 'INR',
      language: 'en',
      documents: {
        pan: ''
      },
      status: '',
      created_at: '',
      updated_at: ''
    },
    communication_preferences: {}
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        const response = await axiosInstance.get('/v1/seller/accounts/profile', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        if (response.data.success) {
          console.log('Profile data:', response.data.data);
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Helper function to render the profile completion status
  const renderProfileStatus = () => {
    const { personal, business_details } = profileData;
    const statusColors = {
      'in-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'incomplete': 'bg-gray-100 text-gray-800'
    };

    const statusColor = statusColors[personal.status] || 'bg-gray-100 text-gray-800';
    const completionPercentage = personal.profile_complete ? 100 : 60;

    return (
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Profile Health</h2>
          <div className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
            {personal.status === 'in-review' ? 'In Review' : 
             personal.status === 'approved' ? 'Approved' :
             personal.status === 'rejected' ? 'Rejected' : 'Incomplete'}
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-600">Profile Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mt-3">
          {personal.profile_complete 
            ? 'Your profile is complete. Keep it updated for better performance.'
            : 'Complete your profile to improve your seller performance and visibility.'}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-4 py-3">
        <div className="flex items-center">
          <Icon icon="solar:user-circle-linear" className="text-blue-600 mr-2" width="32" height="32" />
          <h1 className="text-xl font-semibold">Seller Account</h1>
        </div>
      </div>

      {/* Profile Health Status */}
      {renderProfileStatus()}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex text-sm overflow-x-auto">
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Details
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'password' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'bank' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('bank')}
            >
              Bank Details
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'business' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('business')}
            >
              Business Details
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'warehouse' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('warehouse')}
            >
              Warehouse Address
            </button>
            <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'communication' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('communication')}
            >
              Communication
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Your Name"
                        defaultValue={profileData.personal.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        defaultValue={profileData.personal.email}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Your Phone Number"
                        defaultValue={profileData.personal.phone}
                      />
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Icon icon="solar:info-circle-linear" className="text-gray-600 mt-0.5 mr-2" width="20" height="20" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1">Personal Information Status</h4>
                        <p className="text-sm text-gray-700">
                          {profileData.personal.status === 'in-review' 
                            ? 'Your personal details are currently under review.' 
                            : profileData.personal.status === 'approved'
                            ? 'Your personal details have been verified and approved.'
                            : 'Your personal details require verification.'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="max-w-md">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter new password"
                      />
                      <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters with a mix of letters, numbers & symbols</p>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'bank' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Bank Account Details</h3>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
                      <Icon icon="solar:add-circle-linear" className="mr-1" width="16" height="16" />
                      Add New Account
                    </button>
                  </div>
                  
                  {profileData.bank_details && profileData.bank_details.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.bank_details.map((bank) => (
                        <div key={bank._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-md font-medium">{bank.account_holder_name}</h4>
                              <p className="text-sm text-gray-600">{bank.bank_name || 'Bank Name Not Available'}</p>
                            </div>
                            <div className="flex space-x-2">
                              {bank.is_primary && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Primary
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full ${bank.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {bank.is_verified ? 'Verified' : 'Verification Pending'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Account Number:</span>
                              <span className="ml-2">{bank.account_number.substring(0, 2)}XXXX{bank.account_number.substring(bank.account_number.length - 4)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">IFSC Code:</span>
                              <span className="ml-2">{bank.ifsc_code}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Added On:</span>
                              <span className="ml-2">{new Date(bank.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-3">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                              Edit
                            </button>
                            {!bank.is_primary && (
                              <>
                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                  Set as Primary
                                </button>
                                <button className="text-sm text-red-600 hover:text-red-800">
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Icon icon="solar:card-linear" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Added</h4>
                      <p className="text-gray-600 mb-4">Add your bank account details to receive payments</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Add Bank Account
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'business' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                  {profileData.business_details ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={profileData.business_details.business_name}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={profileData.business_details.documents?.pan || ''}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="3"
                            defaultValue={profileData.business_details.business_address}
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            defaultValue={profileData.business_details.pincode}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={profileData.business_details.currency}>
                            <option value="INR">Indian Rupee (INR)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={profileData.business_details.language}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <Icon icon="solar:info-circle-linear" className="text-blue-600 mt-0.5 mr-2" width="20" height="20" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Business Verification Status</h4>
                            <p className="text-sm text-blue-700">
                              {profileData.business_details.status === 'in-review' 
                                ? 'Your business details are currently under review.' 
                                : profileData.business_details.status === 'approved'
                                ? 'Your business details have been verified and approved.'
                                : 'Your business details require verification.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    
                      <div className="mt-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Save Changes
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Icon icon="solar:buildings-2-linear" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Business Details Added</h4>
                      <p className="text-gray-600 mb-4">Add your business information to complete your profile</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Add Business Details
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'warehouse' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Warehouse Addresses</h3>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center">
                      <Icon icon="solar:add-circle-linear" className="mr-1" width="16" height="16" />
                      Add New Warehouse
                    </button>
                  </div>
                  
                  <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <Icon icon="solar:box-minimalistic-linear" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Warehouse Addresses Added</h4>
                    <p className="text-gray-600 mb-4">Add your warehouse locations to manage inventory better</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Add Warehouse Address
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'communication' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium mb-3">Email Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Order Updates</p>
                            <p className="text-xs text-gray-500">Receive notifications when orders are placed, shipped, or delivered</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Returns & Refunds</p>
                            <p className="text-xs text-gray-500">Get notified about return requests and refund status</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Promotions & Offers</p>
                            <p className="text-xs text-gray-500">Updates about new features, sale events, and special offers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-medium mb-3">SMS Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Order Status</p>
                            <p className="text-xs text-gray-500">Receive SMS alerts for important order status changes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Payment Confirmations</p>
                            <p className="text-xs text-gray-500">Get SMS alerts when payments are processed</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
