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
  const adminRoles = ["admin", "superadmin"];

  if (adminRoles.includes(user.role)) {
    // Admin or Superadmin
    navigate("/request?isAdm=true");
  } else if (user.role === "engineer") {
    // Engineer restricted
    toast.error("You are not allowed to create a new request.");
  } else {
    // Normal customer
    navigate("/request");
  }
}
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
        src={herovideo}
      />

      <div className="absolute inset-0 flex flex-col justify-between items-center text-center px-4 py-10">
        <h1 className="text-white text-2xl md:text-4xl font-heading-bold italic">
          We Inspect Before You Invest!
        </h1>

        <>
          <style>{`
    @keyframes shine {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .button-bg {
      background: conic-gradient(
        from 0deg,
        #F5F5F7,
        #000,
        #000,
        #F5F5F7,
        #000,
        #000,
        #000,
        #F5F5F7
      );
      background-size: 300% 300%;
      animation: shine 6s ease-out infinite;
    }
  `}</style>

          <div className="button-bg rounded-full p-[2px] mb-6 hover:scale-105 transition duration-300 active:scale-100">
            <button
              onClick={handleBookPDI}
              className="bg-button hover:bg-[#88cc6b] text-white px-6 py-3 rounded-full text-lg font-medium w-full transition duration-300"
            >
              Book Your PDI
            </button>
          </div>
        </>
      </div>
    </section>
  );
}
