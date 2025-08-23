import React, { useState } from "react";
import { Button } from "@mui/material";
import withMaterialTable from "../../components/constants/withMaterialTable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

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
    return res?.data.map(u => ({ ...u, id: u._id, _id: u._id })) || [];
  },
  addData: async ({ name, email, mobile, city, password }) => {
    const result = await new ApiService().apipost(ServerUrl.API_REGISTER, {
      name,
      email,
      mobile,
      city,
      password,
      role: "admin",
    });
    // Always return latest data
    return await AdminTable.options.getData();
  },
  updateData: async ({ _id, name, email, mobile, city, password }) => {
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${_id}`, {
      name,
      email,
      mobile,
      city,
      password,
    });
    // Always return latest data
    return await AdminTable.options.getData();
  },
  deleteData: async (_id) => {
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${_id}`);
    // Always return latest data
    return await AdminTable.options.getData();
  },
});

// -------------------- Engineer Table --------------------
const EngineerTable = withMaterialTable(null, {
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
    {
      accessorKey: "engineer_status",
      header: "Status",
      Cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
            row.original.engineer_status ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.original.engineer_status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "toggle",
      header: "Toggle",
      enableSorting: false,
      enableColumnOrdering: false,
      Cell: ({ row, table }) => {
        const [loading, setLoading] = React.useState(false);

        const handleToggle = async () => {
          setLoading(true);
          const { id, name, email, mobile, city, password, engineer_status } = row.original;

          try {
            // Toggle status
            await table.options.updateData?.({
              id,
              name,
              email,
              mobile,
              city,
              password,
              engineer_status: !engineer_status,
            });

            // Refresh table data
            const updatedData = await table.options.getData?.();
            table.setData(updatedData);
          } catch (err) {
            console.error("Failed to toggle engineer status", err);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div className="flex items-center justify-center">
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                row.original.engineer_status ? "bg-green-500" : "bg-red-500"
              } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  row.original.engineer_status ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {row.original.engineer_status ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    },
  ],
  getData: async () => {
    const res = await new ApiService().apiget(
      `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
    );
    return (
      res?.data.map(u => ({
        ...u,
        id: u._id,
        _id: u._id,
        engineer_status: u.engineer_status ?? true,
      })) || []
    );
  },
  addData: async ({ name, email, mobile, city, password }) => {
    const result = await new ApiService().apipost(ServerUrl.API_REGISTER, {
      name,
      email,
      mobile,
      city,
      password,
      role: "engineer",
    });
    // Always return latest data
    return await EngineerTable.options.getData();
  },
  updateData: async ({ _id, name, email, mobile, city, password, engineer_status }) => {
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${_id}`, {
      name,
      email,
      mobile,
      city,
      password,
      engineer_status,
    });
    // Always return latest data
    return await EngineerTable.options.getData();
  },
  deleteData: async (_id) => {
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${_id}`);
    // Always return latest data
    return await EngineerTable.options.getData();
  },
});

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
    </div>
  );
}
