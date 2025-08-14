import React from "react";
import { Link } from "react-router-dom";
import {
  FaTools,
  FaCogs,
  FaMicrochip,
  FaCarCrash,
  FaSearchDollar,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaBullseye,
  FaEye,
  FaMapMarkedAlt,
} from "react-icons/fa";

import about from "../../assets/about.png";
import about1 from "../../assets/about1.jpg";
import about2 from "../../assets/about2.jpg";
import about3 from "../../assets/about3.jpg";
import about4 from "../../assets/about4.jpg";
import about5 from "../../assets/about5.jpg";
import about6 from "../../assets/about6.jpg";
import car from "../../assets/car_fr2.jpg";

const services = [
  {
    icon: <FaTools className="text-green-700 text-5xl mb-2" />, label: "3300+ Parameters Checked"
  },
  {
    icon: <FaCogs className="text-green-700 text-5xl mb-2" />, label: "14 Core Mechanical Systems"
  },
  {
    icon: <FaMicrochip className="text-green-700 text-5xl mb-2" />, label: "Software & Sensor Checks"
  },
  {
    icon: <FaCarCrash className="text-green-700 text-5xl mb-2" />, label: "Structural & Cosmetic Damage"
  },
  {
    icon: <FaSearchDollar className="text-green-700 text-5xl mb-2" />, label: "Digital Forensics & Meter Rollback"
  },
  {
    icon: <FaClipboardCheck className="text-green-700 text-5xl mb-2" />, label: "Feature & Functionality Testing"
  },
];

const issues = [
  { img: about1, title: "Scratches from transport", desc: "Caused during logistics or storage." },
  { img: about2, title: "Faulty electrical components", desc: "Wiring and sensors often have faults." },
  { img: about3, title: "Missing accessories", desc: "Spare tires or manuals may be absent." },
  { img: about4, title: "Panel mismatches or repaints", desc: "May indicate prior damage." },
  { img: about5, title: "Software bugs", desc: "New cars can still glitch digitally." },
  { img: about6, title: "Pre-registration usage", desc: "Demo/test-drive history may be hidden." },
];

const About = () => {
  return (
    <div className="bg-[#f1ffe0] text-gray-800">
      {/* Header */}
      <div className="text-center bg-black text-white py-12">
        <h1 className="text-4xl font-heading tracking-wider">ABOUT US</h1>
      </div>

      {/* Intro Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16 flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-heading text-green-800 leading-tight">
            WE'RE REVOLUTIONIZING VEHICLE INSPECTION & SERVICES
          </h2>
          <p className="text-lg leading-relaxed">
            Carnomia transforms the way vehicle owners access inspections & services.
            With certified technicians and on-demand tech, we simplify inspections from
            pre-delivery to periodic maintenance.
          </p>
          <div className="flex gap-6">
            <div className="text-center p-4 shadow border rounded-xl bg-white">
              <p className="text-3xl font-heading text-green-700">30+</p>
              <p className="text-sm mt-1">Vehicle Services</p>
            </div>
            <div className="text-center p-4 shadow border rounded-xl bg-white">
              <p className="text-3xl font-heading text-green-700">300+</p>
              <p className="text-sm mt-1">Certified Technicians</p>
            </div>
            <div className="text-center p-4 shadow border rounded-xl bg-white">
              <p className="text-3xl font-heading text-green-700">40+</p>
              <p className="text-sm mt-1">Cities Covered</p>
            </div>
          </div>
          <Link to="/services">
            <button className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600">
              Check Our Services
            </button>
          </Link>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <img src={about} alt="Carnomia" className="rounded-xl max-w-md w-full" />
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
        <h2 className="text-3xl font-heading text-center mb-10">What We Do</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center transition duration-300"
            >
              {item.icon}
              <p className="mt-3 text-lg font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inspection Importance */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
        <h2 className="text-3xl font-heading text-center mb-6">Why New Cars Need Inspection Too</h2>
        <p className="text-center text-lg max-w-2xl mx-auto mb-10">
          Carnomia helps you catch hidden flaws before you drive off.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((item, i) => (
            <div
              key={i}
              className="relative h-64 bg-cover bg-center rounded-xl shadow group"
              style={{ backgroundImage: `url(${item.img})` }}
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition duration-300 rounded-xl" />
              <div className="absolute bottom-14 left-4 right-4 text-white text-base font-body z-10">
                {item.title}
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white text-sm opacity-0 group-hover:opacity-100 transition z-10">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16 px-4 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center">
          <div className="lg:w-1/2">
            <img src={car} alt="Mission" className="rounded-xl w-full max-w-md mx-auto" />
          </div>
          <div className="lg:w-1/2 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaBullseye className="text-green-700 text-2xl" />
                <h3 className="text-2xl font-heading">Our Mission</h3>
              </div>
              <p className="text-lg">
                To deliver reliable and tech-enabled vehicle services that redefine transparency and
                customer trust in the auto industry.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaEye className="text-green-700 text-2xl" />
                <h3 className="text-2xl font-heading">Our Vision</h3>
              </div>
              <p className="text-lg">
                To become India's most trusted mobility brand through innovation, excellence, and
                a customer-first approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Availability */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
        <h2 className="text-3xl font-heading flex items-center justify-center gap-2 mb-8">
          <FaMapMarkedAlt className="text-green-700" /> Our Availability
        </h2>
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="lg:w-1/2 space-y-4">
            <h4 className="text-xl font-heading text-green-700">Currently Serving</h4>
            <p className="text-lg font-body">Pune, Maharashtra — <span className="text-green-700">Expanding Fast</span></p>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 text-lg">
                <FaPhoneAlt className="text-green-700" /> +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FaEnvelope className="text-green-700" /> support@drivesta.in
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FaMapMarkerAlt className="text-green-700" /> Pune, Maharashtra
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full rounded-xl overflow-hidden shadow-md">
            <iframe
              title="Pune Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.747054265725!2d73.84708281489363!3d18.547731287393835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c08f198bbce3%3A0x6b3b2edc4e49a8f3!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1655551482721!5m2!1sen!2sin"
              width="100%"
              height="300"
              loading="lazy"
              className="w-full"
              style={{ border: 0 }}
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
