import React, { useState, useEffect } from "react";

import Header from "./Header";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import NewUserForm from "./NewUserForm";
import NewListingForm from "./NewListingForm";
import ListingModal from "./ListingModal";
import ConfirmationModal from "./ConfirmationModal";

const HomeScreen = () => {
  const [activePage, setActivePage] = useState("home");
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentlyBooked, setCurrentlyBooked] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showListingModal, setShowListingModal] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const defaultListings = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      description: "Stylish apartment in downtown LA with views.",
      price: 120,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      location: "Downtown Los Angeles",
      address: "123 Main St, Los Angeles, CA",
      rating: 4.92,
      reviews: 124,
      amenities: ["WiFi", "Kitchen", "Washer", "Dryer"],
      images: [
        "https://images.unsplash.com/photo-1740795095446-22619b771ec7?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80",
      ],
      lat: 34.0522,
      lon: -118.2437,
      userId: null,
    },
  ];

  useEffect(() => {
    const savedListings = localStorage.getItem("homester-listings");
    const savedUser = localStorage.getItem("homester-user");
    const savedBookings = localStorage.getItem("homester-bookings");

    setListings(savedListings ? JSON.parse(savedListings) : defaultListings);
    setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
    setCurrentlyBooked(savedBookings ? JSON.parse(savedBookings) : {});
  }, []);

  const navigateTo = (page) => {
    setActivePage(page);
  };

  const handleSearch = () => {
    setConfirmationMessage(`Search: ${searchQuery}`);
    setShowConfirmation(true);
  };

  const createNewUser = (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.username,
      email: userData.email,
    };

    localStorage.setItem("homester-user", JSON.stringify(newUser));
    setCurrentUser(newUser);
    navigateTo("home");
    setConfirmationMessage("Account created!");
    setShowConfirmation(true);
  };

  const addNewListing = (listingData) => {
    if (!currentUser) {
      setConfirmationMessage("Login first to add a listing.");
      setShowConfirmation(true);
      navigateTo("new-user");
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
      userId: currentUser.id,
    };

    const updatedListings = [newListing, ...listings];
    setListings(updatedListings);
    localStorage.setItem("homester-listings", JSON.stringify(updatedListings));

    navigateTo("home");
    setConfirmationMessage("Listing added!");
    setShowConfirmation(true);
  };

  const deleteListing = (id) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    localStorage.setItem("homester-listings", JSON.stringify(updated));
  };

  const toggleBooking = (id) => {
    const updated = { ...currentlyBooked };
    if (updated[id]) {
      delete updated[id];
      setConfirmationMessage("Booking canceled.");
    } else {
      updated[id] = { userId: currentUser.id, date: new Date().toISOString() };
      setConfirmationMessage("Booking confirmed!");
    }

    setCurrentlyBooked(updated);
    localStorage.setItem("homester-bookings", JSON.stringify(updated));
    setShowListingModal(false);
    setShowConfirmation(true);
  };

  const showListingDetails = (id) => {
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      setCurrentListing(listing);
      setShowListingModal(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("homester-user");
    setConfirmationMessage("Logged out.");
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <NavBar
        currentUser={currentUser}
        navigateTo={navigateTo}
        logout={logout}
      />

      {activePage === "home" && (
        <HomePage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          listings={listings}
          currentUser={currentUser}
          currentlyBooked={currentlyBooked}
          showListingDetails={showListingDetails}
          deleteListing={deleteListing}
        />
      )}

      {activePage === "new-user" && (
        <NewUserForm
          onCreateUser={createNewUser}
          onCancel={() => navigateTo("home")}
        />
      )}

      {activePage === "new-listing" && (
        <NewListingForm
          onSubmit={addNewListing}
          onCancel={() => navigateTo("home")}
        />
      )}

      {showListingModal && currentListing && (
        <ListingModal
          listing={currentListing}
          isBooked={currentlyBooked[currentListing.id]}
          isUserListing={
            currentUser && currentListing.userId === currentUser.id
          }
          currentUser={currentUser}
          onBook={() => toggleBooking(currentListing.id)}
          onClose={() => setShowListingModal(false)}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          message={confirmationMessage}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default HomeScreen;
