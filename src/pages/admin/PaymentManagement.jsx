import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Chip,
  TextField, InputAdornment, Tabs, Tab, Badge, Avatar, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Fade, Grow
} from '@mui/material';
import {
  Search, CheckCircle, Pending, Download, Visibility, Refresh,
  CreditCard, AccountBalanceWallet, FilterList, Money, Phone
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/system';

// Animation
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Updated payment data with mobile numbers and SR.No
const paymentsData = [
  {
    id: 'PAY001',
    bookingId: 'PUN21050001',
    customer: 'Onkar Patil',
    mobile: '9876543210',
    amount: 3500,
    date: '2023-07-15',
    status: 'paid',
    method: 'UPI',
    items: [
      { name: 'Full Car Service', price: 2500 },
      { name: 'AC Gas Refill', price: 1000 }
    ],
    tax: 350,
    discount: 0
  },
  {
    id: 'PAY002',
    bookingId: 'PUN21050002',
    customer: 'Priya Sharma',
    mobile: '8765432109',
    amount: 2800,
    date: '2023-07-16',
    status: 'unpaid',
    method: 'Credit Card',
    items: [
      { name: 'Basic Inspection', price: 1500 },
      { name: 'Oil Change', price: 800 },
      { name: 'Wheel Alignment', price: 500 }
    ],
    tax: 280,
    discount: 0
  },
  {
    id: 'PAY003',
    bookingId: 'PUN21050003',
    customer: 'Rahul Gupta',
    mobile: '7654321098',
    amount: 4200,
    date: '2023-07-17',
    status: 'paid',
    method: 'Cash',
    items: [
      { name: 'Denting & Painting', price: 3000 },
      { name: 'Brake Repair', price: 1200 }
    ],
    tax: 420,
    discount: 0
  },
  {
    id: 'PAY004',
    bookingId: 'PUN21050004',
    customer: 'Aarti Singh',
    mobile: '6543210987',
    amount: 1500,
    date: '2023-07-18',
    status: 'unpaid',
    method: 'UPI',
    items: [
      { name: 'Basic Inspection', price: 1500 }
    ],
    tax: 150,
    discount: 0
  },
  {
    id: 'PAY005',
    bookingId: 'PUN21050005',
    customer: 'Vikram Joshi',
    mobile: '5432109876',
    amount: 5200,
    date: '2023-07-19',
    status: 'paid',
    method: 'Credit Card',
    items: [
      { name: 'Full Car Service', price: 2500 },
      { name: 'Battery Replacement', price: 2700 }
    ],
    tax: 520,
    discount: 0
  }
];

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const StatusBadge = styled(Chip)(({ status }) => ({
  fontWeight: 700,
  borderRadius: '12px',
  backgroundColor: status === 'paid' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(241, 196, 15, 0.2)',
  color: status === 'paid' ? '#2ecc71' : '#f1c40f',
  animation: status === 'unpaid' ? `${pulse} 2s infinite` : 'none',
  '& .MuiChip-icon': {
    color: status === 'paid' ? '#2ecc71' : '#f1c40f'
  }
}));

const PaymentMethodIcon = ({ method }) => {
  const icons = {
    'Credit Card': <CreditCard fontSize="small" />,
    'UPI': <AccountBalanceWallet fontSize="small" />,
    'Cash': <Money fontSize="small" />
  };
  return icons[method] || <Money fontSize="small" />;
};

const generateInvoicePdf = (payment) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('AutoCare Services', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Professional Vehicle Maintenance', 105, 28, { align: 'center' });
  
  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 105, 40, { align: 'center' });
  
  // Invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${payment.id}`, 20, 50);
  doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 20, 58);
  doc.text(`Booking ID: ${payment.bookingId}`, 20, 66);
  
  // Customer details
  doc.text(`Customer: ${payment.customer}`, 140, 50);
  doc.text(`Mobile: ${payment.mobile}`, 140, 58);
  doc.text(`Payment Method: ${payment.method}`, 140, 66);
  
  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 72, 195, 72);
  
  // Items table
  doc.setFillColor(237, 231, 246);
  doc.rect(15, 78, 180, 10, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('Description', 20, 85);
  doc.text('Amount', 170, 85, { align: 'right' });
  
  // Items list
  let y = 95;
  payment.items.forEach((item, index) => {
    doc.setFont(undefined, 'normal');
    doc.text(item.name, 20, y);
    doc.text(`₹${item.price.toLocaleString()}`, 170, y, { align: 'right' });
    y += 8;
  });
  
  // Totals
  doc.setFont(undefined, 'bold');
  doc.text('Subtotal:', 150, y + 10);
  doc.text(`₹${(payment.amount - payment.tax + payment.discount).toLocaleString()}`, 170, y + 10, { align: 'right' });
  
  if (payment.discount > 0) {
    doc.text('Discount:', 150, y + 20);
    doc.text(`-₹${payment.discount.toLocaleString()}`, 170, y + 20, { align: 'right' });
  }
  
  doc.text('Tax:', 150, y + 30);
  doc.text(`₹${payment.tax.toLocaleString()}`, 170, y + 30, { align: 'right' });
  
  doc.setFontSize(14);
  doc.text('Total:', 150, y + 45);
  doc.text(`₹${payment.amount.toLocaleString()}`, 170, y + 45, { align: 'right' });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('AutoCare Services - Quality you can trust', 105, 285, { align: 'center' });
  
  // Save PDF
  doc.save(`invoice_${payment.id}.pdf`);
};

