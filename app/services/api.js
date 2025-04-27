// API base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


/**
 * Send OTP to the provided phone number
 * @param {string} phone - Phone number (10-15 digits)
 * @returns {Promise} - API response
 */
export const sendOTP = async (phone) => {
  try {
    const response = await fetch(`${BASE_URL}/seller/onboarding/send-otp`, {
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
    const response = await fetch(`${BASE_URL}/seller/onboarding/verify-otp`, {
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

// Export other API methods as needed 