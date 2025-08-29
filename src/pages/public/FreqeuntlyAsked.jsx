import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import faqData from '../../components/constants/publicData/faqData';

const FreqeuntlyAsked = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(section => section.questions.length > 0);

  return (
    <div className="bg-primary min-h-screen font-body">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-black text-center py-12 px-4"
      >
        <h3 className="text-gray-300 text-sm">FAQs</h3>
        <h1 className="text-button text-3xl md:text-4xl  font-heading-bold heading mt-2">Ask us anything</h1>
        <p className="text-white mt-2">Have any questions?</p>

        <div className="mt-6 relative w-72 md:w-96 mx-auto">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-button"
          />
        </div>
      </motion.div>

      <div className="bg-white rounded-xl p-6 md:p-10 shadow-lg max-w-6xl mx-auto mt-10">
        {filteredData.length === 0 ? (
          <motion.p className="text-center text-gray-600 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            No results found for "{searchTerm}"
          </motion.p>
        ) : (
          filteredData.map((section, idx) => (
            <motion.div
              key={idx}
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl  font-heading-bold text-gray-800 mb-4 border-b pb-1 border-button">{section.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.questions.map((item, index) => {
                  const globalIndex = faqData
                    .slice(0, faqData.findIndex(s => s.category === section.category))
                    .reduce((acc, cur) => acc + cur.questions.length, 0) + index + 1;

                  return (
                    <motion.div
                      key={index}
                      className="p-4 bg-white border border-button rounded-md flex flex-col gap-2 shadow-sm hover:shadow-md transition"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-1 text-button">
                        <span className="text-white bg-button p-2 rounded-full text-xl">
                          {item.icon}
                        </span>
                        <span className="font-heading-bold">Q{globalIndex}.</span>
                      </div>
                      <div className="text-md font-heading-bold text-gray-900 mb-1">{item.q}</div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{item.a}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
        
        <motion.div
          className="max-w-5xl mx-auto px-6 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-black text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-heading-bold">Still have questions?</h3>
              <p className="text-sm text-gray-400 font-body">
                Can’t find the answer you’re looking for? Please chat to our friendly team.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="bg-button hover:bg-green-500 text-white px-6 py-2 rounded-md font-heading-bold"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FreqeuntlyAsked;