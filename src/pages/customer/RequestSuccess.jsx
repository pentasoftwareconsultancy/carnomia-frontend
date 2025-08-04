import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

const RequestSuccess = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [pdirequest, setpdirequest] = useState([]);

  useEffect(() => {
    const fetchPDIRequest = async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
        if (response?.data?.data?.length > 0) {
          const latestRequest = response.data.data[response.data.data.length - 1];
          setData(latestRequest);
        }
      } catch (err) {
        console.error("Failed to fetch PDI requests", err);
      }
    };

    fetchPDIRequest();
  }, []);

  if (!data) return null;

  const { bookingId, brand, model, imageUrl } = data;

  return (
    <div className="min-h-screen bg-[#F1FFE0] flex items-center justify-center font-sans px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full px-6 py-10 sm:px-10 text-center">
        <h1 className="text-green-700 text-xl sm:text-2xl font-semibold mb-2">
          Congratulations, your PDI is booked successfully!
        </h1>

        <div className="flex justify-center items-center gap-2 text-sm sm:text-base mb-2">
          <FaCheckCircle className="text-green-600" />
          <p className="text-gray-900 font-medium">
            <strong>Your Booking ID -</strong> {bookingId}
          </p>
          <div className="flex items-center gap-1 text-gray-600">
            <strong>Brand:</strong> {brand}
            <strong>Model:</strong> {model}
          </div>
        </div>

        <p className="text-gray-700 text-sm sm:text-base mb-4">
          Our team will reach out soon to finalize your appointment.
        </p>

        <img
          src={imageUrl}
          alt={`${brand} ${model}`}
          className="mx-auto w-full max-w-[500px] object-contain mb-8"
        />

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/customer/dashboard")}
            className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 rounded-full shadow-lg transition"
          >
            Go to your Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccess;
