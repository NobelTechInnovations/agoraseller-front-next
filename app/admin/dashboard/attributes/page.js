'use client';

import { useState } from 'react';

export default function AttributesPage() {
  const [attributes, setAttributes] = useState([
    // Sample data - replace with actual data from your API
    {
      id: 1,
      name: 'Size',
      values: ['Small', 'Medium', 'Large', 'XL', 'XXL', 'XXXL']
    },
    {
      id: 2,
      name: 'Color',
      values: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange']
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false);
  const [isViewMoreModalOpen, setIsViewMoreModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: ''
  });

  const handleCreateAttribute = async (e) => {
    e.preventDefault();
    // TODO: Implement attribute creation logic
    console.log('Create attribute:', formData);
    setIsCreateModalOpen(false);
    setFormData({ name: '', value: '' });
  };

  const handleAddValue = async (e) => {
    e.preventDefault();
    // TODO: Implement value addition logic
    console.log('Add value:', { attributeId: selectedAttribute.id, value: formData.value });
    setIsAddValueModalOpen(false);
    setFormData({ name: '', value: '' });
  };

  const handleDeleteAttribute = async (id) => {
    // TODO: Implement delete logic
    console.log('Delete attribute:', id);
  };

  const handleDeleteValue = async (attributeId, value) => {
    // TODO: Implement value deletion logic
    console.log('Delete value:', { attributeId, value });
  };

  const openAddValueModal = (attribute) => {
    setSelectedAttribute(attribute);
    setFormData({ name: '', value: '' });
    setIsAddValueModalOpen(true);
  };

  const openViewMoreModal = (attribute) => {
    setSelectedAttribute(attribute);
    setIsViewMoreModalOpen(true);
  };

  const renderAttributeValues = (attribute) => {
    const displayValues = attribute.values.slice(0, 3);
    const hasMore = attribute.values.length > 3;

    return (
      <div className="flex flex-wrap gap-2">
        {displayValues.map((value, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1 border border-black"
          >
            <span className="text-black">{value}</span>
            <button
              onClick={() => handleDeleteValue(attribute.id, value)}
              className="text-black hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
        {hasMore && (
          <button
            onClick={() => openViewMoreModal(attribute)}
            className="px-3 py-1 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
          >
            +{attribute.values.length - 3} More
          </button>
        )}
        <button
          onClick={() => openAddValueModal(attribute)}
          className="px-3 py-1 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
        >
          + Add Value
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Attributes</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
        >
          Create Attribute
        </button>
      </div>

      {/* Attributes Table */}
      <div className="border border-black">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              <th className="px-6 py-4 text-left text-black font-semibold">Attribute Name</th>
              <th className="px-6 py-4 text-left text-black font-semibold">Values</th>
              <th className="px-6 py-4 text-left text-black font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.id} className="border-b border-black">
                <td className="px-6 py-4 text-black font-semibold">{attribute.name}</td>
                <td className="px-6 py-4">
                  {renderAttributeValues(attribute)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteAttribute(attribute.id)}
                    className="text-black hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Attribute Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-black mb-6">Create Attribute</h2>
            <form onSubmit={handleCreateAttribute} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-black mb-2">
                  Attribute Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                  placeholder="e.g., Size, Color, Material"
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

      {/* Add Value Modal */}
      {isAddValueModalOpen && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-black mb-6">
              Add Value to {selectedAttribute?.name}
            </h2>
            <form onSubmit={handleAddValue} className="space-y-6">
              <div>
                <label htmlFor="value" className="block text-black mb-2">
                  Value
                </label>
                <input
                  type="text"
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-4 py-2 border border-black rounded-none focus:outline-none focus:border-black"
                  placeholder={`e.g., ${selectedAttribute?.name === 'Size' ? 'Small, Medium, Large' : 'Red, Blue, Green'}`}
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white border border-black hover:bg-white hover:text-black transition-colors duration-200"
                >
                  Add Value
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddValueModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View More Values Modal */}
      {isViewMoreModalOpen && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">
                {selectedAttribute?.name} Values
              </h2>
              <button
                onClick={() => setIsViewMoreModalOpen(false)}
                className="text-black hover:underline"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {selectedAttribute?.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-black"
                >
                  <span className="text-black">{value}</span>
                  <button
                    onClick={() => handleDeleteValue(selectedAttribute.id, value)}
                    className="text-black hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 