import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import NewUserForm from './NewUserForm';
import NewListingForm from './NewListingForm';

const HomeScreen = () => {
  const [activePage, setActivePage] = useState('home');
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentlyBooked, setCurrentlyBooked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showListingModal, setShowListingModal] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [map, setMap] = useState(null);

  // Default listings data
  const defaultListings = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      description: "This stylish apartment in the heart of downtown offers stunning city views and easy access to all the best restaurants and attractions.",
      price: 120,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      location: "Downtown Los Angeles",
      address: "123 Main St, Los Angeles, CA",
      rating: 4.92,
      reviews: 124,
      amenities: ["WiFi", "Kitchen", "Washer", "Dryer", "Air Conditioning", "Heating", "TV", "Essentials"],
      images: [
        "https://a0.muscache.com/im/pictures/miso/Hosting-619966061834034729/original/6a1f6e5d-8b0d-4e1b-9b8c-9b8c9b8c9b8c.jpeg",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
      ],
      lat: 34.0522,
      lon: -118.2437,
      userId: null
    },
    // ... other default listings
  ];

  useEffect(() => {
    // Load data from localStorage
    const savedListings = localStorage.getItem('homester-listings');
    const savedUser = localStorage.getItem('homester-user');
    const savedBookings = localStorage.getItem('homester-bookings');

    setListings(savedListings ? JSON.parse(savedListings) : defaultListings);
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    setCurrentlyBooked(savedBookings ? JSON.parse(savedBookings) : {});

    // Initialize map
    initMap();
  }, []);

  const initMap = () => {
    const defaultLat = 34.0522;
    const defaultLon = -118.2437;
    
    const newMap = L.map('map').setView([defaultLat, defaultLon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(newMap);
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          newMap.setView([userLat, userLon], 13);
          L.marker([userLat, userLon]).addTo(newMap)
            .bindPopup('Your location')
            .openPopup();
        },
        () => {
          console.log('Geolocation not available, using default location');
        }
      );
    }
    
    setMap(newMap);
    addListingMarkers(newMap);

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  };

  const addListingMarkers = (mapInstance) => {
    listings.forEach(listing => {
      L.marker([listing.lat, listing.lon]).addTo(mapInstance)
        .bindPopup(listing.title)
        .on('click', () => showListingDetails(listing.id));
    });
  };

  const navigateTo = (page) => {
    setActivePage(page);
    if (page === 'home' && map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    setConfirmationMessage(`Search functionality would look for: ${searchQuery}`);
    setShowConfirmation(true);
  };

  const createNewUser = (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.username,
      email: userData.email
    };
    
    localStorage.setItem('homester-user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    navigateTo('home');
    setConfirmationMessage('Account created successfully!');
    setShowConfirmation(true);
  };

  const addNewListing = (listingData) => {
    if (!currentUser) {
      setConfirmationMessage('Please create an account to add a listing');
      setShowConfirmation(true);
      navigateTo('new-user');
      return;
    }
    
    const newListing = {
      id: Date.now(),
      ...listingData,
      location: "Los Angeles",
      rating: (4 + Math.random() * 0.9).toFixed(2),
      reviews: Math.floor(Math.random() * 50) + 10,
      amenities: ["WiFi", "Kitchen", "Essentials"],
      lat: 34.0522 + (Math.random() * 0.1 - 0.05),
      lon: -118.2437 + (Math.random() * 0.1 - 0.05),
      userId: currentUser.id
    };
    
    const updatedListings = [newListing, ...listings];
    setListings(updatedListings);
    localStorage.setItem('homester-listings', JSON.stringify(updatedListings));
    
    if (map) {
      addListingMarkers(map);
    }
    
    navigateTo('home');
    setConfirmationMessage('Listing added successfully!');
    setShowConfirmation(true);
  };

  const deleteListing = (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const updatedListings = listings.filter(listing => listing.id !== listingId);
      setListings(updatedListings);
      localStorage.setItem('homester-listings', JSON.stringify(updatedListings));
      
      const updatedBookings = {...currentlyBooked};
      delete updatedBookings[listingId];
      setCurrentlyBooked(updatedBookings);
      localStorage.setItem('homester-bookings', JSON.stringify(updatedBookings));
      
      setConfirmationMessage('Listing deleted successfully');
      setShowConfirmation(true);
    }
  };

  const toggleBooking = (listingId) => {
    const updatedBookings = {...currentlyBooked};
    
    if (updatedBookings[listingId]) {
      delete updatedBookings[listingId];
      setConfirmationMessage('Booking cancelled successfully');
    } else {
      updatedBookings[listingId] = {
        userId: currentUser.id,
        date: new Date().toISOString()
      };
      setConfirmationMessage('Property booked successfully!');
    }
    
    setCurrentlyBooked(updatedBookings);
    localStorage.setItem('homester-bookings', JSON.stringify(updatedBookings));
    setShowListingModal(false);
    setShowConfirmation(true);
  };

  const showListingDetails = (listingId) => {
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      setCurrentListing(listing);
      setShowListingModal(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('homester-user');
    setConfirmationMessage('Logged out successfully');
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="header-bg py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white">Homester</h1>
          <p className="mt-4 text-xl text-gray-200">Find your perfect home.</p>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white cursor-pointer" onClick={() => navigateTo('home')}>Homester</h1>
          <ul className="flex space-x-8 items-center">
            {currentUser && (
              <li>
                <span className="text-blue-400">Hi, {currentUser.name}!</span>
              </li>
            )}
            {!currentUser && (
              <li>
                <button onClick={() => navigateTo('new-user')} className="text-lg text-gray-300 hover:text-blue-500">
                  New User
                </button>
              </li>
            )}
            <li>
              <button onClick={() => navigateTo('new-listing')} className="text-lg text-gray-300 hover:text-blue-500">
                New Listing
              </button>
            </li>
            {currentUser && (
              <li>
                <button onClick={logout} className="text-lg text-gray-300 hover:text-blue-500">
                  Logout
                </button>
              </li>
            )}
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
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Search
              </button>
            </div>

            {/* Map */}
            <div id="map" className="mt-8 h-[400px] w-full rounded-lg"></div>

            {/* Property Listings */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Property Listings</h2>
              <div id="propertyList" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => {
                  const isBooked = currentlyBooked[listing.id];
                  const isUserListing = currentUser && listing.userId === currentUser.id;
                  
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
                        <img src={listing.images[0]} className="w-full h-48 object-cover" alt={listing.title} />
                        <button 
                          className="absolute top-3 right-3 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Toggle heart functionality would go here
                          }}
                        >
                          <i className="far fa-heart text-xl"></i>
                        </button>
                        <div className="absolute bottom-3 left-3 price-tag bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs font-medium">
                          ${listing.price}/night
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-white">{listing.title}</h3>
                          <div className="flex items-center">
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                            <span className="ml-1 text-sm">{listing.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{listing.location}</p>
                        <p className="text-gray-400 text-sm">{listing.bedrooms} beds · {listing.bathrooms} baths · {listing.sqft} sqft</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* New User Page */}
      {activePage === 'new-user' && (
        <NewUserForm 
          onCreateUser={createNewUser} 
          onCancel={() => navigateTo('home')} 
        />
      )}

      {/* New Listing Page */}
      {activePage === 'new-listing' && (
        <NewListingForm 
          onSubmit={addNewListing} 
          onCancel={() => navigateTo('home')} 
        />
      )}

      {/* Listing Details Modal */}
      {showListingModal && currentListing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
          <div className="close-modal absolute top-4 right-4 text-white text-3xl cursor-pointer" onClick={() => setShowListingModal(false)}>
            &times;
          </div>
          <div className="modal-content bg-gray-800 mx-auto my-8 p-8 rounded-lg max-w-6xl">
            <ListingDetails 
              listing={currentListing} 
              isBooked={currentlyBooked[currentListing.id]}
              isUserListing={currentUser && currentListing.userId === currentUser.id}
              currentUser={currentUser}
              onBook={() => toggleBooking(currentListing.id)}
              onClose={() => setShowListingModal(false)}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="confirmation-content bg-gray-800 p-8 rounded-lg max-w-md text-center">
            <h3 className="text-xl font-bold mb-4">{confirmationMessage}</h3>
            <button 
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ListingDetails = ({ listing, isBooked, isUserListing, currentUser, onBook, onClose }) => {
  const [mainImage, setMainImage] = useState(listing.images[0]);

  const changeMainImage = (thumbImage) => {
    const newMain = thumbImage;
    setMainImage(thumbImage);
    // In a real implementation, you would swap the images
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images */}
      <div className="space-y-4">
        <img src={mainImage} className="w-full h-96 object-cover rounded-lg" alt={listing.title} />
        {listing.images.length > 1 && (
          <div className="grid grid-cols-3 gap-2">
            {listing.images.slice(1).map((img, index) => (
              <img 
                key={index}
                src={img} 
                className="w-full h-24 object-cover rounded-lg cursor-pointer" 
                onClick={() => changeMainImage(img)}
                alt={`${listing.title} ${index + 2}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Details */}
      <div>
        <h2 className="text-3xl font-bold">{listing.title}</h2>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <i className="fas fa-star text-yellow-400"></i>
            <span className="ml-1">{listing.rating}</span>
            <span className="ml-2 text-gray-400">({listing.reviews} reviews)</span>
          </div>
          <span className="ml-4 text-gray-400">{listing.location}</span>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 border-b border-gray-700 pb-6">
          <div>
            <p className="text-gray-400">Bedrooms</p>
            <p className="text-xl">{listing.bedrooms}</p>
          </div>
          <div>
            <p className="text-gray-400">Bathrooms</p>
            <p className="text-xl">{listing.bathrooms}</p>
          </div>
          <div>
            <p className="text-gray-400">Area</p>
            <p className="text-xl">{listing.sqft} sqft</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold">About this property</h3>
          <p className="mt-2 text-gray-300">{listing.description}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Address</h3>
          <p className="mt-2 text-gray-300">{listing.address}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Amenities</h3>
          <div className="amenities-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {listing.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold">${listing.price}/night</p>
            <p className="text-gray-400">Includes taxes and fees</p>
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
                className={`${isUserListing ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-3 rounded-lg font-medium`}
              >
                {isUserListing ? 'Your Listing' : 'Book Now'}
              </button>
            )
          ) : (
            <button 
              onClick={() => {
                onClose();
                // In a real app, you would navigate to the new user page
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Create Account to Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
