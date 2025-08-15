import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

          {sections.map((section, index) => (
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
      <h2 className="text-base md:text-lg font-body text-gray-800 mb-2">
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

const sections = [
  {
    title: "Service Overview",
    content:
      "Carnomia offers Pre-Delivery Inspection (PDI) services for new and used cars across selected cities in India. Our services include on-site inspections, digital reports, and consultation before a vehicle is purchased.",
  },
  {
    title: "Booking and Scheduling",
    list: [
      "Users must provide accurate information about the vehicle, seller location, and preferred inspection time.",
      "Carnomia reserves the right to reschedule or cancel a booking due to unforeseen circumstances (e.g., weather, unavailability, etc.).",
      "On-site inspections depend on access being granted by the vehicle owner or dealership.",
    ],
  },
  {
    title: "Payment Terms",
    list: [
      "You only pay after the inspection is complete and the digital report has been delivered.",
      "Payment must be made through the modes available on the platform (UPI, Cash etc.).",
      "No refund is applicable once the report is delivered unless there is a proven error in the service.",
    ],
  },
  {
    title: "Scope of Inspection",
    list: [
      "Carnomia inspections are visual and tool-based checks. We do not dismantle or open parts of the vehicle.",
      "The report is advisory in nature and is not a certification of the car’s legal ownership, insurance status, or registration.",
      "Our findings are based on the vehicle condition at the time of inspection only.",
    ],
  },
  {
    title: "User Responsibilities",
    list: [
      "You are responsible for ensuring access to the vehicle at the scheduled time.",
      "You must ensure the vehicle is located in a safe and accessible environment for inspection.",
      "Carnomia is not responsible for any delays or incomplete checks due to denied access.",
      "If car is not available for inspection within 30 minutes from the scheduled time then you have to pay Rs.500 visiting charges and engineer will move forward to next location.",
    ],
  },
  {
    title: "Liability Disclaimer",
    list: [
      "Carnomia is not liable for any loss, damage, or costs incurred as a result of using our inspection service or relying solely on the report.",
      "We do not guarantee the future performance of the vehicle or detect faults that are intermittent or concealed at the time of inspection.",
    ],
  },
  {
    title: "Intellectual Property",
    content:
      "All materials, including reports, logos, text, and visual media, provided by Carnomia are protected by copyright and may not be reused or redistributed without written permission.",
  },
  {
    title: "Changes To Terms",
    content:
      "We may update these Terms & Conditions from time to time. Changes will be posted on this page and will take effect immediately upon posting.",
  },
];

export default Terms;
