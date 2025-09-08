import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";
import { toast } from "react-toastify";

const AddLocations = () => {
  const [city, setCity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [cityList, setCityList] = useState([]);

  // Fetch cities
  const fetchCities = async () => {
    try {
      const response = await new ApiService().apiget(
        ServerUrl.API_GET_LOCATIONS
      );
      if (response?.data?.locations) {
        setCityList(response.data.locations);
      } else {
        setCityList([]);
      }
    } catch (err) {
      console.error("Failed to fetch Locations", err);
      toast.error("Error fetching cities");
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleAddOrUpdateCity = async () => {
    if (city.trim() === "") {
      return toast.error("City name is required");
    }

    // Split by comma, trim each, filter out empty strings
    const citiesArray = city
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    try {
      if (editIndex !== null) {
        const trimmedCity = citiesArray[0];
        const response = await new ApiService().apiput(
          ServerUrl.API_UPDATE_LOCATIONS,
          {
            oldName: cityList[editIndex],
            newName: trimmedCity,
          }
        );

        if (response?.data) {
          toast.success("City updated successfully");
          fetchCities();
          setEditIndex(null);
          setCity("");
        } else {
          toast.error(response?.data?.message || "Failed to update city");
        }
      } else {
        // Add single or multiple cities
        let payload;
        if (citiesArray.length === 1) {
          // Single city
          payload = { name: citiesArray[0] };
        } else {
          // Multiple cities
          payload = { locations: citiesArray };
        }

        const response = await new ApiService().apipost(
          ServerUrl.API_ADD_LOCATIONS,
          payload
        );

        if (response?.data) {
          toast.success("City(s) added successfully");
          fetchCities();
          setCity("");
        } else {
          toast.error(response?.data?.message || "Failed to add city(s)");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        editIndex !== null ? "Error updating city" : "Error adding city(s)"
      );
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await new ApiService().apidelete(
        `${ServerUrl.API_DELETE_LOCATIONS}/${encodeURIComponent(name)}`
      );

      if (response?.data) {
        toast.success("City deleted successfully");
        fetchCities();
      } else {
        toast.error(response?.data?.message || "Failed to delete city");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting city");
    }
  };

  const handleEdit = (index) => {
    setCity(cityList[index]);
    setEditIndex(index);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Manage Cities
      </Typography>

      {/* Add / Update Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="Enter City Name"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#81da5b", color: "#FFFFFF", "&:hover": { backgroundColor: "#6fc23d" } }}
          onClick={handleAddOrUpdateCity}
        >
          {editIndex !== null ? "Update City" : "Add City"}
        </Button>
      </Paper>

      {/* View Locations Table */}
      {cityList.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            View Locations
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>
                  <TableCell>
                    <strong>City Name</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cityList.map((name, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(index)}>
                        <EditIcon sx={{ color: "#81da5b"}} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(name)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AddLocations;
