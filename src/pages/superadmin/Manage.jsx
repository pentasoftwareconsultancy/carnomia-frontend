import React, { useState } from "react";
import { Button } from "@mui/material";
import withMaterialTable from "../../components/constants/withMaterialTable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ROLES = { ADMIN: "admin", ENGINEER: "engineer" };

// -------------------- Admin Table --------------------
const AdminTable = withMaterialTable(null, {
  title: "Admins",
  columns: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "city", header: "City" },
    {
      accessorKey: "password",
      header: "Password",
      muiTableBodyCellProps: { style: { display: "none" } },
      muiTableHeadCellProps: { style: { display: "none" } },
      enableEditing: true,
    },
  ],
  getData: async () => {
    const res = await new ApiService().apiget(
      `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/admin`
    );
    return res?.data.map((u) => ({ ...u, id: u._id, _id: u._id })) || [];
  },
  addData: async ({ name, email, mobile, city, password }) => {
    const res = await new ApiService().apipost(ServerUrl.API_REGISTER, {
      name,
      email,
      mobile,
      city,
      password,
      role: "admin",
    });
    toast.success("Admin added successfully");

    return { ...res.data, id: res.data._id, _id: res.data._id }; // 👈 return one row
  },

  updateData: async ({ _id, name, email, mobile, city, password }) => {
    const res = await new ApiService().apipatch(
      `${ServerUrl.API_UPDATE_USER}/${_id}`,
      {
        name,
        email,
        mobile,
        city,
        password,
      }
    );
    toast.success("Admin edited successfully");

    return { ...res.data, id: res.data._id, _id: res.data._id }; // 👈 return one row
  },
  deleteData: async (_id) => {
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${_id}`);
    toast.success("Admin deleted successfully");

    return await AdminTable.options.getData();
  },
});

// -------------------- Engineer Table --------------------
const tableData = {
  title: "Engineers",
  columns: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "city", header: "Location" },
    {
      accessorKey: "password",
      header: "Password",
      muiTableBodyCellProps: { style: { display: "none" } },
      muiTableHeadCellProps: { style: { display: "none" } },
      enableEditing: true,
    },
  ],
  getData: async () => {
    const res = await new ApiService().apiget(
      `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
    );

    return res?.data.map((u) => ({ ...u, id: u._id, _id: u._id })) || [];
  },
  addData: async ({ name, email, mobile, city, password }) => {
    await new ApiService().apipost(ServerUrl.API_REGISTER, {
      name,
      email,
      mobile,
      city,
      password,
      role: "engineer",
    });
    toast.success("Engineer added successfully");

    return await EngineerTable.options.getData();
  },
  updateData: async ({ _id, name, email, mobile, city, password }) => {
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${_id}`, {
      name,
      email,
      mobile,
      city,
      password,
    });
    toast.success("Engineer edited successfully");

    return await EngineerTable.options.getData();
  },
  deleteData: async (_id) => {
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${_id}`);
    toast.success("Engineer deleted successfully");

    return await EngineerTable.options.getData();
  },
};
const EngineerTable = withMaterialTable(null, tableData);

// -------------------- Manage Page --------------------
export default function Manage() {
  const [activeTab, setActiveTab] = useState(ROLES.ADMIN);

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === ROLES.ADMIN ? "contained" : "outlined"}
          onClick={() => setActiveTab(ROLES.ADMIN)}
        >
          Manage Admins
        </Button>
        <Button
          variant={activeTab === ROLES.ENGINEER ? "contained" : "outlined"}
          onClick={() => setActiveTab(ROLES.ENGINEER)}
        >
          Manage Engineers
        </Button>
      </div>

      {activeTab === ROLES.ADMIN ? <AdminTable /> : <EngineerTable />}

      <ToastContainer />
    </div>
  );
}
