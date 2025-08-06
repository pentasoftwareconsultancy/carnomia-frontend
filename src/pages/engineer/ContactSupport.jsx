import React, { useRef, useState } from 'react';
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import 'react-toastify/dist/ReactToastify.css';

const ContactSupport = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success('Inquiry submitted successfully!');
      formRef.current.reset();
      setAnimateForm(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setAnimateForm(false), 800);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] px-4 sm:px-6 lg:px-20 py-12 font-sans">
      <ToastContainer position="top-center" autoClose={3000} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-start gap-y-12 lg:gap-20">
        {/* LEFT: Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-900 leading-snug">
            Contact Support
          </h1>
          <p className="text-base sm:text-lg text-gray-700">
            Questions about your service or car delivery?<br />
            Our team is ready to help you every step of the way!
          </p>

          <div className="bg-[#ccffcc] shadow-xl rounded-2xl p-5 sm:p-6 border border-gray-200 space-y-6">
            {[
              {
                icon: <FiPhone className="text-xl sm:text-2xl" />,
                color: '#16a34a',
                label: 'Phone/WhatsApp:',
                value: (
                  <>
                    <a href="tel:+917385978109" className="text-blue-600 hover:underline block text-sm mt-1">
                      +91 73859 78109
                    </a>
                    <a href="tel:+917378554409" className="text-blue-600 hover:underline block text-sm">
                      +91 73785 54409
                    </a>
                  </>
                ),
              },
              {
                icon: <FiMail className="text-xl sm:text-2xl" />,
                color: '#dc2626',
                label: 'Email:',
                value: (
                  <a href="mailto:support@drivesta.com" className="text-blue-600 hover:underline text-sm mt-1">
                    support@drivesta.com
                  </a>
                ),
              },
              {
                icon: <FiGlobe className="text-xl sm:text-2xl" />,
                color: '#7c3aed',
                label: 'Website:',
                value: (
                  <a href="https://www.drivesta.com" className="text-blue-600 hover:underline text-sm mt-1">
                    www.drivesta.com
                  </a>
                ),
              },
              {
                icon: <BsClockHistory className="text-xl sm:text-2xl" />,
                color: '#facc15',
                label: 'Support Hours:',
                value: <span className="text-sm mt-1">Mon-Sun: 9:30 AM – 6:30 PM</span>,
              },
            ].map((item, idx) => (
              <div className="flex items-start gap-3 sm:gap-4" key={idx}>
                <motion.div whileHover={{ scale: 1.2, color: item.color }} transition={{ type: 'spring' }}>
                  {item.icon}
                </motion.div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{item.label}</p>
                  <div className="text-gray-700">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Inquiry Form */}
        <motion.div
          key={animateForm.toString()}
          initial={{ scale: 1 }}
          animate={animateForm ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 bg-white border border-gray-300 rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-green-900 mb-6">Inquiry Form</h2>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-sm">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="w-full px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Optional"
                className="w-full px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-sm">Message</label>
              <textarea
                name="message"
                rows="3"
                placeholder="Write your message..."
                className="w-full px-4 py-2 sm:py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none resize-none text-sm sm:text-base"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-transform hover:scale-[1.02] ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </div>
              ) : (
                '✉️ Submit Inquiry'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSupport;
