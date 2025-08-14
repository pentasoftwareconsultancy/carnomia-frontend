import React, { useEffect, useState } from 'react';
import {
  CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Box,
  IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Button,
} from '@mui/material';
import {
  FiMoreVertical, FiFileText,
} from 'react-icons/fi';
import EditRequestForm from './EditRequestForm';
import ApiService from '../../../core/services/api.service';
import ServerUrl from '../../../core/constants/serverUrl.constant';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-orange-600' },
  assigned: { bg: 'bg-blue-100', text: 'text-blue-700' },
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
};

const AllRequests = ({ setSelectedRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    const fetchPDIRequest = async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
        if (response?.data?.data) {
          setRequests(response.data.data);
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
  };

  const handleView = () => {
    setViewOpen(true);
    handleMenuClose();
  };

  const handleEditOpen = () => {
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditSave = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
    setEditOpen(false);
  };

  const handleEditCancel = () => {
    setEditOpen(false);
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setRequests((prev) => prev.filter((r) => r.id !== selectedRow.id));
    setDeleteOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  if (loading) {
    return (
      <Box className="text-center p-8">
        <Typography variant="body1">Loading requests...</Typography>
      </Box>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-md hover:scale-[1.01] transition-transform">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between flex-col sm:flex-row gap-4 mb-4">
            <Typography
              variant="h6"
              className="text-green-700 font-heading text-xl flex items-center gap-2"
            >
              <FiFileText size={20} />
              All Requests
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {requests.length} requests found
            </Typography>
          </div>

          <div className="rounded-2xl overflow-x-auto bg-slate-50">
            <Table>
              <TableHead>
                <TableRow className="bg-white">
                  {['Booking ID', 'Customer', 'Status', 'address', 'Date', 'Slot', 'Actions'].map((head) => (
                    <TableCell key={head} align="center" className="text-green-700 font-heading text-sm">
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((req, index) => (
                  <TableRow
                    key={req.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                  >
                    <TableCell align="center" className="text-sm">{req.bookingId}</TableCell>
                    <TableCell align="center" className="text-sm">{req.customerName}</TableCell>
                    <TableCell align="center">
                    <span className={`px-3 py-1 rounded-full font-body text-xs ${statusColors[req.status]?.bg} ${statusColors[req.status]?.text}`}>
                        {req.status}
                      </span>
                    </TableCell>
                    <TableCell align="center" className="text-sm">{req.address}</TableCell>
                    <TableCell align="center" className="text-sm">{req.date}</TableCell>
                    <TableCell align="center" className="text-sm">{req.slot || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuOpen(e, req)} className="text-green-700">
                        <FiMoreVertical />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedRow?.id === req.id}
                        onClose={handleMenuClose}
                        PaperProps={{ sx: { borderRadius: 2, boxShadow: 6 } }}
                      >
                        <MenuItem onClick={handleView} className="text-sm hover:bg-green-50 hover:text-green-800">
                          View
                        </MenuItem>
                        <MenuItem onClick={handleEditOpen} className="text-sm hover:bg-green-50 hover:text-green-800">
                          Edit
                        </MenuItem>
                        <MenuItem onClick={handleDeleteOpen} className="text-sm hover:bg-green-50 hover:text-green-800">
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow ? (
            Object.entries(selectedRow).map(([key, value]) => (
              <Box key={key} className="mb-4">
                <Typography variant="subtitle2" fontWeight="bold">
                  {key}
                </Typography>
                <Typography variant="body2">
                  {typeof value === 'object' ? JSON.stringify(value) : value?.toString() || 'N/A'}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No request selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} variant="contained" sx={{ backgroundColor: '#2E7D32' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <EditRequestForm
        request={selectedRow || {}}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        open={editOpen}
      />

      {/* Delete Confirmation Dialog */}
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
    </div>
  );
};

export default AllRequests;