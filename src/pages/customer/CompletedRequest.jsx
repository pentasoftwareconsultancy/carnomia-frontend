import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiMapPin,
  FiCheckCircle,
  FiCreditCard,
} from 'react-icons/fi';

const Completed = () => {
  const [userName, setUserName] = useState('Guest');

  const completedOrders = [
    {
      id: 1,
      bookingId: 'PUN21050001',
      brand: 'Hyundai',
      model: 'Creta',
      variant: 'SX Turbo',
      chasisNo: '1HGCM82633A123456',
      engineer: 'Ramesh Pawar',
      engineercontactno: '9922334455',
      location: 'Pune Central Yard',
      date: '2025-07-03',
      time: '10:00 AM – 11:30 AM',
      paymentMode: 'Cash',
      paymentDate: '2025-07-04',
      paymentTime: '09:30 AM',
      amount: '₹2,500',
      status: 'Paid',
    },
    {
      id: 2,
      bookingId: 'PUN21050002',
      brand: 'Tata',
      model: 'Nexon',
      variant: 'XZ Plus',
      chasisNo: '1HGCM82633A223457',
      engineer: 'Priya Deshmukh',
      engineercontactno: '9922334455',
      location: 'Pune Central Yard',
      date: '2025-07-04',
      time: '02:00 PM – 03:30 PM',
      paymentMode: 'Online',
      paymentDate: '2025-07-05',
      paymentTime: '12:45 PM',
      amount: '₹2,500',
      status: 'Paid',
    },
    {
      id: 3,
      bookingId: 'PUN21050003',
      brand: 'Maruti Suzuki',
      model: 'Baleno',
      variant: 'Alpha',
      chasisNo: '1HGCM82633A323458',
      engineer: 'Amit Kale',
      engineercontactno: '9922334455',
      location: 'Pune Central Yard',
      date: '2025-07-05',
      time: '11:00 AM – 12:30 PM',
      paymentMode: 'Cash',
      paymentDate: '2025-07-06',
      paymentTime: '10:15 AM',
      amount: '₹2,500',
      status: 'Paid',
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.name) setUserName(user.name);
  }, []);

  const downloadReport = (order) => {
    const htmlContent = `<!DOCTYPE html><html><head><title>Report - ${order.bookingId}</title>...</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Drivesta_Report_${order.bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const InfoCard = ({ icon: Icon, title, value }) => (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg w-full">
      <div className="flex items-center text-gray-500 mb-1 text-sm">
        <Icon className="mr-2" />
        <span>{title}</span>
      </div>
      <p className="text-sm sm:text-base font-medium text-gray-800 break-words">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1FFE0] py-4 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Completed Inspections
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Welcome back,{' '}
            <span className="font-semibold text-green-600">{userName}</span>
          </p>
        </motion.div>

        <div className="space-y-6">
          {completedOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.005 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                        {order.brand} {order.model}
                      </h2>
                      <span className="px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                        <FiCheckCircle size={12} /> Completed
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Booking ID: {order.bookingId}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadReport(order)}
                    className="flex items-center px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-all"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <InfoCard icon={FiUser} title="Engineer" value={order.engineer} />
                  <InfoCard icon={FiUser} title="Contact No." value={order.engineercontactno} />
                  <InfoCard icon={FiMapPin} title="Location" value={order.location} />
                  <InfoCard icon={FiCalendar} title="Inspection" value={`${order.date} • ${order.time}`} />
                  <InfoCard icon={FiDollarSign} title="Amount" value={order.amount} />
                  <InfoCard icon={FiCreditCard} title="Payment Mode" value={order.paymentMode} />
                </div>

                {/* Vehicle & Payment Detail Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 mb-2">
                      Vehicle Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Variant</p>
                        <p className="font-medium text-sm sm:text-base">{order.variant}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Chassis No</p>
                        <p className="font-medium text-sm sm:text-base break-words">
                          {order.chasisNo}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600 mb-2">
                      Payment Status / Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="font-medium text-sm sm:text-base">{order.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-sm sm:text-base">{order.paymentDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium text-sm sm:text-base">{order.paymentTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Completed;