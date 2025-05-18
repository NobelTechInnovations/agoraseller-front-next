'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import axiosInstance from '../../../../../utils/axios';
import { getSession } from 'next-auth/react';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Select from 'react-select';




// Image Skeleton Component
const ImageSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg w-full aspect-square"></div>
  </div>
);

// Gallery Skeleton Component
const GallerySkeleton = () => (
  <div className="grid grid-cols-2 gap-2">
    {[1, 2, 3, 4].map((index) => (
      <div key={index} className="animate-pulse">
        <div className="bg-gray-200 rounded-lg w-full aspect-square"></div>
      </div>
    ))}
  </div>
);

// Category Hierarchy Skeleton
const CategoryHierarchySkeleton = () => (
  <div className="mb-6">
    <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-center">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          {item < 3 && <span className="mx-2">{'>'}</span>}
        </div>
      ))}
    </div>
  </div>
);

// Product Details Skeleton
const ProductDetailsSkeleton = () => (
  <div className="mb-8">
    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
    <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
  </div>
);

// Attributes Section Skeleton
const AttributesSkeleton = () => (
  <div className="grid grid-cols-2 gap-6">
    <div className="col-span-2 bg-gray-100 p-4">
      <div className="h-6 w-40 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-64 bg-gray-200 rounded"></div>
    </div>
    {[1, 2, 3, 4].map((item) => (
      <div key={item} className="col-span-1">
        <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Add new loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
  </div>
);

const ProductDetailsPage = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { productId, sellerid } = unwrappedParams;
  // Add product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({
    thumbnail: '',
    gallery: []
  });
  const [imageLoading, setImageLoading] = useState({
    thumbnail: true,
    gallery: true
  });

  // Form state
  const [attributeValues, setAttributeValues] = useState({});
  const [variantSelections, setVariantSelections] = useState({});
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [errors, setErrors] = useState({});
  const [mrpPrice, setMrpPrice] = useState('');
  const [wdrpPrice, setWdrpPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [brand, setBrand] = useState('');
  const [brandDocument, setBrandDocument] = useState(null);
  const [brandDocumentError, setBrandDocumentError] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [packer, setPacker] = useState('');
  const [categoryPath, setCategoryPath] = useState('');
  const [isGeneratingCombinations, setIsGeneratingCombinations] = useState(false);
  const [hasVariations, setHasVariations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  


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

  // Function to convert S3 URL to our API URL
  const getApiImageUrl = (s3Url) => {
    const key = getKeyFromUrl(s3Url);
    if (!key) return null;
    return `/api/images/${key}`;
  };

  const handleAttributeChange = (attributeName, value) => {
    setAttributeValues(prev => ({
      ...prev,
      [attributeName]: value
    }));
    if (errors[attributeName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[attributeName];
        return newErrors;
      });
    }
  };

  // Function to generate combinations
  const generateCombinations = (selections) => {
    const attributes = Object.keys(selections).filter(key => selections[key]?.length > 0);
    if (attributes.length === 0) return [];

    const combinations = [{}];
    for (const attribute of attributes) {
      const values = selections[attribute];
      const newCombinations = [];
      for (const combination of combinations) {
        for (const value of values) {
          newCombinations.push({
            ...combination,
            [attribute]: value
          });
        }
      }
      combinations.splice(0, combinations.length, ...newCombinations);
    }

    return combinations.map(combo => ({
      ...combo,
      price: '',
      quantity: '',
      image: null
    }));
  };

  // Function to format variant options for react-select
  const formatVariantOptions = (attribute) => {
    return attribute.options.map(option => ({
      value: option.value,
      label: option.name,
      color: attribute.name.toLowerCase() === 'color' ? option.value : null,
      name: option.name
    }));
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#111827',
      '&:hover': {
        borderColor: '#111827'
      }
    }),
    option: (base, { data }) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      ...(data.color && {
        '&::before': {
          content: '""',
          display: 'block',
          width: '1rem',
          height: '1rem',
          backgroundColor: data.color,
          borderRadius: '0.25rem',
          border: '1px solid #e5e7eb'
        }
      })
    }),
    multiValue: (base, { data }) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      backgroundColor: '#f3f4f6',
      ...(data.color && {
        '&::before': {
          content: '""',
          display: 'block',
          width: '0.75rem',
          height: '0.75rem',
          backgroundColor: data.color,
          borderRadius: '0.25rem',
          border: '1px solid #e5e7eb'
        }
      })
    })
  };

  // Update handleVariantChange
  const handleVariantChange = async (attributeName, selectedOptions) => {
    const newSelections = {
      ...variantSelections,
      [attributeName]: selectedOptions.map(option => option.value)
    };
    setVariantSelections(newSelections);
    
    if (errors[attributeName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[attributeName];
        return newErrors;
      });
    }
    
    // Show loading state
    setIsGeneratingCombinations(true);
    
    // Add artificial delay to show loading state (remove in production)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate new combinations
    const newCombinations = generateCombinations(newSelections);
    setVariantCombinations(newCombinations);
    
    // Hide loading state
    setIsGeneratingCombinations(false);
  };

  // Handle combination value change
  const handleCombinationChange = (index, field, value) => {
    const newCombinations = [...variantCombinations];
    newCombinations[index] = {
      ...newCombinations[index],
      [field]: value
    };
    setVariantCombinations(newCombinations);
  };

  // Add function to delete combination
  const handleDeleteCombination = (indexToDelete) => {
    setVariantCombinations(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  // Update predefinedBrands format for react-select
  const predefinedBrands = [
    { value: '', label: 'Select Brand', isDisabled: true },
    { value: 'generic', label: 'Generic Product' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'apple', label: 'Apple' },
    { value: 'nokia', label: 'Nokia' },
    { value: 'mi', label: 'Mi' },
  ];

  // Add S3 direct upload functionality
  const uploadToS3 = async (file, folder = 'products') => {
    try {
      // Generate a clean file name
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-'); // Replace special chars with hyphens
      const fileName = `${timestamp}-${originalName}`;
      const key = `${folder}/${fileName}`;

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

  // Update brand document upload handler to just store the file
  const handleBrandDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setBrandDocumentError('File size should be less than 5MB');
        setBrandDocument(null);
        return;
      }
      
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setBrandDocumentError('Only PDF, JPEG, and PNG files are allowed');
        setBrandDocument(null);
        return;
      }
      
      setBrandDocumentError('');
      setBrandDocument(file);
    }
  };
  const imageFilesRef = useRef({});
  const handleCombinationImageUpload = (index, event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const imageFiles = Array.from(files);
  
    // Store the files outside of React state
    imageFilesRef.current[index] = imageFiles;
  
    // Store only a flag in state, no File objects or URLs
    const newCombinations = [...variantCombinations];
    
    // Clean up any existing preview URL
    if (newCombinations[index].previewUrl) {
      URL.revokeObjectURL(newCombinations[index].previewUrl);
    }
  
    newCombinations[index] = {
      ...newCombinations[index],
      hasImage: true,
      imageSelected: true
    };
  
    setVariantCombinations(newCombinations);
  };
  
  
  // Update the variation image upload to handle the file objects
  const uploadVariationImages = async (combinations) => {
    const updatedCombinations = [...combinations];
    
    // Process each combination with image files
    for (let i = 0; i < updatedCombinations.length; i++) {
      const combo = updatedCombinations[i];
      
      // Skip if no image selected
      if (!combo.imageSelected || !imageFilesRef.current[i]) {
        updatedCombinations[i].image = null;
        continue;
      }
      
      try {
        // Upload each file to S3
        const uploadedUrls = [];
        const files = imageFilesRef.current[i];
        
        if (files && files.length > 0) {
          for (let j = 0; j < files.length; j++) {
            const file = files[j];
            console.log(`Uploading variation image ${j+1} for combination ${i+1}...`);
            const s3Result = await uploadToS3(file, 'variations');
            uploadedUrls.push(s3Result.url);
          }
          
          // Store the uploaded URLs
          updatedCombinations[i].image = uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
          console.log(`Uploaded ${uploadedUrls.length} images for combination ${i+1}`);
        }
      } catch (error) {
        console.error(`Error uploading images for combination ${i+1}:`, error);
        // Keep processing other combinations
      }
    }
    
    return updatedCombinations;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Always validate base MRP price
    if (!mrpPrice) newErrors.mrpPrice = "MRP price is required";
    else if (isNaN(mrpPrice) || Number(mrpPrice) <= 0) newErrors.mrpPrice = "MRP price must be a positive number";
    
    // Only validate selling price and stock if no variations
    if (!hasVariations) {
      if (!sellingPrice) newErrors.sellingPrice = "Selling price is required";
      else if (isNaN(sellingPrice) || Number(sellingPrice) <= 0) newErrors.sellingPrice = "Selling price must be a positive number";
      else if (Number(sellingPrice) > Number(mrpPrice)) newErrors.sellingPrice = "Selling price cannot be greater than MRP price";
      
      if (!stockQty) newErrors.stockQty = "Stock quantity is required";
      else if (isNaN(stockQty) || Number(stockQty) < 0 || !Number.isInteger(Number(stockQty))) {
        newErrors.stockQty = "Stock quantity must be a non-negative integer";
      }
    }
    
    if (productWeight && (isNaN(productWeight) || Number(productWeight) <= 0)) {
      newErrors.productWeight = "Product weight must be a positive number";
    }

    // Validate variations if enabled
    if (hasVariations) {
      // Validate required variant attributes
      product?.attributes
        ?.filter(attr => attr.type === 'variant' && attr.isRequired)
        .forEach(attr => {
          if (!variantSelections[attr.name] || variantSelections[attr.name].length === 0) {
            newErrors[attr.name] = `At least one ${attr.name} must be selected`;
          }
        });

      // Validate combinations if any exist
      if (variantCombinations.length > 0) {
        variantCombinations.forEach((combo, index) => {
          if (!combo.price || combo.price.trim() === '') {
            newErrors[`combination_${index}_price`] = 'Price is required for all variations';
          } else if (Number(combo.price) > Number(mrpPrice)) {
            newErrors[`combination_${index}_price`] = 'Variation price cannot be greater than base MRP';
          }
          if (!combo.quantity || combo.quantity.trim() === '') {
            newErrors[`combination_${index}_quantity`] = 'Quantity is required for all variations';
          }
        });
      }
    }
    
    // Add brand validation
    if (!brand) {
      newErrors.brand = "Brand selection is required";
    }
    
    if (brand && brand !== 'generic' && !brandDocument) {
      newErrors.brandDocument = "Brand authorization document is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveAndNext = async () => {
    if (!validateForm()) return;
    
    // Set loading state and clear previous errors
    setIsSubmitting(true);
    setApiError('');
    
    try {
      const session = await getSession();
      console.log("Session obtained, starting uploads");
      
      // Step 1: Handle all S3 uploads first
      
      // Upload brand document if provided
      let brandDocumentUrl = null;
      if (brand !== 'generic' && brandDocument) {
        try {
          console.log('Uploading brand document...');
          const s3Result = await uploadToS3(brandDocument, 'documents');
          brandDocumentUrl = s3Result.url;
          console.log('Brand document uploaded successfully:', brandDocumentUrl);
        } catch (error) {
          console.error('Error uploading brand document:', error);
          setApiError('Failed to upload brand document. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Deep clone combinations to avoid modifying state directly
      let processedCombinations = JSON.parse(JSON.stringify(variantCombinations));
      
      // Upload variation images if needed
      if (hasVariations && variantCombinations.length > 0) {
        console.log('Starting variation image uploads...');
        
        // Process each combination with image files
        for (let i = 0; i < processedCombinations.length; i++) {
          const combo = processedCombinations[i];
          
          // Skip if no image selected
          if (!combo.imageSelected || !imageFilesRef.current[i]) {
            processedCombinations[i].image = null;
            continue;
          }
          
          try {
            // Upload each file to S3
            const uploadedUrls = [];
            const files = imageFilesRef.current[i];
            
            if (files && files.length > 0) {
              for (let j = 0; j < files.length; j++) {
                const file = files[j];
                console.log(`Uploading variation image ${j+1} for combination ${i+1}...`);
                const s3Result = await uploadToS3(file, 'variations');
                uploadedUrls.push(s3Result.url);
              }
              
              // Store the uploaded URLs
              processedCombinations[i].image = uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
              console.log(`Uploaded ${uploadedUrls.length} images for combination ${i+1}`);
            }
          } catch (error) {
            console.error(`Error uploading images for combination ${i+1}:`, error);
            setApiError(`Failed to upload image for variation ${i+1}. Please try again.`);
            setIsSubmitting(false);
            return;
          }
        }
        
        console.log('All variation images uploaded successfully');
      }
      
      // Step 2: Create payload using the expected structure
      const finalPayload = {
        productId: product?.product_id,
        categoryId: product?.category?._id,
        
        // Attributes as array of objects with detailed info
        attributes: Object.entries(attributeValues).map(([attrName, attrValue]) => {
          // Find the attribute by name
          const attribute = product.attributes.find(attr => attr.name === attrName);
          // Find option ID if it's a selection
          let optionId = null;
          if (attribute && attribute.options && attribute.options.length > 0) {
            const option = attribute.options.find(opt => opt.value === attrValue);
            if (option) optionId = option._id;
          }
          
          return {
            attributeId: attribute?._id,
            name: attrName,
            value: attrValue,
            optionId: optionId
          };
        }),
        
        // Pricing in a nested object
        pricing: {
          mrp: parseFloat(mrpPrice) || 0,
          selling_price: parseFloat(sellingPrice) || 0,
          wdrp: parseFloat(wdrpPrice) || 0
        },
        
        // Stock quantity if no variations
        stock: !hasVariations ? parseInt(stockQty, 10) || 0 : null,
        
        // Product details
        weight: parseFloat(productWeight) || null,
        
        // Brand info in a nested object
        brand: {
          name: brand === 'generic' ? 'Generic Product' : brand,
          manufacturer: manufacturer || null,
          packer: packer || null,
          documentUrl: brandDocumentUrl
        },
        
        // Variations flag
        hasVariations: hasVariations && processedCombinations.length > 0
      };
      
      // Add variations if enabled
      if (finalPayload.hasVariations) {
        finalPayload.variations = {
          // Include attribute IDs and option IDs for variations
          attributes: Object.keys(variantSelections).map(attrName => {
            const attribute = product.attributes.find(attr => attr.name === attrName);
            return {
              attributeId: attribute?._id,
              name: attrName,
              values: variantSelections[attrName].map(value => {
                const option = attribute?.options.find(opt => opt.value === value);
                return {
                  optionId: option?._id,
                  value: value
                };
              })
            };
          }),
          combinations: processedCombinations.map(combo => {
            // Extract variation attributes with their IDs
            const variantData = {};
            Object.entries(combo)
              .filter(([key]) => key !== 'price' && key !== 'quantity' && key !== 'image' &&
                      key !== 'hasImage' && key !== 'imageSelected' && 
                      key !== 'previewUrl' && key !== 'imageCount')
              .forEach(([attrName, value]) => {
                const attribute = product.attributes.find(attr => attr.name === attrName);
                const option = attribute?.options.find(opt => opt.value === value);
                
                variantData[attrName] = {
                  attributeId: attribute?._id,
                  optionId: option?._id,
                  value: value
                };
              });
            
            // Handle multiple images vs single image
            let imageUrl = combo.image;
            let additionalImages = [];
            
            // If image is an array, use the first one as primary image
            if (Array.isArray(combo.image) && combo.image.length > 0) {
              imageUrl = combo.image[0];
              additionalImages = combo.image.slice(1);
            }
            
            return {
              variant: variantData,
              price: parseFloat(combo.price) || 0,
              stock: parseInt(combo.quantity, 10) || 0,
              imageUrl: imageUrl,
              // Include additional images if any
              additionalImages: additionalImages
            };
          })
        };
      }
      
      // Step 3: Make the API call
      // Make sure we're using the correct product ID format
      const apiProductId = product?.product_id || productId; 
      
      // Ensure product_id is set in the payload
      finalPayload.product_id = apiProductId;
      
      if (!apiProductId) {
        console.error("Missing product ID for API call");
        setApiError("Product ID is missing. Please refresh the page and try again.");
        setIsSubmitting(false);
        return;
      }

      console.log(`Making API request to save product details...`);
      console.log(`Endpoint: /v1/seller/product/${apiProductId}/details`);
      console.log("Payload:", JSON.stringify(finalPayload, null, 2));
      
      try {
        const response = await axiosInstance.post(
          `/v1/seller/product/${apiProductId}/details`,
          finalPayload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          console.log("Product details saved successfully!");
          
          // Show success message
          setApiError('');
          const nextUrl = `/store-manage/inventory/listing`;
          console.log(`Redirecting to: ${nextUrl}`);
          
          // Give a short delay to show success feedback
          setTimeout(() => {
            router.push(nextUrl);
          }, 500);
        } else {
          // Handle API error
          setApiError(response.data.message || 'Failed to save product details. Please try again.');
          console.error('Error saving product details:', response.data.message);
        }
      } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
          console.error('Error Response:', error.response.data);
          setApiError(error.response.data.message || 'Server error. Please try again.');
        } else if (error.request) {
          console.error('Error Request:', error.request);
          setApiError('No response from server. Please check your connection.');
        } else {
          console.error('Error Message:', error.message);
          setApiError(error.message || 'An unexpected error occurred.');
        }
      }
    } catch (error) {
      console.error('Overall Error:', error);
      setApiError('An unexpected error occurred. Please try again later.');
    } finally {
      // Reset loading state
      setIsSubmitting(false);
    }
  };

  // Add useEffect to fetch product details and generate pre-signed URLs
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const session = await getSession();
        const response = await axiosInstance.get(`/v1/seller/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

        if (response.data.success) {
          const productData = response.data.data.product;
          setProduct(productData);
          setCategoryPath(productData.category);

          // Convert S3 URLs to our API URLs
          if (productData.thumbnail_image) {
            const thumbnailUrl = getApiImageUrl(productData.thumbnail_image);
            if (thumbnailUrl) {
              setImageUrls(prev => ({ ...prev, thumbnail: thumbnailUrl }));
            }
          }

          if (productData.gallery_images && productData.gallery_images.length > 0) {
            const galleryUrls = productData.gallery_images
              .map(getApiImageUrl)
              .filter(url => url);
            setImageUrls(prev => ({ ...prev, gallery: galleryUrls }));
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Category Path Display */}
      {loading ? (
        <CategoryHierarchySkeleton />
      ) : (
        <div className="mb-6">
          <span className="font-bold text-md">Category</span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              {product?.category_hierarchy?.map((cat, index) => (
                <div key={cat._id} className="flex items-center">
                  <span className="font-bold text-md underline">{cat.name}</span>
                  {index < product.category_hierarchy.length - 1 && (
                    <span className="mx-2">{'>'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {/* Main Form Container */}
        <div className="flex-1 w-3/4">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            {/* Welcome Section */}
            {loading ? (
              <ProductDetailsSkeleton />
            ) : (
              <div className="mb-8">
                <h4 className="text-md font-bold text-gray-600">Product Details</h4>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  {product?.title}
                </h3>
              </div>
            )}

            <div className="bg-gray-200 p-4 mb-4">
              <p className="text-sm text-gray-600">
                <b>Note:</b> Please provide complete details about your product specifications, pricing, and inventory information.
              </p>
            </div>

            {apiError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                <p className="flex items-center">
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {apiError}
                </p>
              </div>
            )}

            <div className="flex gap-6">
              {/* Product Form - Full width */}
              <div className="w-full">
                <form>
                  {loading ? (
                    <AttributesSkeleton />
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      {/* Product Attributes Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <h4 className="font-medium text-gray-800">Product Attributes</h4>
                        <p className="text-sm text-gray-600">
                          Provide information about the product&apos;s attributes.
                        </p>
                      </div>
                      
                      {/* Meta Attributes */}
                      {product?.attributes?.filter(attr => attr.type === 'meta').map((attribute) => (
                        <div key={attribute._id} className="col-span-1">
                          <label htmlFor={attribute.name} className="block font-bold text-sm text-gray-700 mb-1">
                            {attribute.name} {attribute.isRequired && '*'}
                          </label>
                          {attribute.options && attribute.options.length > 0 ? (
                            <>
                              <Select
                                id={attribute.name}
                                options={attribute.options.map(option => ({
                                  value: option.value,
                                  label: option.name
                                }))}
                                value={attributeValues[attribute.name] ? {
                                  value: attributeValues[attribute.name],
                                  label: attribute.options.find(opt => opt.value === attributeValues[attribute.name])?.name
                                } : null}
                                onChange={(selectedOption) => handleAttributeChange(attribute.name, selectedOption?.value || '')}
                                className="basic-select"
                                classNamePrefix="select"
                                isSearchable={true}
                                placeholder={`Search ${attribute.name}...`}
                                isClearable={!attribute.isRequired}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    borderColor: errors[attribute.name] ? '#EF4444' : '#111827',
                                    '&:hover': {
                                      borderColor: errors[attribute.name] ? '#EF4444' : '#111827'
                                    }
                                  }),
                                  placeholder: (base) => ({
                                    ...base,
                                    color: '#6B7280',
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 50
                                  })
                                }}
                              />
                              {errors[attribute.name] && (
                                <p className="mt-1 text-sm text-red-600">{errors[attribute.name]}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <input
                                type="text"
                                id={attribute.name}
                                value={attributeValues[attribute.name] || ''}
                                onChange={(e) => handleAttributeChange(attribute.name, e.target.value)}
                                className={`mt-1 block w-full border ${errors[attribute.name] ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                                placeholder={`Enter ${attribute.name}`}
                                required={attribute.isRequired}
                              />
                              {errors[attribute.name] && (
                                <p className="mt-1 text-sm text-red-600">{errors[attribute.name]}</p>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                      
                      {/* Brand and Manufacturer Section */}
                      <div className="col-span-2 bg-gray-100 p-4 mt-6">
                        <h4 className="font-medium text-gray-800">Manufacturer & Brand Information</h4>
                        <p className="text-sm text-gray-600">
                          Provide details about the brand and manufacture of your product.
                        </p>
                      </div>

                      {/* Brand */}
                      <div className="col-span-2">
                        <label htmlFor="brand" className="block font-bold text-sm text-gray-700 mb-1">
                          Brand*
                        </label>
                        <Select
                          id="brand"
                          options={predefinedBrands}
                          value={predefinedBrands.find(option => option.value === brand)}
                          onChange={(selectedOption) => {
                            setBrand(selectedOption.value);
                            if (selectedOption.value === 'generic') {
                              setBrandDocument(null);
                              setBrandDocumentError('');
                            }
                          }}
                          className="basic-select"
                          classNamePrefix="select"
                          isSearchable={true}
                          placeholder="Search and select brand..."
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: errors.brand ? '#EF4444' : '#111827',
                              '&:hover': {
                                borderColor: errors.brand ? '#EF4444' : '#111827'
                              }
                            })
                          }}
                        />
                        {errors.brand && (
                          <p className="mt-1 text-sm text-red-600">{errors.brand}</p>
                        )}

                        {/* Brand Document Upload */}
                        {brand && brand !== 'generic' && (
                          <div className="mt-4">
                            <label className="block font-bold text-sm text-gray-700 mb-1">
                              Brand Authorization Document*
                            </label>
                            <div className="mt-1 flex flex-col gap-2">
                              {brandDocument ? (
                                <div className="bg-green-50 p-3 rounded border border-green-100 flex justify-between items-center">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium text-green-800">
                                      {brandDocument.name}
                                    </span>
                                  </div>
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setBrandDocument(null);
                                      setBrandDocumentError('');
                                    }}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="file"
                                  onChange={handleBrandDocumentUpload}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              )}
                              
                              {brandDocumentError && (
                                <p className="mt-1 text-sm text-red-600">
                                  {brandDocumentError}
                                </p>
                              )}
                              <p className="text-sm text-gray-500">
                                Please upload brand purchase or sale letter authority document (PDF, JPEG, or PNG, max 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Manufacturer */}
                      <div className="col-span-2">
                        <label htmlFor="manufacturer" className="block font-bold text-sm text-gray-700 mb-1">
                          Manufacturer
                        </label>
                        <input
                          type="text"
                          id="manufacturer"
                          value={manufacturer}
                          onChange={(e) => setManufacturer(e.target.value)}
                          className="mt-1 block w-full border border-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          placeholder="Enter manufacturer name"
                        />
                      </div>

                      {/* Variations Toggle Section */}
                      <div className="col-span-2 bg-gray-100 p-4 mt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800">Product Variations</h4>
                            <p className="text-sm text-gray-600">
                              Does this product have different variations (e.g., different colors, sizes)?
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={hasVariations}
                                onChange={(e) => {
                                  setHasVariations(e.target.checked);
                                  if (!e.target.checked) {
                                    // Clear variations when disabled
                                    setVariantSelections({});
                                    setVariantCombinations([]);
                                  }
                                }}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Yes, this product has variations</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {!hasVariations ? (
                        <>
                          {/* Base Pricing Section - Only show if no variations */}
                          <div className="col-span-2 bg-gray-100 p-4">
                            <h4 className="font-medium text-gray-800">Base Pricing & Inventory</h4>
                            <p className="text-sm text-gray-600">
                              Set your product&apos;s base pricing and stock information.
                            </p>
                          </div>
                          
                          {/* MRP Price */}
                          <div className="col-span-1">
                            <label htmlFor="mrpPrice" className="block font-bold text-sm text-gray-700 mb-1">
                              MRP Price (₹)*
                            </label>
                            <div className="relative shadow-sm">
                              <input
                                type="number"
                                id="mrpPrice"
                                value={mrpPrice}
                                onChange={(e) => setMrpPrice(e.target.value)}
                                className={`mt-1 block w-full pl-1 border ${errors.mrpPrice ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            {errors.mrpPrice && <p className="mt-1 text-sm text-red-600">{errors.mrpPrice}</p>}
                          </div>
                          
                          {/* Selling Price */}
                          <div className="col-span-1">
                            <label htmlFor="sellingPrice" className="block font-bold text-sm text-gray-700 mb-1">
                              Selling Price (₹)*
                            </label>
                            <div className="relative shadow-sm">
                              <input
                                type="number"
                                id="sellingPrice"
                                value={sellingPrice}
                                onChange={(e) => setSellingPrice(e.target.value)}
                                className={`mt-1 block w-full pl-1 border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            {errors.sellingPrice && <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>}
                          </div>

                          {/* Stock Quantity */}
                          <div className="col-span-1">
                            <label htmlFor="stockQty" className="block font-bold text-sm text-gray-700 mb-1">
                              Stock Quantity*
                            </label>
                            <input
                              type="number"
                              id="stockQty"
                              value={stockQty}
                              onChange={(e) => setStockQty(e.target.value)}
                              className={`mt-1 block w-full border ${errors.stockQty ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                              placeholder="0"
                              min="0"
                              step="1"
                            />
                            {errors.stockQty && <p className="mt-1 text-sm text-red-600">{errors.stockQty}</p>}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Base MRP Price - Always show */}
                          <div className="col-span-1">
                            <label htmlFor="mrpPrice" className="block font-bold text-sm text-gray-700 mb-1">
                              Base MRP Price (₹)* - Maximum price for all variations
                            </label>
                            
                              <input
                                type="number"
                                id="mrpPrice"
                                value={mrpPrice}
                                onChange={(e) => setMrpPrice(e.target.value)}
                                className={`mt-1 block w-full pl-1 border ${errors.mrpPrice ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            
                            {errors.mrpPrice && <p className="mt-1 text-sm text-red-600">{errors.mrpPrice}</p>}
                          </div>

                          {/* Product Weight - Always show at the end */}
                          <div className="col-span-1">
                            <label htmlFor="productWeight" className="block font-bold text-sm text-gray-700 mb-1">
                              Product Weight (grams)
                            </label>
                            <input
                              type="number"
                              id="productWeight"
                              value={productWeight}
                              onChange={(e) => setProductWeight(e.target.value)}
                              className={`mt-1 block w-full border ${errors.productWeight ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                              placeholder="0"
                              min="0"
                              step="0.01"
                            />
                            {errors.productWeight && <p className="mt-1 text-sm text-red-600">{errors.productWeight}</p>}
                          </div>

                          {/* Variant Attributes */}
                          {product?.attributes?.filter(attr => attr.type === 'variant').map((attribute) => (
                            <div key={attribute._id} className="col-span-1">
                              <label htmlFor={attribute.name} className="block font-bold text-sm text-gray-700 mb-1">
                                {attribute.name} {attribute.isRequired && '*'}
                              </label>
                              <Select
                                id={attribute.name}
                                isMulti
                                options={formatVariantOptions(attribute)}
                                value={formatVariantOptions(attribute).filter(option => 
                                  variantSelections[attribute.name]?.includes(option.value)
                                )}
                                onChange={(selected) => handleVariantChange(attribute.name, selected || [])}
                                styles={customStyles}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                placeholder={`Select ${attribute.name}`}
                              />
                              {errors[attribute.name] && (
                                <p className="mt-1 text-sm text-red-600">{errors[attribute.name]}</p>
                              )}
                            </div>
                          ))}

                          {/* Combinations Table */}
                          {(variantCombinations.length > 0 || isGeneratingCombinations) && (
                            <div className="col-span-2 mt-6">
                              <h4 className="font-medium text-gray-800 mb-4">Product Variations</h4>
                              {isGeneratingCombinations ? (
                                <div className="py-8">
                                  <LoadingSpinner />
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {Object.keys(variantCombinations[0])
                                          .filter(key => key !== 'price' && key !== 'quantity' && key !== 'image' &&
                                                  key !== 'hasImage' && key !== 'imageSelected' && 
                                                  key !== 'previewUrl' && key !== 'imageCount')
                                          .map(attr => (
                                            <th key={attr} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                              {attr}
                                            </th>
                                          ))}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Quantity
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Image
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Actions
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {variantCombinations.map((combination, index) => (
                                        <tr key={index}>
                                          {Object.entries(combination)
                                            .filter(([key]) => key !== 'price' && key !== 'quantity' && key !== 'image' &&
                                                    key !== 'hasImage' && key !== 'imageSelected' && 
                                                    key !== 'previewUrl' && key !== 'imageCount')
                                            .map(([attr, value]) => (
                                              <td key={attr} className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                  {attr.toLowerCase() === 'color' && (
                                                    <div 
                                                      className="w-4 h-4 rounded border border-gray-200" 
                                                      style={{ backgroundColor: value }}
                                                    />
                                                  )}
                                                  <span className="text-sm text-gray-500">
                                                    {product.attributes
                                                      .find(a => a.name.toLowerCase() === attr.toLowerCase())
                                                      ?.options.find(o => o.value === value)?.name || value}
                                                  </span>
                                                </div>
                                              </td>
                                            ))}
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                              <input
                                                type="number"
                                                value={combination.price}
                                                onChange={(e) => handleCombinationChange(index, 'price', e.target.value)}
                                                className={`block w-full border ${errors[`combination_${index}_price`] ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 text-sm p-2`}
                                                placeholder="Enter price"
                                              />
                                              {errors[`combination_${index}_price`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`combination_${index}_price`]}</p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                              <input
                                                type="number"
                                                value={combination.quantity}
                                                onChange={(e) => handleCombinationChange(index, 'quantity', e.target.value)}
                                                className={`block w-full border ${errors[`combination_${index}_quantity`] ? 'border-red-500' : 'border-gray-900'} focus:border-blue-500 focus:ring-blue-500 text-sm p-2`}
                                                placeholder="Enter quantity"
                                              />
                                              {errors[`combination_${index}_quantity`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`combination_${index}_quantity`]}</p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-2">
                                              <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => handleCombinationImageUpload(index, e)}
                                                className="hidden"
                                                id={`image-upload-${index}`}
                                              />
                                              <label
                                                htmlFor={`image-upload-${index}`}
                                                className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs inline-flex items-center"
                                              >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Select Images
                                              </label>
                                              
                                              {/* Simple image selection indicator */}
                                              <div className="mt-1">
                                                {combination.imageSelected ? (
                                                  <div className="flex items-center gap-2">
                                                    <div className="text-xs text-green-600 font-medium">
                                                      <span className="bg-green-50 px-2 py-1 rounded flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Images selected
                                                      </span>
                                                    </div>
                                                    <button 
                                                      type="button"
                                                      onClick={() => {
                                                        const newCombinations = [...variantCombinations];
                                                        
                                                        // Clean up refs
                                                        delete imageFilesRef.current[index];
                                                        
                                                        newCombinations[index] = {
                                                          ...newCombinations[index],
                                                          imageSelected: false,
                                                          hasImage: false
                                                        };
                                                        setVariantCombinations(newCombinations);
                                                      }}
                                                      className="text-red-500 hover:text-red-700 text-xs"
                                                    >
                                                      Clear
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <div className="text-xs text-gray-400">No images selected</div>
                                                )}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                              onClick={() => handleDeleteCombination(index)}
                                              className="text-red-600 hover:text-red-900"
                                            >
                                              Delete
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Link 
                      href={`/store-manage/inventory/${sellerid}/add`}
                      className="inline-flex items-center px-4 py-2 border text-sm font-medium border-gray-900 text-gray-700 border-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back
                    </Link>
                    <button
                      type="button"
                      onClick={handleSaveAndNext}
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border text-sm font-medium border-gray-900 text-blue-700 border-blue-700 ${isSubmitting ? 'bg-blue-50 cursor-not-allowed' : 'hover:bg-blue-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Images Card */}
        <div className="flex flex-col gap-6 w-1/4">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Product Images</h4>
            <div className="flex flex-col gap-4">
              {/* Main product image */}
              {!imageUrls.thumbnail ? (
                <ImageSkeleton />
              ) : (
                <div className="relative w-full aspect-square">
                  <Image
                    src={imageUrls.thumbnail}
                    alt="Product thumbnail"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg"
                    unoptimized
                    onLoad={() => setImageLoading(prev => ({ ...prev, thumbnail: false }))}
                    onError={() => {
                      console.error('Error loading thumbnail image');
                      setImageLoading(prev => ({ ...prev, thumbnail: false }));
                    }}
                  />
                </div>
              )}
              
              {/* Gallery images */}
              {!imageUrls.gallery.length ? (
                <GallerySkeleton />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.gallery.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                        className="object-cover rounded-lg"
                        unoptimized
                        onLoad={() => {
                          if (index === imageUrls.gallery.length - 1) {
                            setImageLoading(prev => ({ ...prev, gallery: false }));
                          }
                        }}
                        onError={() => {
                          console.error(`Error loading gallery image ${index + 1}`);
                          if (index === imageUrls.gallery.length - 1) {
                            setImageLoading(prev => ({ ...prev, gallery: false }));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
