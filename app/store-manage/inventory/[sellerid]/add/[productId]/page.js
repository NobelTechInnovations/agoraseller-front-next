'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

const ProductDetailsPage = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { productId, sellerid } = unwrappedParams;
  
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
  
  const handleAddVariation = () => {
    if (!variationSize || !variationColor || !variationPrice || !variationStock) return;
    
    const newVariation = {
      size: variationSize,
      color: variationColor,
      price: variationPrice,
      stock: variationStock
    };
    
    // Add to variations array
    setSizeVariations([...sizeVariations, variationSize]);
    setColorVariations([...colorVariations, variationColor]);
    
    // Reset form
    setVariationSize('');
    setVariationColor('');
    setVariationPrice('');
    setVariationStock('');
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Category Path Display */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Category:</span>
          <div className="flex items-center">
            {productId.split('>').map((category, index, array) => (
              <div key={index} className="flex items-center">
                <span className={index === array.length - 1 ? "font-medium text-indigo-600" : ""}>
                  {category.trim()}
                </span>
                {index < array.length - 1 && <span className="mx-2">›</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Form Container */}
        <div className="flex-1 w-2/3">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            {/* Welcome Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Product Details</h3>

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
                          Provide information about the product's material characteristics.
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
                          className="mt-1 block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                          placeholder="e.g. Solid, Striped, Floral"
                        />
                      </div>
                      
                      {/* Pricing Section */}
                      <div className="col-span-2 bg-gray-100 p-4">
                        <h4 className="font-medium text-gray-800">Pricing & Inventory</h4>
                        <p className="text-sm text-gray-600">
                          Set your product's pricing and stock information.
                        </p>
                      </div>
                      
                      {/* MRP Price */}
                      <div className="col-span-1">
                        <label htmlFor="mrpPrice" className="block font-bold text-sm text-gray-700 mb-1">
                          MRP Price (₹)*
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <input
                            type="number"
                            id="mrpPrice"
                            value={mrpPrice}
                            onChange={(e) => setMrpPrice(e.target.value)}
                            className={`mt-1 block w-full pl-14 border ${errors.mrpPrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
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
                        <div className="relative rounded-md shadow-sm">

                          <input
                            type="number"
                            id="sellingPrice"
                            value={sellingPrice}
                            onChange={(e) => setSellingPrice(e.target.value)}
                            className={`mt-1 block w-full pl-14 border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
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
                          className={`mt-1 block w-full border ${errors.stockQty ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
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
                          className={`mt-1 block w-full border ${errors.productWeight ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
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
                            <h4 className="font-medium text-gray-800">Size & Color Variations</h4>
                            <p className="text-sm text-gray-600">
                              Add variations if your product comes in different sizes or colors.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowVariationForm(!showVariationForm)}
                            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm hover:bg-indigo-100"
                          >
                            {showVariationForm ? "Hide Form" : "Add Variation"}
                          </button>
                        </div>
                      </div>
                      
                      {/* Variation Form */}
                      {showVariationForm && (
                        <div className="col-span-2 border border-dashed border-gray-300 p-4 rounded-md">
                          <div className="grid grid-cols-4 gap-3">
                            <div>
                              <label htmlFor="variationSize" className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                              <input
                                type="text"
                                id="variationSize"
                                value={variationSize}
                                onChange={(e) => setVariationSize(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                                placeholder="e.g. S, M, L"
                              />
                            </div>
                            <div>
                              <label htmlFor="variationColor" className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                              <input
                                type="text"
                                id="variationColor"
                                value={variationColor}
                                onChange={(e) => setVariationColor(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                                placeholder="e.g. Red, Blue"
                              />
                            </div>
                            <div>
                              <label htmlFor="variationPrice" className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                              <input
                                type="number"
                                id="variationPrice"
                                value={variationPrice}
                                onChange={(e) => setVariationPrice(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label htmlFor="variationStock" className="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  id="variationStock"
                                  value={variationStock}
                                  onChange={(e) => setVariationStock(e.target.value)}
                                  className="block w-full border border-gray-300 rounded-l-md focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2"
                                  placeholder="0"
                                  min="0"
                                  step="1"
                                />
                                <button
                                  type="button"
                                  onClick={handleAddVariation}
                                  className="ml-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Display variations */}
                      {(sizeVariations.length > 0 || colorVariations.length > 0) && (
                        <div className="col-span-2 mt-2">
                          <div className="flex gap-4">
                            {sizeVariations.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-1">Sizes:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {sizeVariations.map((size, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                      {size}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {colorVariations.length > 0 && (
                              <div>
                                <h5 className="text-sm font-medium mb-1">Colors:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {colorVariations.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                      {color}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
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
                          className="mt-1 block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
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
                          className="mt-1 block w-full border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Link 
                        href={`/store-manage/inventory/${sellerid}/add`}
                        className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </Link>
                      <button
                        type="button"
                        onClick={handleSaveAndNext}
                        className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-purple-700 border-purple-700 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
        <div className="flex flex-col gap-6 w-1/3">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Product Images</h4>
            <div className="flex flex-wrap gap-4">
              {/* Placeholder images, replace with actual images if available */}
              <div className="w-32 p-2 h-32 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200 text-gray-400">
                No images uploaded
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
