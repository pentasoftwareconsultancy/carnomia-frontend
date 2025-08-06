import React from "react";
import { motion } from "framer-motion";
import aboutImg from "../../assets/logos/aboutImg.png";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.8,
    },
  },
};

const imageAnim = {
  hidden: { opacity: 0, x: 50, rotate: -5 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 10,
      delay: 0.5,
    },
  },
  hover: {
    scale: 1.05,
    rotate: -2,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

export default function AboutUs() {
  return (
    <div className="bg-[#f1f8e9] py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        About Us
      </h2>
      <div className="mx-4 sm:mx-6 md:mx-12 lg:mx-16">
        <motion.section
          className="bg-black rounded-2xl w-full px-4 sm:px-6 md:px-12 lg:px-16 py-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <motion.div
              className="text-center md:text-left"
              variants={container}
            >
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#81da5b] mb-6 leading-tight"
                variants={item}
              >
                Who We Are
              </motion.h2>

              <motion.p
                className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4"
                variants={item}
              >
                <span className="font-semibold text-[#81da5b]">Drivesta</span>{" "}
                is India's most trusted Pre‑Delivery Inspection (PDI) platform.
                We ensure that your new or used car is mechanically and
                aesthetically flawless before it reaches you.
              </motion.p>

              <motion.p
                className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4"
                variants={item}
              >
                Our certified technicians and tech‑driven model deliver
                comprehensive reports backed with real‑time photo and video
                evidence—giving buyers complete confidence.
              </motion.p>

              <motion.p
                className="text-gray-300 text-base sm:text-lg leading-relaxed"
                variants={item}
              >
                We operate across multiple cities and dealerships, offering
                fast, affordable, and professional PDI services to protect your
                investment and peace of mind.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex justify-center md:justify-end"
              variants={imageAnim}
              whileHover="hover"
            >
              <div className="relative group cursor-pointer">
                <motion.img
                  src={aboutImg}
                  alt="About Drivesta"
                  className="w-full max-w-sm sm:max-w-md md:max-w-full
                             h-auto rounded-xl shadow-lg object-cover"
                  variants={imageAnim}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
