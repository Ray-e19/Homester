// Full restored ProfilePage.jsx with liked listings, message center, and manage listings
// Replies now appear properly in the Sent and Received tabs too

import { useEffect, useState } from "react";
import axios from "axios";
import NewListingForm from "./NewListingForm";

const ProfilePage = ({ currentUser, liked, listings, showListingDetails }) => {
  const renderRepliesFor = (msgId) => {
    return messages
      .filter((m) => m.replyToId === msgId)
      .map((rep) => (
        <div key={rep.id} className="ml-4 mt-2 p-2 bg-gray-600 rounded">
          <p className="text-sm text-white">{rep.message}</p>
          <p className="text-xs text-gray-400">
            Reply: {new Date(rep.datetime).toLocaleString()}
          </p>
        </div>
      ));
  };

  const [messages, setMessages] = useState([]);
  const [showListingForm, setShowListingForm] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [showReceivedMessages, setShowReceivedMessages] = useState(true);
  const [replies, setReplies] = useState({});
  const [softConfirmed, setSoftConfirmed] = useState({});

  const fetchMessages = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/messages/${currentUser.id}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentUser]);

  const likedListings = listings.filter((l) => liked[l.id]);
  const userListings = listings.filter((l) => l.userId === currentUser?.id);

  const filteredMessages = messages.filter((msg) => {
    if (showReceivedMessages) {
      const isOwnerOfHouse = listings.find(
        (l) => l.id === msg.houseId && l.userId === currentUser.id
      );
      const isReplyToMe = messages.find(
        (parent) =>
          parent.id === msg.replyToId && parent.userId === currentUser.id
      );
      return (
        (isOwnerOfHouse && msg.userId !== currentUser.id) ||
        (msg.replyToId && isReplyToMe)
      );
    } else {
      return msg.userId === currentUser.id;
    }
  });

  const handleReplySend = async (msgId, text) => {
    const original = messages.find((m) => m.id === msgId);
    const replyMessage = {
      type: "contact",
      houseId: original.houseId,
      userId: currentUser.id,
      message: text,
      datetime: new Date().toISOString(),
      replyToId: msgId,
    };
    await axios.post("http://localhost:8080/messages", replyMessage);
    setReplies((prev) => ({ ...prev, [msgId]: undefined }));
    setMessages((prev) => [...prev, { ...replyMessage, id: Date.now() }]);
  };

  const handleConfirm = (msgId) => {
    setSoftConfirmed((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleNewListingSubmit = (newListing) => {
    setShowListingForm(false);
    alert("Listing created successfully!");
  };

  const handleToggleListingForm = () => {
    setShowListingForm((prev) => !prev);
    if (!showListingForm) setShowMyListings(false);
  };

  const handleToggleMyListings = () => {
    setShowMyListings((prev) => !prev);
    if (!showMyListings) setShowListingForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Welcome, {currentUser?.username}
      </h1>

      {/* Liked Listings */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          ❤️ Liked Listings
        </h2>
        {likedListings.length === 0 ? (
          <p className="text-gray-400">You haven’t liked any listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {likedListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:ring hover:ring-blue-400"
                onClick={() => showListingDetails(listing.id)}
              >
                <img
                  src={
                    listing.images?.[0] ||
                    "https://placehold.co/400x200?text=No+Image"
                  }
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold text-white">
                  {listing.title}
                </h3>
                <p className="text-sm text-gray-300">{listing.address}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Messages */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-400">
            {showReceivedMessages ? "📩 Received Messages" : "📤 Sent Messages"}
          </h2>
          <button
            onClick={() => setShowReceivedMessages(!showReceivedMessages)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            {showReceivedMessages ? "Show Sent" : "Show Received"}
          </button>
        </div>
        {filteredMessages.length === 0 ? (
          <p className="text-gray-400">No messages found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredMessages.map((msg, i) => {
              const address = msg.houseId
                ? `House ID: ${msg.houseId}`
                : "[Unknown House ID]";
              const isConfirmed = softConfirmed[msg.id];
              return (
                <li key={msg.id || i} className="bg-gray-700 p-4 rounded">
                  <div>
                    <p className="text-sm text-gray-300 mb-1">
                      <span className="font-bold">
                        {msg.type === "tour"
                          ? "Tour Request"
                          : "Contact Message"}
                      </span>{" "}
                      for {address}
                    </p>
                    {msg.type === "tour" ? (
                      <p className="text-white">
                        Requested for {msg.requestedDate} at {msg.requestedTime}
                      </p>
                    ) : (
                      <p className="text-white">{msg.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Sent:{" "}
                      {new Date(msg.createdAt || msg.datetime).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <button
                        onClick={() => showListingDetails(msg.houseId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View Listing
                      </button>
                      {showReceivedMessages && msg.type === "tour" && (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                            onClick={() => handleConfirm(msg.id)}
                          >
                            Confirm
                          </button>
                          <button
                            className={`bg-red-500 text-white px-3 py-1 rounded text-sm transition-opacity duration-300 ${
                              isConfirmed
                                ? "opacity-30 hover:opacity-100"
                                : "hover:bg-red-600"
                            }`}
                            onClick={() =>
                              setSoftConfirmed((prev) => ({
                                ...prev,
                                [msg.id]: false,
                              }))
                            }
                          >
                            Deny
                          </button>
                        </>
                      )}
                      {showReceivedMessages && msg.type === "contact" && (
                        <button
                          onClick={() =>
                            setReplies((prev) => ({ ...prev, [msg.id]: "" }))
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                    {replies[msg.id] !== undefined && (
                      <div className="mt-2">
                        <textarea
                          rows="2"
                          value={replies[msg.id]}
                          onChange={(e) =>
                            setReplies((prev) => ({
                              ...prev,
                              [msg.id]: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-600 text-white rounded p-2 mb-2"
                        ></textarea>
                        <button
                          onClick={() =>
                            handleReplySend(msg.id, replies[msg.id])
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Send Reply
                        </button>
                      </div>
                    )}
                    {renderRepliesFor(msg.id)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Manage Listings */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-400">
            🏠 Manage Listings
          </h2>
          <div className="space-x-2">
            {!showMyListings && (
              <button
                onClick={handleToggleListingForm}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {showListingForm ? "Cancel" : "New Listing"}
              </button>
            )}
            {!showListingForm && (
              <button
                onClick={handleToggleMyListings}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                {showMyListings ? "Hide My Listings" : "My Listings"}
              </button>
            )}
          </div>
        </div>

        {showListingForm && (
          <NewListingForm
            currentUser={currentUser}
            onSubmit={handleNewListingSubmit}
            onCancel={() => setShowListingForm(false)}
          />
        )}

        {showMyListings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {userListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:ring hover:ring-blue-400"
                onClick={() => showListingDetails(listing.id)}
              >
                <img
                  src={
                    listing.images?.[0] ||
                    "https://placehold.co/400x200?text=No+Image"
                  }
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h3 className="text-lg font-semibold text-white">
                  {listing.title}
                </h3>
                <p className="text-sm text-gray-300">{listing.address}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
