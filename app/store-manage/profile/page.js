'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../utils/axios';
import { getSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState('');
  const [ifscSuccess, setIfscSuccess] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showWarehouseForm, setShowWarehouseForm] = useState(false);
  const [warehouseFormData, setWarehouseFormData] = useState({
    address: '',
    pincode: '',
    contact_person: '',
    contact_number: '',
    is_primary: false
  });
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder_name: '',
    branch_name: '',
    ifsc_code: '',
    is_primary: false
  });
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
    warehouses: [],
    communication_preferences: {}
  });
  
  // Profile score simulation - in a real app this would come from API
  const [profileScore, setProfileScore] = useState({
    score: 56, // Out of 100
    last30Days: {
      orders: 125,
      returns: 3,
      cancelations: 2
    },
    performance: [
      { month: 'Jan', score: 76 },
      { month: 'Feb', score: 80 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 85 }
    ]
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

  // Function to validate and fetch IFSC code details
  const validateIfscCode = async (ifsc) => {
    if (!ifsc || ifsc.length !== 11) {
      setIfscError('IFSC code must be 11 characters');
      return;
    }
    
    try {
      setIfscLoading(true);
      setIfscError('');
      
      const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      
      if (response.status === 404) {
        setIfscError('Invalid IFSC code. Please check and try again.');
        return;
      }
      
      if (!response.ok) {
        setIfscError('Failed to validate IFSC code. Please try again.');
        return;
      }
      
      const data = await response.json();
      console.log('IFSC API response:', data);
      
      // Auto-fill bank details from the API response
      setBankFormData(prev => ({
        ...prev,
        bank_name: data.BANK || prev.bank_name,
        branch_name: `${data.BRANCH || ''} ${data.CITY ? `(${data.CITY})` : ''}`.trim(),
        ifsc_code: data.IFSC || prev.ifsc_code
      }));
      
      // Show success notification
      setIfscSuccess(true);
      setTimeout(() => setIfscSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error validating IFSC code:', error);
      setIfscError('Failed to validate IFSC code. Please try again.');
    } finally {
      setIfscLoading(false);
    }
  };
  
  // Handle IFSC code input blur event
  const handleIfscBlur = (e) => {
    const ifscCode = e.target.value.trim().toUpperCase();
    if (ifscCode) {
      validateIfscCode(ifscCode);
    }
  };

  // Function to handle bank account deletion
  const handleDeleteBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) {
      return;
    }
    
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axiosInstance.delete(`/v1/seller/accounts/bank-details/${bankId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (response.data.success) {
        // Update the bank details list by removing the deleted bank
        setProfileData(prev => ({
          ...prev,
          bank_details: prev.bank_details.filter(bank => bank._id !== bankId)
        }));
        alert('Bank account removed successfully');
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      alert('Failed to delete bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle bank form submission
  const handleBankFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axiosInstance.post('/v1/seller/accounts/bank-details', bankFormData, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (response.data.success) {
        // Fetch updated profile data or update the state directly
        const updatedResponse = await axiosInstance.get('/v1/seller/accounts/profile', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        if (updatedResponse.data.success) {
          setProfileData(updatedResponse.data.data);
        }
        
        // Reset form and hide it
        setBankFormData({
          bank_name: '',
          account_number: '',
          account_holder_name: '',
          branch_name: '',
          ifsc_code: '',
          is_primary: false
        });
        setShowBankForm(false);
        alert('Bank account added successfully');
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      alert('Failed to add bank account. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle bank form input changes
  const handleBankInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBankFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Functions for warehouse management
  const handleWarehouseFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const session = await getSession();
      let response;
      
      if (editingWarehouseId) {
        // Update existing warehouse
        response = await axiosInstance.put(`/v1/seller/accounts/warehouse/${editingWarehouseId}`, warehouseFormData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      } else {
        // Add new warehouse
        response = await axiosInstance.post('/v1/seller/accounts/warehouse', warehouseFormData, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      }
      
      if (response.data.success) {
        // Fetch updated profile data
        const updatedResponse = await axiosInstance.get('/v1/seller/accounts/profile', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        
        if (updatedResponse.data.success) {
          setProfileData(updatedResponse.data.data);
        }
        
        // Reset form and hide it
        setWarehouseFormData({
          address: '',
          pincode: '',
          contact_person: '',
          contact_number: '',
          is_primary: false
        });
        setShowWarehouseForm(false);
        setEditingWarehouseId(null);
        alert(editingWarehouseId ? 'Warehouse updated successfully' : 'Warehouse added successfully');
      }
    } catch (error) {
      console.error('Error with warehouse operation:', error);
      alert('Operation failed. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleWarehouseInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setWarehouseFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouseId(warehouse._id);
    setWarehouseFormData({
      address: warehouse.address,
      pincode: warehouse.pincode,
      contact_person: warehouse.contact_person || '',
      contact_number: warehouse.contact_number || '',
      is_primary: warehouse.is_primary || false
    });
    setShowWarehouseForm(true);
  };
  
  const handleDeleteWarehouse = async (warehouseId) => {
    if (!window.confirm('Are you sure you want to delete this warehouse?')) {
      return;
    }
    
    try {
      setLoading(true);
      const session = await getSession();
      const response = await axiosInstance.delete(`/v1/seller/accounts/warehouse/${warehouseId}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      if (response.data.success) {
        // Update the warehouses list
        setProfileData(prev => ({
          ...prev,
          warehouses: prev.warehouses.filter(warehouse => warehouse._id !== warehouseId)
        }));
        alert('Warehouse removed successfully');
      }
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      alert('Failed to delete warehouse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render the profile score
  const renderProfileStatus = () => {
    const { score, last30Days, performance } = profileScore;
    
    // Determine score color based on value
    const getScoreColor = (score) => {
      if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' };
      if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' };
      return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' };
    };
    
    const scoreColor = getScoreColor(score);

    return (
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Seller Performance Score</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Score Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 mb-3">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={scoreColor.bg}
                  strokeWidth="3"
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-2xl font-bold ${scoreColor.text}`}>{score}</span>
                <span className="text-xs text-gray-500">out of 100</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">Your seller performance score affects your visibility in search results</p>
          </div>
          
          {/* Last 30 Days Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Last 30 Days Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orders Processed</span>
                <span className="text-sm font-medium">{last30Days.orders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return Rate</span>
                <span className="text-sm font-medium">{(last30Days.returns / last30Days.orders * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancellation Rate</span>
                <span className="text-sm font-medium">{(last30Days.cancelations / last30Days.orders * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          {/* Score Factors */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">How to Improve Your Score</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Icon icon="solar:check-circle-linear" className="text-green-500 mt-0.5 mr-2" width="16" height="16" />
                <span className="text-gray-600">Maintain low return rate</span>
              </li>
              <li className="flex items-start">
                <Icon icon="solar:check-circle-linear" className="text-green-500 mt-0.5 mr-2" width="16" height="16" />
                <span className="text-gray-600">Ship orders on time</span>
              </li>
              <li className="flex items-start">
                <Icon icon="solar:check-circle-linear" className="text-green-500 mt-0.5 mr-2" width="16" height="16" />
                <span className="text-gray-600">Address customer issues quickly</span>
              </li>
              <li className="flex items-start">
                <Icon icon="solar:check-circle-linear" className="text-green-500 mt-0.5 mr-2" width="16" height="16" />
                <span className="text-gray-600">Accurate product descriptions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-4 py-3">
        <div className="flex items-center w-full justify-between">
            <div className="flex items-center">
                <Icon icon="solar:user-circle-linear" className="text-blue-600 mr-2" width="32" height="32" />
                <h1 className="text-xl font-semibold">Seller Account</h1>
            </div>
                {profileData.business_details?.business_name && (
                <p className="text-sm text-gray-500 badge bg-primary rounded-full text-white px-4 py-1">{profileData.business_details.business_name}</p>
                )}
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
            {/* <button 
              className={`py-3 px-6 border-b-2 ${activeTab === 'password' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button> */}
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
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      {editMode ? (
                        <>
                          <Icon icon="solar:pen-bold" className="mr-1" width="16" height="16" />
                          Cancel Edit
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:pen-bold" className="mr-1" width="16" height="16" />
                          Edit Details
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!editMode ? 'bg-gray-50' : ''}`}
                        placeholder="Your Name"
                        defaultValue={profileData.personal.name}
                        readOnly={!editMode}
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
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md ${!editMode ? 'bg-gray-50' : ''}`}
                        placeholder="Your Phone Number"
                        defaultValue={profileData.personal.phone}
                        readOnly={!editMode}
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
                  
                  {editMode && (
                    <div className="mt-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Changes
                      </button>
                    </div>
                  )}
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
                    {(!profileData.bank_details || profileData.bank_details.length === 0 || showBankForm) ? null : (
                      <button 
                        onClick={() => setShowBankForm(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                      >
                        <Icon icon="solar:add-circle-linear" className="mr-1" width="16" height="16" />
                        Add New Account
                      </button>
                    )}
                  </div>
                  
                  {showBankForm ? (
                    <div className="border border-gray-200 rounded-lg p-6 mb-6">
                      <h4 className="text-md font-medium mb-4">Add Bank Account</h4>
                      <form onSubmit={handleBankFormSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <div className="flex">
                              <input 
                                type="text" 
                                name="ifsc_code"
                                value={bankFormData.ifsc_code}
                                onChange={(e) => {
                                  const value = e.target.value.toUpperCase();
                                  setBankFormData(prev => ({
                                    ...prev,
                                    ifsc_code: value
                                  }));
                                  if (ifscError) setIfscError('');
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter IFSC Code (e.g. HDFC0001234)"
                                required
                                onBlur={handleIfscBlur}
                                maxLength={11}
                              />
                              {ifscLoading && (
                                <div className="ml-2 flex items-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                              )}
                            </div>
                            {ifscError && (
                              <div className="text-xs text-red-500 mt-1">{ifscError}</div>
                            )}
                            {ifscSuccess && (
                              <div className="text-xs text-green-500 mt-1 flex items-center">
                                <Icon icon="solar:check-circle-bold" className="mr-1" width="14" height="14" />
                                IFSC verified successfully! Bank details auto-filled.
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Enter IFSC code to auto-fill bank details</p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <input 
                              type="text" 
                              name="bank_name"
                              value={bankFormData.bank_name}
                              onChange={handleBankInputChange}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${bankFormData.bank_name ? 'bg-gray-50' : ''}`}
                              placeholder="Bank name (auto-filled from IFSC)"
                              readOnly={!!bankFormData.bank_name}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                            <input 
                              type="text" 
                              name="branch_name"
                              value={bankFormData.branch_name}
                              onChange={handleBankInputChange}
                              className={`w-full px-3 py-2 border border-gray-300 rounded-md ${bankFormData.branch_name ? 'bg-gray-50' : ''}`}
                              placeholder="Branch name (auto-filled from IFSC)"
                              readOnly={!!bankFormData.branch_name}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="account_number"
                              value={bankFormData.account_number}
                              onChange={handleBankInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Your account number"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="account_holder_name"
                              value={bankFormData.account_holder_name}
                              onChange={handleBankInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Name as per bank records"
                              required
                            />
                          </div>
                          
                          <div className="flex items-center h-full pt-4">
                            <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="is_primary"
                                checked={bankFormData.is_primary}
                                onChange={handleBankInputChange}
                                className="form-checkbox h-4 w-4 text-blue-600 border border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Set as primary account</span>
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setShowBankForm(false);
                              setBankFormData({
                                bank_name: '',
                                account_number: '',
                                account_holder_name: '',
                                branch_name: '',
                                ifsc_code: '',
                                is_primary: false
                              });
                              setIfscError('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading || ifscLoading || !!ifscError}
                          >
                            {loading ? 'Saving...' : 'Save Bank Details'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : null}
                  
                  {profileData.bank_details && profileData.bank_details.length > 0 && !showBankForm ? (
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
                            {bank.branch_name && (
                              <div>
                                <span className="text-gray-500">Branch:</span>
                                <span className="ml-2">{bank.branch_name}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex space-x-3">
                            {!bank.is_primary && (
                              <>
                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                  Set as Primary
                                </button>
                                <button className="text-sm text-red-600 hover:text-red-800" onClick={() => handleDeleteBank(bank._id)}>
                                  Remove
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showBankForm && (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Icon icon="solar:card-linear" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Bank Accounts Added</h4>
                      <p className="text-gray-600 mb-4">Add your bank account details to receive payments</p>
                      <button 
                        onClick={() => setShowBankForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Add Bank Account
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'business' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Details</h3>
                  </div>
                  
                  {profileData.business_details ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            defaultValue={profileData.business_details.business_name}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {profileData.business_details.documents && 'gst' in profileData.business_details.documents 
                              ? 'GST Number' 
                              : 'PAN Number'
                            }
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            defaultValue={
                              profileData.business_details.documents && 'gst' in profileData.business_details.documents 
                                ? profileData.business_details.documents.gst 
                                : profileData.business_details.documents?.pan || ''
                            }
                            readOnly={true}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            rows="3"
                            defaultValue={profileData.business_details.business_address}
                            readOnly={true}
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                            defaultValue={profileData.business_details.pincode}
                            readOnly={true}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                            defaultValue={profileData.business_details.currency}
                            disabled={true}
                          >
                            <option value="INR">Indian Rupee (INR)</option>
                            <option value="USD">US Dollar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" 
                            defaultValue={profileData.business_details.language}
                            disabled={true}
                          >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                          <Icon icon="solar:info-circle-linear" className="text-yellow-600 mt-0.5 mr-2" width="20" height="20" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800 mb-1">Business Details Can&apos;t Be Changed</h4>
                            <p className="text-sm text-yellow-700">
                              To update your business details, please contact our support team by raising a ticket or sending an email to support@sellerhub.geniezy.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 border border-gray-200 rounded-lg">
                      <Icon icon="solar:buildings-2-linear" className="mx-auto text-gray-400 mb-3" width="48" height="48" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Business Details Added</h4>
                      <p className="text-gray-600 mb-4">Add your business information to complete your profile</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Contact Support
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'warehouse' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Warehouse Addresses</h3>
                    <button 
                      onClick={() => {
                        setEditingWarehouseId(null);
                        setWarehouseFormData({
                          address: '',
                          pincode: '',
                          contact_person: '',
                          contact_number: '',
                          is_primary: false
                        });
                        setShowWarehouseForm(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                    >
                      <Icon icon="solar:add-circle-linear" className="mr-1" width="16" height="16" />
                      Add New Warehouse
                    </button>
                  </div>
                  
                  {/* Primary business address (not editable) */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-md font-medium mb-1">Main Business Address</h4>
                        <p className="text-sm text-gray-600">{profileData.business_details?.business_address ?? ''}</p>
                        <p className="text-sm text-gray-600">Jaipur, Rajasthan {profileData.business_details?.pincode || ''}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full text-center">Primary</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-500">
                        <span>Contact: {profileData.personal?.phone || ''}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Icon icon="solar:info-circle-linear" className="mr-1" width="14" height="14" />
                        Cannot be edited (Business Address)
                      </div>
                    </div>
                  </div>
                  
                  {/* Warehouse Form */}
                  {showWarehouseForm && (
                    <div className="border border-gray-200 rounded-lg p-6 mb-4">
                      <h4 className="text-md font-medium mb-4">{editingWarehouseId ? 'Edit Warehouse' : 'Add New Warehouse'}</h4>
                      <form onSubmit={handleWarehouseFormSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea 
                              name="address"
                              value={warehouseFormData.address}
                              onChange={handleWarehouseInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows="3"
                              placeholder="Full warehouse address"
                              required
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input 
                              type="text" 
                              name="pincode"
                              value={warehouseFormData.pincode}
                              onChange={handleWarehouseInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="e.g. 302019"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                            <input 
                              type="text" 
                              name="contact_person"
                              value={warehouseFormData.contact_person}
                              onChange={handleWarehouseInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Name of contact person"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input 
                              type="text" 
                              name="contact_number"
                              value={warehouseFormData.contact_number}
                              onChange={handleWarehouseInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Phone number"
                              required
                            />
                          </div>
                          <div className="flex items-center h-full pt-4">
                            <label className="inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                name="is_primary"
                                checked={warehouseFormData.is_primary}
                                onChange={handleWarehouseInputChange}
                                className="form-checkbox h-4 w-4 text-blue-600 border border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">Set as primary warehouse</span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowWarehouseForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : editingWarehouseId ? 'Update Warehouse' : 'Add Warehouse'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {/* Additional warehouses list */}
                  {profileData.warehouses && profileData.warehouses.length > 0 ? (
                    <div className="space-y-4">
                      {profileData.warehouses.map((warehouse) => (
                        <div key={warehouse._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="text-md font-medium mb-1">{warehouse.contact_person || 'Warehouse'}</h4>
                              <p className="text-sm text-gray-600">{warehouse.address}</p>
                              <p className="text-sm text-gray-600">Pincode: {warehouse.pincode}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              {warehouse.is_primary && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full text-center">Primary</span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-500">
                              <span>Contact: {warehouse.contact_number}</span>
                            </div>
                            <div className="flex space-x-3">
                              <button 
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                onClick={() => handleEditWarehouse(warehouse)}
                              >
                                <Icon icon="solar:pen-bold" className="mr-1" width="14" height="14" />
                                Edit
                              </button>
                              <button 
                                className="text-sm text-red-600 hover:text-red-800 flex items-center"
                                onClick={() => handleDeleteWarehouse(warehouse._id)}
                              >
                                <Icon icon="solar:trash-bin-trash-bold" className="mr-1" width="14" height="14" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !showWarehouseForm && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Icon icon="solar:info-circle-linear" className="text-blue-600 mt-0.5 mr-2" width="20" height="20" />
                        <div>
                          <p className="text-sm text-blue-700">
                            You are currently using your business address as your primary warehouse. Add additional warehouses if needed.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'communication' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Communication Preferences</h3>
                    <button 
                      onClick={() => setEditMode(!editMode)}
                      className="flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                    >
                      {editMode ? (
                        <>
                          <Icon icon="solar:pen-bold" className="mr-1" width="16" height="16" />
                          Cancel Edit
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:pen-bold" className="mr-1" width="16" height="16" />
                          Edit Preferences
                        </>
                      )}
                    </button>
                  </div>
                  
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
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={profileData.communication_preferences?.email?.orders || true}
                              disabled={!editMode}
                            />
                            <div className={`w-11 h-6 ${!editMode ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!editMode ? 'opacity-75' : ''}`}></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Returns & Refunds</p>
                            <p className="text-xs text-gray-500">Get notified about return requests and refund status</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={profileData.communication_preferences?.email?.returns || true}
                              disabled={!editMode}
                            />
                            <div className={`w-11 h-6 ${!editMode ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!editMode ? 'opacity-75' : ''}`}></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Promotions & Offers</p>
                            <p className="text-xs text-gray-500">Updates about new features, sale events, and special offers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={profileData.communication_preferences?.email?.promotions || false}
                              disabled={!editMode}
                            />
                            <div className={`w-11 h-6 ${!editMode ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!editMode ? 'opacity-75' : ''}`}></div>
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
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              defaultChecked={profileData.communication_preferences?.sms?.orders || true}
                              disabled={!editMode}
                            />
                            <div className={`w-11 h-6 ${!editMode ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!editMode ? 'opacity-75' : ''}`}></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Payment Confirmations</p>
                            <p className="text-xs text-gray-500">Get SMS alerts when payments are processed</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              defaultChecked={profileData.communication_preferences?.sms?.payments || false}
                              disabled={!editMode}
                            />
                            <div className={`w-11 h-6 ${!editMode ? 'bg-gray-300' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${!editMode ? 'opacity-75' : ''}`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {editMode && (
                    <div className="mt-6">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Preferences
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
