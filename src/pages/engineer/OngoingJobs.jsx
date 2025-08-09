import React, { useState, useEffect } from "react";
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
import ApiService from '../../core/services/api.service'
import ServerUrl from '../../core/constants/serverUrl.constant';
import StorageService from "../../core/services/storage.service";
import {APPLICATION_CONSTANTS} from '../../core/constants/app.constant';

const OngoingJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(StorageService.getData(APPLICATION_CONSTANTS.STORAGE.USER_DETAILS));
        const userId = user.userId;
        const res = await new ApiService().apiget(ServerUrl.API_GET_ALL_REQUESTS_BY_ENGINEER + '/' + userId); // Replace with your actual API endpoint
        setJobs(res.data?.data); // Ensure API returns an array of booking objects
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "#1b5e20" }}>
        Ongoing Jobs – PDI in Progress
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2e7d32" }}>
              <TableCell sx={{ color: "white" }}>Customer Name</TableCell>
              <TableCell sx={{ color: "white" }}>Mobile</TableCell>
              <TableCell sx={{ color: "white" }}>Brand & Model</TableCell>
              <TableCell sx={{ color: "white" }}>Booking ID</TableCell>
              <TableCell sx={{ color: "white" }}>Status</TableCell>
              <TableCell sx={{ color: "white" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={index}>
                <TableCell>{job.customerName}</TableCell>
                <TableCell>{job.customerMobile}</TableCell>
                <TableCell>{`${job.brand} ${job.model}`}</TableCell>
                <TableCell>{job.bookingId}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={() => navigate("/engineer/dashboard/report/"+job._id, { state: { job } })}
                  >
                    Continue for Inspection
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OngoingJobs;
