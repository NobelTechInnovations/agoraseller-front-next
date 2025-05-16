import { NextResponse } from 'next/server';
import axiosInstance from '../../../../../utils/axios';

export async function GET() {
  try {
    // Get the token from cookies or localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('sellerAuth') : null;
    
    // Make the API request to the backend
    const response = await axiosInstance.get('/v1/seller/dashboard/sales-report', {
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
        'Content-Disposition': 'attachment; filename="sales-report.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to download sales report' }),
      {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 