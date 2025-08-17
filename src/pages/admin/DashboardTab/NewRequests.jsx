import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FiUser, FiPhone, FiCalendar } from 'react-icons/fi';
import RequestDetails from './RequestDetails';
import ApiService from '../../../core/services/api.service';
import ServerUrl from '../../../core/constants/serverUrl.constant';
import { APPLICATION_CONSTANTS } from '../../../core/constants/app.constant';

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
  padding: theme.spacing(1.5),
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
  padding: theme.spacing(0.75, 1.5),
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

const NewRequests = ({ setViewMode }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    let isMounted = true; // prevents state updates after unmount

    fetchPDIRequests(isMounted);

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, []);


  useEffect(() => {
    if(!modalOpen) {
      fetchPDIRequests(true);
    }
  },[modalOpen]);

   const fetchPDIRequests = async (isMounted) => {
      try {
        setLoading(true); // optional: show loader

        const api = new ApiService();
        const { data } = await api.apipost(ServerUrl.API_GET_ALL_PDIREQUEST_STATUSES,[APPLICATION_CONSTANTS.REQUEST_STATUS.NEW.value]);

        if (isMounted && Array.isArray(data?.data)) {
          setRequests(data.data);
          console.log(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch PDI requests:", error);
        if (isMounted) {
          setError("Unable to load PDI requests."); // optional: show error in UI
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

  const handleAssignClick = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleAssignEngineer = (id, engineer, slot) => {
    const updated = requests.map((r) =>
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
        <CardContent
          sx={{ padding: 2, display: 'flex', flexDirection: 'column' }} 
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              color: '#81da5b',
              fontWeight: 'bold',
              }}
          >
            New Requests
          </Typography>

          <Grid container >
            {requests.filter((r) => r.status === 'NEW').length === 0 ? (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#81da5b',
                    textAlign: 'center',
                    padding: 2,}}
                >
                  No new requests available
                </Typography>
              </Grid>
            ) : (
              requests
                .filter((r) => r.status === 'NEW')
                .map((r) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={r.id || r._id}>
                    <StyledPaper elevation={0}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color: '#81da5b',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <FiUser  style={{ marginRight: 6 }} />
                          {r.customerName || 'Unknown Customer'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#555',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: '#E8F5E9',
                                padding: '1px 4px',
                                borderRadius: 4,
                                marginRight: 6,
                                color: '#81da5b',
                                fontWeight: 600,
                              }}
                            >
                              #{r.bookingId}
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                          <FiPhone  color="#555" style={{ marginRight: 6 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#555',
                            }}
                          >
                            {r.customerMobile || 'Not provided'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FiCalendar  color="#555" style={{ marginRight: 6 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#555',
                            
                            }}
                          >
                            {r.createdAt ? `${r.createdAt}` : 'Not scheduled'}
                          </Typography>
                        </Box>
                      </Box>

                      <StyledButton
                        variant="contained"
                        size="small"
                        onClick={() => handleAssignClick(r)}
                        sx={{
                          alignSelf: 'flex-start',
                          bgcolor: '#81da5b',

                        }}
                      >
                        Assign Engineer
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