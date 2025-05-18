'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import axiosInstance from '../../../utils/axios';
import S3Image from '../../../components/S3Image';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
export default function ProductListing() {
  const { data: session, status } = useSession();
  const sellerId = session?.user?.id;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    liveProducts: 0,
    draftProducts: 0,
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProducts();
    }
  }, [status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/v1/seller/product',
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      if (response.data.success) {
        setProducts(response.data.data.products);
        setFilteredProducts(response.data.data.products);
        
        // Calculate statistics
        const total = response.data.data.pagination.total;
        const liveCount = response.data.data.products.filter(p => p.status === 'live').length;
        const draftCount = response.data.data.products.filter(p => p.status === 'draft').length;
        
        setStatistics({
          totalProducts: total,
          liveProducts: liveCount,
          draftProducts: draftCount,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter products based on active tab
    if (activeTab === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.status === activeTab));
    }
  }, [activeTab, products]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (productId) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
  };

  return (
    <div className="p-3 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="flex justify-between items-center mb-4 border border-gray-300 bg-white shadow rounded-lg px-3 py-2">
        <div className='flex'>
          <div className='flex items-center justify-between mr-1 pr-3 border-r-1 border-gray-400'>
            <Icon icon="system-uicons:box-open" className='text-blue-600 mr-1' width="34" height="34" />
            <h1 className="text-lg font-semibold">Products</h1>
          </div>
          <div className="flex text-lg font-semibold -mb-px space-x-4">
            <button
              className={`${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('all')}
            >
              All ({statistics.totalProducts})
            </button>
            <button
              className={`${activeTab === 'live' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('live')}
            >
              Live ({statistics.liveProducts})
            </button>
            <button
              className={`${activeTab === 'draft' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-500 cursor-pointer'}`}
              onClick={() => setActiveTab('draft')}
            >
              Draft ({statistics.draftProducts})
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-1.5 rounded text-sm font-semibold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Products
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm text-gray-500 mr-1">
            Filter by:
          </div>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
              <option>Category</option>
              <option>Apparel</option>
              <option>Electronics</option>
              <option>Home & Living</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select className="appearance-none border border-gray-300 rounded px-3 py-1.5 pr-8 text-xs bg-white">
              <option>Status</option>
              <option>Live</option>
              <option>Draft</option>
              <option>Under Review</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center">
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-l px-3 py-1.5 pr-8 text-xs bg-white border-r-0">
                <option>Product ID</option>
                <option>Product Name</option>
                <option>Category</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-r px-3 py-1.5 text-xs"
                placeholder="Search products..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-4 text-center">Loading products...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border-collapse text-sm text-left text-gray-600 bg-white border border-gray-200 shadow rounded-lg">
            <thead className="bg-gray-100 border-b border-gray-200 text-xs uppercase text-gray-700">
              <tr className='border-b border-gray-200'>
                <th className="p-2 w-[30%]">Product</th>
                <th className="p-2 w-[15%]">Created Date</th>
                <th className="p-2 w-[10%]">Status</th>
                <th className="p-2 w-[10%]">Price/Qty</th>
                <th className="p-2 w-[10%]">Unified SKU</th>
                <th className="p-2 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-2 border border-gray-200">
                    <div className="flex items-center">
                      <div className="relative group">
                        <div className="h-15 w-15 rounded-lg overflow-hidden cursor-pointer" onClick={() => setSelectedImage(product.images[0]?.thumbnail_image)}>
                          <S3Image
                            src={product.images[0]?.thumbnail_image}
                            alt={product.descriptions[0]?.title}
                            width={60}
                            height={60}
                            className="h-full w-full"
                          />
                        </div>
                        {/* Tooltip */}
                        <div className="invisible group-hover:visible absolute z-10 w-48 p-2 mt-2 bg-gray-800 rounded-md shadow-lg text-white text-xs">
                          <p className="font-medium">{product.descriptions[0]?.title}</p>
                          <p className="mt-1">Category: {product.category_id?.name}</p>
                        </div>
                      </div>
                      <div className="ml-4 max-w-[calc(100%-80px)]">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.descriptions[0]?.title.split(' ').slice(0, 4).join(' ')}
                          {product.descriptions[0]?.title.split(' ').length > 4 ? '...' : ''}
                        </div>
                          <span className="text-gray-500 text-xs bg-gray-100 border border-gray-500 rounded-full px-2 py-0">
                            In {product.category_id?.name}
                          </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-gray-500 border border-gray-200">
                    <dd className="mt-1 text-sm text-gray-900 truncate">
                      {new Date(product.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </dd>
                  </td>

                  <td className="p-2 border border-gray-200">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.status === 'published' 
                        ? 'bg-green-200 text-green-700'
                        : product.status === 'draft'
                          ? 'bg-yellow-200 text-yellow-700'
                          : product.status === 'in-review'
                            ? 'bg-blue-200 text-blue-700'
                            : product.status === 'varification_failed'
                              ? 'bg-red-200 text-red-700'
                              : 'bg-gray-200 text-gray-700'
                    }`}>
                      {product.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2 text-gray-900 truncate border border-gray-200">{product.price ?? 'N/A'} / {product.quantity ?? 'N/A'}</td>
                  <td className="p-2 text-gray-900 truncate border border-gray-200">{product.unified_sku}</td>
                  <td className="p-2 relative">
                      <div ref={dropdownRef} className="relative inline-block text-left">
                        <button
                          onClick={() => handleDropdownClick(product.product_id)}
                          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                        >
                          <Icon icon="mdi:dots-vertical" width="20" height="20" />
                        </button>

                        {openDropdown === product.product_id && (
                          <div className="absolute left-0 z-10 mt-2 w-40 bg-white shadow-lg ring-1 border border-gray-200 ring-opacity-9 focus:outline-none">
                              
                            <div className="text-sm text-gray-700">
                              {product.status === 'in-review' && (
                                <>
                                    <Link
                                      href={`/store-manage/inventory/${btoa(sellerId)}/edit/${product.product_id}`}
                                      className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setOpenDropdown(null)}
                                    >
                                    Edit
                                  </Link>
                               
                                    <Link
                                      href={`/store-manage/inventory/${btoa(sellerId)}/edit/${product.product_id}`}
                                      className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setOpenDropdown(null)}
                                    >
                                    Manage Inventory
                                  </Link>
                                    <Link
                                      href={`/store-manage/inventory/${btoa(sellerId)}/edit/${product.product_id}`}
                                      className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setOpenDropdown(null)}
                                    >
                                    Update Price
                                  </Link>


                                  </>
                              )}

                              <a
                                onClick={() => setOpenDropdown(null)}
                                className="block px-4 py-2"
                                >
                                View product
                              </a>
                                </div>

                          </div>
                        )}
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        {/* Image Popup */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl  p-4 overflow-auto">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none"
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="max-w-full max-h-full overflow-auto flex justify-center items-center">
                <S3Image
                  src={selectedImage}
                  alt="Full size product image"
                  width={800}
                  height={800}
                  className="object-contain max-h-full max-w-full position-initial" // Make sure the image is contained within the container
                />
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
