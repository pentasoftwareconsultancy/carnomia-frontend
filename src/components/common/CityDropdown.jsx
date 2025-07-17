import React, { useState, useRef, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const locations = [
  "Aundh", "Baner", "Balewadi", "Bavdhan", "Bibwewadi", "Boat Club Road",
  "Camp", "Chinchwad", "Dhanori", "Dhankawadi", "Erandwane", "Fatima Nagar",
  "Hadapsar", "Hinjewadi", "Kalyani Nagar", "Karve Nagar", "Kharadi",
  "Kondhwa", "Koregaon Park", "Kothrud", "Lohegaon", "Magarpatta", "Moshi",
  "Mundhwa", "NIBM Road", "Nigdi", "Pashan", "Paud Road", "Pimple Gurav",
  "Pimple Nilakh", "Pimple Saudagar", "Sadashiv Peth", "Salunke Vihar",
  "Satara Road", "Shivajinagar", "Sinhagad Road", "Sus Road", "Swargate",
  "Tingre Nagar", "Viman Nagar", "Wadgaon Sheri", "Wakad", "Warje", "Yerawada"
];

export default function CityDropdown() {
  const [selectedCity, setSelectedCity] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLocations = locations.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 shadow"
      >
        {selectedCity || "Choose City"}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="ml-1">
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-72 max-h-[300px] z-50 bg-white border border-green-300 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Search */}
            <div className="p-3 border-b border-green-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              </div>
            </div>

            {/* City List */}
            <div className="max-h-[220px] overflow-y-auto scrollbar-hide px-3 py-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((city) => (
                  <div
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer text-sm ${
                      selectedCity === city
                        ? "bg-green-100 text-green-800 font-semibold"
                        : "hover:bg-green-50"
                    }`}
                  >
                    {city}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-sm py-6">
                  No cities found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
