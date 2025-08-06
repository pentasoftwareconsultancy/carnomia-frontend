import React from "react";
import { Link, useNavigate } from "react-router-dom";
import herovideo from "../../assets/banners/herovideo1.mp4";
import { useAuth } from "../../core/contexts/AuthContext";
import { toast } from "react-toastify";

export default function HeroSection() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleBookPDI = (e) => {
    e.preventDefault();

    if (!isLoggedIn || !user) {
      toast.info("Please login to book your PDI.");
      navigate("/login");
    } else {
      navigate("/request");
    }
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black">
      
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover" src={herovideo} />
      
      <div className="absolute inset-0 flex flex-col justify-between items-center text-center px-4 py-10">
        
        <h1 className="text-white text-2xl md:text-4xl font-semibold italic">
          We Inspect Before You Invest!
        </h1>

        <button
          onClick={handleBookPDI}
          className="bg-[#81da5b] cursor-pointer text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#88cc6b] transition duration-300 mb-6"
        >
          Book Your PDI
        </button>
      </div>
    </section>
  );
}