const AdminPayment = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState(paymentsData);
  const [filteredPayments, setFilteredPayments] = useState(paymentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    let results = payments;
    
    if (tabValue !== 'all') {
      results = results.filter(payment => payment.status === tabValue);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(payment =>
        payment.id.toLowerCase().includes(term) ||
        payment.bookingId.toLowerCase().includes(term) ||
        payment.customer.toLowerCase().includes(term) ||
        payment.mobile.includes(term) ||
        payment.method.toLowerCase().includes(term)
      );
    }
    
    setFilteredPayments(results);
  }, [searchTerm, tabValue, payments]);

  const updatePaymentStatus = (id, status) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === id ? { ...payment, status } : payment
      )
    );
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getPaymentCount = (status) => {
    return payments.filter(payment => payment.status === status).length;
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 4, background: '#f1ffe0', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            p: 3,
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Payment Management
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<Refresh />} 
              onClick={() => setPayments([...paymentsData])}
              sx={{
                background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>

          {/* Search and Filter */}
          <Grow in timeout={600}>
            <StyledCard sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by name, mobile, booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="primary" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '12px' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#e0e0e0' },
                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                      }
                    }}
                  />
                  <Tooltip title="Filters">
                    <IconButton>
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Status Tabs */}
                <Tabs
                  value={tabValue}
                  onChange={(e, newValue) => setTabValue(newValue)}
                  sx={{ mt: 2 }}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab 
                    label={
                      <Badge badgeContent={payments.length} color="default">
                        All
                      </Badge>
                    } 
                    value="all" 
                    sx={{ borderRadius: '12px', mx: 0.5 }}
                  />
                  <Tab 
                    label={
                      <Badge badgeContent={getPaymentCount('paid')} color="success">
                        Paid
                      </Badge>
                    } 
                    value="paid" 
                    icon={<CheckCircle fontSize="small" />}
                    iconPosition="start"
                    sx={{ borderRadius: '12px', mx: 0.5 }}
                  />
                  <Tab 
                    label={
                      <Badge badgeContent={getPaymentCount('unpaid')} color="warning">
                        Unpaid
                      </Badge>
                    } 
                    value="unpaid" 
                    icon={<Pending fontSize="small" />}
                    iconPosition="start"
                    sx={{ borderRadius: '12px', mx: 0.5 }}
                  />
                </Tabs>
              </CardContent>
            </StyledCard>
          </Grow>

          {/* Payments Table */}
          <Grow in timeout={800}>
            <StyledCard>
              <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ 
                    background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
                    '& th': { color: 'white', fontWeight: 600 }
                  }}>
                    <TableRow>
                      {['SR.No', 'Customer Name', 'Mobile', 'Booking ID', 'Payment Mode', 'Amount', 'Status', 'Actions'].map(h => (
                        <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment, index) => (
                      <Grow in timeout={100 * index} key={payment.id}>
                        <TableRow hover sx={{ '&:last-child td': { border: 0 } }}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: theme.palette.primary.main, 
                                color: 'white',
                                width: 36, 
                                height: 36,
                                boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)'
                              }}>
                                {payment.customer.charAt(0)}
                              </Avatar>
                              <Typography>{payment.customer}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone fontSize="small" color="primary" />
                              <Typography>{payment.mobile}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{payment.bookingId}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PaymentMethodIcon method={payment.method} />
                              <Typography>{payment.method}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>₹{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <StatusBadge 
                              label={payment.status} 
                              status={payment.status} 
                              icon={payment.status === 'paid' ? <CheckCircle fontSize="small" /> : <Pending fontSize="small" />}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  onClick={() => handleViewDetails(payment)}
                                  sx={{ 
                                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.2)' }
                                  }}
                                >
                                  <Visibility color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download Invoice">
                                <IconButton
                                  onClick={() => generateInvoicePdf(payment)}
                                  sx={{ 
                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                                  }}
                                >
                                  <Download color="success" />
                                </IconButton>
                              </Tooltip>
                              {payment.status === 'unpaid' && (
                                <Tooltip title="Mark as Paid">
                                  <IconButton
                                    onClick={() => updatePaymentStatus(payment.id, 'paid')}
                                    sx={{ 
                                      bgcolor: 'rgba(255, 193, 7, 0.1)',
                                      '&:hover': { bgcolor: 'rgba(255, 193, 7, 0.2)' }
                                    }}
                                  >
                                    <CheckCircle color="warning" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Grow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledCard>
          </Grow>

          {/* Payment Details Dialog */}
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px' } }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
              color: 'white',
              fontWeight: 600
            }}>
              Payment Details: {selectedPayment?.id}
            </DialogTitle>
            <DialogContent dividers sx={{ p: 3 }}>
              {selectedPayment && (
                <Box>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: 3, 
                    mb: 3,
                    '& > div': { p: 2, borderRadius: '12px', bgcolor: '#f9f9f9' }
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Booking ID</Typography>
                      <Typography fontWeight={600}>{selectedPayment.bookingId}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                      <Typography fontWeight={600}>{selectedPayment.date}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                      <Typography fontWeight={600}>{selectedPayment.customer}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                      <Typography fontWeight={600}>{selectedPayment.mobile}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Method</Typography>
                      <Typography fontWeight={600}>{selectedPayment.method}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Typography fontWeight={600}>
                        <StatusBadge 
                          label={selectedPayment.status} 
                          status={selectedPayment.status} 
                          size="small"
                        />
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                    p: 3, 
                    borderRadius: '16px',
                    mb: 3,
                    border: '1px solid rgba(46, 125, 50, 0.2)'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, textAlign: 'center' }}>
                      ₹{selectedPayment.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Total Amount
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => generateInvoicePdf(selectedPayment)}
                    startIcon={<Download />}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                      }
                    }}
                  >
                    Download Invoice (PDF)
                  </Button>

                  {selectedPayment.status === 'unpaid' && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() => {
                        updatePaymentStatus(selectedPayment.id, 'paid');
                        handleCloseDialog();
                      }}
                      sx={{
                        py: 1.5,
                        borderRadius: '12px',
                        borderWidth: '2px',
                        '&:hover': { borderWidth: '2px' }
                      }}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Fade>
  );
};

export default AdminPayment;