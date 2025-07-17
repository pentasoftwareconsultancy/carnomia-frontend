import React from "react";

const locations = [
  "Pune", "Kothrud", "Hadapsar", "Viman Nagar",
  "Baner", "Wakad", "Hinjewadi", "Pimple Saudagar",
  "Kharadi", "Magarpatta", "Aundh", "Deccan", "Swargate"
];

export default function LocationTicker() {
  const allLocations = [...locations, ...locations]; // repeat for loop effect

  return (
    <div className="w-full bg-[#F1FFE0] overflow-hidden text-sm text-black py-2">
      <div className="location-marquee whitespace-nowrap flex space-x-6 px-6">
        {allLocations.map((loc, index) => (
          <span key={index} className="inline-block px-2">
            {loc}
          </span>
        ))}
      </div>
    </div>
  );
}
