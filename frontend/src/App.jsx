import React from "react";
import HomeScreen from "./components/HomeScreen";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow">
        <HomeScreen />
      </main>
    </div>
  );
}
