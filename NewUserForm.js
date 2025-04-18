import React, { useState } from 'react';

const NewUserForm = ({ onCreateUser, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
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
    onCreateUser(formData);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Account</h2>
      <form className="bg-gray-800 p-6 rounded-lg" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300">Username</label>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300">Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300">Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password}
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
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
