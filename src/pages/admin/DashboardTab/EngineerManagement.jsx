import React from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const EngineerManagement = withMaterialTable(() => null, {
  title: "Engineers Management",

  columns: [
    {
      accessorKey: "name",
      header: "Name",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base">{row.original.mobile}</span>
      ),
    },
    {
      accessorKey: "city",
      header: "Location",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base">{row.original.city}</span>
      ),
    },
  ],

  getData: async () => {
    try {
      const res = await new ApiService().apiget(
        `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
      );
      const data = res?.data || [];
      return data.map((eng) => ({
        ...eng,
        id: eng._id || eng.engineer_id,
      }));
    } catch (err) {
      console.error("Failed to fetch engineers", err);
      return [];
    }
  },

  addData: async ({ name, email, mobile, city }) => {
    await new ApiService().apipost(ServerUrl.API_REGISTER, {
      name,
      email,
      mobile,
      city,
      role: "engineer",
    });
    return await EngineerManagement.options.getData();
  },

  updateData: async ({ id, name, email, mobile, city }) => {
    await new ApiService().apipatch(`${ServerUrl.API_UPDATE_USER}/${id}`, {
      name,
      email,
      mobile,
      city,
    });
    return await EngineerManagement.options.getData();
  },

  deleteData: async (id) => {
    await new ApiService().apidelete(`${ServerUrl.API_DELETE_USER}/${id}`);
    return await EngineerManagement.options.getData();
  },
});

export default EngineerManagement;
