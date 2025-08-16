import React from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const EngineerManagement = withMaterialTable(() => null, {
  title: "Engineers Management",
  hideAddButton: true,
  disableDefaultActions: true,
  showAddButton: false,

  columns: [
    {
      accessorKey: "name",
      header: "Name",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base text-center">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "city",
      header: "Location",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base text-center">{row.original.city}</span>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      Cell: ({ row }) => (
        <span className="text-sm md:text-base text-center">{row.original.mobile}</span>
      ),
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
      size: 100,
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
    try {
      const res = await new ApiService().apiget(
        `${ServerUrl.API_GET_ALL_USERS_BY_ROLES}/engineer`
      );
      const data = res?.data || [];
      return data.map((eng) => ({
        ...eng,
        engineer_status: eng.engineer_status ?? true,
        id: eng.engineer_id,
      }));
    } catch (err) {
      console.error("Failed to fetch engineers", err);
      return [];
    }
  },

  addData: async (row) => row,      // not used
  updateData: async (row) => row,   // handled by toggle
  deleteData: async (id) => id,     // not used
});

export default EngineerManagement;
