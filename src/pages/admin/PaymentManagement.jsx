import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import { APPLICATION_CONSTANTS } from '../../core/constants/app.constant';

const generateInvoicePdf = (payment) => {
  const doc = new jsPDF();

  const invoiceGreen = [60, 184, 120]; // #3cb878
  const darkBlue = [27, 43, 75]; // #1b2b4b
  const textGray = [100, 100, 100];
  const accentBlue = [70, 130, 180]; // #4682b4 for subtle gradient effect

  // Header with gradient effect
  doc.setFillColor(...darkBlue);
  doc.rect(0, 0, 210, 50, "F");
  doc.setFillColor(...accentBlue);
  doc.rect(0, 45, 210, 5, "F"); // Subtle accent line

  doc.setFillColor(...invoiceGreen);
  doc.triangle(150, 0, 210, 0, 210, 30);

  // Logo (increased size)
  try {
    const logo = '/carnomia.png';
    doc.addImage(logo, 'PNG', 15, 8, 35, 35); // Increased width from 25 to 35, height adjusted
  } catch {
    doc.setFillColor(...invoiceGreen);
    doc.circle(32.5, 25.5, 17.5, "F"); // Adjusted for larger logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18); // Slightly larger for visibility
    doc.setFont("helvetica", "bold");
    doc.text("C", 29, 28);
  }

  // Company Name and Tagline
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("Carnomia", 55, 22);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("We Inspect Before We Invest", 55, 30);

  // INVOICE title
  doc.setFont("times", "bold");
  doc.setFontSize(28); // Slightly smaller for elegance
  doc.setTextColor(...invoiceGreen);
  doc.text("INVOICE", 195, 30, { align: "right" });

  // Separator line
  doc.setDrawColor(...textGray);
  doc.setLineWidth(0.5);
  doc.line(15, 55, 195, 55);

  // Invoice details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Booking ID: ${payment.bookingId}`, 195, 65, { align: "right" });
  doc.text(`PDI Date: ${payment.pdiDate || 'N/A'}`, 195, 72, { align: "right" });

  // Invoice To & From
  const startY = 85; // Increased spacing for better separation

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...invoiceGreen);
  doc.text("Invoice To:", 15, startY);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(payment.customerName, 15, startY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textGray);
  doc.text(`Phone: ${payment.customerMobile}`, 15, startY + 18);
  doc.text(`Address: ${payment.address || 'N/A'}`, 15, startY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...invoiceGreen);
  doc.text("Invoice From:", 195, startY, { align: "right" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Carnomia", 195, startY + 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textGray);
  doc.text("Managing Director, Company Ltd.", 195, startY + 18, { align: "right" });
  doc.text("Phone: +123 4567 8910", 195, startY + 26, { align: "right" });
  doc.text("Email: example@email.com", 195, startY + 34, { align: "right" });

  // Vehicle and Payment Details Table
  const tableStartY = startY + 50; // Increased spacing
  const tableData = [[
    `${payment.brand || '-'} ${payment.model || '-'} ${payment.variant || '-'}`,
    `₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    payment.paymentStatus || 'N/A'
  ]];

  autoTable(doc, {
    startY: tableStartY,
    head: [['Vehicle', 'Amount', 'Payment Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: invoiceGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11, // Slightly larger for clarity
      cellPadding: { top: 10, bottom: 10, left: 6, right: 6 }
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fontSize: 10,
      cellPadding: { top: 8, bottom: 8, left: 6, right: 6 }
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left' },
      1: { cellWidth: 50, halign: 'right' },
      2: { cellWidth: 45, halign: 'center' }
    },
    alternateRowStyles: { fillColor: [245, 245, 245] }, // Softer alternate row color
    margin: { left: 15, right: 15 }
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 20; // Increased spacing
  doc.setFillColor(...invoiceGreen);
  doc.rect(125, finalY - 5, 70, 14, "F"); // Background for total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Total:", 130, finalY + 5);
  doc.text(`₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 190, finalY + 5, { align: "right" });

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  doc.text("Thank you for choosing Carnomia!", 105, 280, { align: "center" });

  doc.save(`invoice_${payment.bookingId}.pdf`);
};

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
        const data = res?.data?.data || [];
        // Map backend data to match required fields
        const mappedData = data.map(item => ({
          ...item,
          pdiDate: item.pdiDate || 'N/A', 
        }));
        setPayments(mappedData);
        setFilteredPayments(mappedData);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setPayments([]);
        setFilteredPayments([]);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments based on search
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const results = payments.filter(p =>
      p.bookingId.toLowerCase().includes(term) ||
      p.customerName.toLowerCase().includes(term) ||
      p.customerMobile.includes(term)
    );
    setFilteredPayments(results);
  }, [searchTerm, payments]);

  const updatePaymentStatus = async (payment) => {
    const bookingId = payment._id;
    await new ApiService().apiput(ServerUrl.API_UPDATE_PAYMENT_STATUS + '/' + bookingId + '/payment-status', { paymentStatus: APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value })
    alert('Payment status updated successfully');
    setPayments(payments.map(p => p.bookingId === bookingId ? { ...p, paymentStatus: 'Paid' } : p));
  };

  const fetchPayments = async () => {
    try {
      const res = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
      const data = res?.data?.data || [];
      const mappedData = data.map(item => ({
        bookingId: item.bookingId || 'N/A',
        customerName: item.name || 'Unknown',
        customerMobile: item.customerMobile || 'N/A',
        address: item.address || item.address || 'N/A',
        brand: item.brand || '-',
        model: item.model || '-',
        variant: item.variant || '-',
        amount: item.amount || 0,
        pdiDate: item.pdiDate || 'N/A',
        paymentStatus: item.status === 'completed' ? 'Paid' : 'Unpaid'
      }));
      setPayments(mappedData);
      setFilteredPayments(mappedData);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
      setFilteredPayments([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] p-4 sm:p-6 md:p-8">
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
            onClick={() => fetchPayments()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5m6 0h5v-5m-5 5v5h-5" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3 sm:p-4">Customer Details</th>
              <th className="p-3 sm:p-4">Booking ID</th>
              <th className="p-3 sm:p-4">Vehicle</th>
              <th className="p-3 sm:p-4">Amount</th>
              <th className="p-3 sm:p-4">Payment Status</th>
              <th className="p-3 sm:p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.bookingId} className="border-b hover:bg-gray-50">
                <td className="p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 text-white rounded-full flex items-center justify-center mr-3">
                      {payment.customerName ? payment.customerName.charAt(0) : ''}
                    </div>
                    <div>
                      <p className="font-medium">{payment.customerName}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{payment.customerMobile}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 sm:p-4">{payment.bookingId}</td>
                <td className="p-3 sm:p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{payment.brand}</span>
                    <span className="text-gray-600 text-sm">{payment.model}</span>
                    <span className="text-gray-500 text-sm">{payment.variant}</span>
                  </div>
                </td>
                <td className="p-3 sm:p-4">₹{payment.amount}</td>
                <td className="p-3 sm:p-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      payment.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value ? (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                      </svg>
                    )}
                    {/* {payment.paymentStatus} */}
                    {APPLICATION_CONSTANTS.PAYMENT_STATUS[payment.paymentStatus ? payment.paymentStatus : APPLICATION_CONSTANTS.PAYMENT_STATUS.PENDING.value].label }
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
                    <button
                      onClick={() => updatePaymentStatus(payment)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {selectedPayment && openDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Blurred & dimmed background */}
    <div className="absolute inset-0 bg-black/20 backdrop-blur-lg"></div>

    {/* Modal content */}
    <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl z-10">
      {/* Header */}
      <div className="bg-green-800 text-white p-4 rounded-t-lg">
        <h2 className="text-lg sm:text-xl font-bold">Payment Details</h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedPayment.customerName} - {selectedPayment.bookingId}
          </h3>
          <p className="text-sm text-gray-500">Invoice #: {selectedPayment.bookingId}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Customer Name:</p>
            <p className="text-sm text-gray-600">{selectedPayment.customerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Mobile:</p>
            <p className="text-sm text-gray-600">{selectedPayment.customerMobile}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Booking ID:</p>
            <p className="text-sm text-gray-600">{selectedPayment.bookingId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Address:</p>
            <p className="text-sm text-gray-600">{selectedPayment.address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Vehicle:</p>
            <p className="text-sm text-gray-600">{`${selectedPayment.brand} ${selectedPayment.model} ${selectedPayment.variant}`}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Amount:</p>
            <p className="text-sm text-gray-600">₹{selectedPayment.amount.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">PDI Date:</p>
            <p className="text-sm text-gray-600">{selectedPayment.pdiDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Payment Status:</p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                selectedPayment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {selectedPayment.paymentStatus === 'Paid' ? (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
              )}
              {selectedPayment.paymentStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
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
          <button
            onClick={() => {
              updatePaymentStatus(selectedPayment);
              setOpenDialog(false);
            }}
            className="flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Mark as Paid
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
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