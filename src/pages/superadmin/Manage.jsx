import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import MaterialTable from "../../components/constants/MaterialTable";
import { toast } from "react-toastify";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

const ROLES = {
  ADMIN: "admin",
  ENGINEER: "engineer",
};

export default function Manage() {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;

  const [adminUsers, setAdminUsers] = useState([]);
  const [engineerUsers, setEngineerUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); 
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState(ROLES.ADMIN);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    designation: "",
    password: "",
    active: true,
  });


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(ROLES.ADMIN), fetchUsers(ROLES.ENGINEER)]);
      } catch (error) {
        toast.error("Failed to initialize user data");
        console.error("Init error:", error);
      }
      setLoading(false);
    };
    init();
  }, []); // Empty dependency array since this runs once on mount

  const fetchUsers = async (role) => {
    try {
      const response = await new ApiService().apiget(
        `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/${role}`
      );
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      const updatedUsers = response.data.map((user) => ({
        ...user,
        id: user._id,
        onEdit: () => handleEdit(user, role),
        onDelete: () => handleDelete(user._id, role),
      }));

      role === ROLES.ADMIN
        ? setAdminUsers((prev) =>
            JSON.stringify(prev) === JSON.stringify(updatedUsers) ? prev : updatedUsers
          )
        : setEngineerUsers((prev) =>
            JSON.stringify(prev) === JSON.stringify(updatedUsers) ? prev : updatedUsers
          );
    } catch (error) {
      toast.error(`Failed to fetch ${role}s`);
      console.error(`Fetch ${role} error:`, error);
    }
  };

  const handleEdit = (user, role) => {
    setEditId(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      city: user.city || "",
      designation: user.designation || "",
      password: "",
      active: user.active ?? true,
    });
    setActiveTab(role);
    setOpen(true);
  };

  const handleDelete = async (id, role) => {

    if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
    try {
      await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${id}`);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully`);
      fetchUsers(role);
    } catch (error) {
      toast.error(`Failed to delete ${role}`);
      console.error(`Delete ${role} error:`, error);
    }
  };

  const handleAddOrUpdate = async () => {
    const { name, email, mobile, city, designation, password } = formData;
    const role = activeTab;

    // Validate required fields
    if (!name.trim() || !email.trim() || !mobile.trim() || !city.trim() || !designation.trim()) {
      toast.error("All fields except password are required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!mobileRegex.test(mobile)) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    // Require password for new users
    if (!editId && !password.trim()) {
      toast.error("Password is required for new users");
      return;
    }

    setSubmitting(true);
    try {
      // Conditionally include password for updates
      const payload = editId
        ? { ...formData, role, password: formData.password || undefined }
        : { ...formData, role };
      const response = editId
        ? await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${editId}`, payload)
        : await new ApiService().apipost(ServerUrl.API_REGISTER, payload);

      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      if (!response.data.success) {
        toast.error(response.data.message || `Failed to ${editId ? "update" : "add"} ${role}`);
        return;
      }

      toast.success(
        `${role.charAt(0).toUpperCase() + role.slice(1)} ${editId ? "updated" : "added"} successfully`
      );
      fetchUsers(role);
      handleClose();
    } catch (error) {
      toast.error(`Error ${editId ? "updating" : "adding"} ${role}`);
      console.error(`Submit ${role} error:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditId(null);
    setFormData({
      name: "",
      email: "",
      mobile: "",
      city: "",
      designation: "",
      password: "",
      active: true,
    });
    setOpen(false);
  };

  // Memoize columns to prevent unnecessary re-renders
  const getColumns = useCallback(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "designation", header: "Designation" },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="small"
            variant="outlined"
            onClick={() => row.original.onEdit()}
            aria-label={`Edit ${row.original.name}`}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => row.original.onDelete()}
            aria-label={`Delete ${row.original.name}`}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], []);

  const columns = useMemo(() => getColumns(), [getColumns]);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === ROLES.ADMIN ? "contained" : "outlined"}
          onClick={() => setActiveTab(ROLES.ADMIN)}
          aria-label="Manage Admins"
        >
          Manage Admins
        </Button>
        <Button
          variant={activeTab === ROLES.ENGINEER ? "contained" : "outlined"}
          onClick={() => setActiveTab(ROLES.ENGINEER)}
          aria-label="Manage Engineers"
        >
          Manage Engineers
        </Button>
      </div>

      {/* Table */}
      <MaterialTable
        title={activeTab === ROLES.ADMIN ? "Admins" : "Engineers"}
        data={activeTab === ROLES.ADMIN ? adminUsers : engineerUsers}
        columns={columns}
        loading={loading}
        addButtonLabel={`+ Add ${activeTab === ROLES.ADMIN ? "Admin" : "Engineer"}`}
        onAdd={() => {
          setEditId(null);
          setFormData({
            name: "",
            email: "",
            mobile: "",
            city: "",
            designation: "",
            password: "",
            active: true,
          });
          setOpen(true);
        }}
      />

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="user-dialog-title"
      >
        <DialogTitle id="user-dialog-title">
          {editId
            ? `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
            : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        </DialogTitle>
        <DialogContent>
          {["name", "email", "mobile", "city", "designation"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              margin="dense"
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              aria-describedby={`${field}-description`}
            />
          ))}
          {!editId && (
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="dense"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              aria-describedby="password-description"
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                aria-label="Active status"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} aria-label="Cancel user action">
            Cancel
          </Button>
          <Button
            onClick={handleAddOrUpdate}
            disabled={submitting}
            aria-label={editId ? "Update user" : "Add user"}
          >
            {submitting ? "Submitting..." : editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}