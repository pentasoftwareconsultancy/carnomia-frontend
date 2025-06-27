import React from "react";

const features = [
{ title: "Verified Technicians", icon: "✅" },
{ title: "100+ Inspection Points", icon: "📋" },
{ title: "Quick Turnaround", icon: "⏱️" },
{ title: "Photo/Video Proof", icon: "📸" },
];

export default function KeyFeaturesCard() {
return (
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-12">
{features.map((item, i) => (
<div key={i} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition" >
<div className="bg-green-100 text-green-600 w-16 h-16 flex items-center justify-center rounded-full text-3xl mb-4">
{item.icon}
</div>
<h4 className="font-semibold text-lg text-gray-800">{item.title}</h4>
</div>
))}
</div>
);
}

