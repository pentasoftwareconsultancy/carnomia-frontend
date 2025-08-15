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

const AllCustomerRequests = () => {
  const [userName, setUserName] = useState("Guest");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user?.name) setUserName(user.name);

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
        setCompletedOrders(response.data?.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch completed inspections.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, []);

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
        <p><strong>Customer:</strong> ${order.customerName} (${order.customerMobile})</p>
        <p><strong>Engineer:</strong> ${order.engineer_name} (${order.engineer_mobile})</p>
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

  return (
    <div className="min-h-screen bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-regal-blue">
          Completed Inspections
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg text-gray-600">
              Loading completed inspections...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && completedOrders.length === 0 && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg text-center">
            <p className="text-lg text-gray-600">
              No completed inspections found.
            </p>
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
                        {APPLICATION_CONSTANTS.REQUEST_STATUS[order.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Booking ID: {order.bookingId} 
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <InfoCard
                    icon={<FiUser size={18} />}
                    title="Customer"
                    value={`${order.customerName} (${order.customerMobile})`}
                  />
                  <InfoCard
                    icon={<FiUser size={18} />}
                    title="Engineer"
                    value={`${ order.engineer_name ? order.engineer_name + '( '+ order.engineer_mobile +')' : 'N/A' }`}
                  />
                  <InfoCard
                    icon={<FiMapPin size={18} />}
                    title="Location"
                    value={order.address}
                  />
                  <InfoCard
                    icon={<FiCalendar size={18} />}
                    title="Inspection"
                    value={order.date}
                  />
                  <InfoCard
                    icon={<FiDollarSign size={18} />}
                    title="Amount"
                    value={`₹${order.amount}`}
                  />
                  <InfoCard
                    icon={<FiCreditCard size={18} />}
                    title="Payment Mode"
                    value={order.paymentMode}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <BottomCard
                    title="Vehicle Details"
                    value={`Variant: ${vehicle.variant || order.variant}`}
                    color="blue"
                  />
                  <BottomCard
                    title="Payment Details"
                    value={`Status: ${
                      APPLICATION_CONSTANTS.PAYMENT_STATUS[
                        order.paymentStatus?.toUpperCase() || APPLICATION_CONSTANTS.PAYMENT_STATUS.PENDING.value
                      ]?.label
                    } | Date: ${
                      order.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value
                        ? new Date(order.paymentDate).toLocaleDateString()
                        : 'N/A'
                    } | Time: ${
                      order.paymentStatus === APPLICATION_CONSTANTS.PAYMENT_STATUS.PAID.value
                        ? order.payment_time
                        : 'N/A'
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

const BottomCard = ({ title, value, color }) => (
  <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-100`}>
    <p className={`text-sm font-semibold text-${color}-700 mb-2`}>{title}</p>
    <p className="text-sm text-gray-700">{value}</p>
  </div>
);

export default AllCustomerRequests;
