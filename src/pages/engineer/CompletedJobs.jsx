import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Completed = [
  { id: 1, project: 'Inventory App', date: '2025-07-09', engineer: 'Sneha Shinde', status: 'Completed' },
  { id: 2, project: 'Billing System', date: '2025-07-09', engineer: 'Amit Patil', status: 'Completed' },
  { id: 3, project: 'CRM Tool', date: '2025-07-09', engineer: 'Riya Kulkarni', status: 'Completed' },
];

const CompletedJobs = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Daily Completed Jobs Report', 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Project', 'Date', 'Engineer', 'Status']],
      body: completedJobs.map((job) => [
        job.id,
        job.project,
        job.date,
        job.engineer,
        job.status,
      ]),
    });

    doc.save('Daily_Completed_Jobs_Report.pdf');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%' }}>
      {/* Heading */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Daily Completed Jobs
      </Typography>

      {/* Styled Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2e7d32' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Project</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Engineer</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Completed.map((job, index) => (
              <TableRow
                key={job.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e8f5e9',
                  '&:hover': {
                    backgroundColor: '#c8e6c9',
                  },
                }}
              >
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.project}</TableCell>
                <TableCell>{job.date}</TableCell>
                <TableCell>{job.engineer}</TableCell>
                <TableCell>{job.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Download Button BELOW table */}
      <Box sx={{ mt: 3, textAlign: { xs: 'center', md: 'left' } }}>
        <Button
          onClick={downloadPDF}
          sx={{
            backgroundColor: 'green',
            color: 'white',
            '&:hover': {
              backgroundColor: '#66bb6a', // light green
            },
            px: 3,
            py: 1,
            fontWeight: 'bold',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          Download Report
        </Button>
      </Box>
    </Box>
  );
};

export default CompletedJobs;
