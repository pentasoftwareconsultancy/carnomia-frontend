import React, { useState } from "react";
import { Button } from "@mui/material";
import withMaterialTable from "../../components/constants/withMaterialTable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";

const ROLES = { ADMIN: "admin", ENGINEER: "engineer" };

// Admin Table
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
    return res?.data.map((u) => ({ ...u, id: u._id })) || [];
  },
  addData: async (data) =>
    await new ApiService().apipost(ServerUrl.API_REGISTER, { ...data, role: "admin" }),
  updateData: async (data) =>
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${data.id}`, data),
  deleteData: async (id) =>
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${id}`),
});

// Engineer Table with toggle
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
          const updated = {
            ...row.original,
            engineer_status: !row.original.engineer_status,
          };
          try {
            await new ApiService().apiput(
              `${ServerUrl.API_UPDATE_USER}/${updated.engineer_id}`,
              { engineer_status: updated.engineer_status }
            );
            table.options.updateData?.(updated);
          } catch (err) {
            console.error("Failed to update engineer status", err);
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
      res?.data.map((u) => ({
        ...u,
        id: u.engineer_id,
        engineer_status: u.engineer_status ?? true,
      })) || []
    );
  },
  addData: async (data) =>
    await new ApiService().apipost(ServerUrl.API_REGISTER, { ...data, role: "engineer" }),
  updateData: async (data) =>
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${data.id}`, data),
  deleteData: async (id) =>
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${id}`),
});

// Manage Page
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
