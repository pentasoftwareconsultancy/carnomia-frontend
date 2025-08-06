import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import { Person, CheckCircle, Badge, CalendarToday, Engineering, Assignment } from '@mui/icons-material';
import { mockEngineers, mockRequests } from './DashboardTab/mockData';
import NewRequests from './DashboardTab/NewRequests';
import JobsManagement from './DashboardTab/JobsManagement';
import CompletedJobs from './DashboardTab/CompletedJobs';
import AllRequests from './DashboardTab/AllRequests';
import EngineerManagement from './DashboardTab/EngineerManagement';
import ScheduleCalendar from './DashboardTab/ScheduleCalendar';
import RequestDetails from './DashboardTab/RequestDetails';
import EditRequestForm from './DashboardTab/EditRequestForm';
import Modal from './DashboardTab/Modal';

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [requests, setRequests] = useState(mockRequests);
  const [engineers, setEngineers] = useState(mockEngineers);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [assignedJobsFilter, setAssignedJobsFilter] = useState('assigned');

  const newRequestsRef = useRef(null);
  const assignedJobsRef = useRef(null);
  const completedJobsRef = useRef(null);
  const allRequestsRef = useRef(null);
  const engineersRef = useRef(null);
  const calendarRef = useRef(null);

  const isEngineerAvailable = (engineerId, date, slot) => {
    if (!slot) return false;
    return !requests.some(
      (req) =>
        req.assignedEngineer === engineers.find((eng) => eng.id === engineerId)?.name &&
        req.date === date &&
        req.slot === slot &&
        req.status !== 'completed'
    );
  };

  const assignEngineer = (id, eng, slot) => {
    console.log('AdminDashboard: Assigning Engineer:', { id, engineer: eng, slot });
    if (!slot) {
      alert('Please select a time slot.');
      return;
    }
    if (!isEngineerAvailable(eng.id, selectedRequest?.date, slot)) {
      alert(`Engineer ${eng.name} is already assigned to another job in the ${slot} slot on ${selectedRequest?.date}.`);
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, assignedEngineer: eng.name, slot, status: 'assigned' }
          : r
      )
    );
    setSelectedRequest(null);
  };

  const handleSaveEdit = (updatedRequest) => {
    console.log('AdminDashboard: Saving edited request:', updatedRequest);
    setRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
    setSelectedRequest(updatedRequest);
    setEditMode(false);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const statusCards = [
    {
      label: 'New Requests',
      count: requests.filter((r) => r.status === 'new').length,
      icon: <Assignment fontSize="medium" />,
      ref: newRequestsRef,
      description: 'Requests awaiting assignment',
    },
    {
      label: 'Assigned Jobs',
      count: requests.filter((r) => r.status === 'assigned').length,
      icon: <Engineering fontSize="medium" />,
      ref: assignedJobsRef,
      description: 'Jobs in progress',
    },
    {
      label: 'Completed Jobs',
      count: requests.filter((r) => r.status === 'completed').length,
      icon: <CheckCircle fontSize="medium" />,
      ref: completedJobsRef,
      description: 'Jobs completed',
    },
    {
      label: 'All Requests',
      count: requests.length,
      icon: <Badge fontSize="medium" />,
      ref: allRequestsRef,
      description: 'Total service requests',
    },
    {
      label: 'Active Engineers',
      count: engineers.filter((e) => e.active).length,
      icon: <Person fontSize="medium" />,
      ref: engineersRef,
      description: 'Engineers available',
    },
    {
      label: 'Upcoming Schedule',
      count: requests.filter((r) => new Date(r.date) > new Date()).length,
      icon: <CalendarToday fontSize="medium" />,
      ref: calendarRef,
      description: 'Scheduled appointments',
    },
  ];

    return (
    <div className="bg-[#f1f8e9] min-h-screen p-2 sm:p-3">
      <Typography
        variant="h4"
        component="h1"
        className="font-semibold mb-4 text-center text-[#2E7D32]"
      >
      </Typography>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {statusCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#fbfcfa] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-40 overflow-hidden hover:-translate-y-1 border-t-4 border-[#2E7D32] relative"
            onClick={() => scrollToSection(card.ref)}
          >            
            <div className="p-4 flex flex-col h-full z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="bg-[#E8F5E9] p-2 rounded-lg">
                  {React.cloneElement(card.icon, { 
                    style: { color: '#2E7D32', fontSize: '1.5rem' } 
                  })}
                </div>
                <Typography
                  variant="h4"
                  className="font-bold text-[#2E7D32] text-2xl"
                >
                  {card.count}
                </Typography>
              </div>
              <div className="mt-auto">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 text-lg mb-1"
                >
                  {card.label}
                </Typography>
                <Typography
                  variant="body2"
                  className="text-gray-600 text-sm"
                >
                  {card.description}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

       <div ref={newRequestsRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <NewRequests
          requests={requests}
          setRequests={setRequests}
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          assignedJobsRef={assignedJobsRef}
        />
      </div>

      <div ref={assignedJobsRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <JobsManagement
          requests={requests}
          setRequests={setRequests}
          setSelectedRequest={setSelectedRequest}
          setViewMode={setViewMode}
          setEditMode={setEditMode}
          assignedJobsFilter={assignedJobsFilter}
          setAssignedJobsFilter={setAssignedJobsFilter}
          assignedJobsRef={assignedJobsRef}
        />
      </div>

      <div ref={completedJobsRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <CompletedJobs requests={requests} />
      </div>

      <div ref={allRequestsRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <AllRequests
          requests={requests}
          setRequests={setRequests}
          setSelectedRequest={setSelectedRequest}
          setViewMode={setViewMode}
          setEditMode={setEditMode}
        />
      </div>

      <div ref={engineersRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <EngineerManagement engineers={engineers} setEngineers={setEngineers} />
      </div>

      <div ref={calendarRef} className="bg-[#f1f8e9] rounded-lg p-3 mb-3">
        <ScheduleCalendar
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          engineers={engineers}
          requests={requests}
        />
      </div>

      {viewMode && selectedRequest && (
        <Modal onClose={() => { setViewMode(false); setSelectedRequest(null); }}>
          <RequestDetails
            request={selectedRequest}
            onClose={() => { setViewMode(false); setSelectedRequest(null); }}
          />
        </Modal>
      )}

      {editMode && selectedRequest && (
        <Modal onClose={() => { setEditMode(false); setSelectedRequest(null); }}>
          <EditRequestForm
            request={selectedRequest}
            onSave={handleSaveEdit}
            onCancel={() => { setEditMode(false); setSelectedRequest(null); }}
          />
        </Modal>
      )}
    </div>
  );
}