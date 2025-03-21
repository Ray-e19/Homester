import React from 'react';

const NewListingForm = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Listing</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewListingForm;
