import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, useMediaQuery, useTheme, TextField, InputAdornment, IconButton, Tooltip,
  createTheme, ThemeProvider, Chip, Grid, Card, CardContent, Alert, TablePagination
} from '@mui/material';
import {
  Search, PictureAsPdf, Work, History, FilterList
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Pure green theme
const greenTheme = createTheme({
  palette: {
    primary: { main: '#2e7d32', light: '#81c784', dark: '#1b5e20', contrastText: '#ffffff' },
    secondary: { main: '#4caf50', light: '#a5d6a7', dark: '#388e3c' },
    success: { main: '#4caf50' },
    warning: { main: '#8bc34a' },
    error: { main: '#a5d6a7' },
    background: { default: '#f1f8e9', paper: '#ffffff' },
    text: { primary: '#1b5e20', secondary: '#2e7d32' },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h5: { fontWeight: 600, color: '#1b5e20' },
    h6: { fontWeight: 500, color: '#1b5e20' },
    body1: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': { fontSize: '0.75rem' },
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px',
          '@media (max-width:600px)': { padding: '6px' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorSuccess': { backgroundColor: '#e8f5e9', color: '#1b5e20' },
          '&.MuiChip-colorWarning': { backgroundColor: '#f1f8e9', color: '#2e7d32' },
          '&.MuiChip-colorDefault': { backgroundColor: '#f5f5f5', color: '#1b5e20' },
          '&.MuiChip-colorError': { backgroundColor: '#f1f8e9', color: '#1b5e20' }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': { backgroundColor: '#f8fbf8' },
          '&:hover': { backgroundColor: '#e8f5e9 !important' }
        },
        head: { backgroundColor: '#2e7d32 !important' }
      }
    }
  }
});

// Sample data
const TodayAssignedJobsData = [
  {
    id: 1,
    bookingId: 'BKG1001',
    brand: 'Toyota',
    model: 'Corolla',
    variant: 'Altis',
    engineer: 'Sneha Shinde',
    engineerContact: '9876543210',
    customer: 'Retail Solutions Inc.',
    customerContact: '022-12345678',
    inspectionDateTime: '2025-07-23 10:30 AM',
    paymentMode: 'Online',
    paymentAmount: '₹5000',
    project: 'Inventory App',
    date: '2025-07-23',
    status: 'In Progress',
    hours: 8,
    priority: 'High',
    description: 'Inventory tracking'
  },
  {
    id: 2,
    bookingId: 'BKG1002',
    brand: 'Honda',
    model: 'City',
    variant: 'VX',
    engineer: 'Amit Patil',
    engineerContact: '9123456780',
    customer: 'Finance Corp',
    customerContact: '033-98765432',
    inspectionDateTime: '2025-07-23 01:00 PM',
    paymentMode: 'Cash',
    paymentAmount: '₹3500',
    project: 'Billing System',
    date: '2025-07-23',
    status: 'Completed',
    hours: 6,
    priority: 'Medium',
    description: 'Invoicing system'
  },
  {
    id: 3,
    bookingId: 'BKG1003',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX',
    engineer: 'Riya Kulkarni',
    engineerContact: '9988776655',
    customer: 'SalesForce Partners',
    customerContact: '044-55667788',
    inspectionDateTime: '2025-07-23 03:15 PM',
    paymentMode: 'Card',
    paymentAmount: '₹4200',
    project: 'CRM Tool',
    date: '2025-07-23',
    status: 'Pending',
    hours: 0,
    priority: 'High',
    description: 'CRM customization'
  }
];

const totalPreviousJobs = 42;

const statusColors = {
  'Completed': 'success',
  'In Progress': 'warning',
  'Pending': 'default',
};

const columns = [
  { id: 'bookingId', label: 'Booking ID', mobile: true },
  { id: 'brand', label: 'Brand', mobile: false },
  { id: 'model', label: 'Model', mobile: false },
  { id: 'variant', label: 'Variant', mobile: false },
  { id: 'engineer', label: 'Engineer Name', mobile: true },
  { id: 'engineerContact', label: 'Engineer Contact', mobile: false },
  { id: 'customer', label: 'Customer Name', mobile: true },
  { id: 'customerContact', label: 'Customer Contact', mobile: false },
  { id: 'inspectionDateTime', label: 'Inspection Date/Time', mobile: true },
  { id: 'paymentMode', label: 'Payment Mode', mobile: false },
  { id: 'paymentAmount', label: 'Payment Amount', mobile: false },
  { id: 'status', label: 'Status', mobile: true },
  { id: 'actions', label: 'Download Report', mobile: true },
];

