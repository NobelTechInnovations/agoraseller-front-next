'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const AddProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryPath, setCategoryPath] = useState(['All categories']);
  const [currentCategories, setCurrentCategories] = useState([
    { name: 'Body care & Health', hasChildren: true },
    { name: 'Food', hasChildren: true },
    { name: 'Fashion & accessories', hasChildren: true },
    { name: 'Homeware & furniture', hasChildren: true },
    { name: 'Media', hasChildren: true },
    { name: 'Sex toy', hasChildren: true },
  ]);

  // Sample child categories - in a real app, these would come from an API
  const childCategories = {
    'Body care & Health': [
      { name: 'Personal Care', hasChildren: true },
      { name: 'Health Care', hasChildren: true },
      { name: 'Beauty Products', hasChildren: true },
    ],
    'Food': [
      { name: 'Snacks', hasChildren: true },
      { name: 'Beverages', hasChildren: true },
      { name: 'Packaged Foods', hasChildren: true },
    ],
    // Add more child categories as needed
  };

  const handleNextClick = (category) => {
    if (childCategories[category.name]) {
      setCategoryPath([...categoryPath, category.name]);
      setCurrentCategories(childCategories[category.name]);
    }
  };

  const handleBackClick = () => {
    if (categoryPath.length > 1) {
      const newPath = [...categoryPath];
      newPath.pop();
      setCategoryPath(newPath);
      
      // Reset to main categories if we're going back to root
      if (newPath.length === 1) {
        setCurrentCategories([
          { name: 'Body care & Health', hasChildren: true },
          { name: 'Food', hasChildren: true },
          { name: 'Fashion & accessories', hasChildren: true },
          { name: 'Homeware & furniture', hasChildren: true },
          { name: 'Media', hasChildren: true },
          { name: 'Sex toy', hasChildren: true },
        ]);
      } else {
        // In a real app, you would fetch the parent's children from an API
        setCurrentCategories(childCategories[newPath[newPath.length - 1]] || []);
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Create New Listing</h3>

        <div className="bg-gray-200 p-4 mb-4">
          <p className="text-sm text-gray-600">
            <b>Note:</b> you must specify all product data such as title, description, and keywords in the respective national language of desired region.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Product Form - 2/3 width */}
          <div className="w-2/3">
            <div className="bg-white p-6 rounded-lg border border-gray-300">
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
                      className="mt-1 block w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-2 bg-gray-100 p-4">
                    <p className="text-sm text-gray-600">
                      Create a detailed description that highlights the product's features, benefits, and unique selling points.
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
                      className="mt-1 block w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        
                        {/* Search Section */}
                        <div className="mb-6">
                          <label className="block text-sm text-gray-700 font-bold mb-1">Search for your desired category:</label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Search all categories"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="text-center my-4">
                          <span className="text-sm text-gray-500">or</span>
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
                                  className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                  Back
                                </button>
                              )}
                            </div>
                            <div className="divide-y divide-gray-200">
                              {currentCategories.map((category, index) => (
                                <div 
                                  key={index}
                                  className="flex items-center justify-between py-3 px-4 hover:bg-gray-50"
                                >
                                  <span className="text-sm text-gray-700">{category.name}</span>
                                  {category.hasChildren && (
                                    <button 
                                      type="button"
                                      className="text-sm text-gray-500 hover:text-indigo-600"
                                      onClick={() => handleNextClick(category)}
                                    >
                                      Next
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Upload Section - 1/3 width */}
          <div className="w-1/3">
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Product Images</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
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
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;