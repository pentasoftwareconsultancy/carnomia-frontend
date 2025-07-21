import React from "react";
import audiLogo from "../../assets/logos/audi-logo.png";
import hyundaiLogo from "../../assets/logos/hyundai-logo.png";
import jaguarLogo from "../../assets/logos/jaguar-logo.png";
import kiaLogo from "../../assets/logos/kia-logo.webp";
import mahindraLogo from "../../assets/logos/mahindra-logo.png";
import mercedesLogo from "../../assets/logos/mercedes-logo.png";
import mgLogo from "../../assets/logos/mg-logo.png";
import skodaLogo from "../../assets/logos/skoda-logo.png";
import tataLogo from "../../assets/logos/tata-logo.png";
import toyotaLogo from "../../assets/logos/toyota-logo.png";
import volkswagenLogo from "../../assets/logos/Volkswagen-logo.png";

const carLogos = [
  { name: "Audi", src: audiLogo },
  { name: "Hyundai", src: hyundaiLogo },
  { name: "Jaguar", src: jaguarLogo },
  { name: "Kia", src: kiaLogo },
  { name: "Mahindra", src: mahindraLogo },
  { name: "Mercedes", src: mercedesLogo },
  { name: "MG", src: mgLogo },
  { name: "Skoda", src: skodaLogo },
  { name: "Tata", src: tataLogo },
  { name: "Toyota", src: toyotaLogo },
  { name: "Volkswagen", src: volkswagenLogo },
];

const LogoSlider = () => {
  const repeatedLogos = [...carLogos, ...carLogos]; // Duplicate for smooth scrolling

  return (
    <div className="w-full overflow-hidden py-12 px-4 bg-[#F1FFE0] ">
      <div className="marquee whitespace-nowrap animate-marquee">
        {repeatedLogos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.name}
            className="w-16 h-16 inline-block mx-6 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
