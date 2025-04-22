import React, { useState } from 'react';

const NewListingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    address: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      sqft: parseInt(formData.sqft)
    });
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">New Listing</h2>
      <form className="bg-gray-800 p-6 rounded-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300">Title</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Price per night ($)</label>
          <input 
            type="number" 
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Bedrooms</label>
          <input 
            type="number" 
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Bathrooms</label>
          <input 
            type="number" 
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Area (sqft)</label>
          <input 
            type="number" 
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Address</label>
          <input 
            type="text" 
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Image URL</label>
          <input 
            type="url" 
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewListingForm;
