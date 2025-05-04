// --- NewListingForm.jsx ---
import React, { useState } from "react";
import axios from "axios";

const NewListingForm = ({ currentUser, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    yearBuilt: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    images: [],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState("drag");
  const [manualUrl, setManualUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items);

    Promise.all(
      items.map((item) => {
        return new Promise((resolve) => {
          if (item.kind === "string" && item.type === "text/uri-list") {
            item.getAsString((url) => {
              if (isValidImageUrl(url)) resolve(url);
              else resolve(null);
            });
          } else resolve(null);
        });
      })
    ).then((urls) => {
      const validUrls = urls.filter((url) => url !== null);
      if (validUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...validUrls],
        }));
      }
    });
  };

  const isValidImageUrl = (url) =>
    url.startsWith("http") &&
    [".jpg", ".jpeg", ".png", ".gif", ".webp"].some((ext) => url.endsWith(ext));

  const addManualImage = () => {
    if (manualUrl.trim().startsWith("http")) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, manualUrl.trim()],
      }));
      setManualUrl("");
    }
  };

  const geocodeAddress = async () => {
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      fullAddress
    )}&format=json`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else throw new Error("No results");
    } catch {
      return { lat: 34.0537, lon: -118.2428 }; // fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { lat, lon } = await geocodeAddress();
    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    const listingData = {
      ...formData,
      title: fullAddress,
      address: fullAddress,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      sqft: parseInt(formData.sqft),
      yearBuilt: parseInt(formData.yearBuilt),
      lat,
      lon,
      userId: currentUser?.id,
    };
    const res = await axios.post("http://localhost:8080/houses", listingData);
    onSubmit(res.data);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">New Listing</h2>
      <form className="bg-gray-800 p-6 rounded-lg" onSubmit={handleSubmit}>
        {/* Address Section */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300">Street Address</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
          />
        </div>

        {/* Price + Specs */}
        <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-300">Sqft</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() =>
              setInputMode(inputMode === "drag" ? "manual" : "drag")
            }
            className="mb-2 bg-gray-600 text-white px-4 py-1 rounded"
          >
            Switch to{" "}
            {inputMode === "drag" ? "Manual URL Input" : "Drag & Drop"}
          </button>

          {inputMode === "drag" ? (
            <div
              className={`border-2 ${
                isDragging
                  ? "border-blue-400 bg-blue-900/20"
                  : "border-gray-500 bg-gray-700"
              } border-dashed rounded-lg p-6 text-center`}
              style={{ minHeight: "200px" }}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
            >
              <p>
                {isDragging ? "Drop image URLs here" : "Drag image URLs here"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                placeholder="Paste image URL..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
              />
              <button
                type="button"
                onClick={addManualImage}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Add Image
              </button>
            </div>
          )}
        </div>

        {/* Preview Thumbnails */}
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-4">
            {formData.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Preview ${i}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewListingForm;
