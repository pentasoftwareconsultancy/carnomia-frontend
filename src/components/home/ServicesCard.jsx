import React from "react";
import { Link } from "react-router-dom";

const services = [
{
title: "New Car PDI",
path: "/request",
image:
"https://cdn.cars24.com/prod/auto-news24-cms/CARS24-Blog-Images/2025/06/20/1d46bb81-c4c1-453d-b591-d68537c85718-pdi-revamped-.jpg",
},
{
title: "Used Car PDI",
path: "/request",
image:
"https://d2hucwwplm5rxi.cloudfront.net/wp-content/uploads/2023/11/28065423/car-inspection-_-Body-1-28-11-23-1024x640.jpg",
},
];

export default function ServicesCard() {
return (
<div className="bg-primary py-16 px-4 sm:px-6 lg:px-8">
<div className="max-w-7xl mx-auto">

<h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
Our Services
</h2>

    {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {services.map((service, index) => (
        <div
          key={index}
          className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        >
          <div className="absolute inset-0 bg-black/50 p-8 flex flex-col justify-end text-white">
            <h3 className="text-2xl font-body mb-4">{service.title}</h3>
            <Link
              to={service.path}
              className="bg-button cursor-pointer text-white px-6 py-2 rounded-md w-fit text-sm font-body transition"
              aria-label={`Book ${service.title}`}
            >
              Book Your PDI Now
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
);
}

