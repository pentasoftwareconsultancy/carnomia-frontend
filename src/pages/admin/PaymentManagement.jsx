import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiEye, FiDownload, FiCheck, FiX } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import { APPLICATION_CONSTANTS } from "../../core/constants/app.constant";

// Invoice generator
const generateInvoicePdf = (payment) => {
  if (!payment) return;

  const doc = new jsPDF();
  const invoiceGreen = [60, 184, 120];
  const darkBlue = [27, 43, 75];
  const textGray = [100, 100, 100];
  const newGreen = [125, 217, 87];

  // Header
  doc.setFillColor(...darkBlue);
  doc.rect(0, 0, 210, 50, "F");

  // Logo
  try {
    doc.addImage("/carnomia.png", "PNG", 6, 1, 70, 37);
  } catch {
    doc.setFillColor(...invoiceGreen);
    doc.circle(35, 25, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("C", 33, 28);
  }

  // Slogan
  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.setTextColor(...newGreen);
  doc.text("We Inspect Before We Invest", 8, 35);

  // Invoice title
  doc.setFont("times", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...invoiceGreen);
  doc.text("INVOICE", 195, 27, { align: "right" });

  // Separator
  doc.setDrawColor(...textGray);
  doc.setLineWidth(0.5);
  doc.line(15, 55, 195, 55);

  // Invoice details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`Booking ID: ${payment.bookingId}`, 195, 65, { align: "right" });
  doc.text(`PDI Date: ${payment.pdiDate || "N/A"}`, 195, 72, {
    align: "right",
  });

  // Invoice To
  const startY = 85;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...invoiceGreen);
  doc.text("Invoice To:", 15, startY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(payment.customerName, 15, startY + 10);
  doc.setFontSize(10);
  doc.setTextColor(...textGray);
  doc.text(`Phone: ${payment.customerMobile}`, 15, startY + 18);
  doc.text(`Address: ${payment.address || "N/A"}`, 15, startY + 26);

  // Invoice From
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...invoiceGreen);
  doc.text("Invoice From:", 195, startY, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Carnomia", 195, startY + 10, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(...textGray);
  doc.text("Managing Director, Company Ltd.", 195, startY + 18, {
    align: "right",
  });
  doc.text("Phone: +91 7385978109", 195, startY + 26, { align: "right" });
  doc.text("Email: example@carnomia.com", 195, startY + 34, { align: "right" });

  // Vehicle table
  const tableStartY = startY + 50;
  autoTable(doc, {
    startY: tableStartY,
    head: [["Vehicle", "Amount", "Payment Status"]],
    body: [
      [
        `${payment.brand || "-"} ${payment.model || "-"} ${payment.variant || "-"}`,
        `₹${payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        payment.paymentStatus || "N/A",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: invoiceGreen,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    bodyStyles: { textColor: [0, 0, 0], fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 45, halign: "center" },
      2: { cellWidth: 45, halign: "center" },
    },
    margin: { left: 15, right: 15 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFillColor(...invoiceGreen);
  doc.rect(195 - 45, finalY, 45, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Total: ₹${payment.amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    195 - 42,
    finalY + 7
  );

  // Footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...textGray);
  doc.text("Thank you for choosing Carnomia!", 105, 280, { align: "center" });

  doc.save(`invoice_${payment.bookingId}.pdf`);
};

const PaymentManagement = ({ isAdmin = true }) => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const url = id
          ? `${ServerUrl.API_GET_REQUEST_BY_ID}/${id}`
          : ServerUrl.API_GET_ALLPDIREQUEST;
        const res = await new ApiService().apiget(url);
        const data = id ? [res.data.data] : res.data.data || [];

        const mapped = data
          .map((item) => ({
            id: item._id,
            bookingId: item.bookingId || "N/A",
            customerName: item.customerName || "Unknown",
            customerMobile: item.customerMobile || "N/A",
            address: item.address || "N/A",
            brand: item.brand || "-",
            model: item.model || "-",
            variant: item.variant || "-",
            amount: item.amount || 0,
            pdiDate: item.date || "N/A",
            status: item.status?.toUpperCase() || "PENDING",
            paymentStatus: item.paymentStatus || "Unpaid",
            paymentMode: item.paymentMode || "N/A",
          }))
          .filter((p) => p.status === "ADMIN_APPROVED" || p.status === "COMPLETED");

        setPayments(mapped);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setPayments([]);
      }
    };

    fetchPayments();
  }, [id]);

  const filteredPayments = payments.filter(
    (p) =>
      p.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerMobile.includes(searchTerm)
  );

  const updatePaymentStatus = async (payment) => {
    if (!isAdmin) return; // Engineers cannot update
    try {
      const requestId = payment.id;
      const newRequestStatus =
        payment.status === APPLICATION_CONSTANTS.REQUEST_STATUS.ADMIN_APPROVED.value
          ? APPLICATION_CONSTANTS.REQUEST_STATUS.COMPLETED.value
          : payment.status;

      const res = await new ApiService().apiput(
        `${ServerUrl.API_UPDATE_PAYMENT_STATUS}/${requestId}`,
        {
          paymentStatus: APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value,
          status: newRequestStatus,
        }
      );

      if (res.data && res.data.data) {
        alert("Payment and request status updated successfully");
        setPayments((prev) =>
          prev.map((p) =>
            p.id === requestId
              ? { ...p, paymentStatus: APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value, status: newRequestStatus }
              : p
          )
        );

        if (selectedPayment?.id === requestId) {
          setSelectedPayment((prev) => ({
            ...prev,
            paymentStatus: APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value,
            status: newRequestStatus,
          }));
        }
      } else {
        alert("Failed to update payment/request status");
      }
    } catch (err) {
      console.error("Error updating payment/request status:", err);
      alert("Failed to update payment/request status");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f8e9] p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Payment Management</h1>

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base">
          <thead className="bg-green-50">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment Status</th>
              {isAdmin && <th className="p-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                    {p.customerName.charAt(0)}
                  </div>
                  <div>
                    <p>{p.customerName}</p>
                    <p className="text-gray-500 text-sm">{p.customerMobile}</p>
                  </div>
                </td>
                <td className="p-3">{p.bookingId}</td>
                <td className="p-3">{p.brand} {p.model} {p.variant}</td>
                <td className="p-3">₹{p.amount.toLocaleString("en-IN")}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    p.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {p.paymentStatus}
                  </span>
                </td>
                {isAdmin && (
                  <td className="p-3 flex space-x-2">
                    <button onClick={() => setSelectedPayment(p)} className="text-blue-600 hover:text-blue-800">
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button onClick={() => generateInvoicePdf(p)} className="text-gray-600 hover:text-gray-800">
                      <FiDownload className="w-5 h-5" />
                    </button>
                    {p.paymentStatus !== "Paid" && (
                      <button onClick={() => updatePaymentStatus(p)} className="text-green-600 hover:text-green-800">
                        <FiCheck className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg max-w-lg w-full shadow-xl z-10 p-6">
            <h2 className="text-lg font-bold mb-4">{selectedPayment.customerName} - {selectedPayment.bookingId}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Mobile:</strong> {selectedPayment.customerMobile}</p>
              <p><strong>Address:</strong> {selectedPayment.address}</p>
              <p><strong>Vehicle:</strong> {selectedPayment.brand} {selectedPayment.model} {selectedPayment.variant}</p>
              <p><strong>Amount:</strong> ₹{selectedPayment.amount.toLocaleString("en-IN")}</p>
              <p><strong>PDI Date:</strong> {selectedPayment.pdiDate}</p>
              <p><strong>Payment Status:</strong> {selectedPayment.paymentStatus}</p>
              <p><strong>Request Status:</strong> {selectedPayment.status}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => generateInvoicePdf(selectedPayment)} className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center">
                <FiDownload className="w-5 h-5 mr-1" /> Download
              </button>

              {isAdmin && selectedPayment.paymentStatus !== "Paid" && (
                <button onClick={() => updatePaymentStatus(selectedPayment)} className="px-4 py-2 border border-green-600 text-green-600 rounded-md flex items-center">
                  <FiCheck className="w-5 h-5 mr-1" /> Mark as Paid
                </button>
              )}

              <button onClick={() => setSelectedPayment(null)} className="px-4 py-2 border text-gray-600 rounded-md flex items-center">
                <FiX className="w-5 h-5 mr-1" /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
