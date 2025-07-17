import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCalendar, FiDollarSign, FiUser, FiMapPin, FiCheckCircle, FiCreditCard } from 'react-icons/fi';

const CompletedRequest = () => {
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
    const htmlContent = `<!DOCTYPE html><html><head><title>Report - ${order.bookingId}</title><style>
      body{font-family:'Segoe UI',sans-serif;padding:30px;line-height:1.6;color:#333}
      .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #eee}
      .logo{font-size:24px;font-weight:bold;color:#4CAF50;letter-spacing:1px}
      h1{color:#2c3e50;margin-bottom:5px;font-size:24px}h2{color:#555;margin-top:0;font-weight:500;font-size:16px}
      table{width:100%;border-collapse:collapse;margin-top:20px;box-shadow:0 2px 10px rgba(0,0,0,0.05)}
      th{background-color:#4CAF50;color:white;text-align:left;padding:15px;font-weight:500}
      td{padding:12px 15px;border-bottom:1px solid #eee}tr:nth-child(even){background-color:#f9f9f9}
      .section-title{background-color:#f1f8fe;color:#2c3e50;font-weight:500}
      .footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;text-align:center;color:#777;font-size:14px}
      .signature{margin-top:60px;display:flex;justify-content:space-between}
      .signature-line{width:250px;border-top:1px solid #333;text-align:center;padding-top:10px;margin-top:40px}
      .amount{font-weight:bold;color:#4CAF50}</style></head><body>
      <div class="header"><div class="logo">DRIVESTA</div><div>${new Date().toLocaleDateString('en-IN')}</div></div>
      <h1>Vehicle Inspection Report</h1><h2>Booking ID: ${order.bookingId}</h2>
      <table><tr class="section-title"><th colspan="2">Vehicle Details</th></tr>
      <tr><td width="30%">Brand</td><td>${order.brand}</td></tr><tr><td>Model</td><td>${order.model}</td></tr>
      <tr><td>Variant</td><td>${order.variant}</td></tr><tr><td>Chassis No</td><td>${order.chasisNo}</td></tr>
      <tr class="section-title"><th colspan="2">Inspection Details</th></tr>
      <tr><td>Engineer</td><td>${order.engineer}</td></tr><tr><td>Engineer Contact No.</td><td>${order.engineercontactno}</td></tr><tr><td>Location</td><td>${order.location}</td></tr>
      <tr><td>Date</td><td>${order.date}</td></tr><tr><td>Time</td><td>${order.time}</td></tr>
      <tr class="section-title"><th colspan="2">Payment Details</th></tr>
      <tr><td>Payment Mode</td><td>${order.paymentMode}</td></tr><tr><td>Payment Date</td><td>${order.paymentDate}</td></tr>
      <tr><td>Payment Time</td><td>${order.paymentTime}</td></tr><tr><td>Amount</td><td class="amount">${order.amount}</td></tr></table>
      <div class="signature"><div class="signature-line">Customer Signature</div><div class="signature-line">Inspector Signature</div></div>
      <div class="footer"><p>Thank you for choosing Drivesta</p><p>Contact support@drivesta.com or call +91 9876543210</p></div></body></html>`;

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
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center text-gray-500 mb-2">
        <Icon className="mr-2" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1FFE0] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Completed Inspections</h1>
          <p className="text-gray-600 mt-1">Welcome back, <span className="font-medium text-green-600">{userName}</span></p>
        </motion.div>

        <div className="space-y-5">
          {completedOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.005 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-xl font-bold text-gray-800">{order.brand} {order.model}</h2>
                      <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                        <FiCheckCircle size={12} /> Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: {order.bookingId}</p>
                  </div>
                  <button
                    onClick={() => downloadReport(order)}
                    className="flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard icon={FiUser} title="Engineer" value={order.engineer} />
                  <InfoCard icon={FiUser} title="Engineer Contact No." value={order.engineercontactno} />
                  <InfoCard icon={FiCalendar} title="Inspection" value={`${order.date} • ${order.time}`} />
                  <InfoCard icon={FiDollarSign} title="Payment Amount" value={`${order.amount}`} />
                  <InfoCard icon={FiCreditCard} title="Payment Mode" value={`${order.paymentMode}`} />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-600 mb-2">Vehicle Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-xs text-gray-500">Variant</p><p className="font-medium">{order.variant}</p></div>
                      <div><p className="text-xs text-gray-500">Chassis No</p><p className="font-medium">{order.chasisNo}</p></div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-purple-600 mb-2">Payment Status / Details</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{order.status}</p></div>
                      <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{order.paymentDate}</p></div>
                      <div><p className="text-xs text-gray-500">Time</p><p className="font-medium">{order.paymentTime}</p></div>
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

export default CompletedRequest;