import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Report from "./report/Report";

const jobs = [
  { id: 1, project: "Inventory App", date: "2025-07-09", engineer: "Onkar Basawane", status: "In Progress - PDI" },
  { id: 2, project: "CRM Tool", date: "2025-07-09", engineer: "Rahul Sharma", status: "In Progress - PDI" },
  { id: 3, project: "CRM", date: "2025-07-09", engineer: "Priti Sharma", status: "In Progress - PDI" },
];

const OngoingJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  const handleContinueInspection = (job) => {
    setSelectedJob(job);
    navigate('/report', { state: { job } });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#1b5e20" }}>
        Ongoing Jobs – PDI in Progress
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2e7d32" }}>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Project</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Engineer</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.project}</TableCell>
                <TableCell>{job.date}</TableCell>
                <TableCell>{job.engineer}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => navigate("/engineer/dashboard/report")}
                  >
                    Continue for Inspection
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show Inspection Form Below the Table */}
      {selectedJob && (
        <Box sx={{ mt: 4 }}>
          <InspectionForm selectedJob={selectedJob} />
        </Box>
      )}
    </Box>
  );
};

export default OngoingJobs;
