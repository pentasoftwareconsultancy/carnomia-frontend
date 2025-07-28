import React, { useState, useEffect } from "react";
import {
  Button,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MaterialTable from "../../components/constants/MaterialTable";
import ApiService from "../../core/services/api.service";
import  ServerUrl  from "../../core/constants/serverUrl.constant";
import { toast } from "react-toastify";

const Manage = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [openDialog, setOpenDialog] = useState(false);

  const [admins, setAdmins] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    designation: "",
    active: true,
  });

  const [editId, setEditId] = useState(null);


useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await new ApiService().apipost(
        `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}?roles=admin,engineer`
      );
      const users = response?.data?.users || [];

      setAdmins(users.filter((u) => u.role === "admin"));
      setEngineers(users.filter((u) => u.role === "engineer"));
    } catch (err) {
      console.error("Failed to fetch users by role", err);
      setAdmins([]);
      setEngineers([]);
    } finally {
      // setLoading(false);
    }
  };
  fetchUsers();
}, []);



  // useEffect(() => {
  //   localStorage.setItem("admins", JSON.stringify(admins));
  // }, [admins]);

  // useEffect(() => {
  //   localStorage.setItem("engineers", JSON.stringify(engineers));
  // }, [engineers]);

  const toggleStatus = (id, type) => {
    const setter = type === "admin" ? setAdmins : setEngineers;
    const list = type === "admin" ? admins : engineers;
    console.log(list);

    setter(list.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  };

  // const handleAddOrUpdate = () => {
  //   const list = activeTab === "admin" ? admins : engineers;
  //   const setter = activeTab === "admin" ? setAdmins : setEngineers;

  //   if (editId) {
  //     const updatedList = list.map((item) =>
  //       item.id === editId ? { ...formData, id: editId, srNo: item.srNo } : item
  //     );
  //     setter(updatedList);
  //   } else {
  //     const newUser = {
  //       ...formData,
  //       id: Date.now(),
  //       srNo: list.length + 1,
  //     };
  //     setter([...list, newUser]);
  //   }

  //   setFormData({
  //     name: "",
  //     email: "",
  //     mobile: "",
  //     city: "",
  //     designation: "",
  //     active: true,
  //   });
  //   setEditId(null);
  //   setOpenDialog(false);
  // };

  const handleAddOrUpdate = async () => {
  const list = activeTab === "admin" ? admins : engineers;
  const setter = activeTab === "admin" ? setAdmins : setEngineers;
  const role = activeTab; // "admin" or "engineer"

  try {
    //setLoading(true);

    if (editId) {
      // Update existing user
      await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${editId}`, {
        ...formData,
        role,
        password: "123456"
      });

      const updatedList = list.map((item) =>
        item.id === editId ? { ...formData, id: editId, srNo: item.srNo } : item
      );
      setter(updatedList);
      toast.success(`${role} updated successfully`);
    } else {
      // Create new user
      const response = await new ApiService().apipost(ServerUrl.API_REGISTER, {
        ...formData,
        role,
        password: "123456", // Assuming password is required
      });

      const newUser = {
        ...formData,
        id: response.data?.id || Date.now(), // fallback if backend doesn't return ID
        srNo: list.length + 1,
      };
      setter([...list, newUser]);
      toast.success(`${role} added successfully`);
    }

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      mobile: "",
      city: "",
      designation: "",
      active: true,
    });
    setEditId(null);
    setOpenDialog(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || `${editId ? "Update" : "Add"} failed`);
  } finally {
    //setLoading(false);
  }
};


  const handleEdit = (row) => {
    setFormData(row.original);
    setEditId(row.original.id);
    setOpenDialog(true);
  };

  const handleDelete = (row, type) => {
    const id = row.original.id;
    if (type === "admin") {
      setAdmins((prev) => prev.filter((u) => u.id !== id));
    } else {
      setEngineers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const ActionMenu = ({ row, type }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              alert("View:\n" + JSON.stringify(row.original, null, 2));
              handleMenuClose();
            }}
          >
            View
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleEdit(row);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete(row, type);
              handleMenuClose();
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const columns = (type) => {
    const baseColumns = [
      { accessorKey: "srNo", header: "Sr No", size: 60 },
      { accessorKey: "name", header: "Name", size: 120 },
      { accessorKey: "email", header: "Email", size: 160 },
      { accessorKey: "mobile", header: "Mobile", size: 120 },
      { accessorKey: "designation", header: "Designation", size: 150 },
      {
        accessorKey: "active",
        header: "Status",
        size: 100,
        Cell: ({ row }) => (
          <FormControlLabel
            control={
              <Switch
                checked={row.original.active}
                onChange={() => toggleStatus(row.original.id, type)}
                color="success"
              />
            }
            label={row.original.active ? "Active" : "Inactive"}
          />
        ),
      },
    ];

    // Insert City column before Action if engineer
    if (type === "engineer") {
      baseColumns.splice(baseColumns.length - 1, 0, {
        accessorKey: "city",
        header: "City",
        size: 120,
      });
    }

    // Add Action column last
    baseColumns.push({
      header: "Action",
      size: 80,
      Cell: ({ row }) => <ActionMenu row={row} type={type} />,
    });

    return baseColumns;
  };

  return (
    <div className="p-6">
      {/* Tab buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === "admin" ? "contained" : "outlined"}
          onClick={() => setActiveTab("admin")}
        >
          Manage Admin
        </Button>
        <Button
          variant={activeTab === "engineer" ? "contained" : "outlined"}
          onClick={() => setActiveTab("engineer")}
        >
          Manage Engineer
        </Button>
      </div>

      {/* Material Table */}
      <MaterialTable
        title={activeTab === "admin" ? "Admins" : "Engineers"}
        data={activeTab === "admin" ? admins : engineers}
        columns={columns(activeTab)}
        addButtonLabel={`+ Add ${activeTab === "admin" ? "Admin" : "Engineer"}`}
        onAdd={() => {
          setFormData({
            name: "",
            email: "",
            mobile: "",
            city: "",
            designation: "",
            active: true,
          });
          setEditId(null);
          setOpenDialog(true);
        }}
      />

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {editId ? "Edit" : "Add"} {activeTab === "admin" ? "Admin" : "Engineer"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            label="Mobile"
            fullWidth
            margin="dense"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          />
          {activeTab === "engineer" && (
            <TextField
              label="City"
              fullWidth
              margin="dense"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          )}
          <TextField
            label="Designation"
            fullWidth
            margin="dense"
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddOrUpdate}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Manage;