import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import { APPLICATION_CONSTANTS } from "../../core/constants/app.constant";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";

const AllCustomerRequests = () => {
  const location = useLocation();
  const { user } = useAuth();

  const userName = location.state?.name || user?.name || "Guest";

  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        setLoading(true);
        const payload = [
          APPLICATION_CONSTANTS.REQUEST_STATUS.NEW.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.ASSIGNED_ENGINEER.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.IN_PROGRESS.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.WAITING_FOR_APPROVAL.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.ADMIN_APPROVED.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.ADMIN_REJECTED.value,
          APPLICATION_CONSTANTS.REQUEST_STATUS.CUSTOMER_PAID.value,
        ];

        const response = await new ApiService().apipost(
          ServerUrl.API_GET_ALL_PDIREQUEST_STATUSES,
          payload
        );

        const normalizedOrders = (response.data?.data || []).map((order) => {
          // Customer
          let customerName =
            order.customerName ||
            order.name ||
            userName;

          let customerMobile =
            order.customerMobile ||
            order.customer?.mobile ||
            "";

          if (customerMobile) {
            customerName = `${customerName} (${customerMobile})`;
          }

          // Engineer
          const engineerName = order.engineer_name || order.engineer?.name || null;
          const engineerMobile = order.engineer_mobile || order.engineer?.mobile || "";
          const engineerDisplay = engineerName
            ? engineerMobile
              ? `${engineerName} (${engineerMobile})`
              : engineerName
            : "N/A";

          return {
            ...order,
            customerName,
            engineerName: engineerDisplay,
          };
        });

        setCompletedOrders(normalizedOrders);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch completed inspections.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [userName]);

  const downloadReport = (order) => {
    const vehicle = order.vehicleDetails || {};
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><title>Report - ${order.bookingId}</title></head>
      <body>
        <h1>Inspection Report</h1>
        <p><strong>Booking ID:</strong> ${order.bookingId}</p>
        <p><strong>Brand:</strong> ${order.brand}</p>
        <p><strong>Model:</strong> ${order.model}</p>
        <p><strong>Variant:</strong> ${vehicle.variant || order.variant}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Engineer:</strong> ${order.engineerName}</p>
        <p><strong>Engineer Location:</strong> ${order.engineer_location}</p>
        <p><strong>Inspection Date & Time:</strong> ${order.date}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>
        <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        <p><strong>Payment Date:</strong> ${order.paymentDate}</p>
        <p><strong>Payment Time:</strong> ${order.payment_time}</p>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Drivesta_Report_${order.bookingId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Tailwind-safe color mapping
  const colorMap = {
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700" },
  };

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-heading-bold text-button">All Inspections</h1>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button"></div>
            <p className="ml-4 text-lg text-gray-600">Loading completed inspections...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && completedOrders.length === 0 && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">No completed inspections found.</p>
          </div>
        )}

        {!loading &&
          !error &&
          completedOrders.length > 0 &&
          completedOrders.map((order, index) => {
            const vehicle = order.vehicleDetails || {};
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-button p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {order.brand} {order.model}
                    </h2>
                    <div className="flex items-center mt-2 gap-2">
                      <span className="px-3 py-1 text-sm font-medium bg-green-50 text-button rounded-full flex items-center gap-2">
                        <FiCheckCircle size={16} />{" "}
                        {APPLICATION_CONSTANTS.REQUEST_STATUS[order.status]?.label || "N/A"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Booking ID: {order.bookingId}</p>
                  </div>
                  <button
                    onClick={() => downloadReport(order)}
                    className="mt-2 sm:mt-0 px-4 py-2 bg-button text-white rounded hover:bg-green-500 flex items-center gap-2"
                  >
                    <FiDownload /> Download Report
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <InfoCard icon={<FiUser size={18} />} title="Customer" value={order.customerName} />
                  <InfoCard icon={<FiUser size={18} />} title="Engineer" value={order.engineerName} />
                  <InfoCard icon={<FiMapPin size={18} />} title="Location" value={order.address} />
                  <InfoCard icon={<FiCalendar size={18} />} title="Inspection" value={order.date} />
                  <InfoCard icon={<FiDollarSign size={18} />} title="Amount" value={`₹${order.amount}`} />
                  <InfoCard icon={<FiCreditCard size={18} />} title="Payment Mode" value={order.paymentMode} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <BottomCard title="Vehicle Details" value={`Variant: ${vehicle.variant || order.variant}`} color="blue" />
                  <BottomCard
                    title="Payment Details"
                    value={`Status: ${
                      APPLICATION_CONSTANTS.PAYMENT_STATUS[order.paymentStatus?.toUpperCase() || "PENDING"]?.label
                    } | Date: ${
                      order.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value
                        ? new Date(order.paymentDate).toLocaleDateString()
                        : "N/A"
                    } | Time: ${
                      order.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value
                        ? order.payment_time
                        : "N/A"
                    }`}
                    color="purple"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 border border-button p-4 rounded-lg flex flex-col gap-2 transition-transform duration-200 hover:scale-105">
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>
      <p className="text-sm font-medium text-gray-600">{title}</p>
    </div>
    <p className="text-base font-semibold text-gray-900">{value || "N/A"}</p>
  </div>
);

const BottomCard = ({ title, value, color }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700" },
    purple: { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-700" },
  };
  const c = colorMap[color] || colorMap.blue;
  return (
    <div className={`${c.bg} p-4 rounded-lg border ${c.border}`}>
      <p className={`${c.text} text-sm font-semibold mb-2`}>{title}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
};

export default AllCustomerRequests;
