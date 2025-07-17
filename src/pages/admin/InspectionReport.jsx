import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Chip, Divider,
  FormControl, InputLabel, Select, MenuItem, TextareaAutosize
} from '@mui/material';
import { Visibility, Edit, CheckCircle, Send, Download, Cancel } from '@mui/icons-material';

const InspectionReport = () => { 
  // Enhanced report data structure
  const [reports, setReports] = useState([
    {
      id: 1,
      bookingId: "DSS001",
      customerName: "Onkar Basawane",
      engineerName: "Engineer A",
      date: "2025-07-10",
      status: "pending", // pending → approved/rejected → sent
      reportUrl: "/reports/dss001.pdf",
      findings: [
        { id: 1, category: "Exterior", issue: "Minor scratch on rear bumper", severity: "low" },
        { id: 2, category: "Interior", issue: "AC not cooling properly", severity: "medium" }
      ],
      recommendations: "Replace AC compressor, polish scratch",
      adminNotes: "",
      rejectionReason: "",
      vehicleDetails: {
        brand: "Hyundai",
        model: "i20",
        variant: "Sportz",
        year: "2022"
      }
    }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [modifiedReport, setModifiedReport] = useState(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModifiedReport({...report});
    setOpenDialog(true);
    setEditing(false);
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFieldChange = (field, value) => {
    setModifiedReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFindingChange = (id, field, value) => {
    setModifiedReport(prev => ({
      ...prev,
      findings: prev.findings.map(f => 
        f.id === id ? { ...f, [field]: value } : f
      )
    }));
  };

  const handleApprove = () => {
    if (!modifiedReport.adminNotes.trim()) {
      alert("Please add approval notes before approving");
      return;
    }

    setReports(reports.map(report => 
      report.id === modifiedReport.id ? 
      { ...modifiedReport, status: "approved" } : report
    ));
    setOpenDialog(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setReports(reports.map(report => 
      report.id === modifiedReport.id ? 
      { 
        ...modifiedReport, 
        status: "rejected",
        rejectionReason: rejectionReason
      } : report
    ));
    setShowRejectDialog(false);
    setOpenDialog(false);
    setRejectionReason("");
  };

  const handleSendToCustomer = () => {
    setReports(reports.map(report => 
      report.id === modifiedReport.id ? 
      { ...modifiedReport, status: "sent" } : report
    ));
    setOpenDialog(false);
  };

  const handleSaveChanges = () => {
    setReports(reports.map(report => 
      report.id === modifiedReport.id ? modifiedReport : report
    ));
    setEditing(false);
  };

  const addNewFinding = () => {
    const newId = Math.max(...modifiedReport.findings.map(f => f.id), 0) + 1;
    setModifiedReport(prev => ({
      ...prev,
      findings: [
        ...prev.findings,
        { id: newId, category: "", issue: "", severity: "low" }
      ]
    }));
  };

  const removeFinding = (id) => {
    setModifiedReport(prev => ({
      ...prev,
      findings: prev.findings.filter(f => f.id !== id)
    }));
  };

  const generatePdfReport = () => {
    const doc = new jsPDF();
    
    // Add logo or header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text('DEEP SIGHT STUDIO', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.text('VEHICLE INSPECTION REPORT', 105, 22, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(200);
    doc.line(15, 25, 195, 25);
    
    // Basic info section
    doc.setFontSize(12);
    doc.text(`Booking ID: ${modifiedReport.bookingId}`, 20, 35);
    doc.text(`Customer: ${modifiedReport.customerName}`, 20, 42);
    doc.text(`Inspection Date: ${modifiedReport.date}`, 20, 49);
    doc.text(`Engineer: ${modifiedReport.engineerName}`, 20, 56);
    doc.text(`Status: ${modifiedReport.status.toUpperCase()}`, 20, 63);
    
    // Vehicle details
    doc.setFontSize(14);
    doc.text('VEHICLE DETAILS', 20, 75);
    doc.setFontSize(12);
    doc.text(`Brand: ${modifiedReport.vehicleDetails.brand}`, 20, 82);
    doc.text(`Model: ${modifiedReport.vehicleDetails.model}`, 20, 89);
    doc.text(`Variant: ${modifiedReport.vehicleDetails.variant}`, 20, 96);
    doc.text(`Year: ${modifiedReport.vehicleDetails.year}`, 20, 103);
    
    // Findings section
    doc.setFontSize(14);
    doc.text('INSPECTION FINDINGS', 20, 115);
    doc.setFontSize(12);
    
    let yPosition = 122;
    modifiedReport.findings.forEach((finding, index) => {
      doc.text(`${index + 1}. ${finding.category.toUpperCase()}: ${finding.issue}`, 25, yPosition);
      doc.text(`Severity: ${finding.severity.toUpperCase()}`, 30, yPosition + 7);
      yPosition += 15;
      
      // Add new page if we're running out of space
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Recommendations
    doc.setFontSize(14);
    doc.text('RECOMMENDATIONS', 20, yPosition + 10);
    doc.setFontSize(12);
    doc.text(modifiedReport.recommendations, 25, yPosition + 17);
    
    // Admin section
    doc.setFontSize(14);
    doc.text('ADMIN NOTES', 20, yPosition + 30);
    doc.setFontSize(12);
    doc.text(modifiedReport.adminNotes || 'N/A', 25, yPosition + 37);
    
    if (modifiedReport.status === 'rejected') {
      doc.setFontSize(14);
      doc.text('REJECTION REASON', 20, yPosition + 50);
      doc.setFontSize(12);
      doc.text(modifiedReport.rejectionReason, 25, yPosition + 57);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Report generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
    
    // Save the PDF
    doc.save(`inspection_report_${modifiedReport.bookingId}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Inspection Reports Management
      </Typography>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Booking ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Vehicle</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.bookingId}</TableCell>
                    <TableCell>{report.customerName}</TableCell>
                    <TableCell>
                      {report.vehicleDetails.brand} {report.vehicleDetails.model}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={
                          report.status === 'sent' ? 'success' :
                          report.status === 'approved' ? 'warning' :
                          report.status === 'rejected' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewReport(report)}
                        sx={{ mr: 1 }}
                      >
                        Review
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={generatePdfReport}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Report Review Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? "Edit" : "Review"} Inspection Report: {selectedReport?.bookingId}
        </DialogTitle>
        <DialogContent dividers>
          {modifiedReport && (
            <Box>
              {/* Vehicle Details */}
              <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3 }}>
                <div>
                  <Typography><strong>Brand:</strong> {modifiedReport.vehicleDetails.brand}</Typography>
                  <Typography><strong>Model:</strong> {modifiedReport.vehicleDetails.model}</Typography>
                </div>
                <div>
                  <Typography><strong>Variant:</strong> {modifiedReport.vehicleDetails.variant}</Typography>
                  <Typography><strong>Year:</strong> {modifiedReport.vehicleDetails.year}</Typography>
                </div>
                <div>
                  <Typography><strong>Engineer:</strong> {modifiedReport.engineerName}</Typography>
                  <Typography><strong>Inspection Date:</strong> {modifiedReport.date}</Typography>
                </div>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Findings Section - Editable */}
              <Typography variant="h6" gutterBottom>Inspection Findings</Typography>
              {modifiedReport.findings.map((finding) => (
                <Box key={finding.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                  {editing ? (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={finding.category}
                          onChange={(e) => handleFindingChange(finding.id, 'category', e.target.value)}
                          label="Category"
                        >
                          {['Exterior', 'Interior', 'Mechanical', 'Electrical', 'Safety'].map(item => (
                            <MenuItem key={item} value={item}>{item}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Issue Description"
                        value={finding.issue}
                        onChange={(e) => handleFindingChange(finding.id, 'issue', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <FormControl fullWidth>
                        <InputLabel>Severity</InputLabel>
                        <Select
                          value={finding.severity}
                          onChange={(e) => handleFindingChange(finding.id, 'severity', e.target.value)}
                          label="Severity"
                        >
                          {['low', 'medium', 'high'].map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button 
                        color="error"
                        onClick={() => removeFinding(finding.id)}
                        sx={{ mt: 1 }}
                      >
                        Remove Finding
                      </Button>
                    </>
                  ) : (
                    <>
                      <Typography><strong>Category:</strong> {finding.category}</Typography>
                      <Typography><strong>Issue:</strong> {finding.issue}</Typography>
                      <Typography><strong>Severity:</strong> 
                        <Chip 
                          label={finding.severity} 
                          size="small" 
                          sx={{ ml: 1 }}
                          color={
                            finding.severity === 'high' ? 'error' :
                            finding.severity === 'medium' ? 'warning' : 'success'
                          }
                        />
                      </Typography>
                    </>
                  )}
                </Box>
              ))}

              {editing && (
                <Button 
                  variant="outlined" 
                  onClick={addNewFinding}
                  sx={{ mb: 3 }}
                >
                  Add New Finding
                </Button>
              )}

              {/* Recommendations */}
              <Typography variant="h6" gutterBottom>Recommendations</Typography>
              {editing ? (
                <TextareaAutosize
                  minRows={3}
                  style={{ width: '100%', padding: '8px' }}
                  value={modifiedReport.recommendations}
                  onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                />
              ) : (
                <Typography>{modifiedReport.recommendations}</Typography>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Admin Section */}
              <Typography variant="h6" gutterBottom>Admin Actions</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Admin Notes"
                value={modifiedReport.adminNotes}
                onChange={(e) => handleFieldChange('adminNotes', e.target.value)}
                required={modifiedReport.status === 'pending'}
              />

              {modifiedReport.status === 'rejected' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Rejection Reason:</Typography>
                  <Typography sx={{ p: 2, backgroundColor: '#ffeeee', borderRadius: 1 }}>
                    {modifiedReport.rejectionReason}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="contained"
                  onClick={generatePdfReport}
                  startIcon={<Download />}
                >
                  Download Full Report
                </Button>
                
                {editing ? (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button 
                    variant="outlined"
                    onClick={handleEditToggle}
                    startIcon={<Edit />}
                  >
                    Edit Report
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          
          {modifiedReport?.status === 'pending' && !editing && (
            <>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<Cancel />}
                onClick={() => setShowRejectDialog(true)}
              >
                Reject Report
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CheckCircle />}
                onClick={handleApprove}
                disabled={!modifiedReport.adminNotes.trim()}
              >
                Approve Report
              </Button>
            </>
          )}

          {modifiedReport?.status === 'approved' && !editing && (
            <Button 
              variant="contained" 
              color="success"
              startIcon={<Send />}
              onClick={handleSendToCustomer}
            >
              Send to Customer
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
        <DialogTitle>Reject Inspection Report</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Please provide a reason for rejecting this report:</Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            label="Rejection Reason"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InspectionReport;