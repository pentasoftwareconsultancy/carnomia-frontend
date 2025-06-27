import React from "react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "New Car PDI",
    path: "/book/new-pdi",
    image:
      "https://stimg.cardekho.com/images/carexteriorimages/630x420/Hyundai/Creta/8667/1744607863052/front-left-side-47.jpg?tr=w-664",
  },
  {
    title: "Used Car PDI",
    path: "/book/used-pdi",
    image:
      "https://stimg.cardekho.com/images/car-images/large/Honda/Honda-City-2011-2013/2754/front-left-side-47.jpg?tr=w-300",
  },
];

export default function ServicesCard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto px-4 py-10">
      {services.map((service, index) => (
        <div
          key={index}
          role="article"
          className="bg-black text-white rounded-2xl overflow-hidden shadow-md flex flex-col transition-transform hover:scale-[1.02]"
        >
          {/* Image */}
          <div className="h-48 w-full md:h-56">
            <img
              src={service.image}
              alt={service.title || "PDI Service"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + Button */}
          <div className="flex flex-col flex-grow items-center justify-between p-6">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-center">
              {service.title}
            </h3>
            <Link
              to={service.path}
              className="mt-auto inline-block bg-gradient-to-r from-green-300 to-green-600 text-black font-semibold px-6 py-2 rounded-full text-sm shadow hover:from-green-200 hover:to-green-200 transition-all duration-300"
              aria-label={`Book ${service.title}`}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
