import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "./Header";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import NewUserForm from "./NewUserForm";
import NewListingForm from "./NewListingForm";
import LoginForm from "./LoginForm";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/houses");
        setListings(response.data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        setListings([]);
      }

      const savedUser = localStorage.getItem("homester-user");
      const savedBookings = localStorage.getItem("homester-bookings");

      setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
      setCurrentlyBooked(savedBookings ? JSON.parse(savedBookings) : {});
    };

    fetchData();
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

  const addNewListing = (newListing) => {
    setListings((prev) => [newListing, ...prev]);
    navigateTo("home");
    setConfirmationMessage("Listing added!");
    setShowConfirmation(true);
  };

  const deleteListing = (id) => {
    const updated = listings.filter((l) => l.id !== id);
    setListings(updated);
    localStorage.setItem("homester-listings", JSON.stringify(updated)); // You can remove this if you don't want backup
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

      {activePage === "login" && (
        <LoginForm
          onLogin={(user) => {
            localStorage.setItem("homester-user", JSON.stringify(user));
            setCurrentUser(user);
            navigateTo("home");
            setConfirmationMessage("Login successful!");
            setShowConfirmation(true);
          }}
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
