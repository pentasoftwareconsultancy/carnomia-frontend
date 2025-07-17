import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';


// Sample Data
const allJobs = [
  {
    id: 'job1',
    project: 'Inventory System',
    assignedDate: '2025-08-10',
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
    assignedDate: '2025-08-10',
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

  const handleStartPdi = (jobId) => {
    setPdiStatus((prev) => ({ ...prev, [jobId]: true }));
    alert(`PDI started for ${jobId}`);
  };

  const handleNewPdi = () => {
    window.location.href = '/OngoingJobs';
  };

  const today = new Date().toISOString().slice(0, 10);

  const filteredJobs = allJobs.filter((job) => {
    const matchLocation = locationFilter ? job.customer.location === locationFilter : true;
    const matchSearch =
      searchText === '' ||
      job.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      job.project.toLowerCase().includes(searchText.toLowerCase());
    const matchDate =
      dateFilter === 'today'
        ? job.assignedDate === today
        : dateFilter === 'thisWeek'
        ? new Date(job.assignedDate) >= new Date(new Date().setDate(new Date().getDate() - 7))
        : true;
    return matchLocation && matchSearch && matchDate;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Engineer Dashboard</h1>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-600" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Location</option>
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

          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Date</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name/project"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 rounded border border-gray-300 text-sm"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Jobs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <FiCheckCircle className="mr-2 text-green-500" /> Assigned Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs match your filter.</p>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-black mb-1">Project: {job.project}</h3>
                <p className="text-sm text-gray-600 mb-2">Assigned Date: {job.assignedDate}</p>

                <h4 className="text-blue-700 font-medium mb-1">Customer Contact Details</h4>
                <ul className="text-sm text-gray-700 space-y-1 mb-4">
                  <li><strong>Name:</strong> {job.customer.name}</li>
                  <li><strong>Phone:</strong> {job.customer.phone}</li>
                  <li><strong>Email:</strong> {job.customer.email}</li>
                  <li><strong>Address:</strong> {job.customer.address}</li>
                </ul>

                <button
                  onClick={() => handleStartPdi(job.id)}
                  disabled={pdiStatus[job.id]}
                  className={`w-full py-2 rounded font-semibold ${
                    pdiStatus[job.id]
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  Start PDI
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Ongoing Jobs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Ongoing Jobs</h2>
        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
          <h3 className="font-bold mb-1">Inventory System – Inspection 1254</h3>
          <p className="text-gray-700 mb-1"><strong>Customer Name & Location:</strong> Sachi Mehra – Kothrud</p>
          <p className="text-gray-700 mb-1">
            <strong>Status:</strong>{' '}
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">In Progress</span>
          </p>
          <p className="text-gray-700 mb-2"><strong>Expected Completion Date:</strong> 12-08-2025</p>

          <button
            onClick={() => setShowMoreDetails((prev) => !prev)}
            className="text-green-700 font-medium flex items-center"
          >
            {showMoreDetails ? 'Hide Details' : 'More Details'} <FaChevronRight className="ml-1" />
          </button>

          {showMoreDetails && (
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Phone:</strong> +91-9876345678</p>
              <p><strong>Email:</strong> sachimehra@gmail.com</p>
              <p><strong>Address:</strong> Flat No. 402, Sai Residency, Paud Road, Kothrud</p>
              <p><strong>Job Notes:</strong> Technician to bring barcode scanner and tools.</p>
            </div>
          )}
        </div>
      </section>

      {/* Completed Jobs */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recently completed jobs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg text-sm">
            <thead className="bg-green-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Customer Name</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Completed On</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">View Payment</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {(showMoreCompleted ? completedJobs : completedJobs.slice(0, 3)).map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{entry.name}</td>
                  <td className="px-4 py-2">{entry.location}</td>
                  <td className="px-4 py-2 flex items-center">
                    {entry.date} <FiCheckCircle className="ml-1 text-green-500" />
                  </td>
                  <td className="px-4 py-2">Completed</td>
                  <td className="px-4 py-2 text-green-700 font-medium">Paid</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowMoreCompleted((prev) => !prev)}
            className="mt-3 text-green-700 font-medium flex items-center"
          >
            {showMoreCompleted ? 'Hide' : 'View More'} <FaChevronRight className="ml-1" />
          </button>
        </div>
      </section>

      {/* Start New PDI Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleNewPdi}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center"
        >
          Start New PDI <FaChevronRight className="ml-2" />
        </button>
      </div>

    </div>
  );
};

export default AssignedJobs;
