import React from "react";
import HeroSection from "../../components/home/HeroSection";
import ServicesCard from "../../components/home/ServicesCard";
import KeyFeaturesCard from "../../components/home/KeyFeaturesCard";
import TestimonialCard from "../../components/home/TestimonialCard";
import AboutUs from "../../components/home/AboutUs";
import CarLogoSlider from "../../components/home/LogoSlider";

export default function Home() {
  return (
    <main className="bg-[#f1f8e9] min-h-screen">
      <HeroSection />

      <ServicesCard />

      <KeyFeaturesCard />

      <TestimonialCard />
      
      <AboutUs />

      <CarLogoSlider />

    </main>
  );
}
