import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Paper, Button, Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import RequestDetails from './RequestDetails';

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  margin: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5), // Slightly reduced padding for mobile
  borderRadius: theme.spacing(1.5),
  borderLeft: `4px solid ${theme.palette.success.main}`,
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor: '#2E7D32',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75, 1.5), // Smaller padding for mobile
  textTransform: 'none',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#1B5E20',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.75rem',
  },
}));

const NewRequests = ({ requests, setRequests, selectedRequest, setSelectedRequest }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleAssignClick = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleAssignEngineer = (id, engineer, slot) => {
    const updated = requests.map(r =>
      r.id === id
        ? { ...r, assignedEngineer: engineer.name, slot, status: 'assigned' }
        : r
    );
    setRequests(updated);
    setModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Box sx={{ width: '100%', p: 0, bgcolor: '#F1FFE0' }}>
      <StyledCard>
        <CardContent sx={{ 
          p: isMobile ? 1 : 2, // Adjusted padding for mobile
          '&:last-child': {
            paddingBottom: isMobile ? 1 : 2,
          }
        }}>
          <Typography variant="h6" gutterBottom sx={{
            color: '#2E7D32',
            fontWeight: 'bold',
            fontSize: isMobile ? '1.1rem' : '1.5rem',
            mb: isMobile ? 1.5 : 3,
          }}>
            New Requests
          </Typography>
          
          <Grid container spacing={isMobile ? 1 : 2}>
            {requests.filter(r => r.status === 'new').length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ 
                  color: '#616161', 
                  textAlign: 'center', 
                  py: isMobile ? 1.5 : 3,
                  fontStyle: 'italic'
                }}>
                  No new requests available
                </Typography>
              </Grid>
            ) : (
              requests.filter(r => r.status === 'new').map((r) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={r.id}> {/* Changed xs to 6 for 2 cards in mobile */}
                  <StyledPaper elevation={0}>
                    <Box sx={{ mb: isMobile ? 0.5 : 1.5 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700,
                        color: '#2E7D32',
                        mb: isMobile ? 0.25 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: isMobile ? '0.8rem' : '0.9375rem'
                      }}>
                        <FiUser size={isMobile ? 14 : 18} style={{ marginRight: 6 }} />
                        {isMobile ? r.customerName?.split(' ')[0] || 'Customer' : r.customerName || 'Not provided'}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: isMobile ? 0.25 : 0.5,
                        color: '#555'
                      }}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: isMobile ? '0.7rem' : '0.8125rem'
                        }}>
                          <span style={{ 
                            backgroundColor: '#E8F5E9',
                            padding: '1px 4px',
                            borderRadius: 4,
                            marginRight: 6,
                            color: '#2E7D32',
                            fontWeight: 600,
                            fontSize: isMobile ? '0.65rem' : '0.8125rem'
                          }}>
                            #{r.id}
                          </span>
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: isMobile ? 0.5 : 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 0.25 : 0.5 }}>
                        <FiPhone size={isMobile ? 12 : 16} color="#555" style={{ marginRight: 6 }} />
                        <Typography variant="body2" sx={{ 
                          color: '#555',
                          fontSize: isMobile ? '0.7rem' : '0.875rem'
                        }}>
                          {r.phone || 'Not provided'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FiCalendar size={isMobile ? 12 : 16} color="#555" style={{ marginRight: 6 }} />
                        <Typography variant="body2" sx={{ 
                          color: '#555',
                          fontSize: isMobile ? '0.7rem' : '0.875rem'
                        }}>
                          {r.date ? `${r.date} ${r.time || ''}` : 'Not scheduled'}
                        </Typography>
                      </Box>
                    </Box>

                    <StyledButton
                      variant="contained"
                      size="small"
                      onClick={() => handleAssignClick(r)}
                      sx={{ 
                        alignSelf: 'flex-start',
                        fontSize: isMobile ? '0.7rem' : '0.875rem'
                      }}
                    >
                      {isMobile ? 'Assign' : 'Assign Engineer'}
                    </StyledButton>
                  </StyledPaper>
                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
      </StyledCard>

      <RequestDetails
        open={modalOpen}
        onClose={() => {
          setSelectedRequest(null);
          setModalOpen(false);
        }}
        request={selectedRequest}
        onAssign={handleAssignEngineer}
        setModalOpen={setModalOpen}
      />
    </Box>
  );
};

export default NewRequests;