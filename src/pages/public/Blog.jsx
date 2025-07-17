import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import img from '../../assets/blog.png';

const Blog = () => {
  const sections = [
    {
      title: "What Is a PDI?",
      content: [
        "A Pre-Delivery Inspection (PDI) is a complete, professional check-up of a car before you finalize the deal. At Drivesta, we go beyond the basics — inspecting over 3300+ parameters, including:",
      ],
      list: [
        "14+ mechanical systems (engine, brakes, suspension, etc.)",
        "Electronics, software, & sensor diagnostics",
        "Structural integrity, repaint & accident detection",
        "Forensics for odometer rollback, flood damage, and lot rot",
        "Accessories, infotainment, air-conditioning, lights & more",
      ],
    },
    {
      title: "Why New Cars Need Inspection Too",
      content: [
        "You might think a showroom car is spotless — but you’d be surprised how often we detect:",
      ],
      list: [
        "Scratches and dents from transport",
        "Faulty electrical components",
        "Missing accessories",
        "Panel mismatches or repaints",
        "Software bugs and CAN-Bus errors",
      ],
    },
    {
      title: "What We Find in Used Cars?",
      content: [
        "Used cars come with history – but sellers rarely share it fully. Our inspectors often uncover:",
      ],
      list: [
        "Odometer tampering",
        "Hidden accident damage or structural repairs",
        "Engine issues, low fluids, or warning lights",
        "Repainted or mismatched body panels",
        "Missing features or poorly repaired interiors",
      ],
    },
    {
      title: "Final Thoughts",
      content: [
        "Buying a car is a big decision – and sometimes a once-in-a-decade investment.",
        "Don’t leave it to guesswork or the seller’s word.",
        "With Drivesta, you’re backed by technology, expertise, and transparency.",
        "Inspect smart. Drive safe. Choose Drivesta.",
      ],
    },
  ];

  return (
    <div className="bg-[#f1ffe0] px-6 md:px-20 py-12 text-gray-800">
      <div className="grid md:grid-cols-[60%_40%] gap-10">
        {/* LEFT COLUMN - Latest */}
        <div>
          <motion.h2 
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            Latest
          </motion.h2>

          <motion.img
            src={img}
            alt="Thumbnail"
            className="w-full h-52 object-cover rounded-md mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          <motion.div
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm text-gray-500 mb-2">By Sam Parker | March 12, 2025</p>
            <h3 className="text-xl font-bold mb-3 leading-snug bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Why a Pre-Delivery Inspection (PDI) Is the Smartest Move Before Buying Any Car
            </h3>
            <p className="text-gray-700 mb-2">
              Whether you're buying a brand-new car or a used one, excitement is natural – but so is risk.
            </p>
            <p className="text-gray-700">
              That's why a Pre-Delivery Inspection (PDI) from Drivesta is a smart, essential step that protects your purchase and your peace of mind.
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - Trending */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Trending Blogs</h2>
          </div>

          <div className="space-y-5">
            {[
              { title: "What is a PDI?", date: "Aug 23, 2023", color: "white" },
              { title: "Why New Cars Need Inspection too?", date: "Aug 23, 2023", color: "green" },
              { title: "What You Get With Drivesta", date: "Aug 23, 2023", color: "white" },
              { title: "What We Find in Used Cars", date: "Aug 23, 2023", color: "white" },
            ].map((blog, i) => (
              <motion.div
                key={i}
                className={`p-6 rounded-lg border border-gray-200 ${blog.color === "green" ? "bg-green-400 text-white" : "bg-white text-gray-900"}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.2 }}
              >
                <p className={`text-sm mb-1 ${blog.color === "green" ? "text-white" : "text-gray-500"}`}>
                  By <span className="text-red-500">Sam Parker</span> | {blog.date}
                </p>
                <h4 className="text-lg font-semibold">{blog.title}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Sections */}
      {sections.map((section, i) => (
        <motion.div
          key={i}
          className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mt-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
        >
          <p className="text-sm text-gray-500 mb-2">By Sam Parker | March 12, 2025</p>
          <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            {section.title}
          </h3>
          {section.content.map((text, j) => (
            <p key={j} className="text-gray-700 mb-2">{text}</p>
          ))}
          {section.list && (
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {section.list.map((li, k) => (
                <li key={k}>{li}</li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}

      <motion.div
        className="bg-white border border-gray-300 p-6 rounded-lg shadow-sm mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-700">
          Book your inspection today at{' '}
          <a href="https://www.drivesta.com" className="text-blue-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
            www.drivesta.com
          </a>
        </p>
        <p className="text-gray-700">
          & WhatsApp us at{' '}
          <a href="https://wa.me/917385978109" className="text-blue-700 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
            +917385978109
          </a>{' '}for instant booking
        </p>
      </motion.div>

      <motion.div 
        className="bg-black text-white mt-16 py-6 px-6 md:px-20 rounded-2xl max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-base mb-1 text-lg">Still have questions?</p>
            <p className="text-lg text-gray-300">
              Can’t find the answer you’re looking for? Please chat to our friendly team.
            </p>
          </div>
          <Link to="/contact-us" className="bg-green-400 hover:bg-green-500 text-black font-semibold text-lg px-5 py-2 rounded">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;
