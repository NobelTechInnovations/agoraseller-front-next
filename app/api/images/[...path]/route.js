import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Make sure to check for environment variables and use fallbacks if needed
const region = process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1';
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;
const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'seller-app-product';

// Initialize S3 client with proper region
const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function GET(request, context) {
  // Use context.params instead of params directly
  const { params } = context;
  
  try {
    // Make sure params.path is available and await it properly
    if (!params?.path || !Array.isArray(params.path)) {
      return new NextResponse('Invalid path', { status: 400 });
    }

    // Get the path from the URL
    const path = params.path.join('/');
    
    console.log('Fetching image from S3:', path);
    console.log('Using bucket:', bucketName);
    console.log('Using region:', region);
    
    // Try direct URL approach first
    const directUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${path}`;
    console.log('Trying direct URL:', directUrl);
    
    try {
      const directResponse = await fetch(directUrl);
      if (directResponse.ok) {
        const blob = await directResponse.blob();
        return new NextResponse(blob, {
          headers: {
            'Content-Type': directResponse.headers.get('Content-Type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    } catch (directError) {
      console.error('Direct URL access failed:', directError);
    }
    
    // If direct URL failed and we have credentials, try with signed URL
    if (accessKeyId && secretAccessKey) {
      try {
        // Generate a pre-signed URL
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: path,
        });
    
        // Generate the signed URL
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        
        // Fetch the image from S3
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`S3 responded with status: ${response.status}`);
        }
        
        const blob = await response.blob();
    
        // Return the image with appropriate headers
        return new NextResponse(blob, {
          headers: {
            'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (error) {
        console.error('Error with signed URL approach:', error);
      }
    }
    
    // If all approaches fail, return error
    return new NextResponse('Unable to access image', { status: 500 });
  } catch (error) {
    console.error('Error in image API route:', error);
    return new NextResponse('Error processing image request', { status: 500 });
  }
} 