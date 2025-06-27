import React from "react";
import aboutImg from "../../assets/logos/drivesta.jpg"; // Replace with your image path

export default function AboutUs() {
return (
<div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
{/* Image Section */}
<div className="w-full">
<img src={aboutImg} alt="About Drivesta" className="rounded-xl shadow-md w-full h-auto object-cover" />
</div>

  {/* Text Section */}
  <div>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      Who We Are
    </h2>
    <p className="text-gray-600 text-base leading-relaxed mb-6">
      Drivesta is your trusted partner in used car inspections. We help
      buyers make informed decisions by offering expert PDI (Pre-Delivery
      Inspection) services. Our certified technicians check every crucial
      aspect of the car before you pay.
    </p>
    <p className="text-gray-600 text-base leading-relaxed">
      We operate in multiple cities with fast turnaround and full
      transparency, providing photo/video proof and digital reports.
    </p>
  </div>
</div>
);
};

