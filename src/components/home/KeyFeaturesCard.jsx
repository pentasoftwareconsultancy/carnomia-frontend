import React from "react";
import { motion } from "framer-motion";
import protect from "../../assets/protection.png";
import report from "../../assets/business-report.png";
import engine from "../../assets/engine.png";
import car from "../../assets/moving-car.mp4";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const featureBox = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 10 },
  },
};

// Features list
const features = [
  { title: "We Inspect All Brand Cars", icon: protect },
  { title: "Get Instant PDI Report", icon: report },
  { title: "Complete On-Board Diagnostics", icon: engine },
];

// Car video section
const CarAnimation = () => {
  return (
<div className="w-full  max-h-[260px] sm:max-h-[350px] my-6 rounded-xl overflow-hidden flex justify-center items-center">

      <video
        className="w-full h-full sm:max-h-[360px] object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={car} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default function KeyFeaturesCard() {
  return (
    <motion.section
      className="w-full bg-secondary py-12 px-4 sm:px-6 md:px-12 lg:px-24 font-sans"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
    >
      <motion.h1
        className="font-extrabold text-4xl text-center mb-8"
        variants={item}
      >
        Key Features
      </motion.h1>

      <motion.div className="text-center" variants={container}>
        <motion.h2
          className="text-2xl sm:text-5xl font-extrabold text-black mb-6"
          variants={item}
        >
          Specialised In New & Used <br className="lg:hidden" /> Car Inspection.
        </motion.h2>
    
        <CarAnimation />

        <div className="flex flex-col sm:flex-row justify-center gap-10 mt-6">
          {features.map(({ title, icon }, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center relative group cursor-pointer"
              variants={featureBox}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={icon}
                alt="icon"
                className="w-10 h-10 mb-4"
                draggable={false}
              />

              <motion.div
                className="absolute top-16 left-2 w-[350px] h-[80px] bg-[#7ED957] rounded-xl"
                initial={{ x: 0, y: 0 }}
                whileHover={{ x: 4, y: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              <motion.div
                className="relative bg-black border-2 border-black rounded-xl text-white w-[350px] h-[80px] flex items-center justify-center text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-sm font-medium leading-tight px-3">
                  {title}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}