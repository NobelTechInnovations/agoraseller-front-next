import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
  },
});

export async function GET(request, { params }) {
  try {
    // Get the path from the URL
    const path = params.path.join('/');
    
    // Generate a pre-signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: path,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Fetch the image from S3
    const response = await fetch(url);
    const blob = await response.blob();

    // Return the image with appropriate headers
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type'),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
} 