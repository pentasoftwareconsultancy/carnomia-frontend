import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, useMediaQuery, useTheme, TextField, InputAdornment, MenuItem, Select, Chip,
  IconButton, Tooltip, Grid, Accordion, AccordionSummary, AccordionDetails, createTheme,
  ThemeProvider
} from '@mui/material';
import {
  Search, Sort, PictureAsPdf, ExpandMore
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ✅ Green theme
const greenTheme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
      light: '#81c784',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1b5e20',
      secondary: '#4caf50',
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  }
});

// ✅ Sample job data
const TodayAssignedJobsData = [
  { id: 1, project: 'Inventory App', date: '2025-07-23', engineer: 'Sneha Shinde', status: 'In Progress', client: 'Retail Solutions Inc.', hours: 8, priority: 'High', description: 'Inventory tracking' },
  { id: 2, project: 'Billing System', date: '2025-07-23', engineer: 'Amit Patil', status: 'Completed', client: 'Finance Corp', hours: 6, priority: 'Medium', description: 'Invoicing system' },
  { id: 3, project: 'CRM Tool', date: '2025-07-23', engineer: 'Riya Kulkarni', status: 'Pending', client: 'SalesForce Partners', hours: 0, priority: 'High', description: 'CRM customization' },
];

const PreviouslyCompletedJobsData = [
  { id: 4, project: 'E-commerce', date: '2025-07-22', engineer: 'Rajesh Kumar', status: 'Completed', client: 'ShopEasy', hours: 45, priority: 'Critical', description: 'E-commerce solution' },
  { id: 5, project: 'HR App', date: '2025-07-21', engineer: 'Priya Sharma', status: 'Completed', client: 'TalentFirst', hours: 28, priority: 'Medium', description: 'HR Portal' },
  { id: 6, project: 'Mobile App', date: '2025-07-18', engineer: 'Vikram Joshi', status: 'Completed', client: 'TechMobile', hours: 36, priority: 'High', description: 'Cross-platform App' },
  { id: 7, project: 'Data Migration', date: '2025-07-15', engineer: 'Neha Gupta', status: 'Completed', client: 'DataSystems', hours: 42, priority: 'Critical', description: 'Cloud migration' },
  { id: 8, project: 'API Integration', date: '2025-07-10', engineer: 'Arun Mehta', status: 'Completed', client: 'ConnectTech', hours: 20, priority: 'Medium', description: 'API auth' },
  { id: 9, project: 'Dashboard UI', date: '2025-07-05', engineer: 'Pooja Patel', status: 'Completed', client: 'AnalyticsPro', hours: 25, priority: 'High', description: 'Real-time Dashboard' },
];

const statusColors = {
  'Completed': 'success',
  'In Progress': 'warning',
  'Pending': 'default',
};

export default function CompletedJobs() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expanded, setExpanded] = useState(false);

  const allJobs = [...TodayAssignedJobsData, ...PreviouslyCompletedJobsData];

  const filterByTimePeriod = (jobs, period) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return jobs.filter(job => {
      const jobDate = new Date(job.date);
      const refDate = new Date(today);

      if (period === 'Week') {
        refDate.setDate(refDate.getDate() - 7);
        return jobDate >= refDate;
      }
      if (period === 'Month') {
        refDate.setMonth(refDate.getMonth() - 1);
        return jobDate >= refDate;
      }
      if (period === 'Year') {
        refDate.setFullYear(refDate.getFullYear() - 1);
        return jobDate >= refDate;
      }
      return true;
    });
  };

  const getTodaysJobs = () => {
    const today = new Date().toISOString().split('T')[0];
    return allJobs.filter(job => job.date === today);
  };

  const filteredJobs = allJobs
    .filter(job =>
      [job.project, job.engineer, job.client].some(field =>
        field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const valA = sortBy === 'date' ? new Date(a.date) : a[sortBy];
      const valB = sortBy === 'date' ? new Date(b.date) : b[sortBy];
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  const todaysJobs = filteredJobs.filter(job => TodayAssignedJobsData.some(j => j.id === job.id));
  const previousCompletedJobs = filterByTimePeriod(
    filteredJobs.filter(job => PreviouslyCompletedJobsData.some(j => j.id === job.id)),
    timeFilter
  );

  const downloadPDF = (job) => {
    const doc = new jsPDF();
    doc.text(`Job Report - ${job.project}`, 14, 15);
    autoTable(doc, {
      startY: 25,
      head: [['ID', 'Project', 'Date', 'Engineer', 'Client', 'Status']],
      body: [[job.id, job.project, job.date, job.engineer, job.client, job.status]],
      headStyles: { fillColor: [46, 125, 50], textColor: 255 },
      alternateRowStyles: { fillColor: [232, 245, 233] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Description']],
      body: [[job.description]],
    });

    doc.save(`Job_${job.id}.pdf`);
  };

  const renderTable = (jobs) => (
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
          {['ID', 'Project', 'Date', 'Engineer', 'Client', 'Status', ''].map(header => (
            <TableCell key={header} sx={{ color: '#fff', fontWeight: 'bold' }}>
              {header !== '' ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {header}
                  <IconButton onClick={() => setSortBy(header.toLowerCase())} size="small" sx={{ color: '#fff' }}>
                    <Sort fontSize="small" />
                  </IconButton>
                </Box>
              ) : null}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.length ? jobs.map(job => (
          <TableRow key={job.id}>
            <TableCell>{job.id}</TableCell>
            <TableCell>{job.project}</TableCell>
            <TableCell>{job.date}</TableCell>
            <TableCell>{job.engineer}</TableCell>
            <TableCell>{job.client}</TableCell>
            <TableCell>
              <Chip label={job.status} color={statusColors[job.status] || 'default'} size="small" />
            </TableCell>
            <TableCell>
              <Tooltip title="Download PDF">
                <IconButton onClick={() => downloadPDF(job)}>
                  <PictureAsPdf color="primary" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={7} align="center">No Jobs Found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <ThemeProvider theme={greenTheme}>
      <Box sx={{ p: 2, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        {/* Header and Search */}
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h5" color="primary">Job Tracking Dashboard</Typography>
          <TextField
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
            }}
          />
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            ['Today\'s Jobs', getTodaysJobs().length],
            ['Total Jobs', filteredJobs.length],
          ].map(([title, count], idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper sx={{ p: 2, textAlign: 'center', borderLeft: `4px solid ${theme.palette.primary.dark}` }}>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">{count}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tables */}
        <Typography variant="h6" sx={{ mb: 1 }}>Today's Assigned Jobs</Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>{renderTable(todaysJobs)}</TableContainer>

        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>Previously Completed Jobs</Typography>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              size="small"
              sx={{ ml: 2 }}
              onClick={e => e.stopPropagation()}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Week">Last Week</MenuItem>
              <MenuItem value="Month">Last Month</MenuItem>
              <MenuItem value="Year">Last Year</MenuItem>
            </Select>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper}>{renderTable(previousCompletedJobs)}</TableContainer>
          </AccordionDetails>
        </Accordion>
      </Box>
    </ThemeProvider>
  );
}