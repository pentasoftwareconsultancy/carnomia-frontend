import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PrivacyPolicy = () => {
return (
<div className="bg-[#f1f8e9] min-h-screen font-sans text-gray-800">
{/* Header */}
<motion.div
className="bg-black py-12 px-4 text-center"
initial={{ opacity: 0, y: -30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
>
<h1 className="text-green-400 text-3xl md:text-4xl font-bold">Privacy Policy</h1>
<p className="text-white mt-2 text-sm md:text-base">Last updated: July 2025</p>
</motion.div>

  {/* Content Wrapper */}
  <div className="flex justify-center px-4 py-10">
    <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full border-4 border-white p-6 md:p-10 space-y-8">
      <motion.p
        className="font-medium text-sm md:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <strong>At Drivesta</strong>, we value your privacy and are committed to protecting your personal information.
        This Privacy Policy outlines how we collect, use, store, and protect your data when you interact with our
        website, services, or customer support.
      </motion.p>

      {/* Sections */}
      {sections.map((section, i) => (
        <Section
          key={i}
          number={section.number}
          content={section.content}
          list={section.list}
          delay={0.2 + i * 0.1}
        />
      ))}
    </div>
  </div>
</div>
);
};

const Section = ({ number, content, list, delay }) => {
const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

return (
<motion.section
ref={ref}
initial={{ opacity: 0, y: 40 }}
animate={inView ? { opacity: 1, y: 0 } : {}}
transition={{ duration: 0.6, delay }}
className="bg-white p-6 rounded-md shadow-md border border-gray-300"
>
<h2 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{number}</h2>
<p className="text-gray-700 text-sm md:text-base mb-3">{content}</p>
{list && (
<ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-gray-700">
{list.map((item, idx) => (
<li key={idx}>{item}</li>
))}
</ul>
)}
</motion.section>
);
};

const sections = [
{
number: "1. Information We Collect",
content: "We may collect the following types of personal information:",
list: [
"Contact Information: Name, email address, phone number, and address.",
"Vehicle Information: Car make, model, variant, year, and condition-related data.",
"Location Data: To provide on-site inspection services.",
"Payment Information: If applicable, for booking services (processed via secure third-party gateways).",
"Website Usage Data: IP address, browser type, pages visited, and session duration.",
],
},
{
number: "2. How We Use Your Information",
content: "We use your data to:",
list: [
"Schedule and conduct car inspections.",
"Generate and share inspection reports.",
"Communicate with you about your service request.",
"Process payments and provide customer support.",
"Improve our services, website performance, and user experience.",
"Comply with legal or regulatory requirements.",
],
},
{
number: "3. Data Sharing and Disclosure",
content: "We do not sell or rent your personal data to third parties. However, we may share information with:",
list: [
"Our professional engineers for providing services.",
"Payment processing providers (secure and PCI-compliant).",
"Law enforcement or regulatory bodies when required by law.",
],
},
{
number: "4. Cookies and Tracking",
content: "We may use cookies or similar technologies to:",
list: [
"Improve website functionality.",
"Analyze user behavior and website performance.",
"Customize user experience.",
"You can choose to disable cookies in your browser settings.",
],
},
{
number: "5. Data Security",
content:
"We take reasonable and industry-standard measures to protect your information from unauthorized access, misuse, or loss.",
},
{
number: "6. Your Rights",
content: "You have the right to:",
list: [
"Access, update, or delete your personal data.",
"Withdraw consent for data use (where applicable).",
"Request a copy of the information we hold about you.",
],
},
{
number: "7. Changes to This Policy",
content:
"We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date.",
},
];

export default PrivacyPolicy;