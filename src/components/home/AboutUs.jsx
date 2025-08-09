import React from "react";
import aboutImg from "../../assets/about-image.jpg";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <h2 className="text-2xl  font-bold text-center mb-10 text-gray-800">
          About Us
      </h2>

      <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 bg-[#f1f8e9] py-16">
        {/* Image Section */}
        <div className="relative shadow-2xl shadow-green-600 rounded-2xl overflow-hidden shrink-0">
          <img
            className="max-w-md w-full object-cover rounded-2xl"
            src={aboutImg}
            alt="About Drivesta"
          />
          <div className="flex items-center gap-1 max-w-72 absolute bottom-8 left-8 bg-white p-4 rounded-xl">
            <div className="flex -space-x-4 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="team"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-1"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="team"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[2]"
              />
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="team"
                className="size-9 rounded-full border-[3px] border-white hover:-translate-y-1 transition z-[3]"
              />
              <div className="flex items-center justify-center text-xs text-white size-9 rounded-full border-[3px] border-white bg-[#81da5b] hover:-translate-y-1 transition z-[4]">
                50+
              </div>
            </div>
            <p className="text-sm font-medium text-slate-800">
              Trusted by 50+ technicians
            </p>
          </div>
        </div>

        {/* Text Section */}
        <div className="text-sm text-slate-600 max-w-lg px-2">
          <h1 className="text-xl uppercase font-semibold text-slate-700">
            Who we are?
          </h1>
          <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-[#81da5b] to-white"></div>
          <p className="mt-8">
            <strong className="text-[#81da5b]">Drivesta</strong> is India's most trusted Pre‑Delivery Inspection (PDI) platform. We ensure your new or used car is mechanically and aesthetically flawless before it reaches you.
          </p>
          <p className="mt-4">
            Our certified technicians and tech‑driven model deliver comprehensive reports backed with real‑time photo and video evidence—giving buyers complete confidence.
          </p>
          <p className="mt-4">
            We operate across multiple cities and dealerships, offering fast, affordable, and professional PDI services to protect your investment and peace of mind.
          </p>
          <Link to="/about-us">
          <button className="flex items-center gap-2 mt-8 hover:-translate-y-0.5 transition bg-[#81da5b] py-3 px-8 rounded-full text-white">
            <span>Read more</span>
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                fill="#fff"
              />
            </svg>
          </button>
          </Link>
        </div>
      </section>
    </>
  );
}
