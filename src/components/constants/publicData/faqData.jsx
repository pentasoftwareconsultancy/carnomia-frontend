import {
  FaQuestionCircle, FaCarSide, FaUserCheck, FaClock, FaClipboardList,
  FaHandshake, FaRupeeSign, FaKey, FaBan,
} from 'react-icons/fa';

import { MdOutlineLocationOn } from 'react-icons/md';
import { BiSolidReport } from 'react-icons/bi';
import { PiChatCircleTextFill } from 'react-icons/pi';
import { GiReceiveMoney } from 'react-icons/gi';

export const faqData = [
  {
    category: 'About Carnomia & PDI Services',
    questions: [
      {
        q: 'What is Carnomia?',
        a: 'Carnomia is a professional car inspection service offering PDI for new and used vehicles across India. We perform detailed checks so you can buy with confidence.',
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
        q: 'How do I book a PDI with Carnomia?',
        a: "It's simple:\n• Visit www.carnomia.com\n• Call/WhatsApp: ‪+91-7385978109\n• Choose your slot and share car details\n• We'll inspect the car at the location you choose",
        icon: <FaQuestionCircle />
      },
      {
        q: 'Where is the inspection done?',
        a: 'At your convenience – showroom, seller’s location, or your home.',
        icon:<MdOutlineLocationOn/>
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
        a: 'Yes. You can, if you wish to. Carnomia reports are private and shared only with the booking customer.',
        icon: <PiChatCircleTextFill />
      },
    ],
  },
  {
    category: 'Pricing and Payment',
    questions: [
      {
        q: 'How much does a Carnomia inspection cost?',
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
        q: 'Is my data safe with Carnomia?',
        a: 'Absolutely. We respect your privacy. Your personal and vehicle data is never shared without consent. Read Privacy Policy.',
        icon: <FaClipboardList />
      },
    ],
  },
];

export default faqData;