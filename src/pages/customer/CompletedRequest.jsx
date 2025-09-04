import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiCheckCircle,
  FiPhone,
} from "react-icons/fi";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import { APPLICATION_CONSTANTS } from "../../core/constants/app.constant";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";

const CompletedRequests = () => {

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
          APPLICATION_CONSTANTS.REQUEST_STATUS.COMPLETED.value,,
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
            customerName = `${customerName}`;
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
        <p><strong>Engineer:</strong> ${order.engineer_name}</p>
        <p><strong>Engineer Contact:</strong> ${order.engineer_mobile}</p>
        <p><strong>Engineer Location:</strong> ${order.engineer_location}</p>
        <p><strong>Inspection Date & Time:</strong> ${order.inspection_date_time}</p>
        <p><strong>Amount:</strong> ${order.amount}</p>
        <p><strong>Payment Mode:</strong> ${order.payment_mode}</p>
        <p><strong>Chassis No:</strong> ${vehicle.chassis_no || "N/A"}</p>
        <p><strong>Payment Status:</strong> ${order.payment_status}</p>
        <p><strong>Payment Date:</strong> ${order.payment_date}</p>
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
  };

  return (
    <div className="min-h-screen bg-primary py-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-heading-bold text-button">
          Completed Inspections
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-button"></div>
            <p className="ml-4 text-lg text-gray-600">
              Loading completed inspections...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : completedOrders.length === 0 ? (
          <p className="text-center text-gray-700">
            No completed inspections found.
          </p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {completedOrders.map((order, index) => {
              const vehicle = order.vehicleDetails || {};
              const topInfoCards = [
                {
                  label: "Customer",
                  icon: <FiUser />,
                  value: `${order.customerName || "N/A"} 
                  (${order.customerMobile || "N/A"})`,
                },
                {
                  label: "Engineer",
                  icon: <FiUser />,
                  value: `${order.engineer_name || "N/A"} (${
                    order.engineer_mobile || "N/A"
                  })`,
                },
                {
                  label: "Contact No.",
                  icon: <FiPhone />,
                  value: order.engineer_mobile || "N/A",
                },
                {
                  label: "Location",
                  icon: <FiMapPin />,
                  value: order.engineer_location || "N/A",
                },
                {
                  label: "Inspection",
                  icon: <FiCalendar />,
                  value: order.inspection_date_time || "N/A",
                },
                {
                  label: "Amount",
                  icon: <FiDollarSign />,
                  value: order.amount || "N/A",
                },
                {
                  label: "Payment Mode",
                  icon: <FiCreditCard />,
                  value: order.payment_mode || "N/A",
                },
              ];

            return (
              <div
                key={index}
                className="bg-white backdrop-blur-md border border-button rounded-xl shadow-md overflow-hidden p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {order.brand} {order.model}
                    </h2>
                    <div className="flex items-center mt-1 gap-2">
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                        <FiCheckCircle size={12} /> Completed
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: {order.bookingId}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadReport(order)}
                    className="flex items-center px-4 py-2 text-sm bg-button text-white rounded-lg shadow-sm transition-all mt-3 sm:mt-0"
                  >
                    <FiDownload className="mr-2" /> Download Report
                  </button>
                </div>

                {/* Top Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topInfoCards.map((card, i) => (
                    <div
                      key={i}
                      className="bg-white/20 backdrop-blur-sm border border-button p-3 rounded-lg"
                    >
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {card.icon} {card.label}
                      </p>
                      <p className="font-medium">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom Info Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vehicle Details */}
                  <div className="bg-blue-50/40 backdrop-blur-sm p-4 rounded-2xl border border-button">
                    <p className="text-sm font-semibold text-blue-700 mb-2">
                      Vehicle Details
                    </p>
                    <div className="flex justify-between text-gray-700">
                      <span>
                        Variant: <strong>{vehicle.variant || order.variant}</strong>
                      </span>
                      {/* <span>
                        Chassis No: <strong>{vehicle.chassis_no || "N/A"}</strong>
                      </span> */}
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-blue-50/40 backdrop-blur-sm p-4 rounded-2xl border border-button">
                    <p className="text-sm font-semibold text-purple-700 mb-2">
                      Payment Status / Details
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between text-gray-700 gap-2">
                      <span>
                        Status: <strong>{order.paymentStatus}</strong>
                      </span>
                      <span>
                        Date: <strong>{order.payment_date || "N/A"}</strong>
                      </span>
                      <span>
                        Time: <strong>{order.payment_time || "N/A"}</strong>
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedRequests;
