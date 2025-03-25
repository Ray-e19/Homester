import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeScreen = () => {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePage, setActivePage] = useState('home');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    lat: '',
    lon: ''
  });

  useEffect(() => {
    // Initialize map when component mounts
    const initMap = () => {
      const map = L.map('map').setView([47.6062, -122.3321], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      return map;
    };

    const map = initMap();

    // Add heart toggle functionality
    document.querySelectorAll('.fa-heart').forEach(heart => {
      heart.addEventListener('click', function() {
        this.classList.toggle('far');
        this.classList.toggle('fas');
        this.classList.toggle('text-red-500');
      });
    });

    // Fetch listings
    fetch('/api/listings')
      .then(response => response.json())
      .then(data => setListings(data))
      .catch(error => console.error('Error fetching listings:', error));

    return () => {
      map.remove();
    };
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchQuery)}&apiKey=YOUR_GEOAPIFY_KEY`
      );
      if (response.data.features.length > 0) {
        const { lat, lon } = response.data.features[0].properties;
        // Here you would update the map view and fetch listings for the new location
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navigateTo = (page) => {
    setActivePage(page);
  };

  const handleNewListingChange = (e) => {
    const { name, value } = e.target;
    setNewListing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addListing = (e) => {
    e.preventDefault();
    // Here you would send the new listing to your API
    console.log('Adding new listing:', newListing);
    // Then reset the form
    setNewListing({
      title: '',
      description: '',
      price: '',
      lat: '',
      lon: ''
    });
    navigateTo('home');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="header-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-poppins font-bold text-white">Homester</h1>
          <p className="mt-4 text-xl font-roboto text-gray-200">Find your perfect home.</p>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-poppins font-bold text-white cursor-pointer" onClick={() => navigateTo('home')}>Homester</h1>
          <ul className="flex space-x-8">
            <li>
              <button onClick={() => navigateTo('new-user')} className="text-lg font-roboto text-gray-300 hover:text-blue-500">
                New User
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('new-listing')} className="text-lg font-roboto text-gray-300 hover:text-blue-500">
                New Listing
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Home Page */}
      {activePage === 'home' && (
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
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg font-roboto"
              >
                Search
              </button>
            </div>

            {/* Map */}
            <div id="map" className="mt-8"></div>

            {/* Property Listings */}
            <div className="mt-8">
              <h2 className="text-2xl font-poppins font-bold mb-4">Property Listings</h2>
              <div id="propertyList" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="airbnb-card bg-gray-800 rounded-xl overflow-hidden">
                    <div className="relative">
                      <img src={listing.imageUrl || 'https://a0.muscache.com/im/pictures/miso/Hosting-619966061834034729/original/6a1f6e5d-8b0d-4e1b-9b8c-9b8c9b8c9b8c.jpeg'} 
                          className="w-full h-48 object-cover" />
                      <button className="absolute top-3 right-3 text-white">
                        <i className="far fa-heart text-xl"></i>
                      </button>
                      <div className="absolute bottom-3 left-3 price-tag text-white px-2 py-1 rounded-md text-xs font-medium">
                        ${listing.price}/night
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-white">{listing.title}</h3>
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 text-xs"></i>
                          <span className="ml-1 text-sm">4.92</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{listing.location || 'Downtown'}</p>
                      <p className="text-gray-400 text-sm">Available dates</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="mt-8">
              <h2 className="text-2xl font-poppins font-bold mb-4">Nearby Places</h2>
              <div id="placesList" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Nearby places will be dynamically added here */}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* New User Page */}
      {activePage === 'new-user' && (
        <div id="new-user-page">
          <div className="container mx-auto px-4 mt-8">
            <h2 className="text-2xl font-poppins font-bold mb-4">New User</h2>
            <form className="bg-gray-800 p-6 rounded-lg">
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Email</label>
                <input type="email" className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-roboto">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Listing Page */}
      {activePage === 'new-listing' && (
        <div id="new-listing-page">
          <div className="container mx-auto px-4 mt-8">
            <h2 className="text-2xl font-poppins font-bold mb-4">New Listing</h2>
            <form className="bg-gray-800 p-6 rounded-lg" onSubmit={addListing}>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={newListing.title}
                  onChange={handleNewListingChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Description</label>
                <textarea 
                  name="description"
                  value={newListing.description}
                  onChange={handleNewListingChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Price</label>
                <input 
                  type="number" 
                  name="price"
                  value={newListing.price}
                  onChange={handleNewListingChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Latitude</label>
                <input 
                  type="number" 
                  name="lat"
                  value={newListing.lat}
                  onChange={handleNewListingChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 font-roboto">Longitude</label>
                <input 
                  type="number" 
                  name="lon"
                  value={newListing.lon}
                  onChange={handleNewListingChange}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100" 
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-roboto">
                Add Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
