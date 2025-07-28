import React, { useState } from 'react';
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

const AssignEngineer = ({ request, onAssign, onBack }) => {
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');

  const filteredEngineers = locationFilter ? mockEngineers.filter(engineer => 
    engineer.location === locationFilter && engineer.active
  ) : [];

  const handleSelectEngineer = (engineer) => {
    console.log('AssignEngineer: Selected Engineer:', engineer);
    setSelectedEngineer(engineer);
  };

  const handleConfirmAssignment = () => {
    console.log('AssignEngineer: onAssign prop:', typeof onAssign);
    if (selectedEngineer && selectedSlot) {
      console.log('AssignEngineer: Confirming Assignment:', {
        id: request?.id,
        engineer: selectedEngineer,
        slot: selectedSlot
      });
      onAssign(selectedEngineer, selectedSlot);
    } else {
      console.log('AssignEngineer: Assignment failed: Engineer or slot not selected', {
        selectedEngineer,
        selectedSlot
      });
    }
  };

  if (!request || !request.id) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <StyledCard elevation={0}>
          <CardHeader
            title="Error"
            subheader="Invalid request data"
            avatar={
              <IconButton onClick={onBack} sx={{ color: '#2E7D32' }}>
                <ArrowBack />
              </IconButton>
            }
            titleTypographyProps={{ color: '#2E7D32', fontWeight: 'bold' }}
            subheaderTypographyProps={{ color: '#2E7D32' }}
          />
          <CardContent>
            <Typography color="error">No valid request data provided.</Typography>
          </CardContent>
        </StyledCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <StyledCard elevation={0}>
        <CardHeader
          title="Assign Engineer"
          subheader={`Request #${request.bookingId || request.id}`}
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
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#2E7D32' }}>Filter by Location</InputLabel>
              <Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                label="Filter by Location"
                sx={{
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#C8E6C9' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2E7D32' },
                }}
              >
                <MenuItem value="">Select a Location</MenuItem>
                {[...new Set(mockEngineers.map(e => e.location))].map(location => (
                  <MenuItem key={location} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>

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

          {locationFilter ? (
            <List sx={{ maxHeight: 400, overflow: 'auto', bgcolor: '#ffffff', borderRadius: 1, p: 1, border: '1px solid #C8E6C9' }}>
              {filteredEngineers.length === 0 ? (
                <Typography variant="body2" sx={{ p: 2, color: '#2E7D32' }}>
                  No engineers available for {locationFilter}
                </Typography>
              ) : (
                filteredEngineers.map((engineer, index) => (
                  <StyledListItem
                    key={engineer.id}
                    button
                    selected={selectedEngineer?.id === engineer.id}
                    onClick={() => handleSelectEngineer(engineer)}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#2E7D32', color: '#ffffff', width: 48, height: 48 }}>
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
                            <Typography variant="body2" color="#2E7D32">{engineer.location}</Typography>
                          </Box>
                          <Box component="span" display="flex" alignItems="center">
                            <Phone fontSize="small" sx={{ mr: 0.5, color: '#2E7D32' }} />
                            <Typography variant="body2" color="#2E7D32">{engineer.phone}</Typography>
                          </Box>
                        </>
                      }
                      secondaryTypographyProps={{ color: '#2E7D32' }}
                    />
                    {selectedEngineer?.id === engineer.id && (
                      <CheckCircle sx={{ color: '#2E7D32', fontSize: 28 }} />
                    )}
                  </StyledListItem>
                ))
              )}
            </List>
          ) : (
            <Typography variant="body2" sx={{ p: 2, color: '#2E7D32' }}>
              Please select a location to view available engineers
            </Typography>
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
          <StyledButton onClick={onBack}>
            Back
          </StyledButton>
          <StyledButton
            disabled={!selectedEngineer || !selectedSlot}
            onClick={handleConfirmAssignment}
            startIcon={<CheckCircle />}
          >
            Confirm Assignment
          </StyledButton>
        </Box>
      </StyledCard>
    </motion.div>
  );
};

export default AssignEngineer;