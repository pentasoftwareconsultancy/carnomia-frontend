import React from "react";
import HeroSection from "../../components/home/HeroSection";
import ServicesCard from "../../components/home/ServicesCard";
import KeyFeaturesCard from "../../components/home/KeyFeaturesCard";
import TestimonialCard from "../../components/home/TestimonialCard";
import AboutUs from "../../components/home/AboutUs";
import CarLogoSlider from "../../components/home/LogoSlider";

export default function Home() {
  return (
    <main className="bg-[#F1FFE0] min-h-screen">
      <HeroSection />

      <ServicesCard />

      <KeyFeaturesCard />

      <TestimonialCard />

      <section className="py-16 px-4 bg-[#F1FFE0]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
            About Us
          </h2>
          <AboutUs />
        </div>
      </section>

      {/* 🚘 Car Brand Logos */}
      <section className="py-12 px-4 bg-[#F1FFE0]">
        <div className="max-w-7xl mx-auto">
          <CarLogoSlider />
        </div>
      </section>
    </main>
  );
}
