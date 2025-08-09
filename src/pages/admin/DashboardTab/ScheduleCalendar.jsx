import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const dummyEngineers = [
  { id: 1, name: 'Engineer A', location: 'Mumbai', active: true },
  { id: 2, name: 'Engineer B', location: 'Delhi', active: true },
];

const locations = ['Mumbai', 'Delhi'];

const ScheduleCalendar = ({ calendarDate, setCalendarDate, engineers = dummyEngineers, requests }) => {
  const [selectedEngineerId, setSelectedEngineerId] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Filter engineers based on location and selected engineer
  const filteredEngineers = engineers.filter((eng) => {
    const locationMatch = selectedLocation === 'all' || eng.location === selectedLocation;
    const engineerMatch = selectedEngineerId === 'all' || eng.id === selectedEngineerId;
    return locationMatch && engineerMatch && eng.active;
  });

  // Calculate available slots for a given date filtered by selected engineer and location
  const getAvailableSlotsCount = (dateStr) => {
    const activeEngineersCount = filteredEngineers.length;
    const totalPossibleAssignments = activeEngineersCount * 3; // 3 slots per engineer

    const assignedSlots = requests.filter(
      (req) =>
        req.date === dateStr &&
        filteredEngineers.some((eng) => eng.id === req.engineerId) &&
        req.status !== 'completed' &&
        req.slot
    ).length;

    return Math.max(0, totalPossibleAssignments - assignedSlots);
  };

  const getTileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const availableSlots = getAvailableSlotsCount(dateStr);
    const maxSlots = filteredEngineers.length * 3;

    if (maxSlots === 0) return null; // no active engineers selected

    if (availableSlots === maxSlots && maxSlots >= 3) return 'all-slots-available';
    if (availableSlots === maxSlots - 1) return 'two-slots-available';
    if (availableSlots === maxSlots - 2) return 'one-slot-available';
    if (availableSlots === 0) return 'no-slots-available';
    return null;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          Schedule Calendar
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Engineer</InputLabel>
            <Select
              value={selectedEngineerId}
              label="Engineer"
              onChange={(e) => setSelectedEngineerId(e.target.value)}
            >
              <MenuItem value="all">All Engineers</MenuItem>
              {engineers.map((eng) => (
                <MenuItem key={eng.id} value={eng.id}>
                  {eng.name} ({eng.location})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Location</InputLabel>
            <Select
              value={selectedLocation}
              label="Location"
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <MenuItem value="all">All Locations</MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" justifyContent="center">
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
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
            background: #A5D6A7; /* light green */
            border-radius: 50%;
            color: black;
          }
          .two-slots-available {
            background: #FFEB3B; /* yellow */
            border-radius: 50%;
            color: black;
          }
          .one-slot-available {
            background: #FF9800; /* orange */
            border-radius: 50%;
            color: white;
          }
          .no-slots-available {
            background: #F44336; /* red */
            border-radius: 50%;
            color: white;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;