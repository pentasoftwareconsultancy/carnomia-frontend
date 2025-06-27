import React from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import drivesta from "../../assets/logos/drivesta2.png";

const locations = [
"Pune", "Kothrud", "Hadapsar", "Viman Nagar",
"Baner", "Wakad", "Hinjewadi", "Pimple Saudagar",
"Kharadi", "Magarpatta", "Aundh", "Deccan", "Swargate",
];

export default function Navbar() {
return (
<header className="w-full z-50 bg-[#F1FFE0] py-2 shadow-md">
<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 gap-3">

    {/* Logo */}
    <Link to="/" className="flex items-center justify-center sm:justify-start">
      <img
        src={drivesta}
        alt="Drivesta Logo"
        className="h-12 sm:h-16 md:h-20 object-contain max-h-[80px]"
      />
    </Link>

    {/* Right side */}
    <div className="flex items-center flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
      
      {/* City Dropdown */}
      <select
        aria-label="Select City"
        className="px-3 py-2 border border-green-400 rounded-md text-sm bg-[#F1FFE0] text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option>Select City</option>
        {locations.map((city, index) => (
          <option key={index} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Login Button */}
      <Link
        to="/login"
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-white hover:text-green-600 border border-green-600 rounded-xl transition"
      >
        <FiUser className="text-lg" />
        <span>Login/SignUp</span>
      </Link>
    </div>
  </div>
</header>
);
}

