import React from "react";

const cities = [
"Pune", "Kothrud", "Hadapsar", "Viman Nagar",
"Baner", "Wakad", "Hinjewadi", "Pimple Saudagar",
"Kharadi", "Magarpatta", "Aundh", "Deccan", "Swargate",
];

export default function LocationTicker() {
const allCities = [...cities, ...cities]; // repeat for smooth loop

return (
<div className="bg-[#F1FFE0] overflow-hidden">
<div className="marquee flex space-x-8 text-sm text-gray-800 font-medium w-max">
{allCities.map((city, index) => (
<span key={index}>{city}</span>
))}
</div>
</div>
);
}

