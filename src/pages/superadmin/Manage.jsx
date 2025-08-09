import React, { useState } from "react";
import { Button } from "@mui/material";
import withMaterialTable from "../../components/constants/withMaterialTable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

const ROLES = { ADMIN: "admin", ENGINEER: "engineer" };

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
      muiTableBodyCellProps: { style: { display: "none" } }, // hides from table view
      muiTableHeadCellProps: { style: { display: "none" } }, // hides header
      enableEditing: true,
      enableColumnOrdering: false, // optional
    }, // { accessorKey: "designation", header: "Designation" },
  ],
  getData: async () => {
    const res = await new ApiService().apiget(
      `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/admin`
    );
    return res?.data.map((u) => ({ ...u, id: u._id })) || [];
  },
  addData: async (data) => {
    const res = await new ApiService().apipost(ServerUrl.API_REGISTER, {
      ...data,
      role: "admin",
    });
    return { ...res.data, id: res.data._id };
  },
  updateData: async (data) => {
    return await new ApiService().apipatch(
      `${ServerUrl.API_UPDATE_USER}/${data.id}`,
      data
    );
  },
  deleteData: async (id) => {
    return await new ApiService().apidelete(
      `${ServerUrl.API_DELETE_USER}/${id}`
    );
  },
});

const EngineerTable = withMaterialTable(null, {
  title: "Engineers",
  columns: [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "mobile", header: "Mobile" },
    { accessorKey: "city", header: "City" },
    {
      accessorKey: "password",
      header: "Password",
      muiTableBodyCellProps: { style: { display: "none" } }, // hides from table view
      muiTableHeadCellProps: { style: { display: "none" } }, // hides header
      enableEditing: true,
      enableColumnOrdering: false, // optional
    },
    { accessorKey: "designation", header: "Designation" },
  ],
  getData: async () => {
    const res = await new ApiService().apiget(
      `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
    );
    return res?.data.map((u) => ({ ...u, id: u._id })) || [];
  },
  addData: async (data) => {
    const response = await new ApiService().apipost(ServerUrl.API_REGISTER, {
      ...data,
      role: "engineer",
    });
    return { ...response.data, id: response.data._id };
  },
  updateData: async (updatedUser) => {
    const response = await new ApiService().apipatch(
      `${ServerUrl.API_UPDATE_USER}/${updatedUser.id}`,
      updatedUser
    );
  },
  deleteData: async (id) => {
    return await new ApiService().apidelete(
      `${ServerUrl.API_DELETE_USER}/${id}`
    );
  },
});

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
    </div>
  );
}
