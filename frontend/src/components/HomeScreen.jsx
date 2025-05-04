// --- HomeScreen.jsx ---
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
import ProfilePage from "./ProfilePage";

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
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("homester-liked");
    return saved ? JSON.parse(saved) : {};
  });

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

  const toggleLike = async (id) => {
    const updated = { ...liked };
    if (updated[id]) {
      delete updated[id];
    } else {
      updated[id] = true;
    }
    setLiked(updated);
    localStorage.setItem("homester-liked", JSON.stringify(updated));

    if (currentUser) {
      try {
        await axios.post("http://localhost:8080/likes", {
          userId: currentUser.id,
          houseId: id,
        });
      } catch (err) {
        console.error("Failed to sync like:", err);
      }
    }
  };

  const saveMessage = async (messageData) => {
    try {
      await axios.post("http://localhost:8080/messages", messageData);
      setConfirmationMessage("Message sent!");
      setShowConfirmation(true);
    } catch (err) {
      console.error("Failed to send message:", err);
      setConfirmationMessage("Failed to send message");
      setShowConfirmation(true);
    }
  };

  const navigateTo = (page) => setActivePage(page);

  const handleSearch = () => {
    setConfirmationMessage(`Search: ${searchQuery}`);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <NavBar
        currentUser={currentUser}
        navigateTo={navigateTo}
        logout={() => {
          setCurrentUser(null);
          localStorage.removeItem("homester-user");
          setActivePage("home");
          setConfirmationMessage("Logged out.");
          setShowConfirmation(true);
        }}
      />

      {activePage === "home" && (
        <HomePage
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          listings={listings}
          currentUser={currentUser}
          currentlyBooked={currentlyBooked}
          showListingDetails={(id) => {
            const listing = listings.find((l) => l.id === id);
            if (listing) {
              setCurrentListing(listing);
              setShowListingModal(true);
            }
          }}
          deleteListing={(id) => {
            const updated = listings.filter((l) => l.id !== id);
            setListings(updated);
          }}
          liked={liked}
          toggleLike={toggleLike}
        />
      )}

      {currentUser && activePage === "new-listing" && (
        <NewListingForm
          onSubmit={(newListing) => {
            setListings([...listings, newListing]);
            navigateTo("home");
            setConfirmationMessage("New listing added!");
            setShowConfirmation(true);
          }}
          onCancel={() => navigateTo("home")}
        />
      )}

      {activePage === "new-user" && (
        <NewUserForm
          onCreateUser={(user) => {
            localStorage.setItem("homester-user", JSON.stringify(user));
            setCurrentUser(user);
            navigateTo("home");
            setConfirmationMessage("User created!");
            setShowConfirmation(true);
          }}
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

      {currentUser && activePage === "profile" && (
        <ProfilePage
          currentUser={currentUser}
          liked={liked}
          listings={listings}
          showListingDetails={(id) => {
            const listing = listings.find((l) => l.id === id);
            if (listing) {
              setCurrentListing(listing);
              setShowListingModal(true);
            }
          }}
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
          liked={liked}
          toggleLike={toggleLike}
          onSaveMessage={saveMessage}
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
