import React, { useState } from 'react';
import {
  FaQuestionCircle, FaCarSide, FaUserCheck, FaClock, FaClipboardList,
  FaHandshake, FaRupeeSign, FaKey, FaBan, FaSearch
} from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { BiSolidReport } from 'react-icons/bi';
import { PiChatCircleTextFill } from 'react-icons/pi';
import { GiReceiveMoney } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'About Drivesta & PDI Services',
    questions: [
      {
        q: 'What is Drivesta?',
        a: 'Drivesta is a professional car inspection service offering PDI for new and used vehicles across India. We perform detailed checks so you can buy with confidence.',
        icon: <FaQuestionCircle />
      },
      {
        q: 'What is a PDI (Pre-Delivery Inspection)?',
        a: 'A PDI is a thorough evaluation of a car’s condition – including mechanical, electrical, structural, and cosmetic checks. It helps buyers avoid surprises or hidden damages.',
        icon: <FaCarSide />
      },
      {
        q: 'Who should get a PDI done?',
        a: 'Whether you’re buying a brand-new car or from a showroom or used car from a private seller or dealer, a PDI is strongly recommended to ensure you’re making a smart investment.',
        icon: <FaUserCheck />
      },
    ],
  },
  {
    category: 'Car Inspections',
    questions: [
      {
        q: 'How do I check my order delivery status ?',
        a: 'New cars can still have delivery damages, panel misalignment, factory defects, missing accessories, or software faults. We help you catch these before delivery.',
        icon: <FaClipboardList />
      },
      {
        q: 'Can you inspect cars from OLX, CarTrade, or dealers?',
        a: 'Yes. We inspect cars from any source – dealers, individuals, marketplaces, etc.',
        icon: <FaHandshake />
      },
    ],
  },
  {
    category: 'Booking & Process',
    questions: [
      {
        q: 'How do I book a PDI with Drivesta?',
        a: "It's simple:\n• Visit www.drivesta.com\n• Call/WhatsApp: +91-9723280710\n• Choose your slot and share car details\n• We'll inspect the car at the location you choose",
        icon: <FaQuestionCircle />
      },
      {
        q: 'Where is the inspection done?',
        a: 'At your convenience – showroom, seller’s location, or your home.',
        icon: <MdOutlineLocationOn />
      },
      {
        q: 'How long does the inspection take?',
        a: 'Most inspections take 45 to 60 minutes, depending on the car’s condition.',
        icon: <FaClock />
      },
      {
        q: 'When will I get the report?',
        a: 'You’ll receive a digital report within minutes of the inspection – instantly via email or WhatsApp.',
        icon: <BiSolidReport />
      },
      {
        q: 'Can I share the report with the seller?',
        a: 'Yes. You can, if you wish to. Drivesta reports are private and shared only with the booking customer.',
        icon: <PiChatCircleTextFill />
      },
    ],
  },
  {
    category: 'Pricing and Payment',
    questions: [
      {
        q: 'How much does a Drivesta inspection cost?',
        a: 'Our pricing is flat for brand cars. Contact us or visit the website for details.',
        icon: <FaRupeeSign />
      },
      {
        q: 'Do I need to pay in advance?',
        a: 'No. You only pay after the inspection and once you receive your report.',
        icon: <GiReceiveMoney />
      },
      {
        q: 'What payment modes are accepted?',
        a: 'We accept UPI and Cash payments.',
        icon: <FaRupeeSign />
      },
    ],
  },
  {
    category: 'Support & Policies',
    questions: [
      {
        q: 'What if I don’t want to buy the car after the report?',
        a: 'No problem! Our goal is to help you make the right decision, not just complete a deal.\nWalk away confidently if needed.',
        icon: <FaKey />
      },
      {
        q: 'What if the seller denies access?',
        a: 'We recommend confirming with the seller before scheduling. If access is denied, our team will help you reschedule at no extra cost.',
        icon: <FaBan />
      },
      {
        q: 'What happens in case of a cancellation?',
        a: 'You can cancel or reschedule easily via call/WhatsApp. No charges if canceled in advance.',
        icon: <FaBan />
      },
      {
        q: 'Is my data safe with Drivesta?',
        a: 'Absolutely. We respect your privacy. Your personal and vehicle data is never shared without consent. Read Privacy Policy.',
        icon: <FaClipboardList />
      },
    ],
  },
];

const FreqeuntlyAsked = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(section => section.questions.length > 0);

  return (
    <div className="bg-[#f1f8e9] min-h-screen font-sans">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-black text-center py-12 px-4"
      >
        <h3 className="text-gray-300 text-sm">FAQs</h3>
        <h1 className="text-green-400 text-3xl md:text-4xl font-bold mt-2">Ask us anything</h1>
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
            className="pl-10 pr-4 py-2 rounded-md w-full bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-1 border-green-300">{section.category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.questions.map((item, index) => {
                  const globalIndex = faqData
                    .slice(0, faqData.findIndex(s => s.category === section.category))
                    .reduce((acc, cur) => acc + cur.questions.length, 0) + index + 1;

                  return (
                    <motion.div
                      key={index}
                      className="p-4 bg-[#F9FFF1] border border-gray-200 rounded-md flex flex-col gap-2 shadow-sm hover:shadow-md transition"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3 mb-1 text-green-700">
                        <span className="text-white bg-green-600 p-2 rounded-full text-xl">
                          {item.icon}
                        </span>
                        <span className="font-semibold">Q{globalIndex}.</span>
                      </div>
                      <div className="text-md font-medium text-gray-900 mb-1">{item.q}</div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{item.a}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        className="max-w-5xl mx-auto px-6 mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-black text-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Still have questions?</h3>
            <p className="text-sm text-gray-400">
              Can’t find the answer you’re looking for? Please chat to our friendly team.
            </p>
          </div>
          <Link to="/contact-us" className="bg-green-400 hover:bg-green-500 text-black px-6 py-2 rounded-md font-medium">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default FreqeuntlyAsked;
