import React, { useState } from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";
import { MoreVert } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import EditRequestForm from "./EditRequestForm";

const statusColors = {
  PENDING: { bg: "bg-yellow-200", text: "text-yellow-800", label: "Pending" },
  WAITING_APPROVAL: { bg: "bg-yellow-200", text: "text-yellow-800", label: "Pending" },
  ASSIGNED_ENGINEER: { bg: "bg-blue-200", text: "text-blue-800", label: "Assigned" },
  COMPLETED: { bg: "bg-green-200", text: "text-green-800", label: "Completed" },
  REJECTED: { bg: "bg-red-200", text: "text-red-800", label: "Cancelled" },
};

// Actions menu (View, Edit, Delete)
const ActionsCell = ({ row, onView, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            onView(row.original);
            handleClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            onEdit(row.original);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(row.original);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

const AllRequests = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Handlers
  const handleView = (row) => {
    setSelectedRow(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteOpen(true);
  };

  const handleEditSave = (updatedRequest) => {
    // TODO: API call to update
    console.log("Updated:", updatedRequest);
    setEditOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await new ApiService().apidelete(
        `${ServerUrl.API_DELETE_REQUEST}/${selectedRow.id}`
      );
      console.log("Deleted:", selectedRow.id);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteOpen(false);
    }
  };

  const Table = withMaterialTable(() => null, {
    title: "All Requests",
    hideAddButton: true,   // 🔥 this hides the Add button
    disableDefaultActions: false, // keep View/Edit/Delete

    columns: [
      { accessorKey: "bookingId", header: "Booking ID" },
      {
        accessorKey: "customer",
        header: "Customer",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">
              {row.original.customerName || "Unknown"}
            </span>
            <span className="text-gray-500 text-sm">
              {row.original.customerMobile || "N/A"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "vehicle",
        header: "Vehicle",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold">{row.original.brand || "-"}</span>
            <span className="text-gray-600 text-sm">
              {row.original.model || "-"}
            </span>
            <span className="text-gray-500 text-sm">
              {row.original.variant || "-"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        Cell: ({ row }) => (
          <div className="text-gray-700 text-sm">
            {row.original.address || row.original.address || "-"}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          const value = row.original.status;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[value]?.bg} ${statusColors[value]?.text}`}
            >
              {statusColors[value]?.label || value}
            </span>
          );
        },
      },
      // {
      //   accessorKey: "actions",
      //   header: "Actions",
      //   Cell: ({ row }) => (
      //     <ActionsCell
      //       row={row}
      //       onView={handleView}
      //       onEdit={handleEdit}
      //       onDelete={handleDelete}
      //     />
      //   ),
      // },
    ],

    getData: async () => {
      try {
        const res = await new ApiService().apiget(
          ServerUrl.API_GET_ALLPDIREQUEST
        );
        return res?.data?.data || [];
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  });

  return (
    <>
      <Table />

      {/* View Dialog */}
      <Dialog open={viewOpen} onClose={() => setViewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedRow ? (
            Object.entries(selectedRow).map(([key, value]) => (
              <Box key={key} className="mb-4">
                <Typography variant="subtitle2" fontWeight="bold">
                  {key}
                </Typography>
                <Typography variant="body2">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : value?.toString() || "N/A"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No request selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <EditRequestForm
        request={selectedRow || {}}
        onSave={handleEditSave}
        onCancel={() => setEditOpen(false)}
        open={editOpen}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete Booking ID:{" "}
            {selectedRow?.bookingId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllRequests;
