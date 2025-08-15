import React from 'react';


import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaPinterestP,
} from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="bg-primary">
     
<div
  className="w-full h-30 bg-black flex items-center justify-center"
>
  <h1 className="text-button text-4xl font-bold drop-shadow-lg">CONTACT US</h1>
</div>
      {/* Top Info Section */}
      <div className="text-center px-6 md:px-20 py-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-body text-gray-800 mb-4">
          Have questions before your next car purchase?
        </h2>
      </div>
      <div className="flex flex-col md:flex-row justify-center gap-10 px-6 md:px-20 pb-20">
  {/* Now Contact Info is on the left */}
  <div className="text-gray-800 w-full md:w-1/2 max-w-xl">
    <h3 className="text-xl font-bold text-[#27ae60] mb-6">Contact Info</h3>

    <div className="mb-6">
      <h4 className="font-body text-lg border-b pb-2">LOCATION</h4>
      <p className="mt-2 text-s text-gray-600">Pune, Maharashtra</p>
    </div>
    <div className="mb-6">
      <h4 className="font-body text-lg border-b pb-2">EMAIL & PHONE</h4>
      <p className="mt-2 text-s text-gray-600">support@drivesta.com</p>
      <p className="text-s text-gray-600">(+91) 7385978109 / 7378554409</p>
    </div>
    <div className="mb-6">
      <h4 className="font-body text-lg border-b pb-2">WEBSITE</h4>
      <p className="mt-2 text-s text-gray-600">www.drivesta.com</p>
    </div>
    <div className="mb-6">
      <h4 className="font-body text-lg border-b pb-2">CUSTOMER SUPPORT HOURS</h4>
      <p className="mt-2 text-s text-gray-600">
        Monday to Sunday: 09:30 AM – 06:30 PM
      </p>
    </div>
    <div>
      <h4 className="font-body text-lg border-b pb-2">FOLLOW US</h4>
      <div className="flex space-x-4 mt-3">
        <FaFacebookF className="text-button hover:text-black transition" />
        <FaTwitter className="text-button hover:text-black transition" />
        <FaLinkedinIn className="text-button hover:text-black transition" />
        <FaYoutube className="text-button hover:text-black transition" />
        <FaInstagram className="text-button hover:text-black transition" />
        
      </div>
    </div>
  </div>
  {/* Now Form is on the right */}
  <div className="bg-white text-black p-8 rounded-2xl  shadow-lg border border-button  w-full md:w-1/2 max-w-md">
    <h3 className="text-xl font-bold mb-6 text-center">
      DO YOU HAVE ANY QUESTIONS?
    </h3>
    <form className="space-y-4">
      <input
        type="text"
        placeholder="Your Name"
        className="w-full px-4 py-3 bg-white text-black border border-button rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <input
        type="email"
        placeholder="Your Email Address"
        className="w-full px-4 py-3 bg-white text-black border border-button rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <input
        type="tel"
        placeholder="Your Phone"
        className="w-full px-4 py-3 bg-white text-black border border-button rounded focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <textarea
        rows="4"
        placeholder="Type Message"
        className="w-full px-4 py-3 bg-white text-black border border-button rounded focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
      ></textarea>
      <button
        type="submit"
        className="w-full border py-2 mt-2 bg-button text-white rounded-2xl transition font-medium"
      >
        Send Message
      </button>
    </form>
  </div>
</div>

    </div>
  );
};

export default Contact;