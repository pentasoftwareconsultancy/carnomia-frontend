import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const paymentsData = [
  {
    id: 'PAY001', bookingId: 'BK001', customer: 'Onkar Patil', mobile: '9876543210',
    amount: 3500, date: '2023-07-15', status: 'paid', method: 'UPI',
    items: [{ name: 'Full Car Service', price: 2500 }, { name: 'AC Gas Refill', price: 1000 }],
    tax: 350, discount: 0
  },
  {
    id: 'PAY002', bookingId: 'BK002', customer: 'Priya Sharma', mobile: '8765432109',
    amount: 2800, date: '2023-07-16', status: 'unpaid', method: 'Credit Card',
    items: [{ name: 'Basic Inspection', price: 1500 }, { name: 'Oil Change', price: 800 }],
    tax: 280, discount: 0
  }
];

const generateInvoicePdf = (payment) => {
  const doc = new jsPDF();
  doc.setFontSize(18).text('INVOICE', 105, 20, { align: 'center' });
  doc.setFontSize(12)
    .text(`Booking ID: ${payment.bookingId}`, 20, 40)
    .text(`Customer: ${payment.customer}`, 20, 50)
    .text(`Amount: ₹${payment.amount}`, 20, 60);
  doc.save(`invoice_${payment.id}.pdf`);
};

const PaymentManagement = () => {
  const [payments, setPayments] = useState(paymentsData);
  const [filteredPayments, setFilteredPayments] = useState(paymentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    let results = payments;
    if (tabValue !== 'all') results = results.filter(p => p.status === tabValue);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p =>
        p.id.toLowerCase().includes(term) ||
        p.customer.toLowerCase().includes(term) ||
        p.mobile.includes(term)
      );
    }
    setFilteredPayments(results);
  }, [searchTerm, tabValue, payments]);

  const updatePaymentStatus = (id, status) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <div className="min-h-screen bg-[#F1FFE0] p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-6">
        Payment Management
      </h1>

      <div className="bg-white rounded-lg shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
          <div className="relative w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setPayments([...paymentsData])}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5m6 0h5v-5m-5 5v5h-5" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {['all', 'paid', 'unpaid'].map((tab) => (
            <button
              key={tab}
              onClick={() => setTabValue(tab)}
              className={`flex-1 py-3 text-center text-sm sm:text-base font-medium ${
                tabValue === tab ? 'bg-green-50 text-green-800 border-b-2 border-green-600' : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                tab === 'paid' ? 'bg-green-100 text-green-800' : tab === 'unpaid' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {payments.filter(p => tab === 'all' || p.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3 sm:p-4">Customer</th>
              <th className="p-3 sm:p-4">Booking ID</th>
              <th className="p-3 sm:p-4">Amount</th>
              <th className="p-3 sm:p-4">Status</th>
              <th className="p-3 sm:p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">
                      {payment.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{payment.customer}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{payment.mobile}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 sm:p-4">{payment.bookingId}</td>
                <td className="p-3 sm:p-4">₹{payment.amount}</td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status === 'paid' ? (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                      </svg>
                    )}
                    {payment.status}
                  </span>
                </td>
                <td className="p-3 sm:p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setOpenDialog(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => generateInvoicePdf(payment)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    {payment.status === 'unpaid' && (
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'paid')}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-green-800 text-white p-4 rounded-t-lg">
              <h2 className="text-lg sm:text-xl font-bold">Payment Details</h2>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">
                {selectedPayment.customer} - {selectedPayment.bookingId}
              </h3>
              <p className="text-gray-700 mb-2">Amount: ₹{selectedPayment.amount}</p>
              <p className="text-gray-700 flex items-center">
                Status:
                <span
                  className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                    selectedPayment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedPayment.status}
                </span>
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => generateInvoicePdf(selectedPayment)}
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Invoice
                </button>
                {selectedPayment.status === 'unpaid' && (
                  <button
                    onClick={() => {
                      updatePaymentStatus(selectedPayment.id, 'paid');
                      setOpenDialog(false);
                    }}
                    className="flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setOpenDialog(false)}
                className="w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;