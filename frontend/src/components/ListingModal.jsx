// --- ListingModal.jsx ---
import { useState, useEffect } from "react";

const ListingModal = ({
  listing = {},
  isUserListing = false,
  currentUser = null,
  onClose = () => {},
  liked = {},
  toggleLike = () => {},
  onSaveMessage = () => {},
  onMessageSent = () => {},
}) => {
  const [mainImage, setMainImage] = useState(null);
  const [showTourForm, setShowTourForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...listing });

  useEffect(() => {
    if (listing.images?.length > 0) {
      setMainImage(listing.images[0]);
    }
  }, [listing]);

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleTourRequest = async () => {
    const tourInfo = {
      type: "tour",
      houseId: listing.id,
      userId: currentUser?.id,
      requestedDate: tourDate,
      requestedTime: tourTime,
      datetime: new Date().toISOString(),
    };
    await onSaveMessage(tourInfo);
    setShowTourForm(false);
    onMessageSent();
  };

  const handleContactMessage = async () => {
    const msg = {
      type: "contact",
      houseId: listing.id,
      userId: currentUser?.id,
      message,
      datetime: new Date().toISOString(),
    };
    await onSaveMessage(msg);
    setShowContactForm(false);
    onMessageSent();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8080/houses/${listing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setIsEditing(false);
    window.location.reload();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const res = await fetch(`http://localhost:8080/houses/${listing.id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("Listing deleted.");
          onClose();
          window.location.reload();
        } else {
          alert("Failed to delete listing.");
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Error deleting listing.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div
        className="close-modal absolute top-4 right-4 text-white text-3xl cursor-pointer"
        onClick={onClose}
      >
        &times;
      </div>
      <div className="modal-content bg-gray-800 mx-auto my-8 p-8 rounded-lg max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {mainImage && (
            <img
              src={mainImage}
              className="w-full object-cover rounded-lg max-h-[400px]"
              alt={listing.title || "Listing Image"}
            />
          )}
          {listing.images?.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {listing.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                    img === mainImage ? "ring-4 ring-blue-400" : ""
                  }`}
                  alt={`img-${i}`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-start">
            {isEditing ? (
              <input
                className="text-3xl font-bold bg-gray-700 text-white p-2 rounded w-full"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            ) : (
              <h2 className="text-3xl font-bold">{listing.title}</h2>
            )}
            <i
              className={`${
                liked[listing.id] ? "fas" : "far"
              } fa-heart text-white text-2xl cursor-pointer ml-4`}
              onClick={() => toggleLike(listing.id)}
            ></i>
          </div>

          {isEditing ? (
            <textarea
              className="mt-2 w-full bg-gray-700 text-white p-2 rounded"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          ) : (
            <p className="mt-2 text-gray-300">{listing.description}</p>
          )}

          <p className="text-sm text-gray-500">House ID: {listing.id}</p>
          <p className="mt-4 text-gray-300 font-medium">{listing.address}</p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {["bedrooms", "bathrooms", "sqft"].map((field) => (
              <div key={field}>
                <p className="text-gray-400">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </p>
                {isEditing ? (
                  <input
                    type="number"
                    className="bg-gray-700 text-white rounded px-2 py-1 w-full"
                    value={formData[field] || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field]: parseInt(e.target.value),
                      })
                    }
                  />
                ) : (
                  <p>
                    {listing[field]}
                    {field === "sqft" ? " sqft" : ""}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            {isEditing ? (
              <input
                type="number"
                className="w-full bg-gray-700 text-white rounded px-4 py-2"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
              />
            ) : (
              <p className="text-2xl font-bold">
                ${listing.price?.toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-6 space-x-4">
            {isUserListing ? (
              isEditing ? (
                <>
                  <button
                    onClick={handleEditSubmit}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Delete Listing
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  onClick={() => setShowTourForm(!showTourForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Request a Tour
                </button>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Contact
                </button>
              </>
            )}
          </div>

          {showTourForm && (
            <div className="mt-4">
              <input
                type="date"
                min={getTomorrow()}
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                className="bg-gray-700 text-white rounded px-4 py-2 mr-2"
              />
              <input
                type="time"
                list="halfHourSteps"
                value={tourTime}
                onChange={(e) => setTourTime(e.target.value)}
                className="bg-gray-700 text-white rounded px-4 py-2 mr-2"
              />
              <datalist id="halfHourSteps">
                {[
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "12:00",
                  "12:30",
                  "13:00",
                  "13:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                ].map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
              <button
                onClick={handleTourRequest}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Submit Tour Request
              </button>
            </div>
          )}

          {showContactForm && (
            <div className="mt-4">
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full bg-gray-700 text-white rounded px-4 py-2 mb-2"
              ></textarea>
              <button
                onClick={handleContactMessage}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Send Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
