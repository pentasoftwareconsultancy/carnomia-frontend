import React from "react";

const testimonials = [
{
name: "Rahul Mehta",
comment:
"The inspection saved me from buying a faulty car. Highly recommend Drivesta!",
},
{
name: "Anjali Kapoor",
comment:
"Engineer was on time and provided full PDF with all details. Worth the cost!",
},
{
name: "Vikram Shah",
comment:
"Professional and detailed. Trusted their report fully before payment.",
},
];

export default function TestimonialCard() {
return (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-20">
{testimonials.map((t, index) => (
<div key={index} className="bg-white shadow-lg rounded-xl p-6 relative overflow-hidden" >
{/* Quote Icon Background */}
<div className="absolute top-4 left-4 text-4xl text-green-100 opacity-60 pointer-events-none select-none">
“
</div>

      <p className="text-gray-700 mt-4 text-sm md:text-base leading-relaxed">
        {t.comment}
      </p>
      <p className="text-sm font-semibold text-green-600 mt-4 text-right">
        — {t.name}
      </p>
    </div>
  ))}
</div>
);
}