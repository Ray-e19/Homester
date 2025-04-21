import { useState } from "react";

const ListingModal = ({
  listing,
  isBooked,
  isUserListing,
  currentUser,
  onBook,
  onClose,
}) => {
  const [mainImage, setMainImage] = useState(listing.images[0]);

  const changeMainImage = (img) => {
    setMainImage(img);
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
        {/* Image Section */}
        <div className="space-y-4">
          <img
            src={mainImage}
            className="w-full h-96 object-cover rounded-lg"
            alt={listing.title}
          />
          {listing.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {listing.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => changeMainImage(img)}
                  className="w-full h-24 object-cover rounded-lg cursor-pointer"
                  alt={`img-${i}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <h2 className="text-3xl font-bold">{listing.title}</h2>
          <div className="flex items-center mt-2">
            <i className="fas fa-star text-yellow-400"></i>
            <span className="ml-1">{listing.rating}</span>
            <span className="ml-2 text-gray-400">
              ({listing.reviews} reviews)
            </span>
          </div>
          <p className="mt-2 text-gray-300">{listing.description}</p>
          <p className="mt-4 text-gray-300 font-medium">{listing.address}</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <p className="text-gray-400">Bedrooms</p>
              <p>{listing.bedrooms}</p>
            </div>
            <div>
              <p className="text-gray-400">Bathrooms</p>
              <p>{listing.bathrooms}</p>
            </div>
            <div>
              <p className="text-gray-400">Area</p>
              <p>{listing.sqft} sqft</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <ul className="grid grid-cols-2 gap-2 mt-2 text-gray-300">
              {listing.amenities.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">${listing.price}/night</p>
              <p className="text-gray-400 text-sm">Includes taxes and fees</p>
            </div>
            {currentUser ? (
              isBooked ? (
                <button
                  onClick={onBook}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Cancel Booking
                </button>
              ) : (
                <button
                  onClick={onBook}
                  disabled={isUserListing}
                  className={`${
                    isUserListing
                      ? "bg-gray-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-6 py-3 rounded-lg font-medium`}
                >
                  {isUserListing ? "Your Listing" : "Book Now"}
                </button>
              )
            ) : (
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
              >
                Create Account to Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
