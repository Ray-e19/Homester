import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
];

const Header = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full h-[400px] overflow-hidden">
      <img
        src={images[currentImage]}
        alt="Header Background"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ease-in-out"
      />
      <div className="absolute inset-0 bg-black opacity-30 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold text-white">Homester</h1>
        <p className="mt-4 text-xl text-gray-200">Find your perfect home.</p>
      </div>
    </header>
  );
};

export default Header;
