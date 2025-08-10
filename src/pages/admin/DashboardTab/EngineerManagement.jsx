import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Switch,
  Box,
} from "@mui/material";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const EngineerManagement = () => {
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await new ApiService().apiget(
          ServerUrl.API_GET_ALL_USERS_BY_ROLES + "/engineer"
        );

        if (response?.data?.data) {
          setEngineers(response.data.data);
        } else if (Array.isArray(response?.data)) {
          setEngineers(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch engineers", err);
      }
    };

    fetchEngineers();
  }, []);

  const handleToggle = async (id) => {
    setEngineers((prev) =>
      prev.map((eng) => (eng.id === id ? { ...eng, active: !eng.active } : eng))
    );
    // You may also add your API call to update status here
  };

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
      <TableContainer
        component={Paper}
        className="rounded-xl shadow-md bg-gray-100"
      >
        <Table size="small">
          <TableHead>
            <TableRow className="bg-green-100">
              {columns.map((column) => (
                <TableCell
                  key={column}
                  className="text-green-800 font-bold text-center text-sm md:text-base"
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{data.map(renderRow)}</TableBody>
        </Table>
      </TableContainer>
    );

  return (
    <Box className="w-full p-0 bg-[#F1FFE0]">
      <div className="bg-white rounded-2xl shadow-lg w-full transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-green-800 font-bold text-xl sm:text-2xl mb-4 animate-fadeIn">
            Engineers Management
          </h2>

          {renderTable(
            engineers,
            ["Name", "City", "Mobile", "Status", "Toggle"],
            (eng, index) => (
              <TableRow
                key={eng._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-slate-100`}
              >
                <TableCell className="text-center text-sm">
                  {eng.name}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {eng.city}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {eng.mobile}
                </TableCell>
                <TableCell className="text-center">
                  <Chip
                    label={eng.active ? "Active" : "Inactive"}
                    sx={{
                      fontWeight: "bold",
                      px: 1.5,
                      backgroundColor: eng.active ? "#4CAF50" : "#EF4444",
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: "0.75rem",
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={eng.active || false} // default false if undefined
                    onChange={() => handleToggle(eng._id)}
                    color="success"
                    inputProps={{ "aria-label": "toggle engineer status" }}
                  />
                </TableCell>
              </TableRow>
            ),
            "No engineers available."
          )}
        </div>
      </div>
    </Box>
  );
};

export default EngineerManagement;