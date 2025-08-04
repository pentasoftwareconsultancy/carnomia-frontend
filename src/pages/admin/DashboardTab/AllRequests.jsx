import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Box,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FiTool, FiUser, FiMapPin, FiCalendar, FiMoreVertical, FiFileText,
} from 'react-icons/fi';
import EditRequestForm from './EditRequestForm';
import ApiService from '../../../core/services/api.service';
import ServerUrl from '../../../core/constants/serverUrl.constant';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  width: '100%',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.01)',
    backdropFilter: 'blur(3px)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    boxShadow: theme.shadows[10],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflowX: 'auto',
  backgroundColor: '#f8fafc',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.85rem',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#000000',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5),
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  textTransform: 'capitalize',
  fontSize: '0.75rem',
  height: 24,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
  },
}));

const statusColors = {
  pending: { bg: '#FFECB3', text: '#FB8C00' },
  assigned: { bg: '#BBDEFB', text: '#1976D2' },
  completed: { bg: '#C8E6C9', text: '#388E3C' },
  cancelled: { bg: '#FFCDD2', text: '#D32F2F' },
};

const columns = [
  { id: 'bookingId', label: 'Booking ID', icon: <FiTool size={16} /> },
  { id: 'customerName', label: 'Customer', icon: <FiUser size={16} /> },
  { id: 'status', label: 'Status' },
  { id: 'location', label: 'Location', icon: <FiMapPin size={16} /> },
  { id: 'date', label: 'Date', icon: <FiCalendar size={16} /> },
  { id: 'slot', label: 'Slot' },
  { id: 'actions', label: 'Actions', icon: <FiMoreVertical size={16} /> },
];

const AllRequests = ({ setSelectedRequest, setViewMode }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const fetchPDIRequest = async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
        if (response?.data?.data) {
          setRequests(response.data.data); // set all requests
        }
      } catch (err) {
        console.error('Failed to fetch PDI requests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPDIRequest();
  }, []);

  const handleMenuOpen = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleView = () => {
    setSelectedRequest(selectedRow);
    setViewMode('details');
    handleMenuClose();
  };

  const handleEditOpen = () => {
    setSelectedRequest(selectedRow);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditSave = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
    setEditOpen(false);
    setSelectedRequest(null);
  };

  const handleEditCancel = () => {
    setEditOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setRequests((prev) => prev.filter((r) => r.id !== selectedRow.id));
    setDeleteOpen(false);
    setSelectedRequest(null);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="body1">Loading requests...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden', p: 0, m: 0 }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#2E7D32',
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <FiFileText size={20} />
              All Requests
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {requests.length} requests found
            </Typography>
          </Box>

          <StyledTableContainer component={Paper}>
            <Table sx={{ minWidth: 600 }} aria-label="requests table">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <StyledTableCell key={col.id} sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        {col.icon}
                        {col.label}
                      </Box>
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <StyledTableCell colSpan={7}>No requests available.</StyledTableCell>
                  </TableRow>
                ) : (
                  requests.map((request, index) => (
                    <TableRow
                      key={request.id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                        '&:hover': { backgroundColor: '#e3f2fd' },
                        transition: 'background 0.3s ease',
                      }}
                    >
                      <StyledTableCell>{request.bookingId}</StyledTableCell>
                      <StyledTableCell>{request.customerName}</StyledTableCell>
                      <StyledTableCell>
                        <StyledChip
                          label={request.status}
                          sx={{
                            backgroundColor: statusColors[request.status]?.bg,
                            color: statusColors[request.status]?.text,
                          }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{request.location}</StyledTableCell>
                      <StyledTableCell>{request.date}</StyledTableCell>
                      <StyledTableCell>{request.slot || 'N/A'}</StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, request)} sx={{ color: '#2E7D32' }}>
                          <FiMoreVertical />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedRow?.id === request.id}
                          onClose={handleMenuClose}
                          PaperProps={{ sx: { borderRadius: 2, boxShadow: 6 } }}
                        >
                          <StyledMenuItem onClick={handleView}>View</StyledMenuItem>
                          <StyledMenuItem onClick={handleEditOpen}>Edit</StyledMenuItem>
                          <StyledMenuItem onClick={handleDeleteOpen}>Delete</StyledMenuItem>
                        </Menu>
                      </StyledTableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </CardContent>
      </StyledCard>

      <EditRequestForm
        request={selectedRow || {}}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        open={editOpen}
      />

      <Dialog open={deleteOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete Booking ID: {selectedRow?.bookingId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllRequests;
