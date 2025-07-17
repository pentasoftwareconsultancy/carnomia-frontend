// ViewPaymentStatus.jsx
import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Avatar, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { styled } from '@mui/material/styles';
import { indigo, green, orange, red } from '@mui/material/colors';

// Sample data
const payments = [
  {
    id: 'PAY001',
    bookingId: 'BK001',
    customer: 'Onkar Basawane',
    amount: 2500,
    date: '2025-07-15',
    status: 'completed',
    method: 'Credit Card',
    items: [
      { name: 'Basic Inspection', price: 1500 },
      { name: 'AC Service', price: 1000 }
    ],
    tax: 250,
    discount: 0
  },
  {
    id: 'PAY002',
    bookingId: 'BK002',
    customer: 'Rahul Sharma',
    amount: 1800,
    date: '2025-07-16',
    status: 'pending',
    method: 'UPI',
    items: [
      { name: 'Basic Inspection', price: 1500 },
      { name: 'Oil Change', price: 300 }
    ],
    tax: 180,
    discount: 0
  }
];

const StatusChip = styled('span')(({ status }) => ({
  padding: '4px 10px',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'capitalize',
  backgroundColor:
    status === 'completed'
      ? green[100]
      : status === 'pending'
      ? orange[100]
      : red[100],
  color:
    status === 'completed'
      ? green[800]
      : status === 'pending'
      ? orange[800]
      : red[800],
}));

const generateInvoicePdf = (payment) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(40, 53, 147);
  doc.text('Deep Sight Studio', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Vehicle Inspection Services', 105, 28, { align: 'center' });
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 105, 40, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Invoice #: ${payment.id}`, 20, 50);
  doc.text(`Date: ${new Date(payment.date).toLocaleDateString()}`, 20, 58);
  doc.text(`Booking ID: ${payment.bookingId}`, 20, 66);
  doc.text(`Customer: ${payment.customer}`, 140, 50);
  doc.text(`Payment Method: ${payment.method}`, 140, 58);
  doc.text(`Status: ${payment.status.toUpperCase()}`, 140, 66);

  doc.line(15, 72, 195, 72);
  doc.setFillColor(237, 231, 246);
  doc.rect(15, 78, 180, 10, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('Description', 20, 85);
  doc.text('Amount', 170, 85, { align: 'right' });

  let y = 95;
  payment.items.forEach((item) => {
    doc.setFont(undefined, 'normal');
    doc.text(item.name, 20, y);
    doc.text(`₹${item.price.toLocaleString()}`, 170, y, { align: 'right' });
    y += 8;
  });

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

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('Deep Sight Studio - Vehicle Inspection Services', 105, 285, { align: 'center' });

  doc.save(`invoice_${payment.id}.pdf`);
};

const PaymentStatus = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: indigo[800] }}>
        View Payment Status
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: indigo[50] }}>
                <TableRow>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.bookingId}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: indigo[100], color: indigo[600] }}>
                          {payment.customer.charAt(0)}
                        </Avatar>
                        {payment.customer}
                      </Box>
                    </TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <StatusChip status={payment.status}>{payment.status}</StatusChip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton onClick={() => setSelectedPayment(payment)} color="primary">
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Invoice">
                        <IconButton onClick={() => generateInvoicePdf(payment)} color="secondary">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onClose={() => setSelectedPayment(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <Box>
              <Typography><strong>Booking ID:</strong> {selectedPayment.bookingId}</Typography>
              <Typography><strong>Customer:</strong> {selectedPayment.customer}</Typography>
              <Typography><strong>Date:</strong> {selectedPayment.date}</Typography>
              <Typography><strong>Amount:</strong> ₹{selectedPayment.amount}</Typography>
              <Typography><strong>Status:</strong> {selectedPayment.status}</Typography>
              <Typography><strong>Method:</strong> {selectedPayment.method}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPayment(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentStatus;