export default function CompletedJobs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredJobs = TodayAssignedJobsData.filter(job =>
    Object.values(job).some(field =>
      String(field).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadPDF = (job) => {
    const doc = new jsPDF();
    doc.setTextColor(46, 125, 50);
    doc.text(`Job Report - ${job.bookingId}`, 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['Booking ID', 'Brand', 'Model', 'Variant', 'Engineer', 'Engineer Contact', 'Customer Name', 'Customer Contact', 'Inspection Date/Time', 'Payment Mode', 'Payment Amount', 'Status']],
      body: [[job.bookingId, job.brand, job.model, job.variant, job.engineer, job.engineerContact, job.customer, job.customerContact, job.inspectionDateTime, job.paymentMode, job.paymentAmount, job.status]],
      headStyles: { fillColor: [46, 125, 50], textColor: 255 },
      bodyStyles: { textColor: [27, 94, 32] },
      alternateRowStyles: { fillColor: [232, 245, 233] }
    });
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Description']],
      body: [[job.description]],
      headStyles: { fillColor: [76, 175, 80], textColor: 255 },
    });
    doc.save(`Job_${job.bookingId}.pdf`);
  };

  const renderMobileRow = (job) => (
    <Box key={job.id} sx={{
      p: 2, mb: 1, backgroundColor: '#f8fbf8',
      borderRadius: 1, borderLeft: `4px solid ${theme.palette.primary.light}`
    }}>
      <Typography variant="body2" fontWeight="bold">Booking ID: {job.bookingId}</Typography>
      <Typography variant="body2">{job.brand} {job.model} ({job.variant})</Typography>
      <Typography variant="body2">Engineer: {job.engineer}</Typography>
      <Typography variant="body2">Engineer Contact: {job.engineerContact}</Typography>
      <Typography variant="body2">Customer: {job.customer}</Typography>
      <Typography variant="body2">Customer Contact: {job.customerContact}</Typography>
      <Typography variant="body2">Inspection: {job.inspectionDateTime}</Typography>
      <Typography variant="body2">Payment: {job.paymentMode} - {job.paymentAmount}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Chip label={job.status} color={statusColors[job.status] || 'default'} size="small" />
        <Tooltip title="Download PDF">
          <IconButton onClick={() => downloadPDF(job)} size="small">
            <PictureAsPdf sx={{ color: theme.palette.primary.dark, fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderDesktopTable = () => (
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell key={column.id}
              sx={{
                color: '#fff', fontWeight: 'bold',
                display: column.mobile || !isMobile ? 'table-cell' : 'none'
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredJobs
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map(job => (
            <TableRow key={job.id} hover>
              {columns.map(column => (
                <TableCell key={`${job.id}-${column.id}`}
                  sx={{ display: column.mobile || !isMobile ? 'table-cell' : 'none' }}
                >
                  {column.id === 'status' ? (
                    <Chip label={job.status} color={statusColors[job.status] || 'default'} size="small" />
                  ) : column.id === 'actions' ? (
                    <Tooltip title="Download PDF">
                      <IconButton onClick={() => downloadPDF(job)} size="small">
                        <PictureAsPdf sx={{ color: theme.palette.primary.dark }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    job[column.id]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );

  return (
    <ThemeProvider theme={greenTheme}>
      <Box sx={{
        p: isMobile ? 1 : 2, backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
      }}>

        {/* Summary Cards */}
        <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#e0fcc2', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Work sx={{ fontSize: isMobile ? 30 : 40 }} />
                  <Box>
                    <Typography variant={isMobile ? "body2" : "h6"}>Today's Jobs</Typography>
                    <Typography variant={isMobile ? "h6" : "h5"}>{TodayAssignedJobsData.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#e0fcc2', height: '100%', borderRadius: 2 }}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <History sx={{ fontSize: isMobile ? 30 : 40 }} />
                  <Box>
                    <Typography variant={isMobile ? "body2" : "h6"}>Previous Jobs</Typography>
                    <Typography variant={isMobile ? "h6" : "h5"}>{totalPreviousJobs}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Header + Search */}
        <Box sx={{
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center',
          gap: 2, mb: 3
        }}>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 600 }}>
            Today's Jobs
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, width: isMobile ? '100%' : 'auto' }}>
            <TextField
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isMobile ? "Search..." : "Search jobs..."}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: theme.palette.primary.dark }} />
                  </InputAdornment>
                ),
                sx: { backgroundColor: '#ffffff', borderRadius: 2 }
              }}
              sx={{ flexGrow: 1 }}
            />
            {isMobile && (
              <IconButton sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
              }}>
                <FilterList />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Table / Mobile list */}
        {isMobile ? (
          <Box sx={{ mb: 2 }}>
            {filteredJobs.length ? filteredJobs.map(job => renderMobileRow(job)) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No jobs found matching your search.
              </Alert>
            )}
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{
              border: `1px solid ${theme.palette.primary.light}`,
              borderRadius: 2, overflowX: 'auto'
            }}>
              {renderDesktopTable()}
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}