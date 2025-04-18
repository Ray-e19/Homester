import React, { useState, useEffect } from 'react';
import HomeScreen from './HomeScreen'; // Import the HomeScreen component

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Homester</h1>
          <ul className="flex space-x-8">
            <li>
              <a href="#" className="text-lg text-gray-700 hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-lg text-gray-700 hover:text-blue-500">
                New Listing
              </a>
            </li>
            <li>
              <a href="#" className="text-lg text-gray-700 hover:text-blue-500">
                New User
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <HomeScreen /> {/* Render the HomeScreen component here */}
      </main>
    </div>
  );
}
