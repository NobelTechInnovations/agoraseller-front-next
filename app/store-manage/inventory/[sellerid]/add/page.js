'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import axiosInstance from '../../../../utils/axios';
import { getSession } from 'next-auth/react';

const AddProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryPath, setCategoryPath] = useState(['All categories']);
  const [categoryPathIds, setCategoryPathIds] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [currentCategories, setCurrentCategories] = useState([]);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const sellerId = params.sellerid;
  const MAX_IMAGES = 7;

  // Initialize S3 client
  const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    },
  });

  // Fetch master categories
  const fetchMasterCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const session = await getSession();
      const response = await axiosInstance.get('/v1/seller/category',{
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (response.data.success) {
        setCurrentCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching master categories:', error);
      setUploadError('Failed to load categories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch child categories
  const fetchChildCategories = async (parentId) => {
    setIsLoadingCategories(true);
    try {
      const response = await axiosInstance.get(`/v1/seller/category/${parentId}/tree`);
      if (response.data.success) {
        setCurrentCategories(response.data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching child categories:', error);
      setUploadError('Failed to load subcategories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Load initial categories on component mount
  useEffect(() => {
    fetchMasterCategories();
  }, []);

  // Sample child categories - Remove this as we'll use API data
  const childCategories = {};

  const uploadToS3 = async (file) => {
    try {
      // Generate a clean file name
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-'); // Replace special chars with hyphens
      const fileName = `${timestamp}-${originalName}`;
      const key = `products/${fileName}`;

      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(command);

      // Return the S3 URL with proper encoding
      const encodedKey = encodeURIComponent(key);
      return {
        url: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${encodedKey}`,
        key: key
      };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  };

  const handleNextClick = async (category) => {
    if (category.hasChildren) {
      setCategoryPath([...categoryPath, category.name]);
      setCategoryPathIds([...categoryPathIds, category._id]);
      await fetchChildCategories(category._id);
    } else {
      // This is an end category
      setSelectedCategory(category);
    }
  };

  const handleBackClick = async () => {
    if (categoryPath.length > 1) {
      const newPath = [...categoryPath];
      const newPathIds = [...categoryPathIds];
      newPath.pop();
      newPathIds.pop();
      setCategoryPath(newPath);
      setCategoryPathIds(newPathIds);
      
      // If we're going back to root, fetch master categories
      if (newPath.length === 1) {
        await fetchMasterCategories();
      } else {
        // Fetch the categories of the parent
        const parentId = newPathIds[newPathIds.length - 1];
        await fetchChildCategories(parentId);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Calculate how many more images we can add
      const remainingSlots = MAX_IMAGES - uploadedImages.length;
      
      // Take only as many files as we have slots for
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      
      // Check if we're rejecting any files due to the limit
      if (files.length > remainingSlots) {
        const rejectedCount = files.length - remainingSlots;
        setUploadError(`Only the first ${remainingSlots} image${remainingSlots !== 1 ? 's' : ''} ${remainingSlots !== 1 ? 'were' : 'was'} added. ${rejectedCount} image${rejectedCount !== 1 ? 's' : ''} ${rejectedCount !== 1 ? 'were' : 'was'} rejected due to the ${MAX_IMAGES} image limit.`);
      }
      
      // Upload each file to S3 and create preview
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error(`${file.name} is not a valid image file`);
          }

          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            throw new Error(`${file.name} is too large. Maximum size is 10MB`);
          }

          const s3Result = await uploadToS3(file);
          return {
            url: URL.createObjectURL(file), // Local preview
            name: file.name,
            s3Url: s3Result.url,
            s3Key: s3Result.key
          };
        } catch (error) {
          console.error('Error uploading file to S3:', error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }
      });

      const uploadedResults = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...uploadedResults]);
    } catch (error) {
      console.error('Error handling files:', error);
      setUploadError(error.message || 'Failed to process selected images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const remainingSlots = MAX_IMAGES - uploadedImages.length;
      
      // If we have no slots left, show error and don't process
      if (remainingSlots <= 0) {
        setUploadError(`Maximum of ${MAX_IMAGES} images already reached. No more images can be added.`);
        return;
      }
      
      // Take only as many files as we have slots for
      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      
      // Create a new DataTransfer object with only the files we're keeping
      const dataTransfer = new DataTransfer();
      filesToUpload.forEach(file => dataTransfer.items.add(file));
      
      // Update the file input with the limited files
      fileInputRef.current.files = dataTransfer.files;
      
      // Check if we're rejecting any files due to the limit
      if (files.length > remainingSlots) {
        const rejectedCount = files.length - remainingSlots;
        setUploadError(`Only ${remainingSlots} image${remainingSlots !== 1 ? 's' : ''} ${remainingSlots !== 1 ? 'were' : 'was'} added. ${rejectedCount} image${rejectedCount !== 1 ? 's' : ''} ${rejectedCount !== 1 ? 'were' : 'was'} rejected due to the ${MAX_IMAGES} image limit.`);
      }
      
      // Process the remaining files
      await handleFileUpload({ target: { files: dataTransfer.files } });
    }
  };
  
  const handleRemoveImage = (index) => {
    setUploadedImages(prev => {
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Add a function to dismiss error
  const dismissError = () => {
    setUploadError(null);
  };

  const handleSaveAndNext = async () => {
    if (!selectedCategory) {
      setUploadError('Please select a category');
      return;
    }

    if (!title.trim()) {
      setUploadError('Please enter a product title');
      return;
    }

    if (uploadedImages.length === 0) {
      setUploadError('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const payload = {
        product: {
          category_id: selectedCategory._id
        },
        images: uploadedImages.map(img => img.s3Url),
        title: {
          title: title.trim(),
          description: description.trim()
        }
      };

      const response = await axiosInstance.post('/v1/seller/product', payload);
      
      if (response.data.success) {
        // Navigate to next screen with seller ID and product ID
        router.push(`/store-manage/inventory/${sellerId}/add/${response.data.data.product.product_id}`);
      } else {
        throw new Error(response.data.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setUploadError(error.response?.data?.message || error.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Create New Listing</h3>

        <div className="bg-blue-100 p-4 mb-4 rounded-sm">
          <p className="text-sm text-gray-600">
            <b>Note:</b> you must specify all product data such as title, description, and keywords in the respective national language of desired region.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Product Form - 2/3 width */}
          <div className="w-2/3">
            <div className="bg-white p-6 rounded-sm border border-gray-200">
              <form>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 bg-gray-100 p-4">
                    <p className="text-sm text-gray-600">
                      The product title should summarize the most important product details in short, concise and informative manner. Customer should be able to 
                      identify the type of product and its main features at a glance. The ideal length is <b>50-80 characters</b>, this will ensure the entire title is visible in search results.
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="title" className="block font-bold text-sm text-gray-700 mb-1">
                      Product Title
                    </label>
                    <textarea
                      id="title"
                      rows={2}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 p-1 block w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-2 bg-gray-100 p-4">
                    <p className="text-sm text-gray-600">
                      Create a detailed description that highlights the product&apos;s features, benefits, and unique selling points.
                      Briefly and concisely describe the function, the structure and any other relevant information. Always put the most important 
                      information at the beginning of the description.
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="description" className="block font-bold text-sm text-gray-700 mb-1">
                      Product Description
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 p-1 block w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="col-span-2">
                    <div className="mb-6">
                      <div className="mb-4">
                        {/* Category Path */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          {categoryPath.map((category, index) => (
                            <div key={index} className="flex items-center">
                              <span className={index === categoryPath.length - 1 ? "font-medium" : ""}>{category}</span>
                              {index < categoryPath.length - 1 && <span className="mx-2">›</span>}
                            </div>
                          ))}
                        </div>

                        {/* Category Table */}
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Choose your desired category:</label>
                          <div className="border border-gray-200 rounded-md">
                            <div className="py-2 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-800">
                                {categoryPath[categoryPath.length - 1]}
                              </span>
                              {categoryPath.length > 1 && (
                                <button
                                  type="button"
                                  onClick={handleBackClick}
                                  className="text-sm text-blue-600 hover:text-blue-800"
                                  disabled={isLoadingCategories}
                                >
                                  Back
                                </button>
                              )}
                            </div>
                            <div className="divide-y divide-gray-200">
                              {isLoadingCategories ? (
                                <div className="py-8 flex justify-center items-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                              ) : currentCategories.length === 0 ? (
                                <div className="py-8 text-center text-gray-500">
                                  No categories found
                                </div>
                              ) : (
                                currentCategories.map((category, index) => (
                                  <div 
                                    key={category._id}
                                    className={`flex items-center justify-between py-3 px-4 hover:bg-gray-50 ${selectedCategory?._id === category._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className={`text-sm font-semibold hover:underline ${selectedCategory?._id === category._id ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                        {category.name}
                                      </span>
                                      {selectedCategory?._id === category._id && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      )}
                                    </div>
                                    <button 
                                      type="button"
                                      className={`text-sm hover:underline ${
                                        selectedCategory?._id === category._id 
                                          ? 'text-blue-600 font-medium'
                                          : category.hasChildren 
                                            ? 'text-gray-500 hover:text-blue-600' 
                                            : 'text-blue-600 hover:text-blue-800'
                                      }`}
                                      onClick={() => handleNextClick(category)}
                                      disabled={isLoadingCategories}
                                    >
                                      {category.hasChildren ? 'Next' : selectedCategory?._id === category._id ? 'Selected' : 'Select'}
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Image Upload Section - 1/3 width */}
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">Product Images</h4>
                <div className="text-sm bg-gray-100 px-2 py-1 rounded-md">
                  <span className={uploadedImages.length === MAX_IMAGES ? "font-bold text-indigo-600" : ""}>
                    {uploadedImages.length}/{MAX_IMAGES} images
                  </span>
                </div>
              </div>
              
              <div 
                className={`border-2 border-dashed ${uploadedImages.length >= MAX_IMAGES ? 'border-gray-200 bg-gray-50' : 'border-gray-300'} rounded-lg p-6 text-center`}
                onDragOver={handleDragOver}
                onDrop={uploadedImages.length >= MAX_IMAGES ? null : handleDrop}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className={`mx-auto h-12 w-12 ${uploadedImages.length >= MAX_IMAGES ? 'text-gray-300' : 'text-gray-400'}`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className={`relative ${uploadedImages.length >= MAX_IMAGES ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'cursor-pointer bg-white text-indigo-600 hover:text-indigo-500'} rounded-md font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500`}
                    >
                      <span>{uploadedImages.length >= MAX_IMAGES ? 'Maximum images reached' : 'Upload a file'}</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        ref={fileInputRef}
                        onChange={uploadedImages.length >= MAX_IMAGES ? null : handleFileUpload}
                        multiple
                        accept="image/*"
                        disabled={uploadedImages.length >= MAX_IMAGES}
                      />
                    </label>
                    {uploadedImages.length < MAX_IMAGES && <p className="pl-1">or drag and drop</p>}
                  </div>
                  {uploadedImages.length < MAX_IMAGES ? (
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  ) : (
                    <p className="text-xs text-gray-500">You&apos;ve reached the maximum of {MAX_IMAGES} images</p>
                  )}
                </div>
              </div>

              {/* Error message display */}
              {uploadError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md relative">
                  <button 
                    onClick={dismissError}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    aria-label="Dismiss error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <p className="text-sm text-red-600 pr-7">{uploadError}</p>
                </div>
              )}

              {/* Loading indicator */}
              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Processing images...</span>
                  </div>
                </div>
              )}

              {/* Image Preview Section */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative aspect-square group">
                        <div className="h-full w-full relative">
                          <Image
                            src={image.url}
                            alt={image.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                          {index + 1}/{uploadedImages.length}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Save and Next button at the bottom */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAndNext}
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
            ${isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Product...
            </>
          ) : (
            'Save and Next'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;