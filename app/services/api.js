// API base URL
const BASE_URL = process.env.NEXT_PUBLIC_SELLER_API_URL;

/**
 * Send OTP to the provided phone number
 * @param {string} phone - Phone number (10-15 digits)
 * @returns {Promise} - API response
 */
export const sendOTP = async (phone) => {
  try { 
    const response = await fetch(`${BASE_URL}/user/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Verify OTP for the provided phone number
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to verify
 * @returns {Promise} - API response
 */
export const verifyOTP = async (phone, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Register a new seller after OTP verification
 * @param {object} sellerData - Seller registration data
 * @returns {Promise} - API response
 */
export const registerSeller = async (sellerData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sellerData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error registering seller:", error);
    throw error;
  }
};

/**
 * Add bank details for the seller
 * @param {object} bankDetails - Bank account details
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const addBankDetails = async (bankDetails, token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/add-bank-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(bankDetails),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding bank details:", error);
    throw error;
  }
};

/**
 * Add warehouse/pickup address for the seller
 * @param {object} warehouseData - Warehouse details
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const addWarehouse = async (warehouseData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/add-warehouse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(warehouseData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error adding warehouse:", error);
    throw error;
  }
};

/**
 * Complete seller profile with business details
 * @param {object} businessData - Business details including name, address, pincode, etc.
 * @param {string} token - Authentication token
 * @returns {Promise} - API response
 */
export const completeBusinessProfile = async (businessData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/business-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(businessData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error completing business profile:", error);
    throw error;
  }
};

// Export other API methods as needed 