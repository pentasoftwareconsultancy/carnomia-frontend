import React, { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Card, CardContent, Typography, Button, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select,
  FormControl, InputLabel, Checkbox, FormControlLabel, Switch, Box,
  Grid, Divider, Chip, Avatar, Badge
} from '@mui/material';
import {
  MoreVert, Close, PersonAdd, Edit, Delete, Visibility,
  FileDownload, CheckCircle, Cancel, Person, CalendarToday
} from '@mui/icons-material';

// Updated mockRequests with slot field
const mockRequests = [
  { id: 1, bookingId: "DSS001", customerName: "Onkar Basawane", location: "PCMC", dealerAddress: "Nashik Phata", brand: "Hyundai", model: "i20", variant: "Sportz", phone: "9876543210", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
  { id: 2, bookingId: "DSS002", customerName: "Amit Sharma", location: "Pune", dealerAddress: "Baner Showroom", brand: "Maruti", model: "Swift", variant: "VXI", phone: "9123456780", date: "2025-07-02", time: "01:00 PM", status: "assigned", assignedEngineer: "Engineer A", slot: "1:00 PM - 4:00 PM" },
  { id: 3, bookingId: "DSS003", customerName: "Sneha Patil", location: "PCMC", dealerAddress: "Akurdi Hub", brand: "Tata", model: "Punch", variant: "XZ", phone: "9988776655", date: "2025-07-01", time: "10:00 AM", status: "completed", assignedEngineer: "Engineer B", slot: "9:00 AM - 12:00 PM" },
  { id: 4, bookingId: "DSS004", customerName: "Pratik Patil", location: "PCMC", dealerAddress: "Chinchwad", brand: "Hyundai", model: "Venue", variant: "Sportz", phone: "9876543777", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
  { id: 5, bookingId: "DSS005", customerName: "Pratik Patil", location: "PCMC", dealerAddress: "Chinchwad", brand: "Hyundai", model: "Venue", variant: "Sportz", phone: "9876543777", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
  { id: 6, bookingId: "DSS006", customerName: "Pratik Patil", location: "PCMC", dealerAddress: "Chinchwad", brand: "Hyundai", model: "Venue", variant: "Sportz", phone: "9876543777", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
  { id: 7, bookingId: "DSS007", customerName: "Pratik Patil", location: "PCMC", dealerAddress: "Chinchwad", brand: "Hyundai", model: "Venue", variant: "Sportz", phone: "9876543777", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
  { id: 8, bookingId: "DSS008", customerName: "Pratik Patil", location: "PCMC", dealerAddress: "Chinchwad", brand: "Hyundai", model: "Venue", variant: "Sportz", phone: "9876543777", date: "2025-07-01", time: "11:30 AM", status: "new", slot: null },
];

const mockEngineers = [
  { id: 1, name: "Engineer A", location: "Pune", phone: "9090909090", active: true },
  { id: 2, name: "Engineer B", location: "PCMC", phone: "8888888888", active: true },
  { id: 3, name: "Engineer C", location: "PCMC", phone: "7777777777", active: false },
];

// Available time slots
const timeSlots = [
  "9:00 AM - 12:00 PM",
  "1:00 PM - 4:00 PM",
  "4:00 PM - 7:00 PM"
];

const ActionMenu = ({ request, setSelectedRequest, setRequests, setViewMode, setEditMode, viewOnly = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const actions = [
    {
      label: 'View',
      icon: <Visibility fontSize="small" />,
      action: () => {
        setSelectedRequest(request);
        setViewMode(true);
        handleClose();
      }
    },
    ...(viewOnly ? [] : [
      {
        label: 'Edit',
        icon: <Edit fontSize="small" />,
        action: () => {
          setSelectedRequest(request);
          setEditMode(true);
          handleClose();
        }
      },
      {
        label: 'Delete',
        icon: <Delete fontSize="small" />,
        action: () => {
          if (window.confirm("Delete this request?")) {
            setRequests(prev => prev.filter(req => req.id !== request.id));
          }
          handleClose();
        },
        color: 'error'
      }
    ])
  ];

  return (
    <div>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: '20ch' } }}
      >
        {actions.map((action, index) => (
          <MenuItem key={index} onClick={action.action} sx={{ color: action.color || 'inherit' }}>
            <Box display="flex" alignItems="center" gap={1}>
              {action.icon}
              {action.label}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const Modal = ({ title, onClose, children, maxWidth = 'md' }) => (
  <Dialog open={true} onClose={onClose} maxWidth={maxWidth} fullWidth>
    <DialogTitle sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      color: 'white',
      py: 2
    }}>
      <Typography variant="h6">{title}</Typography>
      <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers sx={{ py: 3 }}>
      {children}
    </DialogContent>
  </Dialog>
);

const RequestDetails = ({ request, onClose }) => (
  <Modal title="Request Details" onClose={onClose}>
    <Grid container spacing={3}>
      {[
        {
          title: "Customer Information",
          fields: ['bookingId', 'customerName', 'phone', 'location', 'dealerAddress']
        },
        {
          title: "Vehicle Details",
          fields: ['brand', 'model', 'variant', 'date', 'time', 'status', 'slot'],
          specialFields: {
            status: (value) => (
              <Chip
                label={value}
                size="small"
                color={
                  value === 'completed' ? 'success' :
                    value === 'assigned' ? 'warning' : 'primary'
                }
              />
            )
          }
        }
      ].map((section, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {section.title}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            {section.fields.map(field => (
              <React.Fragment key={field}>
                <Typography><strong>{field.replace(/([A-Z])/g, ' $1')}:</strong></Typography>
                <Typography>
                  {section.specialFields?.[field]
                    ? section.specialFields[field](request[field])
                    : request[field] || 'N/A'}
                </Typography>
              </React.Fragment>
            ))}
            {index === 1 && request.assignedEngineer && (
              <>
                <Typography><strong>Assigned Engineer:</strong></Typography>
                <Typography>
                  <Chip
                    label={request.assignedEngineer}
                    size="small"
                    avatar={<Avatar>{request.assignedEngineer.charAt(0)}</Avatar>}
                  />
                </Typography>
              </>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
    <DialogActions sx={{ mt: 3 }}>
      <Button onClick={onClose} variant="outlined" color="secondary">
        Close
      </Button>
    </DialogActions>
  </Modal>);

const EditRequestForm = ({ request, onSave, onCancel }) => {
  const [formData, setFormData] = useState(request);

 const handleChange = (e) => {
  if (!e || !e.target) return; // Add null checks
  
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal title="Edit Request" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(request).map(key => (
            key !== 'id' && (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/([A-Z])/g, ' $1')}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
            )
          ))}
        </Grid>
        <DialogActions sx={{ mt: 3 }}>
          <Button onClick={onCancel} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Modal>
  );
};

const EngineerManagement = ({ engineers, setEngineers }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEngineer, setNewEngineer] = useState({
    name: "", location: "", phone: "", active: true
  });

  const handleAdd = (e) => {
    e.preventDefault();
    const newId = Math.max(...engineers.map(e => e.id), 0) + 1;
    setEngineers(prev => [...prev, { ...newEngineer, id: newId }]);
    setNewEngineer({ name: "", location: "", phone: "", active: true });
    setShowAddForm(false);
  };

  const toggleEngineerStatus = (id) => {
    setEngineers(prev => prev.map(eng =>
      eng.id === id ? { ...eng, active: !eng.active } : eng
    ));
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" color="primary">
            Engineers Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setShowAddForm(true)}
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
          >
            Add Engineer
          </Button>
        </Box>

        {showAddForm && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add New Engineer
            </Typography>
            <form onSubmit={handleAdd}>
              <Grid container spacing={2}>
                {['name', 'phone'].map(field => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                      value={newEngineer[field]}
                      onChange={(e) => setNewEngineer(prev => ({ ...prev, [field]: e.target.value }))}
                      required
                      size="small"
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Location</InputLabel>
                    <Select
                      name="location"
                      value={newEngineer.location}
                      onChange={(e) => setNewEngineer(prev => ({ ...prev, location: e.target.value }))}
                      label="Location"
                      required
                    >
                      {['Pune', 'PCMC'].map(loc => (
                        <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newEngineer.active}
                        onChange={(e) => setNewEngineer(prev => ({ ...prev, active: e.target.checked }))}
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button variant="outlined" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}>
                  Add Engineer
                </Button>
              </Box>
            </form>
          </Paper>
        )}

        {engineers.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            No engineers available.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#E8F5E9' }}>
                  {['ID', 'Name', 'Location', 'Phone', 'Status', 'Actions'].map((head) => (
                    <TableCell key={head} align="center" sx={{ fontWeight: 'bold' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {engineers.map((eng) => (
                  <TableRow key={eng.id} hover>
                    <TableCell align="center">{eng.id}</TableCell>
                    <TableCell align="center">{eng.name}</TableCell>
                    <TableCell align="center">{eng.location}</TableCell>
                    <TableCell align="center">{eng.phone}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={eng.active ? "Active" : "Inactive"}
                        size="small"
                        color={eng.active ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={eng.active}
                        onChange={() => toggleEngineerStatus(eng.id)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState(mockRequests);
  const [engineers, setEngineers] = useState(mockEngineers);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showEngineerPage, setShowEngineerPage] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [assignedJobsFilter, setAssignedJobsFilter] = useState("assigned");
  const [selectedSlot, setSelectedSlot] = useState("");

  // Create refs for each section
  const newRequestsRef = useRef(null);
  const assignedJobsRef = useRef(null);
  const completedJobsRef = useRef(null);
  const allRequestsRef = useRef(null);
  const engineersRef = useRef(null);
  const calendarRef = useRef(null);

  // Function to check if an engineer is available for a specific slot on a specific date
  const isEngineerAvailable = (engineerId, date, slot) => {
    if (!slot) return false;
    return !requests.some(
      (req) =>
        req.assignedEngineer === engineers.find((eng) => eng.id === engineerId)?.name &&
        req.date === date &&
        req.slot === slot &&
        req.status !== "completed"
    );
  };

  // Function to calculate available slots for a given date
  const getAvailableSlotsCount = (dateStr) => {
    const activeEngineers = engineers.filter((eng) => eng.active);
    const totalPossibleAssignments = activeEngineers.length * timeSlots.length;
    const assignedSlots = requests.filter(
      (req) => req.date === dateStr && req.status !== "completed" && req.slot
    ).length;
    return Math.max(0, totalPossibleAssignments - assignedSlots);
  };

  // Function to determine calendar tile class based on slot availability
  const getTileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const availableSlots = getAvailableSlotsCount(dateStr);
    const activeEngineers = engineers.filter((e) => e.active).length;
    const maxSlots = activeEngineers * timeSlots.length;

    if (availableSlots === maxSlots && maxSlots >= 3) return 'all-slots-available';
    if (availableSlots === 2) return 'two-slots-available';
    if (availableSlots === 1) return 'one-slot-available';
    if (availableSlots === 0) return 'no-slots-available';
    return null;
  };

  // Updated assignEngineer function to include slot assignment
  const assignEngineer = (id, eng, slot) => {
    if (!slot) {
      alert("Please select a time slot.");
      return;
    }
    if (!isEngineerAvailable(eng.id, selectedRequest.date, slot)) {
      alert(`Engineer ${eng.name} is already assigned to another job in the ${slot} slot on ${selectedRequest.date}.`);
      return;
    }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, assignedEngineer: eng.name, status: "assigned", slot }
          : r
      )
    );
    setSelectedRequest(null);
    setShowEngineerPage(false);
    setSelectedLocation("");
    setSelectedSlot("");
  };

  const handleSaveEdit = (updatedRequest) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
    setSelectedRequest(updatedRequest);
    setEditMode(false);
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const statusCards = [
    {
      label: "New Requests",
      key: "new",
      count: requests.filter((r) => r.status === "new").length,
      color: "#4CAF50",
      icon: <Person sx={{ color: "white" }} />,
      ref: newRequestsRef,
    },
    {
      label: "Assigned Jobs",
      key: "assigned",
      count: requests.filter((r) => r.status === "assigned").length,
      color: "#FFA000",
      icon: <CheckCircle sx={{ color: "white" }} />,
      ref: assignedJobsRef,
    },
    {
      label: "Completed Jobs",
      key: "completed",
      count: requests.filter((r) => r.status === "completed").length,
      color: "#388E3C",
      icon: <FileDownload sx={{ color: "white" }} />,
      ref: completedJobsRef,
    },
    {
      label: "All Requests",
      key: "all",
      count: requests.length,
      color: "#2196F3",
      icon: <Badge sx={{ color: "white" }} />,
      ref: allRequestsRef,
    },
    {
      label: "Active Engineers",
      key: "engineers",
      count: engineers.filter((e) => e.active).length,
      color: "#009688",
      icon: <Person sx={{ color: "white" }} />,
      ref: engineersRef,
    },
    {
      label: "Schedule Calendar",
      key: "calendar",
      count: "-",
      color: "#673AB7",
      icon: <CalendarToday sx={{ color: "white" }} />,
      ref: calendarRef,
    },
  ];

  const renderTable = (data, columns, renderRow, emptyMessage) => (
    data.length === 0 ? (
      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
        {emptyMessage}
      </Typography>
    ) : (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#E8F5E9" }}>
              {columns.map((column) => (
                <TableCell key={column} align="center" sx={{ fontWeight: "bold" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data.map(renderRow)}</TableBody>
        </Table>
      </TableContainer>
    )
  );

  return (
    <Box sx={{
      backgroundColor: '#F1FFE0',
      minHeight: '100vh',
      p: 3,
      '& .MuiCard-root': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 2,
        mb: 3,
        borderLeft: '4px solid #4CAF50'
      }
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        color: '#2E7D32',
        mb: 4,
        textAlign: 'center'
      }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statusCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={i} sx={{ flexGrow: 1 }}>
            <Card
              onClick={() => scrollToSection(card.ref)}
              sx={{
                cursor: 'pointer',
                bgcolor: card.color,
                color: 'white',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{card.label}</Typography>
                    <Typography variant="h5">{card.count}</Typography>
                  </Box>
                  <Box sx={{ fontSize: '2rem' }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div ref={newRequestsRef}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              New Requests
            </Typography>
            <Grid container spacing={2}>
              {requests.filter(r => r.status === "new").map((r, i) => (
                <Grid item xs={12} sm={6} md={4} key={`${r.id}-${i}`}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, borderLeft: '4px solid #4CAF50' }}>
                    <Typography variant="subtitle2"><strong>Booking ID:</strong> {r.bookingId}</Typography>
                    <Typography variant="body2"><strong>Customer:</strong> {r.customerName}</Typography>
                    <Typography variant="body2"><strong>Phone:</strong> {r.phone}</Typography>
                    <Typography variant="body2"><strong>Date/Time:</strong> {r.date} at {r.time}</Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 1, backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
                      onClick={() => { setSelectedRequest(r); scrollToSection(assignedJobsRef); }}
                    >
                      Assign To
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </div>

      {selectedRequest && !viewMode && !editMode && (
        <Card sx={{ borderLeft: '4px solid #FFA000' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Assign Engineer to {selectedRequest.customerName}
            </Typography>
            <Box sx={{
              p: 3,
              backgroundColor: '#E8F5E9',
              borderRadius: 2,
              mb: 3
            }}>
              <Grid container spacing={2}>
                {['customerName', 'phone', 'brand', 'model', 'variant', 'dealerAddress', 'date'].map(field => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <Typography variant="body2">
                      <strong>{field.replace(/([A-Z])/g, ' $1')}:</strong> {selectedRequest[field]}
                    </Typography>
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select Time Slot</InputLabel>
                    <Select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      label="Select Time Slot"
                    >
                      <MenuItem value="">Select a slot</MenuItem>
                      {timeSlots.map((slot) => (
                        <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#388E3C' },
                px: 4,
                py: 1
              }}
              onClick={() => { setShowEngineerPage(true); scrollToSection(engineersRef); }}
            >
              Select Engineer
            </Button>
          </CardContent>
        </Card>
      )}

      {showEngineerPage && (
        <div ref={engineersRef}>
          <Card sx={{ borderLeft: '4px solid #2196F3' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                Available Engineers
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 3, maxWidth: 300 }}>
                <InputLabel>Filter by Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  label="Filter by Location"
                >
                  <MenuItem value="">All Locations</MenuItem>
                  {[...new Set(engineers.map(e => e.location))].map((loc, idx) => (
                    <MenuItem key={idx} value={loc}>{loc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid container spacing={2}>
                {engineers
                  .filter(e => selectedLocation ? e.location === selectedLocation : true)
                  .filter(e => e.active)
                  .map((eng, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Paper elevation={2} sx={{
                        p: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${isEngineerAvailable(eng.id, selectedRequest.date, selectedSlot) ? '#4CAF50' : '#F44336'}`,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2"><strong>Name:</strong> {eng.name}</Typography>
                          <Typography variant="body2"><strong>Location:</strong> {eng.location}</Typography>
                          <Typography variant="body2"><strong>Phone:</strong> {eng.phone}</Typography>
                          <Typography variant="body2">
                            <strong>Availability:</strong>{" "}
                            {isEngineerAvailable(eng.id, selectedRequest.date, selectedSlot)
                              ? "Available"
                              : "Booked for this slot"}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            mt: 2,
                            backgroundColor: isEngineerAvailable(eng.id, selectedRequest.date, selectedSlot)
                              ? '#4CAF50'
                              : '#B0BEC5',
                            '&:hover': {
                              backgroundColor: isEngineerAvailable(eng.id, selectedRequest.date, selectedSlot)
                                ? '#388E3C'
                                : '#B0BEC5'
                            },
                            alignSelf: 'flex-start'
                          }}
                          disabled={!isEngineerAvailable(eng.id, selectedRequest.date, selectedSlot)}
                          onClick={() => assignEngineer(selectedRequest.id, eng, selectedSlot)}
                        >
                          Assign This Engineer
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </div>
      )}

      <div ref={assignedJobsRef}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
                Jobs Management
              </Typography>
              <Box>
                <Button
                  variant={assignedJobsFilter === "assigned" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setAssignedJobsFilter("assigned")}
                  sx={{
                    mr: 1,
                    ...(assignedJobsFilter === "assigned" && {
                      backgroundColor: '#FFA000',
                      '&:hover': { backgroundColor: '#F57C00' }
                    })
                  }}
                >
                  Assigned
                </Button>
                <Button
                  variant={assignedJobsFilter === "unassigned" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setAssignedJobsFilter("unassigned")}
                  sx={assignedJobsFilter === "unassigned" ? {
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#388E3C' }
                  } : {}}
                >
                  Unassigned
                </Button>
              </Box>
            </Box>

            {renderTable(
              requests.filter(r => assignedJobsFilter === "assigned" ? r.status === "assigned" : r.status === "new"),
              assignedJobsFilter === "assigned"
                ? ['Booking ID', 'Customer', 'Engineer', 'Date', 'Slot', 'Actions']
                : ['Booking ID', 'Customer', 'Location', 'Date', 'Time', 'Actions'],
              (r) => (
                <TableRow key={r.id} hover>
                  <TableCell align="center">{r.bookingId}</TableCell>
                  <TableCell align="center">{r.customerName}</TableCell>
                  {assignedJobsFilter === "assigned" ? (
                    <>
                      <TableCell align="center">{r.assignedEngineer}</TableCell>
                      <TableCell align="center">{r.date}</TableCell>
                      <TableCell align="center">{r.slot || 'N/A'}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="center">{r.location}</TableCell>
                      <TableCell align="center">{r.date}</TableCell>
                      <TableCell align="center">{r.time}</TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    {assignedJobsFilter === "assigned" ? (
                      <ActionMenu
                        request={r}
                        setSelectedRequest={setSelectedRequest}
                        setRequests={setRequests}
                        setViewMode={setViewMode}
                        setEditMode={setEditMode}
                        viewOnly={true}
                      />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#4CAF50',
                          '&:hover': { backgroundColor: '#388E3C' }
                        }}
                        onClick={() => { setSelectedRequest(r); scrollToSection(assignedJobsRef); }}
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ),
              `No ${assignedJobsFilter} jobs available.`
            )}
          </CardContent>
        </Card>
      </div>

      <div ref={completedJobsRef}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Completed Jobs
            </Typography>
            {renderTable(
              requests.filter(r => r.status === "completed"),
              ['Booking ID', 'Customer', 'Engineer', 'Date', 'Slot', 'Actions'],
              (r) => (
                <TableRow key={r.id} hover>
                  <TableCell align="center">{r.bookingId}</TableCell>
                  <TableCell align="center">{r.customerName}</TableCell>
                  <TableCell align="center">{r.assignedEngineer}</TableCell>
                  <TableCell align="center">{r.date}</TableCell>
                  <TableCell align="center">{r.slot || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FileDownload />}
                      sx={{
                        backgroundColor: '#4CAF50',
                        '&:hover': { backgroundColor: '#388E3C' }
                      }}
                      onClick={() => alert(`Downloading report for ${r.bookingId}`)}
                    >
                      Report
                    </Button>
                  </TableCell>
                </TableRow>
              ),
              "No completed jobs available."
            )}
          </CardContent>
        </Card>
      </div>

      <div ref={allRequestsRef}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              All Requests
            </Typography>
            {renderTable(
              requests,
              ['Booking ID', 'Customer', 'Status', 'Location', 'Date', 'Slot', 'Actions'],
              (r) => (
                <TableRow key={r.id} hover>
                  <TableCell align="center">{r.bookingId}</TableCell>
                  <TableCell align="center">{r.customerName}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={r.status}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                      color={
                        r.status === 'completed' ? 'success' :
                          r.status === 'assigned' ? 'warning' : 'primary'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">{r.location}</TableCell>
                  <TableCell align="center">{r.date}</TableCell>
                  <TableCell align="center">{r.slot || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <ActionMenu
                      request={r}
                      setSelectedRequest={setSelectedRequest}
                      setRequests={setRequests}
                      setViewMode={setViewMode}
                      setEditMode={setEditMode}
                    />
                  </TableCell>
                </TableRow>
              ),
              "No requests available."
            )}
          </CardContent>
        </Card>
      </div>

      <div ref={engineersRef}>
        <EngineerManagement engineers={engineers} setEngineers={setEngineers} />
      </div>

      <div ref={calendarRef}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
              Schedule Calendar
            </Typography>
            <Box display="flex" justifyContent="center">
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                className="react-calendar"
                tileClassName={getTileClassName}
              />
            </Box>
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
                background: #4CAF50;
                border-radius: 50%;
                color: white;
              }
              .two-slots-available {
                background: #FFA500;
                border-radius: 50%;
                color: white;
              }
              .one-slot-available {
                background: #FFFF00;
                border-radius: 50%;
                color: black;
              }
              .no-slots-available {
                background: #F44336;
                border-radius: 50%;
                color: white;
              }
            `}</style>
          </CardContent>
        </Card>
      </div>

      {viewMode && selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => { setViewMode(false); setSelectedRequest(null); }}
        />
      )}

      {editMode && selectedRequest && (
        <EditRequestForm
          request={selectedRequest}
          onSave={handleSaveEdit}
          onCancel={() => { setEditMode(false); setSelectedRequest(null); }}
        />
      )}
    </Box>
  );
}