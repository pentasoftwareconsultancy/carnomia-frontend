import React, { useState } from 'react';
import Modal from './Modal';
import { Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiUser, FiPhone, FiMapPin, FiCalendar, FiTruck, FiHome } from 'react-icons/fi';
import AssignEngineer from './AssignEngineer';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = styled(motion.div)({
  backfaceVisibility: 'hidden',
  transformStyle: 'preserve-3d',
  perspective: '1000px',
});

const InfoItem = styled(MotionBox)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(1),
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  '&:hover': {
    backgroundColor: '#E8F5E9',
    transform: 'translateY(-2px)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1),
  color: '#2E7D32',
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
}));

const ModalContainer = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1299,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[24],
  width: '90%',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflowY: 'auto',
  padding: theme.spacing(3),
  zIndex: 1300,
}));

export default function RequestDetails({ open, onClose, request, onAssign, setModalOpen }) {
  const [step, setStep] = useState(1);

  if (!open || !request) return null;

  const {
    customerName = 'John Doe',
    phone = '+1 (555) 123-4567',
    location = 'New York, NY',
    id = 'REQ-001',
    bookingId = 'BOOK-001',
    date = '2023-06-15',
    time = '10:00 AM',
    brand = 'Toyota',
    model = 'Camry',
    variant = 'Hybrid XLE',
    dealerAddress = '123 Main St, New York, NY'
  } = request;

  const handleAssign = (engineer, selectedSlot) => {
    if (onAssign) {
      onAssign(request.id, engineer, selectedSlot);
      setModalOpen(false);
      setStep(1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <ModalContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            onClose();
            setModalOpen(false);
            setStep(1);
          }}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode='wait'>
              {step === 1 ? (
                <MotionBox
                  key="request-details"
                  initial={{ rotateY: 0, opacity: 1 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -180, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                      Customer Info
                    </Typography>
                    
                    <InfoItem 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <IconWrapper><FiUser size={20} /></IconWrapper>
                      <Typography variant="body2">
                        <strong>Name:</strong> {customerName}
                      </Typography>
                    </InfoItem>
                     
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <IconWrapper><FiPhone size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {phone}
                  </Typography>
                </InfoItem>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <IconWrapper><FiMapPin size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Location:</strong> {location}
                  </Typography>
                </InfoItem>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <IconWrapper><FiUser size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Booking ID:</strong> {bookingId || id}
                  </Typography>
                </InfoItem>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <IconWrapper><FiCalendar size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Date/Time:</strong> {date} {time}
                  </Typography>
                </InfoItem>

                <Typography variant="h6" sx={{ mt: 2, color: '#2E7D32', fontWeight: 'bold' }}>
                  Vehicle Info
                </Typography>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <IconWrapper><FiTruck size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Brand:</strong> {brand}
                  </Typography>
                </InfoItem>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <IconWrapper><FiTruck size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Model:</strong> {model}
                  </Typography>
                </InfoItem>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <IconWrapper><FiTruck size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Variant:</strong> {variant}
                  </Typography>
                </InfoItem>

                <Typography variant="h6" sx={{ mt: 2, color: '#2E7D32', fontWeight: 'bold' }}>
                  Dealer Info
                </Typography>
                
                <InfoItem 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <IconWrapper><FiHome size={20} /></IconWrapper>
                  <Typography variant="body2">
                    <strong>Address:</strong> {dealerAddress}
                  </Typography>
                </InfoItem>

                    {/* Rest of your info items */}
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: 1, 
                        mt: 2 
                      }}
                      component={motion.div}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <StyledButton onClick={() => { 
                        onClose(); 
                        setModalOpen(false); 
                        setStep(1); 
                      }}>
                        Cancel
                      </StyledButton>
                      <StyledButton onClick={() => setStep(2)}>
                        Continue to Assign Engineer
                      </StyledButton>
                    </Box>
                  </Box>
                </MotionBox>
              ) : (
                <MotionBox
                  key="assign-engineer"
                  initial={{ rotateY: 180, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 180, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <AssignEngineer
                    request={request}
                    onAssign={handleAssign}
                    onBack={() => setStep(1)}
                  />
                </MotionBox>
              )}
            </AnimatePresence>
          </ModalContent>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
}