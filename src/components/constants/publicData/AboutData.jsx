import {
  FaStethoscope,
  FaTools,
  FaMicrochip,
  FaBatteryFull,
  FaClipboardCheck,
} from "react-icons/fa";

const aboutData = [
  {
    icon: <FaStethoscope className="text-2xl sm:text-3xl md:text-4xl text-green-600" />,
    title: "3300+ Parameters Checked",
    position: "top-[8%] left-[5%] sm:top-[5%] sm:left-[15%]",
  },
  {
    icon: <FaTools className="text-2xl sm:text-3xl md:text-4xl text-green-600" />,
    title: "14 Core Mechanical Systems",
    position: "top-[0%] left-1/2 transform -translate-x-1/2",
  },
  {
    icon: <FaMicrochip className="text-2xl sm:text-3xl md:text-4xl text-green-600" />,
    title: "Software & Sensor Ecosystem Checks",
    position: "top-[8%] right-[5%] sm:top-[5%] sm:right-[15%]",
  },
  {
    icon: <FaBatteryFull className="text-2xl sm:text-3xl md:text-4xl text-green-600" />,
    title: "Structural & Cosmetic Damage (Accident, Repaint, Fit & Finish)",
    position: "bottom-[8%] left-[5%] sm:bottom-[5%] sm:left-[10%]",
  },
  {
    icon: <FaClipboardCheck className="text-2xl sm:text-3xl md:text-4xl text-green-600" />,
    title: "Full Feature & Functionality Testing",
    position: "bottom-[8%] right-[5%] sm:bottom-[5%] sm:right-[10%]",
  },
];

export default aboutData;