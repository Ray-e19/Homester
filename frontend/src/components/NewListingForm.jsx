import React, { useState } from "react";
import axios from "axios";

const NewListingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
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

    items.forEach((item) => {
      if (item.kind === "string" && item.type === "text/uri-list") {
        item.getAsString((url) => {
          console.log("Dropped URL:", url);

          // Validate that it's a direct image URL
          if (isValidImageUrl(url)) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, url],
            }));
          } else {
            console.warn("Ignored invalid image URL:", url);
          }
        });
      }
    });
  };

  const isValidImageUrl = (url) => {
    // Must start with http or https
    if (!url.startsWith("http")) return false;

    // Must end with common image extensions
    return (
      url.endsWith(".jpg") ||
      url.endsWith(".jpeg") ||
      url.endsWith(".png") ||
      url.endsWith(".gif") ||
      url.endsWith(".webp")
    );
  };

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
      const response = await axios.get(url, {
        headers: { "Accept-Language": "en" },
      });
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else throw new Error("No results");
    } catch (err) {
      return { lat: 34.0537, lon: -118.2428 }; // LA City Hall fallback
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { lat, lon } = await geocodeAddress();
    const listingData = {
      ...formData,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      sqft: parseInt(formData.sqft),
      address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`,
      lat,
      lon,
    };
    const res = await axios.post("http://localhost:8080/houses", listingData);
    onSubmit(res.data);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h2 className="text-2xl font-bold mb-4">New Listing</h2>
      <form className="bg-gray-800 p-6 rounded-lg" onSubmit={handleSubmit}>
        {/* Title */}
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

        {/* Description */}
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

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-300">Price per night ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
          />
        </div>

        {/* Bedrooms */}
        <div className="mb-4">
          <label className="block text-gray-300">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
          />
        </div>

        {/* Bathrooms */}
        <div className="mb-4">
          <label className="block text-gray-300">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
          />
        </div>

        {/* Sqft */}
        <div className="mb-4">
          <label className="block text-gray-300">Area (sqft)</label>
          <input
            type="number"
            name="sqft"
            value={formData.sqft}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
          />
        </div>

        {/* Address Fields */}
        <div className="mb-4">
          <label className="block text-gray-300">Street Address</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="123 Main St"
            required
            className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
          />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Los Angeles"
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
              placeholder="CA"
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
              placeholder="90012"
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-gray-900 text-gray-100"
            />
          </div>
        </div>

        {/* Toggle */}
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

          {inputMode === "drag" && (
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
                {isDragging
                  ? "Drop image URLs here"
                  : "Drag online image URLs here"}
              </p>
            </div>
          )}

          {inputMode === "manual" && (
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
