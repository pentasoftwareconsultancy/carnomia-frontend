import React from "react";
import { motion } from "framer-motion";
import img from "../../assets/blog.png";
import {detailedSections} from "../../components/constants/publicData/BlogData";

const Blog = () => {
  return (
    <div className=" bg-primary px-6 md:px-20 py-12 text-regal-blue  ">
      <style>{`html { scroll-behavior: smooth; }`}</style>

      <div className="grid md:grid-cols-[60%_40%] gap-10">
        <div>
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          </motion.h2>
          <motion.img
            src={img}
            alt="Thumbnail"
            className="w-full h-auto max-h-72 object-cover rounded-md mb-4 sm:max-h-64 md:max-h-72 lg:max-h-80"
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
            <h3 className="text-xl font-bold-bold mb-3 leading-snug">
              <span className="bg-button bg-clip-text text-transparent">
                Why a Pre-Delivery Inspection (PDI) Is the Smartest Move Before
                Buying Any Car
              </span>
            </h3>
            <p className="text-gray-700 mb-2">
              Whether you're buying a brand-new car or a used one, excitement is
              natural – but so is risk.
            </p>
            <p className="text-gray-700">
              That's why a Pre-Delivery Inspection (PDI) from Carnomia is a smart,
              essential step that protects your purchase and your peace of mind.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-3xl font-bold-bold text-button">Trending Blogs</h2>
          </div>
          <div className="space-y-5">
            {[
              { title: "What is a PDI?", date: "Aug 23, 2023", link: "#pdi" },
              { title: "Why New Cars Need Inspection too?", date: "Aug 23, 2023", link: "#new-cars" },
              { title: "What You Get With Carnomia", date: "Aug 23, 2023", link: "#final-thoughts" },
              { title: "What We Find in Used Cars", date: "Aug 23, 2023", link: "#used-cars" },
            ].map((blog, i) => (
              <motion.a
                key={i}
                href={blog.link}
                className="block group p-6 rounded-xl border border-button bg-green-100/80 text-green-900 shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <h4 className="text-lg font-bold-bold group-hover:underline">
                  {blog.title}
                </h4>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
{detailedSections.map((section, i) => (
  <motion.div
    key={i}
    id={section.id}
    className="bg-white border border-gray-200 p-6 rounded-lg font-body shadow-sm mt-10"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: i * 0.2 }}
  >
    <h3 className="text-xl font-bold-bold mb-3 bg-button bg-clip-text text-transparent">
      {section.title}
    </h3>
    {section.content.map((text, j) => (
      <p key={j} className="text-gray-700 mb-2">
        {text}
      </p>
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
      {/* CTA Booking Box */}
      <motion.div
        className="bg-white border border-gray-300 p-6 rounded-lg shadow-sm mt-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-700">
          Book your inspection today at{" "}
          <a
            href="https://www.carnomia.com"
            className="text-blue-700 font-body hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.carnomia.com
          </a>
        </p>
        <p className="text-gray-700">
          & WhatsApp us at{" "}
          <a
            href="https://wa.me/917385978109"
            className="text-blue-700 font-body hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            +917385978109
          </a>{" "}
          for instant booking
        </p>
      </motion.div>

      {/* Help CTA Banner */}
      <motion.div
        className="bg-black text-white mt-16 py-6 px-6 md:px-20 rounded-2xl max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-body text-base mb-1 text-lg">
              Still have questions?
            </p>
            <p className="text-lg text-gray-300">
              Can’t find the answer you’re looking for? Please chat to our
              friendly team.
            </p>
          </div>
          <a
            href="/contact"
            className="bg-button hover:bg-green-500 text-white font-bold-bold text-lg px-5 py-2 rounded"
          >
            Contact Us
          </a>
        </div>
      </motion.div>
    </div>
  );
};
export default Blog;