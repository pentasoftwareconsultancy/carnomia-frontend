import React from "react";

function TestimonialCard() {
  const feedbackData = [
    {
      name: "Priti Tole",
      feedback:
        "Their detailed inspection helped me avoid future repair costs. The report was thorough and easy to understand.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Saideep Gopale",
      feedback:
        "Loved how professional and transparent the service was. From tyre checks to engine status, everything was covered.",
      stars: 4,
      img: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    {
      name: "Onkar Basawane",
      feedback:
        "Quick booking, on-time visit, and a full report by evening. I'd definitely recommend Drivesta to anyone buying a new car.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Sahil Theurkar",
      feedback:
        "Super smooth experience! The engineer explained everything clearly, and I felt confident driving out of the dealership.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
  ];

  return (
    <section className="w-full bg-[#f1f8e9] px-4 sm:px-6 md:px-16 py-16">
   <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {feedbackData.map(({ name, feedback, stars, img }, idx) => (
          <div
            key={idx}
            className="bg-black text-white rounded-2xl p-6 border border-[#ffd95c] hover:border-yellow-400 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            {/* avatar + name */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={img}
                alt={name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-yellow-400 hover:scale-105 transition-transform duration-300"
              />
              <h4 className="font-semibold text-base">{name}</h4>
            </div>

            {/* testimonial */}
            <p className="text-sm text-gray-200 mb-3 leading-relaxed">
              {feedback}
            </p>

            {/* star rating */}
            <div className="text-yellow-400 text-lg hover:animate-pulse">
              {"★".repeat(stars) + "☆".repeat(5 - stars)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TestimonialCard;