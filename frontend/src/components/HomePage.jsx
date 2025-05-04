import { useState } from "react";
import MapView from "./MapView";

const HomePage = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  listings,
  currentUser,
  currentlyBooked,
  showListingDetails,
  deleteListing,
  liked,
  toggleLike,
}) => {
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = maxPrice === "" || listing.price <= parseInt(maxPrice);

    const matchesBedrooms =
      bedrooms === "" || listing.bedrooms >= parseInt(bedrooms);

    const matchesBathrooms =
      bathrooms === "" || listing.bathrooms >= parseInt(bathrooms);

    return matchesSearch && matchesPrice && matchesBedrooms && matchesBathrooms;
  });

  return (
    <main id="home-page">
      <div className="container mx-auto px-4 mt-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by city or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-60 px-4 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-gray-100"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-36 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
          />

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value="">Bedrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>

          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100"
          >
            <option value="">Bathrooms</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>

          <button
            onClick={() => {
              setSearchQuery("");
              setMaxPrice("");
              setBedrooms("");
              setBathrooms("");
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>

        <MapView
          listings={filteredListings}
          onMarkerClick={showListingDetails}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Property Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isBooked = currentlyBooked[listing.id];
              const isUserListing =
                currentUser && listing.userId === currentUser.id;

              return (
                <div
                  key={listing.id}
                  className="airbnb-card bg-gray-800 rounded-xl overflow-hidden relative hover:transform hover:-translate-y-1 transition-transform cursor-pointer"
                  onClick={() => showListingDetails(listing.id)}
                >
                  {isBooked && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Booked
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <i
                        className={`${
                          liked[listing.id] ? "fas" : "far"
                        } fa-heart text-white text-xl drop-shadow cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(listing.id);
                        }}
                      ></i>
                    </div>
                    <img
                      src={
                        listing.images?.[0] ||
                        "https://placehold.co/400x200?text=No+Image"
                      }
                      className="w-full h-48 object-cover"
                      alt={listing.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x200?text=No+Image";
                      }}
                    />
                    <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium">
                      ${listing.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white">
                      {listing.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {listing.location}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {listing.bedrooms} beds · {listing.bathrooms} baths ·{" "}
                      {listing.sqft} sqft
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
