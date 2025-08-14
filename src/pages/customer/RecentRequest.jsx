import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import QRCode from "../../assets/Car.png";
import DrivestaLogo from "../../assets/logos/drivesta.png";
import {
  FaCar,
  FaWhatsapp,
  FaPhoneAlt,
  FaCarSide,
  FaGasPump,
  FaShieldAlt,
} from "react-icons/fa";
import { GiCarWheel, GiGearStick } from "react-icons/gi";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import {
  BsPencil,
  BsDownload,
  BsCheck,
  BsX,
  BsCurrencyRupee,
} from "react-icons/bs";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import { APPLICATION_CONSTANTS } from "../../core/constants/app.constant";

const Recent = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(null);
  const [keyMetrics, setKeyMetrics] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchLatestPDIRequest = async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_RECENT_REQUEST_BY_CUSTOMER);  
        if (response?.data?.data && isMounted) {
          const latestRequest = response.data.data;
          console.log("Latest PDI Request:", latestRequest);
          setState((prev) => ({
            userName: latestRequest.customerName || "User",
            ...latestRequest,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch latest PDI request:", error);
        if (isMounted) {
          setState(null);
        }

      }
    };
    fetchLatestPDIRequest();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => { 

    if (state) {
      
  setKeyMetrics([
    {
      icon: <FaCarSide className="text-2xl text-button" />,
      value: `${state.BHPs || "525"} BHP`,
      label: "Power",
    },
    {
      icon: <FaShieldAlt className="text-2xl text-button" />,
      value: `${state.Airbags || "4"} Airbags`,
      label: "Safety",
    },
    {
      icon: <FaGasPump className="text-2xl text-button" />,
      value: `${state.Mileage || "25.4"} kmpl`,
      label: "Mileage",
    },
    {
      icon: <GiCarWheel className="text-2xl text-button" />,
      value: `${state.NCAP || "5 Star"}`,
      label: "NCAP Rating",
    },
    {
      icon: <GiGearStick className="text-2xl text-button" />,
      value: state.transmissionType || "Automatic",
      label: "Transmission",
    },
    {
      icon: <HiOutlineCalendar className="text-2xl text-button" />,
      value: state.date
        ? new Date(state.date).toLocaleDateString()
        : "Not set",
      label: "PDI Date",
    },
  ]);
    }
}, [state])


  const handleAssistanceClick = (i) => {
    if (i === 0) navigate("/customer/contact");
    else if (i === 2) handleState("showEditModal", true);
  };

  // console.log("form data ", state);


  const renderModal = (show, title, content, actions) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-5 text-white text-center">
              <h3 className="text-xl font-heading flex items-center justify-center">
                {title.icon && <title.icon className="mr-2" />} {title.text}
              </h3>
            </div>
            <div className="p-6">{content}</div>
            {actions && (
              <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">
                {actions}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-primary px-4 sm:px-6 md:px-8 py-6 font-sans">
      
      {state ? (
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8"
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-gray-900">
              Welcome back,{" "}
              <span className="text-button">{state.userName}</span>
            </h1>

    {state == null ? (
            <p className="text-gray-600 mt-1 sm:mt-2">
              You don't have any recent requests yet.
              </p>) : '' }

    {state && state != null ? (
            <p className="text-gray-600 mt-1 sm:mt-2 flex items-center text-sm sm:text-base">
              Your vehicle booking details
              <span className="ml-2 w-2 h-2 bg-button rounded-full animate-pulse"></span>
            </p>) : '' }
            
          </div>

          <button
            onClick={() => navigate("/customer/contact")}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-button text-white rounded-lg shadow-sm text-xs sm:text-sm font-medium flex items-center"
          >
            <FaPhoneAlt className="mr-1 sm:mr-2" /> Contact Support
          </button>
        </motion.div>

    
{/* { state && state != null ? ( */}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Vehicle Image - Full width on mobile, 2/3 on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-primary rounded-xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="relative h-48 sm:h-64 md:h-80 w-full">
              <img
                src={
                  state.imageUrl ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt="Vehicle"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                <h3 className="text-lg sm:text-xl font-heading text-white">
                  {state.brand} {state.model}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm">
                  {state.variant}
                </p>
              </div>
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                <span className="w-2 h-2 bg-button rounded-full mr-1 sm:mr-2"></span>
                {APPLICATION_CONSTANTS.REQUEST_STATUS[state['status']].label}
              </div>
            </div>
          </motion.div>

          {/* Key Metrics - Grid layout responsive */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4"
          >
            {keyMetrics.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-white to-green-50 rounded-xl p-3 sm:p-4 shadow-xl border border-gray-100 hover:shadow-md"
              >
                {item.icon}
                <div className="text-base sm:text-lg md:text-xl font-heading text-gray-900 mt-1 sm:mt-2">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Booking & Vehicle Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-200 lg:col-span-2 w-full"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h3 className="text-base sm:text-lg font-body text-[#003C00] flex items-center mb-2 sm:mb-0">
                <FaCar className="mr-2 text-button" /> Booking & Vehicle
                Details
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleState("showEditModal", true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-button text-white rounded-lg shadow-sm text-xs sm:text-sm font-medium flex items-center"
              >
                <BsPencil className="mr-1 sm:mr-2" /> Edit Details
              </motion.button>
            </div>

            <div className="space-y-3">
              {[
                ["Booking ID", state.bookingId],
                ["Brand", state.brand],
                ["Model", state.model],
                ["Variant", state.variant],
                ["Fuel Type", state.fuelType], // ✅ backend match
                ["Transmission", state.transmissionType], // ✅ backend match
                [
                  "PDI Date",
                  state.date
                    ? new Date(state.date).toLocaleDateString()
                    : "Not specified",
                ],
                [
                  "Location",
                  <span className="text-button flex items-center text-sm sm:text-base">
                    <HiOutlineLocationMarker className="mr-1" />{" "}
                    {state.address}
                  </span>,
                ],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-200 pb-2 text-sm sm:text-base"
                >
                  <span className="text-gray-700 font-medium">{label}:</span>
                  <span className="text-gray-900 text-right">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-4 sm:p-6 text-black flex flex-col justify-between w-full"
          >
            <div>
              <h3 className="text-base sm:text-lg font-heading mb-4">
                Booking Status
              </h3>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-button text-sm sm:text-base">
                    Booking Fee
                  </span>
                  <span className="font-heading text-sm sm:text-base">₹2,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-button text-sm sm:text-base">
                    Payment Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-heading ${
                      state.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {/* {state['paymentStatus']} */}
                    {APPLICATION_CONSTANTS.PAYMENT_STATUS[state['paymentStatus'] ? state['paymentStatus'] : APPLICATION_CONSTANTS.PAYMENT_STATUS.PENDING.value].label}
                  </span>
                </div>
              </div>

              { state['paymentStatus'] != APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value ? (
                <span>Payment not done yet</span> 
                // <motion.button
                //   whileHover={{ scale: 1.02 }}
                //   whileTap={{ scale: 0.98 }}
                //   onClick={() => handleState("showPayment", true)}
                //   className="w-full bg-white text-green-800 font-heading py-2 sm:py-3 rounded-lg shadow-md hover:bg-gray-100 text-sm sm:text-base"
                // >
                //   Complete Payment
                // </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  // onClick={handleDownloadReport}
                  className="w-full bg-white text-green-800 font-heading py-2 sm:py-3 rounded-lg shadow-md hover:bg-gray-100 text-sm sm:text-base"
                >
                  Download Car Report
                </motion.button>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-green-500/30">
              <h4 className="text-xs sm:text-sm font-heading mb-3">
                Need assistance?
              </h4>
              {[
                "Contact Support Team",
                "View Booking FAQs",
                "Modify Booking",
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleAssistanceClick(i)}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition cursor-pointer mb-2"
                >
                  <p className="font-medium text-xs sm:text-sm">{item}</p>
                  <p className="text-button text-xs">
                    {i === 0
                      ? "Get immediate help via email or chat"
                      : i === 1
                      ? "Find answers to common questions"
                      : "Change dates or cancel your reservation"}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Additional Notes Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8"
        >
          <h3 className="text-base sm:text-lg font-heading text-gray-900 mb-2 sm:mb-3">
            Additional Notes
          </h3>
          <div className="bbg-gradient-to-br from-white to-green-50 rounded-lg p-3 sm:p-4 text-gray-700 text-sm sm:text-base">
            {state.notes ||
              "No additional notes were provided for this booking."}
          </div>
        </motion.div>



      {/* Edit Modal */}
      {renderModal(
        state.showEditModal,
        { icon: BsPencil, text: "Edit Booking Details" },
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto p-1">
          {[
            "bookingId",
            "brand",
            "model",
            "variant",
            "transmission",
            "fuel",
            "address",
            "pdiDate",
            "notes",
          ].map((field) => (
            <div key={field} className="space-y-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              {field === "notes" ? (
                <textarea
                  name={field}
                  value={state[field]}
                  onChange={(e) => handleFormData(field, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent bg-white"
                  rows={3}
                />
              ) : (
                <input
                  type={field.includes("Date") ? "date" : "text"}
                  name={field}
                  value={state[field]}
                  onChange={(e) => handleFormData(field, e.target.value)}
                  disabled={["brand", "model", "bookingId"].includes(field)}
                  className={`w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 text-xs sm:text-sm transition focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent ${
                    ["brand", "model", "bookingId"].includes(field)
                      ? "bg-gray-100"
                      : "bg-white"
                  }`}
                />
              )}
            </div>
          ))}
        </div>,
        <>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleState("showEditModal", false)}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300 text-xs sm:text-sm"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.setItem(
                "recentBooking",
                JSON.stringify(state)
              );
              handleState("showEditModal", false);
            }}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-white bg-button rounded-lg font-medium hover:bg-green-700 shadow-md text-xs sm:text-sm"
          >
            Save Changes
          </motion.button>
        </>
      )}

  

      {/* Payment Modal */}
      {renderModal(
        state.showPayment,
        { icon: BsCurrencyRupee, text: "Complete Payment" },
        <>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-gray-700 text-sm sm:text-base">Service:</span>
            <span className="font-medium text-sm sm:text-base">
              Vehicle Booking
            </span>
          </div>
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <span className="text-gray-700 text-sm sm:text-base">Amount:</span>
            <span className="text-xl sm:text-2xl font-heading text-button">
              ₹2,500
            </span>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src={QRCode}
                alt="QR Code"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
              />
            </div>
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Scan with any UPI app to pay
            </p>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // onClick={handleMarkAsPaid} disabled={state.isPaid}
              className={`w-full py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center text-xs sm:text-base ${
                state.isPaid
                  ? "bg-green-100 text-green-800 cursor-not-allowed"
                  : "bg-button text-white hover:bg-green-700 shadow-md"
              }`}
            >
              {state.isPaid ? (
                <>
                  <BsCheck className="mr-1 sm:mr-2" /> Payment Completed
                </>
              ) : (
                "Mark as Paid"
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleState("showPayment", false)}
              className="w-full py-2 sm:py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs sm:text-base"
            >
              <BsX className="mr-1 sm:mr-2" /> Close
            </motion.button>
          </div>
        </>,
        null
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {state.showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-white rounded-lg sm:rounded-xl shadow-lg border border-green-200 overflow-hidden max-w-xs sm:max-w-sm"
          >
            <div className="flex items-center p-3 sm:p-4">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full mr-2 sm:mr-3">
                <BsCheck className="text-button text-lg sm:text-xl" />
              </div>
              <div>
                <h4 className="font-heading text-gray-900 text-sm sm:text-base">
                  Payment Successful!
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Your car report are sent to your WhatsApp
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

      
      ) : (
        <p className="text-center text-gray-700">No recent requests found.</p>
      )}

    </div>
  );
};

export default Recent;
