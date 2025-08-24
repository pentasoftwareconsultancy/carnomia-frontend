import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  format,
  subMonths,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";
import "chart.js/auto";
import { FiCalendar, FiFilter, FiDownload, FiRefreshCw } from "react-icons/fi";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

const generateInspectionData = () => {
  const puneLocations = ["Kothrud", "Hinjewadi", "Baner", "Wakad"];
  const indianBrands = [
    "Tata",
    "Mahindra",
    "Maruti",
    "Hyundai",
    "Kia",
    "Honda",
  ];
  const indianEngineers = [
    "Rajesh Patil",
    "Priya Deshmukh",
    "Amit Joshi",
    "Neha Kulkarni",
  ];

  return Array.from({ length: 500 }, (_, i) => ({
    id: `INSP${1000 + i}`,
    date: subMonths(new Date(), 12 - Math.floor(Math.random() * 365) / 30),
    location: puneLocations[Math.floor(Math.random() * puneLocations.length)],
    brand: indianBrands[Math.floor(Math.random() * indianBrands.length)],
    engineer:
      indianEngineers[Math.floor(Math.random() * indianEngineers.length)],
    status: Math.random() > 0.2 ? "Completed" : "Pending",
  }));
};

const inspectionData = generateInspectionData();

const chartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "right", labels: { usePointStyle: true } },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          return `${context.label}: ${context.raw} (${Math.round(
            (context.raw / total) * 100
          )}%)`;
        },
      },
    },
  },
};

const AdminAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [filteredData, setFilteredData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Keep the original request count call
        const countRes = await new ApiService().apipost(
          ServerUrl.API_GET_REQUEST_COUNT
        );

        // 2. Fetch all PDI requests
        const allPdiRes = await new ApiService().apiget(
          ServerUrl.API_GET_ALLPDIREQUEST
        );

        // 3. Fetch all locations
        const locationsRes = await new ApiService().apiget(
          ServerUrl.API_GET_LOCATIONS
        );

        if (countRes?.data?.data && Array.isArray(allPdiRes?.data?.data)) {
          const c = countRes.data.data;
          const inspections = allPdiRes.data.data;

          // Status distribution
          const statusTrend = inspections.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {});

          // Daily trend
          const dailyTrend = inspections.reduce((acc, item) => {
            const dateStr = format(new Date(item.date), "MMM dd");
            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
          }, {});
          const dailyTrendArray = Object.entries(dailyTrend).map(
            ([name, value]) => ({ name, value })
          );

          // By engineer
          const byEngineer = inspections.reduce((acc, item) => {
            acc[item.engineer] = (acc[item.engineer] || 0) + 1;
            return acc;
          }, {});

          // By location
          const byLocation = inspections.reduce((acc, item) => {
            acc[item.location] = (acc[item.location] || 0) + 1;
            return acc;
          }, {});

          // By brand
          const byBrand = inspections.reduce((acc, item) => {
            acc[item.brand] = (acc[item.brand] || 0) + 1;
            return acc;
          }, {});

          // Optional: check against locationsRes
          const locationList = locationsRes?.data?.data || [];

          setFilteredData({
            summary: {
              total: c.allRequests || 0,
              completed: c.completedJobs || 0,
              pending: c.pendingJobs || 0,
            },
            dailyTrend: dailyTrendArray,
            statusTrend,
            byEngineer,
            byLocation,
            byBrand,
            inspections,
            locationList,
          });
        } else {
          console.error("Failed to fetch required data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, startDate, endDate]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
    setCustomRange(period === "custom");
    const now = new Date();
    const periods = {
      monthly: [startOfMonth(now), endOfMonth(now)],
      quarterly: [startOfQuarter(now), endOfQuarter(now)],
      yearly: [startOfYear(now), endOfYear(now)],
    };
    if (periods[period]) {
      setStartDate(periods[period][0]);
      setEndDate(periods[period][1]);
    }
  };

  const createChartData = (data, colors, label) => ({
    labels: Object.keys(data),
    datasets: [
      {
        label,
        data: Object.values(data),
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });

  const colors = {
    engineer: ["#4f46e5cc", "#10b981cc", "#f59e0bcc", "#ef4444cc"],
    location: ["#8b5cf6cc", "#ec4899cc", "#14b8a6cc", "#f97316cc"],
    brand: [
      "#4f46e5cc",
      "#10b981cc",
      "#f59e0bcc",
      "#ef4444cc",
      "#8b5cf6cc",
      "#ec4899cc",
    ],
    status: ["#10b981cc", "#f59e0bcc"],
  };

  return (
    <div className="min-h-screen bg-primary p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Pune Vehicle Inspection Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              {format(startDate, "MMM dd, yyyy")} -{" "}
              {format(endDate, "MMM dd, yyyy")}
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-filter"
            >
              <FiFilter className="icon" /> Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="label">Time Period</label>
                <select
                  className="input-select"
                  value={timePeriod}
                  onChange={(e) => handleTimePeriodChange(e.target.value)}
                >
                  {["monthly", "quarterly", "yearly", "custom"].map(
                    (period) => (
                      <option key={period} value={period}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </option>
                    )
                  )}
                </select>
              </div>

              {customRange && (
                <>
                  <div>
                    <label className="label">Start Date</label>
                    <input
                      type="date"
                      value={format(startDate, "yyyy-MM-dd")}
                      onChange={(e) => setStartDate(new Date(e.target.value))}
                      className="input-select"
                    />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <input
                      type="date"
                      value={format(endDate, "yyyy-MM-dd")}
                      onChange={(e) => setEndDate(new Date(e.target.value))}
                      className="input-select"
                    />
                  </div>
                </>
              )}

              <div className="flex items-end">
                <button
                  onClick={() => handleTimePeriodChange("monthly")}
                  className="btn-reset"
                >
                  <FiRefreshCw className="icon" /> Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {["total", "completed", "pending"].map((type) => {
                const bgColor =
                  type === "total"
                    ? "bg-indigo-100"
                    : type === "completed"
                    ? "bg-green-100"
                    : "bg-yellow-100";
                const textColor =
                  type === "total"
                    ? "text-indigo-600"
                    : type === "completed"
                    ? "text-green-600"
                    : "text-yellow-600";
                const borderColor =
                  type === "total"
                    ? "border-indigo-500"
                    : type === "completed"
                    ? "border-green-500"
                    : "border-yellow-500";

                return (
                  <div
                    key={type}
                    className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${borderColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {type === "total"
                            ? "Total"
                            : type.charAt(0).toUpperCase() + type.slice(1)}
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {filteredData.summary?.[type] || 0}
                        </h3>
                        {type !== "total" && (
                          <p className="text-sm text-gray-500 mt-1">
                            {Math.round(
                              (filteredData.summary?.[type] /
                                filteredData.summary?.total) *
                                100 || 0
                            )}
                            % of total
                          </p>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${bgColor}`}>
                        <FiCalendar className={`h-6 w-6 ${textColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartCard title="Daily Inspection Trend">
                {filteredData.dailyTrend && (
                  <Line
                    data={{
                      labels: filteredData.dailyTrend.map((item) => item.name),
                      datasets: [
                        {
                          label: "Inspections",
                          data: filteredData.dailyTrend.map(
                            (item) => item.value
                          ),
                          backgroundColor: "#4f46e540",
                          borderColor: "#4f46e5",
                          borderWidth: 2,
                          tension: 0.4,
                          fill: true,
                        },
                      ],
                    }}
                    options={chartConfig}
                  />
                )}
              </ChartCard>

              <ChartCard title="Status Distribution">
                {filteredData.statusTrend && (
                  <Pie
                    data={createChartData(
                      filteredData.statusTrend,
                      colors.status,
                      "Status"
                    )}
                    options={chartConfig}
                  />
                )}
              </ChartCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <ChartCard title="By Engineer">
                {filteredData.byEngineer && (
                  <Pie
                    data={createChartData(
                      filteredData.byEngineer,
                      colors.engineer,
                      "Engineer"
                    )}
                    options={chartConfig}
                  />
                )}
              </ChartCard>

              <ChartCard title="By Location">
                {filteredData.byLocation && (
                  <Pie
                    data={createChartData(
                      filteredData.byLocation,
                      colors.location,
                      "Location"
                    )}
                    options={chartConfig}
                  />
                )}
              </ChartCard>

              <ChartCard title="By Brand">
                {filteredData.byBrand && (
                  <Pie
                    data={createChartData(
                      filteredData.byBrand,
                      colors.brand,
                      "Brand"
                    )}
                    options={chartConfig}
                  />
                )}
              </ChartCard>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-body text-gray-900">
                  Recent Inspections
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "ID",
                        "Date",
                        "Location",
                        "Brand",
                        "Engineer",
                        "Status",
                      ].map((header) => (
                        <th key={header} className="table-header">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.inspections
                      ?.slice(0, 10)
                      .map((inspection) => (
                        <tr key={inspection.id} className="hover:bg-gray-50">
                          <td className="table-cell font-medium">
                            {inspection.id}
                          </td>
                          <td className="table-cell">
                            {format(inspection.date, "MMM dd, yyyy")}
                          </td>
                          <td className="table-cell">{inspection.location}</td>
                          <td className="table-cell">{inspection.brand}</td>
                          <td className="table-cell">{inspection.engineer}</td>
                          <td className="table-cell">
                            <span
                              className={`status-badge ${
                                inspection.status === "Completed"
                                  ? "completed"
                                  : "pending"
                              }`}
                            >
                              {inspection.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-body text-gray-900 mb-6">{title}</h3>
    <div className="h-80">{children}</div>
  </div>
);

export default AdminAnalytics;