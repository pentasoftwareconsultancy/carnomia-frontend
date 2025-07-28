
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';

const StyledModal = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#F1FFE0',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  padding: theme.spacing(2),
  width: '90%',
  maxWidth: 800, // Wider for two-column layout
  maxHeight: '80vh',
  overflowY: 'auto',
  border: '1px solid #C8E6C9',
  [theme.breakpoints.down('sm')]: {
    width: '95%',
    padding: theme.spacing(1.5),
    maxWidth: 400, // Narrower for mobile
  },
}));

const Modal = ({ title, onClose, children }) => {
  return (
    <StyledModal>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography
          variant="h6"
          sx={{ color: '#2E7D32', fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#2E7D32' }}>
          <Close />
        </IconButton>
      </Box>
      {children}
    </StyledModal>
  );
};

export default Modal;
