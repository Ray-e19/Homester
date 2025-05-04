// --- NavBar.jsx ---
import React from "react";

const NavBar = ({ currentUser, navigateTo, logout }) => {
  return (
    <nav className="bg-gray-800 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => navigateTo("home")}
        >
          Homester
        </h1>
        <ul className="flex space-x-8 items-center">
          {currentUser && (
            <li>
              <span className="text-blue-400">
                Hi, {currentUser.name || currentUser.username}!
              </span>
            </li>
          )}

          {!currentUser && (
            <li>
              <button
                onClick={() => navigateTo("new-user")}
                className="text-lg text-gray-300 hover:text-blue-500"
              >
                New User
              </button>
            </li>
          )}
          {!currentUser && (
            <li>
              <button
                onClick={() => navigateTo("login")}
                className="text-lg text-gray-300 hover:text-blue-500"
              >
                Login
              </button>
            </li>
          )}

          {currentUser && (
            <li>
              <button
                onClick={() => navigateTo("profile")}
                className="text-lg text-gray-300 hover:text-blue-500"
              >
                Profile
              </button>
            </li>
          )}

          {currentUser && (
            <li>
              <button
                onClick={logout}
                className="text-lg text-gray-300 hover:text-blue-500"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
