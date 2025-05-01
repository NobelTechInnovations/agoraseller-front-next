import Link from 'next/link';
import Image from 'next/image';

const AddProduct = () => {
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
                  The product title should summarize the most important product details in short, concise and informative manner. Cusotemr should be able to 
                  indentify the type of product and its main features at a glance. The ideal length is <b>50-80 characters</b>, this will ensure the entire title is visible in search results.

                </p>
              </div>
              <div className="col-span-2">
                <label htmlFor="title" className="block font-bold text-sm text-gray-700 mb-1">
                  Product Title
                </label>
                <textarea
                  id="title"
                  rows={2}
                  className="mt-1 block w-full border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-2 bg-gray-100 p-4">
                <p className="text-sm text-gray-600">
                  Create a detailed description that highlights the product's features, benefits, and unique selling points.
                  Breifly and concisely describe the function, the struture and any other relevant information. Always put the most important 
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
                  className="mt-1 block w-full border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
                 
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md  text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  )
}

export default AddProduct;