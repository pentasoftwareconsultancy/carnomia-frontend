import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";
import { toast } from 'react-toastify';

const ScheduleCalendar = ({ calendarDate, setCalendarDate, requests }) => {
  const [engineers, setEngineers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedEngineerId, setSelectedEngineerId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await new ApiService().apiget(
          ServerUrl.API_GET_ALL_USERS_BY_ROLES + "/engineer"
        );

        let fetchedEngineers = [];
        if (response?.data?.data) {
          fetchedEngineers = response.data.data;
        } else if (Array.isArray(response?.data)) {
          fetchedEngineers = response.data;
        } else {
          throw new Error('Invalid API response structure');
        }

        console.log('Fetched Engineers:', fetchedEngineers); // Debug log
        setEngineers(fetchedEngineers);

        // Derive unique locations from engineers' cities
        const uniqueLocations = [...new Set(
          fetchedEngineers
            .map(eng => eng.city?.trim()) // Handle null/undefined and trim spaces
            .filter(city => city && city.length > 0) // Remove empty or null cities
        )].sort();
        console.log('Unique Locations:', uniqueLocations); // Debug log
        setLocations(uniqueLocations);

        if (uniqueLocations.length === 0) {
          toast.warn('No valid locations found for engineers');
        }
      } catch (err) {
        console.error("Failed to fetch engineers:", err);
        setError('Failed to load engineers. Please try again.');
        toast.error('Error fetching engineers');
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  // Filter engineers based on selected location
  const filteredEngineers = engineers.filter((eng) => {
    const locationMatch = selectedLocation === 'all' || eng.city?.trim() === selectedLocation;
    return locationMatch && eng.active !== false; // Allow engineers without active field or active: true
  });

  // Debug filtered engineers
  useEffect(() => {
    console.log('Selected Location:', selectedLocation);
    console.log('Filtered Engineers:', filteredEngineers);
  }, [selectedLocation, filteredEngineers]);

  // Reset selectedEngineerId when location changes if the current engineer is not valid
  useEffect(() => {
    if (selectedEngineerId !== 'all' && filteredEngineers.length > 0) {
      const isValidEngineer = filteredEngineers.some(eng => eng._id === selectedEngineerId);
      if (!isValidEngineer) {
        setSelectedEngineerId('all');
        console.log('Reset selectedEngineerId to "all" due to location change');
      }
    } else if (filteredEngineers.length === 0 && selectedEngineerId !== 'all') {
      setSelectedEngineerId('all');
      console.log('Reset selectedEngineerId to "all" due to no engineers available');
    }
  }, [selectedLocation, filteredEngineers, selectedEngineerId]);

  // Calculate available slots for a given date
  const getAvailableSlotsCount = (dateStr) => {
    const activeEngineers = selectedEngineerId === 'all'
      ? filteredEngineers
      : filteredEngineers.filter(eng => eng._id === selectedEngineerId);
    const totalPossibleAssignments = activeEngineers.length * 3; // 3 slots per engineer

    const assignedSlots = requests.filter(
      (req) =>
        req.date === dateStr &&
        activeEngineers.some((eng) => eng._id === req.engineerId) &&
        req.status !== 'completed' &&
        req.slot
    ).length;

    return Math.max(0, totalPossibleAssignments - assignedSlots);
  };

  const getTileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const availableSlots = getAvailableSlotsCount(dateStr);
    const maxSlots = (selectedEngineerId === 'all' ? filteredEngineers.length : 1) * 3;

    if (maxSlots === 0) return null; // No active engineers

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

        {loading && (
          <Typography variant="body2" sx={{ color: '#616161', textAlign: 'center', py: 2 }}>
            Loading engineers...
          </Typography>
        )}

        {error && (
          <Typography variant="body2" sx={{ color: '#F44336', textAlign: 'center', py: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <>
            <Box display="flex" gap={2} mb={2}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={locations.length === 0}
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Engineer</InputLabel>
                <Select
                  value={selectedEngineerId}
                  label="Engineer"
                  onChange={(e) => setSelectedEngineerId(e.target.value)}
                  disabled={filteredEngineers.length === 0}
                >
                  <MenuItem value="all">All Engineers</MenuItem>
                  {filteredEngineers.map((eng) => (
                    <MenuItem key={eng._id} value={eng._id}>
                      {eng.name} ({eng.city})
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
                tileDisabled={() => filteredEngineers.length === 0}
              />
            </Box>
          </>
        )}

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
            background: #F5F5F7 /* light green */
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
          .react-calendar__tile--disabled {
            background: #E0E0E0;
            color: #9E9E9E;
            cursor: not-allowed;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;