import React, { useState, useMemo, useEffect, useCallback } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const withMaterialTable = (WrappedComponent, tableConfig) => {
  return () => {
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await tableConfig.getData();
          setData(result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, [tableConfig]);

    const openAddDialog = () => {
      setSelectedRow({});
      setIsAddOpen(true);
    };

    const openEditDialog = (rowData) => {
      setSelectedRow(rowData);
      setIsEditOpen(true);
    };

    const openViewDialog = (rowData) => {
      setSelectedRow(rowData);
      setIsViewOpen(true);
    };

    const closeDialogs = () => {
      setIsAddOpen(false);
      setIsEditOpen(false);
      setIsViewOpen(false);
      setSelectedRow({});
    };

    const handleAddSubmit = async () => {
      try {
        const newRow = await tableConfig.addData(selectedRow);
        setData((prevData) => [...prevData, newRow]);
        closeDialogs();
      } catch (error) {
        console.error("Error adding data:", error);
      }
    };

    const handleEditSubmit = async () => {
      try {
        await tableConfig.updateData(selectedRow);
        setData((prevData) =>
          prevData.map((item) =>
            item.id === selectedRow.id ? selectedRow : item
          )
        );
        closeDialogs();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };

    const handleDelete = async (rowData) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          await tableConfig.deleteData(rowData.id);
          setData((prevData) =>
            prevData.filter((item) => item.id !== rowData.id)
          );
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    };

    const renderFormFields = () => {
      if (typeof tableConfig.customFormFields === "function") {
        return tableConfig.customFormFields(selectedRow || {}, setSelectedRow);
      }

      // fallback default rendering
      return tableConfig.columns.map((col) => (
        <TextField
          key={col.accessorKey}
          margin="dense"
          label={col.header}
          fullWidth
          value={selectedRow[col.accessorKey] || ""}
          onChange={(e) =>
            setSelectedRow((prev) => ({
              ...prev,
              [col.accessorKey]: e.target.value,
            }))
          }
        />
      ));
    };

    const renderViewFields = () => (
      <Stack spacing={2}>
        {tableConfig.columns.map((col) => (
          <Box key={col.accessorKey}>
            <Typography variant="subtitle2" component="span">
              {col.header}:{" "}
            </Typography>
            <Typography variant="body2" component="span">
              {selectedRow[col.accessorKey] || "N/A"}
            </Typography>
          </Box>
        ))}
      </Stack>
    );

    const columns = useMemo(() => {
      // If default actions are disabled, return only the provided columns
      if (tableConfig.disableDefaultActions) {
        return tableConfig.columns;
      }

      // Otherwise include the default actions column
      return [
        ...tableConfig.columns,
        {
          id: "actions",
          header: "Actions",
          Cell: ({ row }) => (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    openViewDialog(row.original);
                    setAnchorEl(null);
                  }}
                >
                  View
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    openEditDialog(row.original);
                    setAnchorEl(null);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDelete(row.original);
                    setAnchorEl(null);
                  }}
                >
                  Delete
                </MenuItem>
              </Menu>
            </>
          ),
        },
      ];
    }, [anchorEl, tableConfig]);

    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" component="h2">
            {tableConfig.title}
          </Typography>

          {!tableConfig.hideAddButton && (
            <Tooltip title="Add New">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddDialog}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  ":hover": { backgroundColor: "#1565c0" },
                }}
              >
                Add New
              </Button>
            </Tooltip>
          )}
        </Stack>

        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          enablePagination
          enableRowSelection={false}
          enableGlobalFilter
        />

        {/* Dialogs */}
        <Dialog open={isAddOpen} onClose={closeDialogs} fullWidth>
          <DialogTitle>Add New</DialogTitle>
          <DialogContent>{renderFormFields()}</DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs}>Cancel</Button>
            <Button onClick={handleAddSubmit}>Add</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isEditOpen} onClose={closeDialogs} fullWidth>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>{renderFormFields()}</DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Update</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isViewOpen} onClose={closeDialogs} fullWidth>
          <DialogTitle>View Details</DialogTitle>
          <DialogContent>{renderViewFields()}</DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };
};

export default withMaterialTable;
