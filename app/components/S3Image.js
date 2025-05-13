'use client';

import { useState, useEffect } from 'react';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const S3Image = ({ 
  src, 
  alt, 
  width = 150, 
  height = 150, 
  className = '', 
  fallbackSrc = '/placeholder-image.png',
  objectFit = 'cover'
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Initialize S3 client
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    },
  });

  // Function to get pre-signed URL
  const getPresignedUrl = async (key) => {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: key,
      });
      return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      return null;
    }
  };

  // Function to extract key from S3 URL
  const getKeyFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading slash and decode
    } catch (error) {
      console.error('Error parsing S3 URL:', error);
      return null;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const generateSignedUrl = async () => {
      try {
        if (!src) {
          setError(true);
          setLoading(false);
          return;
        }

        const key = getKeyFromUrl(src);
        if (!key) {
          setError(true);
          setLoading(false);
          return;
        }

        const signedUrl = await getPresignedUrl(key);
        if (signedUrl) {
          setSignedUrl(signedUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error generating signed URL:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) {
      generateSignedUrl();
    }
  }, [src, mounted]);

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (!mounted) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {signedUrl && (
        <img
          src={error ? fallbackSrc : signedUrl}
          alt={alt || 'Product image'}
          width={width}
          height={height}
          className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
          style={{ 
            objectFit: 'contain',
            width: '100%',
            height: '100%'
          }}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};

export default S3Image; 