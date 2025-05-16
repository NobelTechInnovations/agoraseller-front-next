import { NextResponse } from 'next/server';
import axiosInstance from '../../../../../utils/axios';

export async function GET() {
  try {
    // Get the token from cookies or localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellerAuth') : null;
    
    // Make the API request to the backend
    const response = await axiosInstance.get('/v1/seller/dashboard/return-report', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Important for binary files like Excel
    });

    // Return the Excel file as a blob
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="return-report.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error fetching return report:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to download return report' }),
      {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 