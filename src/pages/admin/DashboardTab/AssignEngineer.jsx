import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { ArrowBack, CheckCircle, Person, Phone, LocationOn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { mockEngineers, timeSlots } from './mockData'; // Assuming you have a mockData file with these arrays
import { motion } from 'framer-motion';
import ApiService from '../../../core/services/api.service';
import ServerUrl from '../../../core/constants/serverUrl.constant'
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  border: '1px solid #C8E6C9',
  boxShadow: theme.shadows[6],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  backgroundColor: '#F1FFE0',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: '#E8F5E9',
    transform: 'translateY(-2px)',
  },
  '&.Mui-selected': {
    backgroundColor: '#C8E6C9',
    borderLeft: '4px solid #2E7D32',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F1FFE0',
  color: '#2E7D32',
  fontWeight: 'bold',
  border: '1px solid #2E7D32',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75, 2),
  textTransform: 'none',
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: '#E8F5E9',
    boxShadow: theme.shadows[5],
  },
  '&:disabled': {
    backgroundColor: '#C8E6C9',
    color: '#2E7D32',
    borderColor: '#2E7D32',
    opacity: 0.6,
  },
}));


// import React, { useState, useEffect } from "react";

const AssignEngineer = ({ request, onAssign, onBack, setModalOpen }) => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [locationFilter, setLocationFilter] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_ALL_USERS_BY_ROLES + '/engineer');
        if (response?.data) {
          setEngineers(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch engineers", err);
      }
    };

    const fetchCities = async () => {
        try {
          const response = await new ApiService().apiget(
            ServerUrl.API_GET_LOCATIONS
          );
          if (response?.data?.locations) {
            setLocationFilter(response.data.locations);
          } else {
            setLocationFilter([]);
          }
        } catch (err) {
          console.error("Failed to fetch Locations", err);
          toast.error("Error fetching cities");
        }
      };

    fetchCities();
    fetchEngineers();
  }, []);

  // Filter engineers by location if filter is set, otherwise show all active engineers
  // const engineers = locationFilter
  //   ? engineers.filter(e => e.location === locationFilter && e.active)
  //   : engineers.filter(e => e.active);

  const handleSelectEngineer = (engineer) => {
    setSelectedEngineer(engineer);
  };

  const handleConfirmAssignment = async () => {
     if (!selectedEngineer || !selectedSlot || !selectedLocation) {
        alert('Please select engineer, location and time slot correctly!');
        return;
      }

      try {
        const payload = {
          requestId: request._id,
          engineerId: selectedEngineer._id,
          location: selectedLocation,
          timeSlot: selectedSlot,
        };

        console.log('Assigning:', payload);

        // Replace API_ASSIGN_ENGINEER with your actual API endpoint path constant
        const response = await new ApiService().apiput(ServerUrl.API_ASSIGN_ENGINEER, payload);

        if (response.data) {
          alert('Engineer assigned successfully!');
          setModalOpen(false);
          // setModalOpen(false);
          // if (onAssign) onAssign(payload);
        } else {
          alert('Failed to assign engineer: ' + (response.data.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error assigning engineer:', error);
        alert('An error occurred while assigning engineer');
      }
    };

  if (!request || !request._id) {
    return (
      <div>request no found</div> 
    );
  }

  return (
    // your motion.div and StyledCard wrapper as before...

    <>
      <CardHeader
        title="Assign Engineer"
        subheader={`Request #${request.bookingId || request._id}`}
        avatar={
          <IconButton onClick={onBack} sx={{ color: '#2E7D32' }}>
            <ArrowBack />
          </IconButton>
        }
        titleTypographyProps={{ color: '#2E7D32', fontWeight: 'bold' }}
        subheaderTypographyProps={{ color: '#2E7D32' }}
      />

      <Divider sx={{ bgcolor: '#C8E6C9' }} />

      <CardContent>
        <Box sx={{ mb: 2 }}>
          {/* Location filter dropdown */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#2E7D32' }}>Filter by Location</InputLabel>
            <Select
              onChange={(e) => setSelectedLocation(e.target.value)}
              label="Filter by Location"
              sx={{
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#C8E6C9' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2E7D32' },
              }}
            >
              {/* <MenuItem value="">All Locations</MenuItem> */}
              {locationFilter.map(loc => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Time slot dropdown */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#2E7D32' }}>Time Slot</InputLabel>
            <Select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              label="Time Slot"
              sx={{
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#C8E6C9' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2E7D32' },
              }}
            >
              {timeSlots.map((slot, idx) => (
                <MenuItem key={idx} value={slot}>{slot}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Engineers list */}
        {engineers.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2, color: '#2E7D32' }}>
            No engineers available{engineers ? ` for ${engineers}` : ''}
          </Typography>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: '#fff', borderRadius: 1, p: 1, border: '1px solid #C8E6C9' }}>
            {engineers.map((engineer, index) => (
              <StyledListItem
                key={engineer._id}
                button
                selected={selectedEngineer?._id === engineer._id}
                onClick={() => handleSelectEngineer(engineer)}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#2E7D32', color: '#fff', width: 48, height: 48 }}>
                    {engineer.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
               <ListItemText
                primary={engineer.name}
                primaryTypographyProps={{ color: '#2E7D32', fontWeight: 'bold', fontSize: '1.1rem' }}
                secondary={
                  <>
                    <Box component="span" display="flex" alignItems="center">
                      <LocationOn fontSize="small" sx={{ mr: 0.5, color: '#2E7D32' }} />
                      <Typography variant="body2" color="#2E7D32" component="span">
                        {engineer.location}
                      </Typography>
                    </Box>
                    <Box component="span" display="flex" alignItems="center">
                      <Phone fontSize="small" sx={{ mr: 0.5, color: '#2E7D32' }} />
                      <Typography variant="body2" component="span" color="#2E7D32">{engineer.phone}</Typography>
                    </Box>
                  </>
                }
                secondaryTypographyProps={{ color: '#2E7D32' }}
              />
                {selectedEngineer?._id === engineer._id && (
                  <CheckCircle sx={{ color: '#2E7D32', fontSize: 28 }} />
                )}
              </StyledListItem>
            ))}
          </List>
        )}
      </CardContent>

      <Divider sx={{ bgcolor: '#C8E6C9' }} />

      <Box
        sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <StyledButton onClick={onBack}>Back</StyledButton>
        <StyledButton
          disabled={!selectedEngineer || !selectedSlot}
          onClick={handleConfirmAssignment}
          startIcon={<CheckCircle />}
        >
          Confirm Assignment
        </StyledButton>
      </Box>

    </>
  );
};

export default AssignEngineer;