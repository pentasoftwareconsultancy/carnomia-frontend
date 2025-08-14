import React from "react";

function TestimonialCard() {
  // Renamed the component to avoid naming conflict
  const feedbackData = [
    {
      name: "Priti Tole",
      feedback:
        "Their detailed inspection helped me avoid future repair costs. The report was thorough and easy to understand.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "Sahil Theurkar",
      feedback:
        "Loved how professional and transparent the service was. From tyre checks to engine status, everything was covered.",
      stars: 4,
      img: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    {
      name: "Onkar Basawane",
      feedback:
        "Quick booking, on-time visit, and a full report by evening. I'd definitely recommend Carnomia to anyone buying a new car.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    {
      name: "Saideep Gopale",
      feedback:
        "Super smooth experience! The engineer explained everything clearly, and I felt confident driving out of the dealership.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    {
      name: "Anjali Patil",
      feedback:
        "Carnomia made my first car purchase stress-free. Their attention to detail is unmatched. Highly recommended!",
      stars: 5,
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Shubham Shelke",
      feedback:
        "I was impressed by how easy it was to schedule an inspection. The team was punctual and knowledgeable.",
      stars: 4,
      img: "https://randomuser.me/api/portraits/men/40.jpg",
    },
    {
      name: "Pratiksha Patil",
      feedback:
        "Very professional and detailed inspection. Gave me full confidence in the vehicle I was about to buy.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      name: "Tanmay Yelwande",
      feedback:
        "Excellent service! The checklist covered areas I hadn’t even considered. 10/10 would use again.",
      stars: 5,
      img: "https://randomuser.me/api/portraits/men/63.jpg",
    },
  ];

  const Testimonials = ({ item }) => (
    <div className="p-4 rounded-2xl mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-primary border border-button">
      <div className="flex gap-2 items-center">
        <img
          className="size-11 rounded-full border-2 border-white ring-2 ring-yellow-400"
          src={item.img}
          alt="User"
        />
        <div className="flex flex-col">
          <p className="font-body text-gray-800">{item.name}</p>
          <div className="text-yellow-500 text-sm">
            {"★".repeat(item.stars)}
            {"☆".repeat(5 - item.stars)}
          </div>
        </div>
      </div>
      <p className="text-sm py-4 text-gray-600 leading-relaxed">
        {item.feedback}
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 12s linear infinite;
        }
      `}</style>

      <section className="bg-primary py-12">
        <h2 className="text-2xl  font-heading text-center mb-10 text-gray-800">
          What Our Customers Say
        </h2>

        <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#f1f8e9] to-transparent"></div>
          <div className="marquee-inner flex transform-gpu min-w-[200%] pt-6 pb-5">
            {[...feedbackData].map((item, index) => (
              <Testimonials key={index} item={item} />
            ))}
          </div>
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-[#f1f8e9] to-transparent"></div>
        </div>
      </section>
    </>
  );
}

export default TestimonialCard;
