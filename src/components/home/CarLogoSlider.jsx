import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const carBrands = [
  "/logos/honda.png",
  "/logos/toyota.png",
  "/logos/bmw.png",
  "/logos/audi.png",
  "/logos/mahindra.png",
  "/logos/hyundai.png",
  "/logos/tesla.png",
];

export default function CarLogoSlider() {
  return (
    <div className="px-6 py-12 bg-gray-100">
      <h3 className="text-2xl text-center font-bold mb-6">Our Trusted Brands</h3>
      <Swiper
        spaceBetween={30}
        slidesPerView={4}
        loop={true}
        autoplay={{ delay: 2000 }}
        className="max-w-5xl mx-auto"
      >
        {carBrands.map((src, i) => (
          <SwiperSlide key={i}>
            <img src={src} alt="Brand" className="w-24 h-12 object-contain mx-auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
