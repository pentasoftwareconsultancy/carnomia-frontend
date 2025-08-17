import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import termsData from "../../components/constants/publicData/termsData";

const Terms = () => {
  return (
    <div className="bg-primary min-h-screen font-sans text-gray-800">
      {/* Header */}
      <motion.header
        className="bg-black py-12 px-4 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm text-gray-300">Effective Date: 21/05/2025</p>
        <h1 className="text-button text-3xl md:text-4xl font-bold mt-2">
          Terms and Conditions
        </h1>
        <p className="text-gray-300 text-sm mt-2">Welcome to Carnomia.com.</p>
      </motion.header>
      {/* Main Content */}
      <div className="flex justify-center py-10 px-4">
        <div className="bg-white border-4 border-white max-w-5xl w-full rounded-xl shadow-md p-6 md:p-10 space-y-6 text-sm md:text-base">
          <motion.p
            className="font-body text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            By accessing or using our website and services, you agree to the
            terms outlined below. Please read them carefully.
          </motion.p>

          {termsData.map((section, index) => (
            <TermSection
              key={index}
              title={section.title}
              content={section.content}
              list={section.list}
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TermSection = ({ title, content, list, delay }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="border border-button rounded-md p-5 shadow-sm bg-white"
    >
      <h2 className="text-base md:text-lg font-bold text-button mb-2">
        {title}
      </h2>
      {content && <p className="text-gray-700 mb-2">{content}</p>}
      {list && (
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Terms;
