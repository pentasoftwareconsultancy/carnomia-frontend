import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FiFilter, FiCalendar, FiUser, FiTool } from "react-icons/fi";
import ActionMenu from "./ActionMenu";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[6],
  margin: 0,
  width: "100%",
  transition: "none",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[4],
  backgroundColor: "#f8fafc",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: { xs: "0.8rem", sm: "0.9rem" },
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#000000",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
    fontSize: "0.75rem",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75, 2),
  textTransform: "none",
  boxShadow: theme.shadows[2],
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const JobsManagement = ({
  setSelectedRequest,
  setViewMode,
  setEditMode,
  assignedJobsFilter,
  setAssignedJobsFilter,
  assignedJobsRef,
}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await new ApiService().apiget(
          ServerUrl.API_GET_ALLPDIREQUEST
        );
        console.log("API response:", response);
        const requestsArray = response.data?.data || [];
        setRequests(requestsArray);
      } catch (err) {
        setError("Failed to load requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on your custom statuses
  const filteredRequests = requests.filter((r) =>
    assignedJobsFilter === "assigned"
      ? r.status === "ASSIGNED_ENGINEER"
      : r.status === "NEW"
  );

  const renderTable = (data, columns, renderRow, emptyMessage) =>
    data.length === 0 ? (
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{
          py: 4,
          fontSize: { xs: "0.9rem", sm: "1rem" },
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        {emptyMessage}
      </Typography>
    ) : (
      <StyledTableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#E8F5E9" }}>
              {columns.map((column) => (
                <StyledTableCell
                  key={column}
                  sx={{ fontWeight: "bold", color: "#2E7D32" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5, // spacing between icon and text
                    }}
                  >
                    {column === "Booking ID" && <FiTool size={16} />}
                    {column === "Customer" && <FiUser size={16} />}
                    {column === "Date" && <FiCalendar size={16} />}
                    <span>{column}</span>
                  </Box>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((r, index) => (
              <TableRow
                key={r.id}
                hover
                sx={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
                  transition: "background-color 0.3s ease",
                  "&:hover": { backgroundColor: "#f1f5f9" },
                }}
              >
                {renderRow(r)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );

  if (loading) {
    return (
      <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ py: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{ width: "100%", maxWidth: "100%", p: 0, m: 0, bgcolor: "#F1FFE0" }}
    >
      <StyledCard>
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#2E7D32",
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                animation: "fadeIn 0.5s ease-out",
              }}
            >
              Jobs Management
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledButton
                variant={
                  assignedJobsFilter === "assigned" ? "contained" : "outlined"
                }
                size="small"
                onClick={() => setAssignedJobsFilter("assigned")}
                sx={{
                  backgroundColor:
                    assignedJobsFilter === "assigned"
                      ? "#FFA000"
                      : "transparent",
                  color:
                    assignedJobsFilter === "assigned" ? "#ffffff" : "#FFA000",
                  borderColor: "#FFA000",
                  "&:hover": {
                    backgroundColor:
                      assignedJobsFilter === "assigned" ? "#F57C00" : "#FFF8E1",
                    color:
                      assignedJobsFilter === "assigned" ? "#ffffff" : "#F57C00",
                  },
                }}
              >
                <FiFilter size={16} style={{ marginRight: 4 }} />
                Assigned
              </StyledButton>
              <StyledButton
                variant={
                  assignedJobsFilter === "unassigned" ? "contained" : "outlined"
                }
                size="small"
                onClick={() => setAssignedJobsFilter("unassigned")}
                sx={{
                  backgroundColor:
                    assignedJobsFilter === "unassigned"
                      ? "#4CAF50"
                      : "transparent",
                  color:
                    assignedJobsFilter === "unassigned" ? "#ffffff" : "#4CAF50",
                  borderColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor:
                      assignedJobsFilter === "unassigned"
                        ? "#388E3C"
                        : "#E8F5E9",
                    color:
                      assignedJobsFilter === "unassigned"
                        ? "#ffffff"
                        : "#388E3C",
                  },
                }}
              >
                <FiFilter size={16} style={{ marginRight: 4 }} />
                Unassigned
              </StyledButton>
            </Box>
          </Box>

          {renderTable(
            filteredRequests,
            assignedJobsFilter === "assigned"
              ? [
                  "Booking ID",
                  "Customer",
                  "Engineer",
                  "Date",
                  "Slot",
                  "Actions",
                ]
              : [
                  "Booking ID",
                  "Customer",
                  "Location",
                  "Date",
                  "Time",
                  "Actions",
                ],
            (r) => (
              <>
                <StyledTableCell>{r.bookingId}</StyledTableCell>
                <StyledTableCell>{r.customerName}</StyledTableCell>
                {assignedJobsFilter === "assigned" ? (
                  <>
                    <StyledTableCell>
                      {r.assignedEngineer || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell>{r.date}</StyledTableCell>
                    <StyledTableCell>{r.slot || "N/A"}</StyledTableCell>
                  </>
                ) : (
                  <>
                    <StyledTableCell>{r.location}</StyledTableCell>
                    <StyledTableCell>{r.date}</StyledTableCell>
                    <StyledTableCell>{r.time}</StyledTableCell>
                  </>
                )}
                <StyledTableCell>
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
                    <StyledButton
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setSelectedRequest(r);
                        scrollToSection(assignedJobsRef);
                      }}
                      sx={{
                        backgroundColor: "#4CAF50",
                        "&:hover": { backgroundColor: "#388E3C" },
                      }}
                    >
                      Assign
                    </StyledButton>
                  )}
                </StyledTableCell>
              </>
            ),
            `No ${assignedJobsFilter} jobs available.`
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default JobsManagement;