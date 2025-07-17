import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import QRCode from '../../assets/Drivesta1.png';
import DrivestaLogo from '../../assets/logos/drivesta2.png';
import { FaCar, FaWhatsapp, FaPhoneAlt, FaCarSide, FaGasPump, FaShieldAlt } from 'react-icons/fa';
import { GiCarWheel, GiGearStick } from 'react-icons/gi';
import { HiOutlineCalendar, HiOutlineLocationMarker } from 'react-icons/hi';
import { BsPencil, BsDownload, BsCheck, BsX, BsCurrencyRupee } from 'react-icons/bs';

const Recent = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    userName: '', sidebarWidth: 0, showPayment: false, showEditModal: false, isPaid: false, showToast: false,
    formData: { bookingId: '', brand: '', model: '', variant: '', transmission: '', fuel: '', address: '', pdiDate: '', notes: '', image: '', bhp: '', airbags: '', mileage: '', ncap: '' }
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.name) setState(p => ({ ...p, userName: user.name }));
    const bookingData = JSON.parse(localStorage.getItem('recentRequest'));
    if (bookingData) setState(p => ({ ...p, formData: bookingData }));
    const sidebar = document.querySelector('div.fixed.left-0');
    if (sidebar && window.innerWidth >= 768) {
      new ResizeObserver(entries => setState(p => ({ ...p, sidebarWidth: entries[0].contentRect.width }))).observe(sidebar);
    }
  }, []);

  const handleState = (k, v) => setState(p => ({ ...p, [k]: v }));
  const handleFormData = (n, v) => setState(p => ({ ...p, formData: { ...p.formData, [n]: v } }));

  const handleMarkAsPaid = () => {
    handleState('isPaid', true);
    handleState('showToast', true);
    setTimeout(() => handleState('showToast', false), 3000);
  };

  const handleDownloadReport = () => {
    if (!state.isPaid) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoImg = new Image();
    logoImg.src = DrivestaLogo;
    logoImg.onload = () => {
      doc.addImage(logoImg, 'PNG', pageWidth / 2 - 20, 10, 40, 20);
      doc.setFontSize(18).text('Vehicle Booking Details', pageWidth / 2, 35, { align: 'center' });
      let y = 45;
      const addSection = (title, items) => {
        doc.setFont('helvetica', 'bold').setTextColor(50, 168, 82).text(title, 15, y);
        doc.setTextColor(0, 0, 0).setFont('helvetica', 'normal');
        items.forEach(([l, v]) => { y += 8; doc.text(`${l}: ${v}`, 15, y); });
        y += 10; doc.setDrawColor(200).line(15, y, pageWidth - 15, y); y += 8;
      };
      addSection('Customer Details', [['Name', state.userName]]);
      addSection('Booking Information', [
        ['Booking ID', state.formData.bookingId], ['Status', 'Confirmed'],
        ['PDI Date', state.formData.pdiDate ? new Date(state.formData.pdiDate).toLocaleDateString() : 'Not specified']
      ]);
      addSection('Vehicle Information', [
        ['Brand', state.formData.brand], ['Model', state.formData.model], ['Variant', state.formData.variant],
        ['Fuel', state.formData.fuel], ['Transmission', state.formData.transmission], ['Power', `${state.formData.bhp || '525'} BHP`],
        ['Airbags', state.formData.airbags || '4'], ['Mileage', `${state.formData.mileage || '25.4'} kmpl`],
        ['NCAP Rating', `${state.formData.ncap || '5'} Stars`]
      ]);
      addSection('Payment Details', [['Status', 'PAID'], ['Amount', '₹2500']]);
      doc.setFontSize(10).text('Thank you for choosing Drivesta!', pageWidth / 2, 280, { align: 'center' });
      doc.save('Drivesta_Vehicle_Details.pdf');
    };
  };

  const handleAssistanceClick = (i) => {
    if (i === 0) navigate('/customer/contact');
    else if (i === 2) handleState('showEditModal', true);
  };

  const keyMetrics = [
    { icon: <FaCarSide className="text-2xl text-green-600" />, value: `${state.formData.bhp || '525'} BHP`, label: 'Power' },
    { icon: <FaShieldAlt className="text-2xl text-green-600" />, value: `${state.formData.airbags || '4'} Airbags`, label: 'Safety' },
    { icon: <FaGasPump className="text-2xl text-green-600" />, value: `${state.formData.mileage || '25.4'} kmpl`, label: 'Mileage' },
    { icon: <GiCarWheel className="text-2xl text-green-600" />, value: `${state.formData.ncap || '5'} Stars`, label: 'NCAP Rating' },
    { icon: <GiGearStick className="text-2xl text-green-600" />, value: state.formData.transmission || 'Automatic', label: 'Transmission' },
    { icon: <HiOutlineCalendar className="text-2xl text-green-600" />, 
      value: state.formData.pdiDate ? new Date(state.formData.pdiDate).toLocaleDateString() : 'Not set', 
      label: 'PDI Date' 
    },
  ];

  const renderModal = (show, title, content, actions) => (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} 
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-5 text-white text-center">
              <h3 className="text-xl font-bold flex items-center justify-center">
                {title.icon && <title.icon className="mr-2" />} {title.text}
              </h3>
            </div>
            <div className="p-6">{content}</div>
            {actions && <div className="flex justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#F1FFE0] px-4 md:px-8 py-6 font-sans">
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome back, <span className="text-green-600">{state.userName}</span>
            </h1>
            <p className="text-gray-600 mt-2 flex items-center">
              Your vehicle booking details
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </p>
          </div>
          <button onClick={() => navigate('/customer/contact')}
            className="mt-4 md:mt-0 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm text-sm font-medium flex items-center">
            <FaPhoneAlt className="mr-2" /> Contact Support
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} 
            className="lg:col-span-2 bg-[#F1FFE0] rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="relative h-64 md:h-80 w-full">
              <img src={state.formData.image || 'https://via.placeholder.com/800x400?text=No+Image'} 
                alt="Vehicle" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{state.formData.brand} {state.formData.model}</h3>
                <p className="text-gray-300 text-sm">{state.formData.variant}</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Booking Confirmed 
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} 
            className="grid grid-cols-2 gap-4">
            {keyMetrics.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }} 
                className="bg-[#F1FFE0] rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-md">
                {item.icon}
                <div className="text-xl font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} 
            className="bg-[#F1FFE0] rounded-xl shadow-xl p-6 border border-gray-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <FaCar className="mr-2 text-green-600" /> Booking & Vehicle Details
              </h3>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} 
                onClick={() => handleState('showEditModal', true)} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm text-sm font-medium flex items-center">
                <BsPencil className="mr-2" /> Edit Details
              </motion.button>
            </div>
            <div className="space-y-4">
              {[
                ['Booking ID', state.formData.bookingId], ['Brand', state.formData.brand],
                ['Model', state.formData.model], ['Variant', state.formData.variant],
                ['Fuel Type', state.formData.fuel], ['Transmission', state.formData.transmission],
                ['PDI Date', state.formData.pdiDate ? new Date(state.formData.pdiDate).toLocaleDateString() : 'Not specified'],
                ['Location', <span className="text-blue-600 flex items-center"><HiOutlineLocationMarker className="mr-1" /> {state.formData.address}</span>],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} 
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Booking Status</h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-100">Booking Fee</span>
                <span className="font-bold">₹2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Payment Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  state.isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}>{state.isPaid ? 'Paid' : 'Pending'}</span>
              </div>
            </div>

            {!state.isPaid ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                onClick={() => handleState('showPayment', true)} 
                className="w-full bg-white text-green-800 font-bold py-3 rounded-lg shadow-md hover:bg-gray-100">
                Complete Payment
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                onClick={handleDownloadReport} 
                className="w-full bg-white text-green-800 font-bold py-3 rounded-lg shadow-md hover:bg-gray-100">
                Download Car Report
              </motion.button>
            )}

            <div className="mt-6 pt-4 border-t border-green-500/30">
              <h4 className="text-sm font-bold mb-3">Need assistance?</h4>
              {['Contact Support Team', 'View Booking FAQs', 'Modify Booking'].map((item, i) => (
                <div key={i} onClick={() => handleAssistanceClick(i)}
                  className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition cursor-pointer mb-2 last:mb-0">
                  <p className="font-medium">{item}</p>
                  <p className="text-green-200 text-xs">{
                    i === 0 ? 'Get immediate help via email or chat' : 
                    i === 1 ? 'Find answers to common questions' : 'Change dates or cancel your reservation'
                  }</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} 
          className="bg-[#F1FFE0] rounded-xl shadow-xl p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Notes</h3>
          <div className="bg-[#F1FFE0] rounded-lg p-4 text-gray-700">
            {state.formData.notes || "No additional notes were provided for this booking."}
          </div>
        </motion.div>
      </div>

      {renderModal(
        state.showEditModal,
        { icon: BsPencil, text: 'Edit Booking Details' },
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {['bookingId', 'brand', 'model', 'variant', 'transmission', 'fuel', 'address', 'pdiDate', 'notes'].map(field => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              {field === 'notes' ? (
                <textarea name={field} value={state.formData[field]} 
                  onChange={(e) => handleFormData(field, e.target.value)} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm transition focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent bg-white" rows={3} />
              ) : (
                <input
                  type={field.includes('Date') ? 'date' : 'text'}
                  name={field}
                  value={state.formData[field]}
                  onChange={(e) => handleFormData(field, e.target.value)}
                  disabled={['brand', 'model', 'bookingId'].includes(field)}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 text-sm transition focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent ${
                    ['brand', 'model', 'bookingId'].includes(field) ? 'bg-gray-100' : 'bg-white'
                  }`}
                />
              )}
            </div>
          ))}
        </div>,
        <>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} 
            onClick={() => handleState('showEditModal', false)} 
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg font-medium hover:bg-gray-300">
            Cancel
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} 
            onClick={() => { 
              localStorage.setItem('recentBooking', JSON.stringify(state.formData)); 
              handleState('showEditModal', false); 
            }} 
            className="px-6 py-2 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 shadow-md">
            Save Changes
          </motion.button>
        </>
      )}

      {renderModal(
        state.showPayment,
        { icon: BsCurrencyRupee, text: 'Complete Payment' },
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-700">Service:</span>
            <span className="font-medium">Vehicle Booking</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-700">Amount:</span>
            <span className="text-2xl font-bold text-green-600">₹2,500</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-center mb-4">
              <img src={QRCode} alt="QR Code" className="w-40 h-40 object-contain" />
            </div>
            <p className="text-center text-sm text-gray-600">Scan with any UPI app to pay</p>
          </div>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
              onClick={handleMarkAsPaid} disabled={state.isPaid} 
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                state.isPaid ? 'bg-green-100 text-green-800 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
              }`}>
              {state.isPaid ? <><BsCheck className="mr-2" /> Payment Completed</> : 'Mark as Paid'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
              onClick={() => handleState('showPayment', false)} 
              className="w-full py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <BsX className="mr-2" /> Close
            </motion.button>
          </div>
        </>,
        null
      )}

      <AnimatePresence>
        {state.showToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} 
            className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-xl border border-green-200 overflow-hidden">
            <div className="flex items-center p-4">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <BsCheck className="text-green-600 text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Payment Successful!</h4>
                <p className="text-sm text-gray-600">Your car report are send to your WhatsApp</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recent;