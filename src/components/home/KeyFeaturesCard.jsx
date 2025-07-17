import React from "react";
import { motion } from "framer-motion";
import carFront from "../../assets/car_front.png";
import protect from "../../assets/protection.png";
import report from "../../assets/business-report.png";
import engine from "../../assets/engine.png";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const featureBox = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const carImage = {
  hidden: { opacity: 0, x: 50 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 60,
      delay: 0.5
    }
  }
};

const featureBoxes = [
  {
    title: "We Inspect All Brand Cars",
    icon: (
      <img
        src={protect}
        alt="Protection icon"
        className="w-10 h-10 mb-4"
        draggable={false}
      />
    ),
  },
  {
    title: "Get Instant PDI Report",
    icon: (
      <img
        src={report}
        alt="Report icon"
        className="w-10 h-10 mb-4"
        draggable={false}
      />
    ),
  },
  {
    title: "Complete On-Board Diagnostics",
    icon: (
      <img
        src={engine}
        alt="Engine diagnostics icon"
        className="w-10 h-10 mb-4"
        draggable={false}
      />
    ),
  },
];

export default function KeyFeaturesCard() {
  return (
    <motion.section 
      className="w-full bg-[#F1FFE0] py-12 px-4 sm:px-6 md:px-12 lg:px-24 font-sans"
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
      
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {/* ───── LEFT SECTION ───── */}
        <motion.div 
          className="flex-1 w-full text-center lg:text-center"
          variants={container}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black leading-tight mb-10"
            variants={item}
          >
            SPECIALISED IN NEW & USED <br className="lg:hidden" />
            CAR INSPECTION.
          </motion.h2>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6"
            variants={container}
          >
            {featureBoxes.map(({ title, icon }, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center relative group cursor-pointer"
                variants={featureBox}
                whileHover={{ scale: 1.05 }}
              >
                {icon}
                {/* Offset green background */}
                <motion.div
                  className="
                    absolute
                    top-16
                    left-2
                    w-[250px]
                    h-[80px]
                    bg-green-500
                    rounded-xl
                  "
                  initial={{ x: 0, y: 0 }}
                  whileHover={{ x: 4, y: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {/* Black box on top */}
                <motion.div
                  className="
                    relative
                    bg-black
                    border-2
                    border-black
                    rounded-xl
                    text-white
                    w-[250px]
                    h-[80px]
                    flex
                    items-center
                    justify-center
                    text-center
                  "
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-sm font-medium leading-tight px-3">
                    {title}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ───── RIGHT SECTION ───── */}
        <motion.div 
          className="flex flex-col items-center justify-center w-full lg:w-[50%]"
          variants={container}
        >
          <motion.h4 
            className="text-green-500 font-extrabold uppercase text-lg mb-4 text-center"
            variants={item}
          >
            OUR EXPERTISE
          </motion.h4>

          <motion.div 
            className="flex flex-wrap justify-center gap-10 text-center text-sm font-bold text-black mb-4"
            variants={container}
          >
            <motion.div variants={item}>• Professional <br /> Engineers</motion.div>
            <motion.div variants={item}>• Affordable <br /> Pricing</motion.div>
            <motion.div variants={item}>• On‑Site <br /> Inspection</motion.div>
          </motion.div>

          <motion.img
            src={carFront}
            alt="Front view car"
            className="w-56 sm:w-60 md:w-72 lg:w-80 h-auto select-none"
            draggable={false}
            variants={carImage}
            whileHover={{ 
              rotate: [0, -2, 2, -2, 0],
              transition: { duration: 0.6 }
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}