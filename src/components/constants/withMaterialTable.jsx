import React, { useEffect, useState, useMemo } from "react";
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
    const [currentRow, setCurrentRow] = useState(null);

    const toggleStatus = async (rowId) => {
      const row = data.find((u) => u.id === rowId);
      if (!row) return;

      const updatedStatus = !row.user_status;

      try {
        await new ApiService().apipatch(
          `${ServerUrl.API_UPDATE_USER}/${rowId}`,
          { user_status: updatedStatus }
        );

        setData((prev) =>
          prev.map((u) =>
            u.id === rowId ? { ...u, user_status: updatedStatus } : u
          )
        );
      } catch (err) {
        console.error("Failed to toggle engineer status", err);
      }
    };

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
        const result = await tableConfig.addData(selectedRow);

        // if full dataset is returned
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData((prev) => [...prev, result]);
        }

        closeDialogs();
      } catch (error) {
        console.error("Error adding data:", error);
      }
    };

    const handleEditSubmit = async () => {
      try {
        const result = await tableConfig.updateData(selectedRow);

        // if full dataset is returned
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setData((prev) =>
            prev.map((item) => (item.id === selectedRow.id ? result : item))
          );
        }

        closeDialogs();
      } catch (error) {
        console.error("Error updating data:", error);
      }
    };

    const handleDelete = async (rowData) => {
      if (window.confirm("Are you sure you want to delete this item?")) {
        try {
          const result = await tableConfig.deleteData(rowData.id);

          if (Array.isArray(result)) {
            setData(result);
          } else {
            setData((prev) => prev.filter((item) => item.id !== rowData.id));
          }
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    };

    const renderFormFields = () => {
      if (typeof tableConfig.customFormFields === "function") {
        return tableConfig.customFormFields(selectedRow, setSelectedRow);
      }

      return tableConfig.columns.map((col) => {
        const value = selectedRow[col.accessorKey] || "";

        // Dropdown select
        if (
          col.editVariant === "select" &&
          Array.isArray(col.editSelectOptions)
        ) {
          return (
            <TextField
              key={col.accessorKey}
              margin="dense"
              label={col.header}
              fullWidth
              select
              value={value}
              onChange={(e) =>
                setSelectedRow((prev) => ({
                  ...prev,
                  [col.accessorKey]: e.target.value,
                }))
              }
            >
              {col.editSelectOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        // Default text input
        return (
          <TextField
            key={col.accessorKey}
            margin="dense"
            label={col.header}
            fullWidth
            value={value}
            onChange={(e) =>
              setSelectedRow((prev) => ({
                ...prev,
                [col.accessorKey]: e.target.value,
              }))
            }
          />
        );
      });
    };

    const renderViewFields = () => (
      <Stack spacing={2}>
        {tableConfig.columns.map((col) => (
          <Box key={col.accessorKey}>
            <Typography variant="subtitle2">{col.header}:</Typography>
            <Typography variant="body2">
              {selectedRow[col.accessorKey] || "N/A"}
            </Typography>
          </Box>
        ))}
      </Stack>
    );

    const columns = useMemo(() => {
      if (tableConfig.disableDefaultActions) return tableConfig.columns;

      return [
        ...tableConfig.columns,
        {
          id: "actions",
          header: "Actions",
          Cell: ({ row }) => (
            <>
              <IconButton
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setCurrentRow(row.original);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl) && currentRow?.id === row.original.id}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    openViewDialog(currentRow);
                    setAnchorEl(null);
                  }}
                >
                  View
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    openEditDialog(currentRow);
                    setAnchorEl(null);
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleDelete(currentRow);
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
    }, [anchorEl, currentRow, tableConfig]);

    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" sx={{ color: "#81da5b" }}>
            {tableConfig.title}
          </Typography>

          {!tableConfig.hideAddButton && (
            <Tooltip title="Add New">
              <Button
                variant="contained"
                sx={{ backgroundColor: "#81da5b", color: "", "&:hover": { backgroundColor: "#6fc23d" } }}
                startIcon={<AddIcon />}
                onClick={openAddDialog}
              >
                Add New
              </Button>
            </Tooltip>
          )}
        </Stack>

        {/* Table with styled headers */}
        <MaterialReactTable
          columns={columns}
          data={data}
          enableSorting
          enablePagination
          enableRowSelection={false}
          enableGlobalFilter
          muiTableHeadRowProps={{
            sx: {
              backgroundColor: "#f0fdf4", // header row background
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              color: "#81da5b", // heading text color
              fontWeight: "bold",
              fontSize: "15px",
            },
          }}
        />

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onClose={closeDialogs} fullWidth>
          <DialogTitle>Add New</DialogTitle>
          <DialogContent>{renderFormFields()}</DialogContent>
          <DialogActions>
            <Button onClick={closeDialogs} sx={{ backgroundColor: "#81da5b", color: "#FFFFFF", "&:hover": { backgroundColor: "#6fc23d" } }}>
            Cancel
            </Button>
            <Button onClick={handleAddSubmit} sx={{ backgroundColor: "#81da5b", color: "#FFFFFF", "&:hover": { backgroundColor: "#6fc23d" } }}>
              Add
              </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onClose={closeDialogs} fullWidth>
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>{renderFormFields()}</DialogContent>
          <DialogActions>
          <Button onClick={closeDialogs} sx={{ backgroundColor: "#81da5b", color: "#FFFFFF", "&:hover": { backgroundColor: "#6fc23d" } }}>
            Cancel
          </Button>
            <Button onClick={handleEditSubmit} sx={{ backgroundColor: "#81da5b", color: "#FFFFFF", "&:hover": { backgroundColor: "#6fc23d" } }}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Dialog */}
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
