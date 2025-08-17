import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import privacyData from "../../components/constants/publicData/privacyData";

const PrivacyPolicy = () => {
  return (
    <div className="bg-primary min-h-screen font-sans text-regal-blue">
      {/* Header */}
      <motion.div
        className="bg-black py-12 px-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-button text-3xl md:text-4xl font-bold">
          Privacy Policy
        </h1>
        {/* <p className="text-white mt-2 text-sm md:text-base">
          Last updated: July 2025
        </p> */}
      </motion.div>

      {/* Content Wrapper */}
      <div className="flex justify-center px-4 py-10">
        <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full border-4 border-white p-6 md:p-10 space-y-8">
          <motion.p
            className="font-medium text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <strong>At Carnomia</strong>, we value your privacy and are
            committed to protecting your personal information. This Privacy
            Policy outlines how we collect, use, store, and protect your data
            when you interact with our website, services, or customer support.
          </motion.p>

          {/* privacyData */}
          {privacyData.map((section, i) => (
            <Section
              key={i}
              number={section.number}
              content={section.content}
              list={section.list}
              delay={0.2 + i * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Section = ({ number, content, list, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-6 rounded-md shadow-md border border-button"
    >
      <h2 className="text-base md:text-lg font-bold text-button mb-2">
        {number}
      </h2>
      <p className="text-regal-blue text-sm md:text-base mb-3">{content}</p>
      {list && (
        <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-regal-blue">
          {list.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </motion.section>
  );
};

export default PrivacyPolicy;
