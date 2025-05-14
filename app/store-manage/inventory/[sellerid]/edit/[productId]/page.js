'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import axiosInstance from '../../../../../utils/axios';
import { getSession } from 'next-auth/react';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
  const [color, setColor] = useState('');
  const [fabric, setFabric] = useState('');
  const [pattern, setPattern] = useState('');
  const [mrpPrice, setMrpPrice] = useState('');
  const [wdrpPrice, setWdrpPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQty, setStockQty] = useState('');
  const [productWeight, setProductWeight] = useState('');
  const [brand, setBrand] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [packer, setPacker] = useState('');
  const [categoryPath, setCategoryPath] = useState('');
  
  // Variations state
  const [sizeVariations, setSizeVariations] = useState([]);
  const [colorVariations, setColorVariations] = useState([]);
  const [showVariationForm, setShowVariationForm] = useState(false);
  const [variationSize, setVariationSize] = useState('');
  const [variationColor, setVariationColor] = useState('');
  const [variationPrice, setVariationPrice] = useState('');
  const [variationStock, setVariationStock] = useState('');
  
  const [errors, setErrors] = useState({});
  
  // Add new state variables at the top with other states
  const [hasVariations, setHasVariations] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variationImages, setVariationImages] = useState({});
  
  // Available variation attributes
  const availableAttributes = [
    { id: 'color', label: 'Color' },
    { id: 'size', label: 'Size' },
    { id: 'pattern', label: 'Pattern' },
    { id: 'material', label: 'Material' },
    { id: 'style', label: 'Style' },
    { id: 'fit', label: 'Fit' },
    { id: 'length', label: 'Length' },
    { id: 'sleeve', label: 'Sleeve' }
  ];

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

  const handleAttributeChange = (attributeId) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attributeId)) {
        return prev.filter(id => id !== attributeId);
      }
      if (prev.length >= 3) {
        // Show error or notification that max 3 attributes can be selected
        return prev;
      }
      return [...prev, attributeId];
    });
  };

  const handleAddVariation = () => {
    // Create a new variation object with selected attributes
    const newVariation = {
      id: Date.now(),
      ...selectedAttributes.reduce((acc, attr) => ({
        ...acc,
        [attr]: ''
      }), {}),
      price: '',
      stock: '',
      image: null
    };
    
    setVariations([...variations, newVariation]);
  };

  const handleDeleteVariation = (variationId) => {
    setVariations(variations.filter(v => v.id !== variationId));
    // Also remove the image if exists
    const newVariationImages = { ...variationImages };
    delete newVariationImages[variationId];
    setVariationImages(newVariationImages);
  };

  const handleImageUpload = (variationId, file) => {
    // Here you would typically handle the actual file upload
    // For now, we'll just create a preview URL
    const imageUrl = URL.createObjectURL(file);
    setVariationImages(prev => ({
      ...prev,
      [variationId]: imageUrl
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!mrpPrice) newErrors.mrpPrice = "MRP price is required";
    else if (isNaN(mrpPrice) || Number(mrpPrice) <= 0) newErrors.mrpPrice = "MRP price must be a positive number";
    
    if (!wdrpPrice) newErrors.wdrpPrice = "WDRP price is required";
    else if (isNaN(wdrpPrice) || Number(wdrpPrice) <= 0) newErrors.wdrpPrice = "WDRP price must be a positive number";
    else if (Number(wdrpPrice) > Number(mrpPrice)) newErrors.wdrpPrice = "WDRP price cannot be greater than MRP price";
    
    if (!sellingPrice) newErrors.sellingPrice = "Selling price is required";
    else if (isNaN(sellingPrice) || Number(sellingPrice) <= 0) newErrors.sellingPrice = "Selling price must be a positive number";
    else if (Number(sellingPrice) > Number(mrpPrice)) newErrors.sellingPrice = "Selling price cannot be greater than MRP price";
    
    if (!stockQty) newErrors.stockQty = "Stock quantity is required";
    else if (isNaN(stockQty) || Number(stockQty) < 0 || !Number.isInteger(Number(stockQty))) {
      newErrors.stockQty = "Stock quantity must be a non-negative integer";
    }
    
    if (productWeight && (isNaN(productWeight) || Number(productWeight) <= 0)) {
      newErrors.productWeight = "Product weight must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSaveAndNext = () => {
    if (!validateForm()) return;
    
    // Here you would typically save the form data
    // For this example, we'll just redirect to the next step
    
    // Placeholder for API call to save data
    console.log("Submitting product details:", {
      productId,
      color,
      fabric,
      pattern,
      mrpPrice,
      wdrpPrice,
      sellingPrice,
      stockQty,
      productWeight,
      brand,
      manufacturer,
      packer,
      variations: {
        sizes: sizeVariations,
        colors: colorVariations
      },
      categoryPath
    });
    
    // Navigate to the next step
    router.push(`/store-manage/inventory/${sellerid}/add/${productId}/shipping`);
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
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Category:</span>
          <div className="flex items-center">
            {product?.category}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Main Form Container */}
        <div className="flex-1 w-3/4">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            {/* Welcome Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Product Details - {product?.title}
              </h3>

              <div className="bg-gray-200 p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <b>Note:</b> Please provide complete details about your product specifications, pricing, and inventory information.
                </p>
              </div>

              <div className="flex gap-6">
                {/* Product Form - Full width */}
                <div className="w-full">
                  <form>
                    <div className="grid grid-cols-2 gap-6">
                      {/* Material Details Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <h4 className="font-medium text-gray-800">Material Details</h4>
                        <p className="text-sm text-gray-600">
                          Provide information about the product&apos;s material characteristics.
                        </p>
                      </div>
                      
                      {/* Color */}
                      <div className="col-span-1">
                        <label htmlFor="color" className="block font-bold text-sm text-gray-700 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          id="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="mt-1 block w-full border border-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          placeholder="e.g. Red, Blue, Black"
                        />
                      </div>
                      
                      {/* Fabric */}
                      <div className="col-span-1">
                        <label htmlFor="fabric" className="block font-bold text-sm text-gray-700 mb-1">
                          Fabric
                        </label>
                        <input
                          type="text"
                          id="fabric"
                          value={fabric}
                          onChange={(e) => setFabric(e.target.value)}
                          className="mt-1 block w-full border border-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          placeholder="e.g. Cotton, Polyester, Silk"
                        />
                      </div>
                      
                      {/* Pattern */}
                      <div className="col-span-2">
                        <label htmlFor="pattern" className="block font-bold text-sm text-gray-700 mb-1">
                          Pattern
                        </label>
                        <input
                          type="text"
                          id="pattern"
                          value={pattern}
                          onChange={(e) => setPattern(e.target.value)}
                          className="mt-1 block w-full border border-gray-900  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          placeholder="e.g. Solid, Striped, Floral"
                        />
                      </div>
                      
                      {/* Pricing Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <h4 className="font-medium text-gray-800">Pricing & Inventory</h4>
                        <p className="text-sm text-gray-600">
                          Set your product&apos;s pricing and stock information.
                        </p>
                      </div>
                      
                      {/* MRP Price */}
                      <div className="col-span-1">
                        <label htmlFor="mrpPrice" className="block font-bold text-sm text-gray-700 mb-1">
                          MRP Price (₹)*
                        </label>
                        <div className="relative  shadow-sm">
                          <input
                            type="number"
                            id="mrpPrice"
                            value={mrpPrice}
                            onChange={(e) => setMrpPrice(e.target.value)}
                            className={`mt-1 block w-full pl-1 border ${errors.mrpPrice ? 'border-red-500' : 'border-gray-900'}  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
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
                        <div className="relative  shadow-sm">

                          <input
                            type="number"
                            id="sellingPrice"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(e.target.value)}
                            className={`mt-1 block w-full pl-1 border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-900'}  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
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
                          className={`mt-1 block w-full border ${errors.stockQty ? 'border-red-500' : 'border-gray-900'}  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                          placeholder="0"
                          min="0"
                          step="1"
                        />
                        {errors.stockQty && <p className="mt-1 text-sm text-red-600">{errors.stockQty}</p>}
                      </div>
                      
                      {/* Product Weight */}
                      <div className="col-span-1">
                        <label htmlFor="productWeight" className="block font-bold text-sm text-gray-700 mb-1">
                          Product Weight (grams)
                        </label>
                        <input
                          type="number"
                          id="productWeight"
                          value={productWeight}
                          onChange={(e) => setProductWeight(e.target.value)}
                          className={`mt-1 block w-full border ${errors.productWeight ? 'border-red-500' : 'border-gray-900'}  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                        {errors.productWeight && <p className="mt-1 text-sm text-red-600">{errors.productWeight}</p>}
                      </div>
                      
                      {/* Variations Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800">Product Variations</h4>
                            <p className="text-sm text-gray-600">
                              Does this product have variations?
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={hasVariations}
                                onChange={(e) => setHasVariations(e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Yes, this product has variations</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {hasVariations && (
                        <>
                          {/* Variation Attributes Selection */}
                          <div className="col-span-2 p-4 border border-gray-200 ">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Select Variation Attributes (Max 3)</h5>
                            <div className="grid grid-cols-4 gap-4">
                              {availableAttributes.map(attr => (
                                <label key={attr.id} className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedAttributes.includes(attr.id)}
                                    onChange={() => handleAttributeChange(attr.id)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                    disabled={!selectedAttributes.includes(attr.id) && selectedAttributes.length >= 3}
                                  />
                                  <span className={`ml-2 text-sm ${!selectedAttributes.includes(attr.id) && selectedAttributes.length >= 3 ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {attr.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                            {selectedAttributes.length >= 3 && (
                              <p className="mt-2 text-sm text-gray-500">
                                Maximum 3 attributes can be selected
                              </p>
                            )}
                          </div>

                          {/* Variations Table */}
                          {selectedAttributes.length > 0 && (
                            <div className="col-span-2">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {selectedAttributes.map(attr => (
                                        <th key={attr} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          {attr}
                                        </th>
                                      ))}
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
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
                                    {variations.map((variation) => (
                                      <tr key={variation.id}>
                                        {selectedAttributes.map(attr => (
                                          <td key={attr} className="px-6 py-4 whitespace-nowrap">
                                            <input
                                              type="text"
                                              value={variation[attr] || ''}
                                              onChange={(e) => {
                                                const updatedVariations = variations.map(v => 
                                                  v.id === variation.id 
                                                    ? { ...v, [attr]: e.target.value }
                                                    : v
                                                );
                                                setVariations(updatedVariations);
                                              }}
                                              className="block w-full border border-gray-900  focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                                              placeholder={`Enter ${attr}`}
                                            />
                                          </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <input
                                            type="number"
                                            value={variation.price || ''}
                                            onChange={(e) => {
                                              const updatedVariations = variations.map(v => 
                                                v.id === variation.id 
                                                  ? { ...v, price: e.target.value }
                                                  : v
                                              );
                                              setVariations(updatedVariations);
                                            }}
                                            className="block w-full border border-gray-900  focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                          />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <input
                                            type="number"
                                            value={variation.stock || ''}
                                            onChange={(e) => {
                                              const updatedVariations = variations.map(v => 
                                                v.id === variation.id 
                                                  ? { ...v, stock: e.target.value }
                                                  : v
                                              );
                                              setVariations(updatedVariations);
                                            }}
                                            className="block w-full border border-gray-900  focus:border-blue-500 focus:ring-blue-500 text-sm p-2"
                                            placeholder="0"
                                            min="0"
                                            step="1"
                                          />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(variation.id, e.target.files[0])}
                                            className="hidden"
                                            id={`image-upload-${variation.id}`}
                                          />
                                          <label
                                            htmlFor={`image-upload-${variation.id}`}
                                            className="cursor-pointer"
                                          >
                                            {variationImages[variation.id] ? (
                                              <img
                                                src={variationImages[variation.id]}
                                                alt="Variation"
                                                className="w-12 h-12 object-cover rounded"
                                              />
                                            ) : (
                                              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                                                Upload
                                              </div>
                                            )}
                                          </label>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          <button
                                            onClick={() => handleDeleteVariation(variation.id)}
                                            className="text-red-600 hover:text-red-900"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                
                                {/* Add New Variation Button */}
                                <div className="mt-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={handleAddVariation}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Add New Variation
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Brand and Manufacturer Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <h4 className="font-medium text-gray-800">Manufacturer & Brand Information</h4>
                        <p className="text-sm text-gray-600">
                          Provide details about the brand and manufacture of your product.
                        </p>
                      </div>
                      
                      {/* Brand */}
                      <div className="col-span-2">
                        <label htmlFor="brand" className="block font-bold text-sm text-gray-700 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          id="brand"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="mt-1 block w-full border border-gray-900  focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                          placeholder="e.g. Nike, Apple, Samsung"
                        />
                      </div>
                      
                      {/* Manufacturer */}
                      <div className="col-span-1">
                        <label htmlFor="manufacturer" className="block font-bold text-sm text-gray-700 mb-1">
                          Manufacturer or Packer Name
                        </label>
                        <input
                          type="text"
                          id="manufacturer"
                          value={manufacturer}
                          onChange={(e) => setManufacturer(e.target.value)}
                          className="mt-1 block w-full border border-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Link 
                        href={`/store-manage/inventory/listing`}
                        className="inline-flex items-center px-4 py-2 border text-sm font-medium border-gray-900 text-gray-700 border-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </Link>
                      <button
                        type="button"
                        onClick={handleSaveAndNext}
                        className="inline-flex items-center px-4 py-2 border text-sm font-medium border-gray-900 text-blue-700 border-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save and Next
                      </button>
                    </div>
                  </form>
                </div>
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
              
              {/* Variation thumbnails */}
              {Object.entries(variationImages).map(([variationId, imageUrl]) => (
                <div key={variationId} className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt="Variation"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover rounded-lg"
                    unoptimized
                  />
                  <button
                    onClick={() => {
                      const newVariationImages = { ...variationImages };
                      delete newVariationImages[variationId];
                      setVariationImages(newVariationImages);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
