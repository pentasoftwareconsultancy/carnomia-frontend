import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Box, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
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
  const [selectedSlots, setSelectedSlots] = useState([]);

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

        setEngineers(fetchedEngineers);

        const uniqueLocations = [...new Set(
          fetchedEngineers
            .map(eng => eng.city?.trim())
            .filter(city => city && city.length > 0)
        )].sort();

        setLocations(uniqueLocations);

        if (uniqueLocations.length === 0) {
          toast.warn('No valid locations found for engineers');
        }
      } catch (err) {
        setError('Failed to load engineers. Please try again.');
        toast.error('Error fetching engineers');
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  const filteredEngineers = engineers.filter((eng) => {
    const locationMatch = selectedLocation === 'all' || eng.city?.trim() === selectedLocation;
    return locationMatch && eng.active !== false;
  });

  useEffect(() => {
    if (selectedEngineerId !== 'all' && filteredEngineers.length > 0) {
      const isValidEngineer = filteredEngineers.some(eng => eng._id === selectedEngineerId);
      if (!isValidEngineer) {
        setSelectedEngineerId('all');
      }
    } else if (filteredEngineers.length === 0 && selectedEngineerId !== 'all') {
      setSelectedEngineerId('all');
    }
  }, [selectedLocation, filteredEngineers, selectedEngineerId]);

  const calculateSlotsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]; // Use YYYY-MM-DD format
    const slots = ["Slot 1", "Slot 2", "Slot 3"];
    const activeEngineers = selectedEngineerId === 'all'
      ? filteredEngineers
      : filteredEngineers.filter(eng => eng._id === selectedEngineerId);

    if (activeEngineers.length === 0) return [];

    const assignedRequests = requests.filter(
      (req) =>
        req.date === dateStr &&
        activeEngineers.some((eng) => eng._id === req.engineerId) &&
        req.status !== 'completed' &&
        req.slot
    );

    const assignedSlots = assignedRequests.map(r => r.slot);
    return slots.filter(slot => !assignedSlots.includes(slot));
  };

  const handleDateClick = (date) => {
    const newDate = new Date(date); // Create a new Date instance to avoid reference issues
    setCalendarDate(newDate);
    const slots = calculateSlotsForDate(newDate);
    setSelectedSlots(slots);
  };

  const getTileClassName = ({ date }) => {
    const currentDateStr = calendarDate ? calendarDate.toISOString().split('T')[0] : null;
    const tileDateStr = date.toISOString().split('T')[0];
    const availableSlots = calculateSlotsForDate(date).length;
    const maxSlots = (selectedEngineerId === 'all' ? filteredEngineers.length : 1) * 3;
    let classes = [];

    // Highlight the currently selected date
    if (currentDateStr === tileDateStr) {
      classes.push('selected-date');
    }

    if (maxSlots > 0) {
      if (availableSlots === maxSlots && maxSlots >= 3) classes.push('all-slots-available');
      else if (availableSlots === maxSlots - 1) classes.push('two-slots-available');
      else if (availableSlots === maxSlots - 2) classes.push('one-slot-available');
      else if (availableSlots === 0) classes.push('no-slots-available');
    }

    return classes.join(" ");
  };

  // ✅ Dynamic date disabling logic
  const isDateDisabled = ({ date }) => {
    // Disable all past dates
    if (date < new Date().setHours(0, 0, 0, 0)) {
      return true;
    }

    // Case 1: No engineer selected → keep all future dates enabled
    if (selectedEngineerId === "all") {
      return false;
    }

    // Case 2: Engineer selected → disable dates if that engineer has no slots
    const slots = calculateSlotsForDate(date);
    return slots.length === 0;
  };


  const selectedEngineer = engineers.find(eng => eng._id === selectedEngineerId);

  return (
    <Card sx={{ background: '#ffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', p: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#81da5b', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Schedule Calendar
        </Typography>

        {loading && (
          <Typography variant="body2" sx={{ color: '#616161', textAlign: 'center', py: 2 }}>
            Loading engineers...
          </Typography>
        )}

        {error && (
          <Typography variant="body2" sx={{ color: '#D32F2F', textAlign: 'center', py: 2 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <>
            {/* Filters */}
            <Box display="flex" gap={2} mb={4} justifyContent="center" flexWrap="wrap">
              <FormControl size="small" sx={{ minWidth: 150, background: '#FFF', borderRadius: '8px' }}>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={locations.length === 0}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180, background: '#FFF', borderRadius: '8px' }}>
                <InputLabel>Engineer</InputLabel>
                <Select
                  value={selectedEngineerId}
                  label="Engineer"
                  onChange={(e) => setSelectedEngineerId(e.target.value)}
                  disabled={filteredEngineers.length === 0}
                  sx={{ borderRadius: '8px' }}
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

            {/* Calendar + Slots Side by Side */}
            <Box display="flex" justifyContent="center" gap={3} mt={2} flexWrap="wrap">
              {/* Calendar */}
              <Card
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  background: '#FFF',
                  flex: '0 1 400px',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#81da5b", mb: 2 }}>
                    Select a Date
                  </Typography>
                  <Calendar
                    onChange={handleDateClick}
                    value={calendarDate}
                    tileClassName={getTileClassName}
                    tileDisabled={isDateDisabled}
                    className="calendar-full"
                    minDate={new Date()}   // this also ensures no past date selection
                  />

                </CardContent>
              </Card>

              {/* Slots */}
              {selectedEngineerId !== 'all' && (
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: '#FFF',
                    flex: '0 1 300px',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#81da5b', mb: 2 }}>
                      {selectedEngineer ? selectedEngineer.name : "Engineer"}'s Slots
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: "#81da5b" }}>
                      Date: {calendarDate ? calendarDate.toISOString().split("T")[0] : ''}
                    </Typography>

                    {selectedSlots.length > 0 ? (
                      <Box display="flex" flexDirection="column" gap={1}>
                        {selectedSlots.map((slot) => (
                          <Chip
                            key={slot}
                            label={slot}
                            sx={{
                              background: '#81da5b',
                              color: '#FFF',
                              fontWeight: 'bold',
                              borderRadius: '12px',
                              padding: '8px',
                              fontSize: '0.95rem',
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ color: "#D32F2F", fontStyle: 'italic' }}>
                        No slots available
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          </>
        )}

        {/* Styles */}
        <style>{`
          .calendar-full {
            width: 100% !important;
          }
          .selected-date {
            background: #1976D2 !important;
            color: white !important;
            border-radius: 50% !important;
            font-weight: bold;
          }
          .react-calendar {
            border: none;
            border-radius: 12px;
            padding: 10px;
          }
          .react-calendar__tile--active.selected-date {
            background: #1976D2 !important;
            color: #fff !important;
            border-radius: 50% !important;
          }
          .react-calendar__tile--now {
            background: #E3F2FD !important;
            border-radius: 50%;
          }
          .react-calendar__tile--active {
            background: #1976D2 !important;
            color: white !important;
            border-radius: 50%;
          }
          .all-slots-available {
            background: #A5D6A7 !important;
            border-radius: 50%;
            color: #1B5E20 !important;
            font-weight: bold;
          }
          .two-slots-available {
            background: #FFCA28 !important;
            border-radius: 50%;
            color: #F57F17 !important;
            font-weight: bold;
          }
          .one-slot-available {
            background: #FF9800 !important;
            border-radius: 50%;
            color: #FFF !important;
            font-weight: bold;
          }
          .no-slots-available {
            background: #EF5350 !important;
            border-radius: 50%;
            color: #FFF !important;
            font-weight: bold;
          }
          .react-calendar__tile:disabled {
            background: #f5f5f5 !important;
            color: #bdbdbd !important;
            opacity: 0.6;
            cursor: not-allowed;
            border-radius: 50% !important;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;