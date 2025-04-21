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
}) => {
  return (
    <main id="home-page">
      <div className="container mx-auto px-4 mt-8">
        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search by city or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-700 rounded-lg shadow-sm bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Map */}
        <MapView listings={listings} onMarkerClick={showListingDetails} />

        {/* Property Listings */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Property Listings</h2>
          <div
            id="propertyList"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {listings.map((listing) => {
              const isBooked = currentlyBooked[listing.id];
              const isUserListing =
                currentUser && listing.userId === currentUser.id;

              return (
                <div
                  key={listing.id}
                  className="airbnb-card bg-gray-800 rounded-xl overflow-hidden relative hover:transform hover:-translate-y-1 transition-transform cursor-pointer"
                  onClick={() => showListingDetails(listing.id)}
                >
                  {isUserListing && (
                    <button
                      className="delete-btn absolute top-3 right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteListing(listing.id);
                      }}
                    >
                      ×
                    </button>
                  )}

                  {isBooked && (
                    <div className="unavailable-badge absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Booked
                    </div>
                  )}

                  <div className="relative">
                    <img
                      src={
                        listing.images?.[0] ||
                        "https://placehold.co/400x200?text=No+Image"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/400x200?text=No+Image";
                      }}
                      className="w-full h-48 object-cover"
                      alt={listing.title}
                    />
                    <div className="absolute bottom-3 left-3 price-tag bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium">
                      ${listing.price}/night
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white">
                        {listing.title}
                      </h3>
                      <div className="flex items-center">
                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                        <span className="ml-1 text-sm">{listing.rating}</span>
                      </div>
                    </div>
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
