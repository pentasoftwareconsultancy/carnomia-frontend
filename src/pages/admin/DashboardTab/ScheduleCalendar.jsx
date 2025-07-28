import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ScheduleCalendar = ({ calendarDate, setCalendarDate, engineers, requests }) => {
  const getAvailableSlotsCount = (dateStr) => {
    const activeEngineers = engineers.filter((eng) => eng.active);
    const totalPossibleAssignments = activeEngineers.length * 3; // Assuming 3 time slots per engineer
    const assignedSlots = requests.filter(
      (req) => req.date === dateStr && req.status !== "completed" && req.slot
    ).length;
    return Math.max(0, totalPossibleAssignments - assignedSlots);
  };

  const getTileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const availableSlots = getAvailableSlotsCount(dateStr);
    const activeEngineers = engineers.filter((e) => e.active).length;
    const maxSlots = activeEngineers * 3;

    if (availableSlots === maxSlots && maxSlots >= 3) return 'all-slots-available';
    if (availableSlots === 2) return 'two-slots-available';
    if (availableSlots === 1) return 'one-slot-available';
    if (availableSlots === 0) return 'no-slots-available';
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          Schedule Calendar
        </Typography>
        <Box display="flex" justifyContent="center">
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            className="react-calendar"
            tileClassName={getTileClassName}
          />
        </Box>
        <style>{`
          .react-calendar {
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 10px;
            max-width: 100%;
          }
          .react-calendar__tile--now {
            background: #E8F5E9;
          }
          .react-calendar__tile--active {
            background: #4CAF50;
            color: white;
          }
          .all-slots-available {
            background: #4CAF50;
            border-radius: 50%;
            color: white;
          }
          .two-slots-available {
            background: #FFA500;
            border-radius: 50%;
            color: white;
          }
          .one-slot-available {
            background: #FFFF00;
            border-radius: 50%;
            color: black;
          }
          .no-slots-available {
            background: #F44336;
            border-radius: 50%;
            color: white;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;