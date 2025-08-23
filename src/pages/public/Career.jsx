import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import career from '../../assets/career.jpg';
import { careerData } from './../../components/constants/publicData/careerData';

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
<div className="bg-primary min-h-screen">
      {/* Hero */}       <section className="bg-gray-800 text-white py-20 px-6 lg:px-20">
       <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
           <div>             <h1 className="text-4xl md:text-5xl font-heading mb-4 leading-tight">
            Join the <span className="text-green-300 font-heading-bold">Carnomia</span> Team
            </h1>
           <p className="text-blue-100 font-body">
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
        <h2 className="text-3xl font-heading-bold text-center mb-3">Current Openings</h2>
        <p className="text-center text-gray-600 mb-12 font-body">Explore roles and apply below</p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerData.map((job, i) => (
            <motion.div
              key={i}
              className="bg-white border border-button rounded-xl p-6 shadow hover:shadow-lg transition-all flex flex-col justify-between hover:scale-[1.02]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div>
                <h3 className="text-xl font-semibold mb-2 text-button">{job.title}</h3>
                <p className="text-sm font-body"><strong>Experience:</strong> {job.experience}</p>
                <p className="text-sm font-body "><strong>Location:</strong> {job.location}</p>
                <p className="text-sm font-body"><strong>Qualification:</strong> {job.qualification}</p>
                <p className="text-sm font-body"><strong>Mode:</strong> {job.mode}</p>
                <p className="mt-3 text-sm font-body text-gray-600 line-clamp-3">{job.description}</p>
              </div>
              <button
                onClick={() => openModal(job)}
                className="mt-5 bg-button text-white px-4 py-2 rounded hover:bg-green-500 transition font-medium"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </section>
{isModalOpen && selectedJob && (
  <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start overflow-y-auto py-10 px-4">
    <motion.div
      className="bg-white rounded-lg p-6 max-w-2xl w-full shadow-2xl relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Close button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-2xl text-regal-blue hover:text-red-500"
      >
        &times;
      </button>

      {/* Job Title */}
      <h2 className="text-2xl font-semibold mb-3 text-button">
        {selectedJob.title}
      </h2>

      {/* Job Details */}
      <p><strong>Experience:</strong> {selectedJob.experience}</p>
      <p><strong>Location:</strong> {selectedJob.location}</p>
      <p><strong>Qualification:</strong> {selectedJob.qualification}</p>
      <p><strong>Mode:</strong> {selectedJob.mode}</p>
      <p><strong>Level:</strong> {selectedJob.level}</p>

      {/* Skills */}
      <div className="mt-3">
        <strong>Skills:</strong>
        <ul className="list-disc ml-6 mt-1 text-sm">
          {selectedJob.knowledge.map((k, i) => (
            <li key={i}>{k}</li>
          ))}
        </ul>
      </div>

      {/* Google Form Section */}
      <div className="mt-6 p-4 bg-primary border border-button rounded-lg">
        <h3 className="text-lg font-heading-bold text-button mb-2">
          Apply for this Position
        </h3>
        <p className="text-sm text-gray-700 font-body mb-4">
          Please fill in your details and upload your resume using the form below:
        </p>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScItrr66uFn1JheRJufFonMIA4vK-f7ziR-KpMnWokUfYztvg/viewform?usp=header "
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-button text-white px-5 py-2 rounded-md shadow hover:bg-green-500 transition-colors"
        >
          Fill Application Form
        </a>
      </div>
    </motion.div>
  </div>
)}
    </div>
  );
};
export default Career;