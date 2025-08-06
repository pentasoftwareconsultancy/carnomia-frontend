import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaChevronRight, FaChevronDown, FaPlus } from 'react-icons/fa';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Sample Data
const allJobs = [
  {
    id: 'job1',
    project: 'Inventory System',
    assignedDate: new Date().toISOString().slice(0, 10), // Today's date
    customer: {
      name: 'Sachi Mehra',
      phone: '+91-9876345678',
      email: 'sachimehra@gmail.com',
      address: 'Flat No. 402, Sai Residency, Near MIT College, Paud Road, Kothrud, Pune - 411038',
      location: 'Kothrud'
    }
  },
  {
    id: 'job2',
    project: 'Inventory System',
    assignedDate: '2025-08-10',
    customer: {
      name: 'Rohan Kale',
      phone: '+91-9876543210',
      email: 'rohan.kale@gmail.com',
      address: 'Flat 12, Green Heights, Baner Road, Pune - 411045',
      location: 'Baner'
    }
  },
  {
    id: 'job3',
    project: 'Inventory System',
    assignedDate: new Date().toISOString().slice(0, 10), // Today's date
    customer: {
      name: 'Pooja Patil',
      phone: '+91-9988776655',
      email: 'pooja.patil@gmail.com',
      address: 'Sunshine Residency, Kalyani Nagar, Pune - 411006',
      location: 'Kalyani Nagar'
    }
  }
];

const completedJobs = [
  { name: 'Aniket Joshi', location: 'Karve Nagar', date: '08-07-2025' },
  { name: 'Rajeev Kumar', location: 'Kalyani Nagar', date: '07-07-2025' },
  { name: 'Neha Rane', location: 'Camp, Pune', date: '07-07-2025' },
  { name: 'Sneha Shinde', location: 'Baner', date: '06-07-2025' },
  { name: 'Vikram Pawar', location: 'Hinjewadi', date: '05-07-2025' },
];

const AssignedJobs = () => {
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pdiStatus, setPdiStatus] = useState({});
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [showMoreCompleted, setShowMoreCompleted] = useState(false);
  const navigate = useNavigate();

  const handleStartPdi = (jobId) => {
    setPdiStatus((prev) => ({ ...prev, [jobId]: true }));
    const selectedJob = allJobs.find(job => job.id === jobId);
  };

  const today = new Date().toISOString().slice(0, 10);

  const filteredJobs = allJobs.filter((job) => {
    const matchLocation = locationFilter ? job.customer.location === locationFilter : true;
    const matchSearch =
      searchText === '' ||
      job.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      job.project.toLowerCase().includes(searchText.toLowerCase());
    const matchDate = dateFilter === 'today' ? job.assignedDate === today : true;
    return matchLocation && matchSearch && matchDate;
  });

  return (
    <div className="bg-[#f1f8e9] min-h-screen p-4 md:p-6 font-sans">

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Engineer Dashboard</h1>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex items-center">
              <FaMapMarkerAlt className="absolute left-3 text-green-600 z-10" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-10 py-2 text-sm w-full md:w-48 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">All Locations</option>
                <option value="Kothrud">Kothrud</option>
                <option value="Baner">Baner</option>
                <option value="Hadapsar">Hadapsar</option>
                <option value="Karve Nagar">Karve Nagar</option>
                <option value="Camp">Camp</option>
                <option value="Hinjewadi">Hinjewadi</option>
                <option value="Kalyani Nagar">Kalyani Nagar</option>
                <option value="Wakad">Wakad</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-full md:w-32 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name/project"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-sm w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Jobs */}
      <section className="mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-green-800 flex items-center">
            <FiCheckCircle className="mr-2 text-green-600" /> Assigned Jobs
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredJobs.length} jobs
            </span>
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
            <div className="text-gray-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-1">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{job.project}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <FiClock className="mr-1" /> Assigned: {job.assignedDate}
                  </p>

                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <h4 className="text-green-800 font-medium mb-2">Customer Details</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-start">
                        <span className="font-medium text-gray-600 w-16">Name:</span>
                        <span>{job.customer.name}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium text-gray-600 w-16">Phone:</span>
                        <span>{job.customer.phone}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium text-gray-600 w-16">Email:</span>
                        <span className="truncate">{job.customer.email}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium text-gray-600 w-16">Location:</span>
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="text-green-500 mr-1 text-xs" />
                          {job.customer.location}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/engineer/dashboard/ongoing-job")}
                  disabled={pdiStatus[job.id]}
                  className={`w-full py-2.5 rounded-lg font-semibold mt-auto flex items-center justify-center transition-all ${
                    pdiStatus[job.id]
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {pdiStatus[job.id] ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PDI In Progress
                    </>
                  ) : (
                    'Start PDI'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ongoing Jobs */}
      <section className="mb-8 md:mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
          <FiClock className="mr-2 text-green-600" /> Ongoing Jobs
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Inventory System – Inspection 1254</h3>
              <p className="text-gray-700 mb-1 flex items-center">
                <FaMapMarkerAlt className="text-green-500 mr-1 text-xs" />
                <span>Sachi Mehra – Kothrud</span>
              </p>
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  In Progress
                </span>
                <span className="text-xs text-gray-500">Expected: 12-08-2025</span>
              </div>
            </div>
            <button
              onClick={() => setShowMoreDetails((prev) => !prev)}
              className="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors"
            >
              {showMoreDetails ? (
                <>
                  <span className="mr-1">Hide</span>
                  <FaChevronDown className="text-xs" />
                </>
              ) : (
                <>
                  <span className="mr-1">Details</span>
                  <FaChevronRight className="text-xs" />
                </>
              )}
            </button>
          </div>

          {showMoreDetails && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Contact Information</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li className="flex">
                      <span className="font-medium text-gray-500 w-20">Phone:</span>
                      <span>+91-9876345678</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium text-gray-500 w-20">Email:</span>
                      <span>sachimehra@gmail.com</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium text-gray-500 w-20">Address:</span>
                      <span>Flat No. 402, Sai Residency, Kothrud</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Job Notes</h4>
                  <div className="bg-green-50 rounded-lg p-3 text-gray-600">
                    Technician to bring barcode scanner and tools. Customer requested morning appointment.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    
    
    </div>
  );
};

export default AssignedJobs;