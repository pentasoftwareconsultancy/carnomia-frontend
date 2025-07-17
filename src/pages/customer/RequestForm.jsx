import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDownload, FaChevronDown } from "react-icons/fa";
import jeepImage from "../../assets/honda_elevate.png";
import { useAuth } from "../../context/AuthContext"; // Added to check authentication

const carData = [
  {
    brand: "Honda",
    models: [
      {
        name: "Elevate",
        image: "https://ackodrive-assets.ackodrive.com/media/test_LEtPtQM.png",
        variants: [
          { name: "Base", transmission: "Manual", fuel: "Petrol" },
          { name: "Top", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
      {
        name: "City",
        image:
          "https://www.pngplay.com/wp-content/uploads/13/Honda-City-Transparent-Background.png",
        variants: [
          { name: "VX", transmission: "Manual", fuel: "Diesel" },
          { name: "ZX", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
    ],
  },
  {
    brand: "Toyota",
    models: [
      {
        name: "Fortuner",
        image:
          "https://www.freepnglogos.com/uploads/fortuner-png/fortuner-10.png",
        variants: [
          { name: "Standard", transmission: "Manual", fuel: "Diesel" },
          { name: "Legender", transmission: "Automatic", fuel: "Diesel" },
        ],
      },
      {
        name: "Innova",
        image:
          "https://wallpapers.com/images/hd/toyota-innova-crysta-minivan-nrh9rqvaj1lkdzbh.jpg",
        variants: [
          { name: "GX", transmission: "Manual", fuel: "Diesel" },
          { name: "ZX", transmission: "Automatic", fuel: "Diesel" },
        ],
      },
    ],
  },
  {
    brand: "Mahindra",
    models: [
      {
        name: "Thar",
        image:
          "https://images.hindustantimes.com/auto/img/2024/05/21/600x338/Mahindra_Thar_Green_1716261507027_1716261515527.webp",
        variants: [
          { name: "AX", transmission: "Manual", fuel: "Diesel" },
          { name: "LX", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
      {
        name: "XUV700",
        image:
          "https://meetassociates.com/uploads/models/model1634122517xuv700redrage.png",
        variants: [
          { name: "MX", transmission: "Manual", fuel: "Diesel" },
          { name: "AX7", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
    ],
  },
  {
    brand: "Maruti Suzuki",
    models: [
      {
        name: "Ertiga",
        image:
          "https://sgcarrent.com/wp-content/uploads/2025/01/MUV_-_MARUTI_ERTIGA-removebg-preview.png",
        variants: [
          { name: "VXI", transmission: "Manual", fuel: "Petrol+CNG" },
          { name: "ZXI+", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
      {
        name: "Brezza",
        image:
          "https://toppng.com/uploads/thumbnail/maruti-suzuki-india-cars-bhilai-dealer-local-vitara-brezza-price-in-delhi-1156298297405phb8jbcy.png",
        variants: [
          { name: "VXI", transmission: "Manual", fuel: "Petrol" },
          { name: "ZXI+", transmission: "Automatic", fuel: "Petrol" },
        ],
      },
    ],
  },
];

const carStatusOptions = [
  { value: "new", label: "New Car" },
  { value: "used", label: "Used Car" },
];

const RequestForm = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth(); // Added to ensure authenticated context

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedImage, setSelectedImage] = useState(jeepImage);
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [carStatus, setCarStatus] = useState("");
  const [pdiDate, setpdiDate] = useState("");
  const [address, setAddress] = useState("");
  const [dealer, setDealer] = useState("");

  const [open, setOpen] = useState({
    brand: false,
    model: false,
    variant: false,
    status: false,
  });
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const brandObj = carData.find((b) => b.brand === selectedBrand);
  const modelObj = brandObj?.models.find((m) => m.name === selectedModel);
  const models = brandObj?.models || [];
  const variants = modelObj?.variants || [];

  const today = new Date().toISOString().split("T")[0];

  // Debug log to check context and state
  React.useEffect(() => {
    console.log("RequestForm mounted", { isLoggedIn, user, selectedBrand, selectedModel, selectedVariant });
  }, [isLoggedIn, user, selectedBrand, selectedModel, selectedVariant]);

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedModel("");
    setSelectedVariant("");
    setSelectedImage(jeepImage);
    setTransmission("");
    setFuel("");
  };

  const handleModelChange = (e) => {
    const m = e.target.value;
    setSelectedModel(m);
    setSelectedVariant("");
    const img = brandObj?.models.find((x) => x.name === m)?.image || jeepImage;
    setSelectedImage(img);
  };

  const handleVariantChange = (e) => {
    const v = e.target.value;
    setSelectedVariant(v);
    const vObj = variants.find((x) => x.name === v);
    if (vObj) {
      setTransmission(vObj.transmission);
      setFuel(vObj.fuel);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      console.error("User not authenticated or user data missing");
      return; // Prevent submission if not authenticated
    }
    localStorage.setItem(
      "recentRequest",
      JSON.stringify({
        brand: selectedBrand,
        model: selectedModel,
        variant: selectedVariant,
        transmission,
        fuel,
        image: selectedImage,
        userId: user.id || "anonymous", // Optional: Add user context
      })
    );
    navigate("/success"); // Changed to lowercase to match route
  };

  // Fallback if not authenticated or data is missing
  if (!isLoggedIn) {
    return <div className="p-4 text-red-500">Please log in to request an inspection.</div>;
  }

  return (
    <div className="min-h-screen bg-[#F1FFE0] px-6 md:px-20 py-10 font-sans">
      <div className="mt-20 flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Left side (title & image) */}
        <div className="md:w-1/2 flex flex-col items-center text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl md:text-5xl font-bold mb-2"
          >
            Request Vehicle Inspection
          </motion.h2>

          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt="Vehicle"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            className="w-70 md:w-106 mt-10 drop-shadow-md"
            onError={(e) => { e.target.src = jeepImage; }} // Fallback if image fails
          />

          <motion.a
            whileHover={{ scale: 1.05 }}
            href="#"
            className="text-blue-600 text-sm mt-60 ml-100 font-semibold flex items-center gap-1 hover:underline"
          >
            Download Sample Report <FaDownload />
          </motion.a>
        </div>

        {/* Right side (form) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:w-1/3 w-full bg-white p-5 rounded-2xl shadow-xl shadow-gray-300/60"
        >
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Vehicle Details</h3>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <SelectField
              label="Select Brand"
              required
              value={selectedBrand}
              onChange={handleBrandChange}
              options={carData.map((b) => ({ label: b.brand, value: b.brand }))}
              open={open.brand}
              toggle={() => toggle("brand")}
            />

            <SelectField
              label="Select Model"
              required
              disabled={!selectedBrand}
              value={selectedModel}
              onChange={handleModelChange}
              options={models.map((m) => ({ label: m.name, value: m.name }))}
              open={open.model}
              toggle={() => toggle("model")}
            />

            <SelectField
              label="Select Variant"
              required
              disabled={!selectedModel}
              value={selectedVariant}
              onChange={handleVariantChange}
              options={variants.map((v) => ({ label: v.name, value: v.name }))}
              open={open.variant}
              toggle={() => toggle("variant")}
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                readOnly
                value={transmission}
                placeholder="Transmission"
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50"
              />
              <input
                type="text"
                readOnly
                value={fuel}
                placeholder="Fuel Type"
                className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50"
              />
            </div>

            <input
              type="text"
              placeholder="Dealer Name"
              required
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <SelectField
              label="Select Car Status"
              required
              value={carStatus}
              onChange={(e) => setCarStatus(e.target.value)}
              options={carStatusOptions}
              open={open.status}
              toggle={() => toggle("status")}
            />

            <input
              type="date"
              required
              min={today}
              value={pdiDate}
              onChange={(e) => e.target.value >= today && setpdiDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <textarea
              placeholder="Notes (optional)"
              rows={2}
              className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-green-600 rounded focus:ring-green-500"
              />
              I confirm the above information is accurate.
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-green-600 text-white py-3 text-base font-bold rounded-xl hover:bg-green-700 transition shadow-md"
            >
              Book PDI Now
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* reusable select */
const SelectField = ({
  label,
  value,
  onChange,
  options,
  open,
  toggle,
  disabled = false,
  required = true,
}) => (
  <div className="relative">
    <motion.div whileHover={{ scale: 1.01 }} className="w-full">
      <select
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onFocus={toggle}
        onBlur={() => setTimeout(toggle, 200)}
        className={`w-full border border-gray-300 rounded-xl p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
          disabled ? "bg-gray-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute right-3 top-4 text-gray-400 pointer-events-none"
      >
        <FaChevronDown />
      </motion.div>
    </motion.div>
  </div>
);

export default RequestForm;