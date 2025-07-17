import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import career from '../../assets/career.jpg';

const jobDescriptions = [
  {
    title: "Vehicle Inspection Engineer",
    experience: "1–3 Years",
    location: "Multiple (Pune, Delhi, Bengaluru)",
    qualification: "Diploma/Degree in Mechanical or Automobile Engineering",
    mode: "Field Work",
    description:
      "Conduct 360° vehicle inspections, identify and document defects, use diagnostic tools, generate inspection reports, and explain to the customer.",
    level: "Junior to Mid-Level",
    knowledge: [
      "Strong understanding of automotive systems and diagnostics",
      "Ability to identify and document vehicle defects accurately",
      "Familiarity with OBD-II scanners and inspection tools",
      "Good communication to explain results to customers",
      "Basic computer and mobile app handling",
    ],
  },
  {
    title: "Pre-Delivery Inspection (PDI) Technician",
    experience: "0–2 Years",
    location: "Pune (Warehouse/Dealer Network)",
    qualification: "ITI / Diploma in Automobile/Mechanical",
    mode: "On-site",
    description:
      "Perform final checks before vehicle delivery, ensure checklist compliance, report issues, and maintain inspection quality standards.",
    level: "Entry-Level",
    knowledge: [
      "Knowledge of vehicle components and PDI procedures",
      "Ability to follow inspection checklist",
      "Detail-oriented for delivery readiness",
      "Basic reporting and escalation handling",
    ],
  },
  {
    title: "Service Center Quality Auditor",
    experience: "3–5 Years",
    location: "Remote + Field Visits (Travel Required)",
    qualification: "B.Tech/BE in Automobile or Mechanical Engineering",
    mode: "Hybrid",
    description:
      "Audit partner service centers, ensure quality compliance, train mechanics, and prepare audit reports with feedback.",
    level: "Senior-Level",
    knowledge: [
      "Expertise in quality audits and service SOPs",
      "Training and evaluation of mechanics",
      "Knowledge of service parts, tools, and standards",
      "Proficiency in Excel or audit reporting tools",
    ],
  },
];

const Career = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-[#f1ffe0] min-h-screen">
      {/* Hero */}
      <section className="bg-gray-800 text-white py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Join the <span className="text-green-300">Drivesta</span> Team
            </h1>
            <p className="text-blue-100">
              We’re building tech-driven solutions to make vehicle inspections smarter and faster. Be a part of our family.
            </p>
          </div>
          <motion.img
            src={career}
            alt="Career Banner"
            className="rounded-xl shadow-xl w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* Job Openings */}
      <section className="px-6 lg:px-20 py-16">
        <h2 className="text-3xl font-bold text-center mb-3">Current Openings</h2>
        <p className="text-center text-gray-600 mb-12">Explore roles and apply below</p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobDescriptions.map((job, i) => (
            <motion.div
              key={i}
              className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition-all flex flex-col justify-between hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-800">{job.title}</h3>
                <p className="text-sm"><strong>Experience:</strong> {job.experience}</p>
                <p className="text-sm"><strong>Location:</strong> {job.location}</p>
                <p className="text-sm"><strong>Qualification:</strong> {job.qualification}</p>
                <p className="text-sm"><strong>Mode:</strong> {job.mode}</p>
                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{job.description}</p>
              </div>
              <button
                onClick={() => openModal(job)}
                className="mt-5 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-medium"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      {/* <motion.div
        className="bg-black text-white py-10 px-6 md:px-20 mt-12 rounded-2xl mx-4 md:mx-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-lg mb-1">Still have questions?</p>
            <p className="text-gray-300">Can’t find the role you’re looking for? Reach out to our hiring team.</p>
          </div>
          <Link
            to="/contact-us"
            className="bg-green-400 hover:bg-green-500 text-black font-semibold px-5 py-2 rounded"
          >
            Contact Us
          </Link>
        </div>
      </motion.div> */}

      {/* Modal */}
      {isModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start overflow-y-auto py-10 px-4">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500"
            >&times;</button>
            <h2 className="text-2xl font-bold mb-3 text-green-700">{selectedJob.title}</h2>
            <p><strong>Experience:</strong> {selectedJob.experience}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Qualification:</strong> {selectedJob.qualification}</p>
            <p><strong>Mode:</strong> {selectedJob.mode}</p>
            <p><strong>Level:</strong> {selectedJob.level}</p>
            <div className="mt-3">
              <strong>Skills:</strong>
              <ul className="list-disc ml-6 mt-1 text-sm">
                {selectedJob.knowledge.map((k, i) => (
                  <li key={i}>{k}</li>
                ))}
              </ul>
            </div>
            <form className="mt-6 space-y-4">
              <input type="text" placeholder="Name" className="w-full border px-3 py-2 rounded focus:outline-green-500" />
              <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded focus:outline-green-500" />
              <input type="tel" placeholder="Mobile" className="w-full border px-3 py-2 rounded focus:outline-green-500" />
              <input type="text" placeholder="City" className="w-full border px-3 py-2 rounded focus:outline-green-500" />
              <input type="text" placeholder="Qualification" className="w-full border px-3 py-2 rounded focus:outline-green-500" />
              <select className="w-full border px-3 py-2 rounded text-gray-600 focus:outline-green-500">
                <option value="">Experience Level</option>
                <option value="Fresher">Fresher</option>
                <option value="Experienced">Experienced</option>
              </select>
              <input type="file" className="w-full border px-3 py-2 rounded" />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Career;
