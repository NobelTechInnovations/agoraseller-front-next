'use client';

import { useState } from 'react';

export default function CategoryPage() {
  const [categories, setCategories] = useState([
    // Sample data - replace with actual data from your API
    { id: 1, name: 'Electronics', parentCategory: null, thumbnail: '/electronics.jpg' },
    { id: 2, name: 'Clothing', parentCategory: null, thumbnail: '/clothing.jpg' },
    { id: 3, name: 'Smartphones', parentCategory: 'Electronics', thumbnail: '/smartphones.jpg' },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    parentCategory: '',
    thumbnail: null
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement category creation logic
    console.log('Create form submitted:', formData);
    setIsCreateModalOpen(false);
    setFormData({ name: '', parentCategory: '', thumbnail: null });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement category update logic
    console.log('Edit form submitted:', formData);
    setIsEditModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: '', parentCategory: '', thumbnail: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        thumbnail: file
      }));
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory || '',
      thumbnail: null
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    // TODO: Implement delete logic
    console.log('Delete category:', id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Categories</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
        >
          Create Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="border border-black">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="px-6 py-4 text-left text-black font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-black font-semibold">Parent Category</th>
              <th className="px-6 py-4 text-left text-black font-semibold">Thumbnail</th>
              <th className="px-6 py-4 text-left text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-black">
                <td className="px-6 py-4 text-black">{category.name}</td>
                <td className="px-6 py-4 text-black">{category.parentCategory || '-'}</td>
                <td className="px-6 py-4">
                  {category.thumbnail && (
                    <img
                      src={category.thumbnail}
                      alt={category.name}
                      className="w-16 h-16 object-cover border border-black"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => openEditModal(category)}
                      className="text-black hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-black hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-black mb-6">Create Category</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="parentCategory" className="block text-black mb-2">
                  Parent Category
                </label>
                <select
                  id="parentCategory"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-black mb-2">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-black mb-6">Edit Category</h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label htmlFor="edit-name" className="block text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-parentCategory" className="block text-black mb-2">
                  Parent Category
                </label>
                <select
                  id="edit-parentCategory"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit-thumbnail" className="block text-black mb-2">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  id="edit-thumbnail"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
