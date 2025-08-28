import React from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  NEW: { bg: "bg-yellow-200", text: "text-yellow-800", label: "New" },
  WAITING_FOR_APPROVAL: { bg: "bg-yellow-200", text: "text-yellow-800", label: "Waiting for Approval" },
  IN_PROGRESS: { bg: "bg-yellow-200", text: "text-yellow-800", label: "Waiting for Approval" },
  ASSIGNED_ENGINEER: { bg: "bg-blue-200", text: "text-blue-800", label: "Assigned" },
  ADMIN_APPROVED: { bg: "bg-blue-200", text: "text-blue-800", label: "Approved" },
  COMPLETED: { bg: "bg-green-200", text: "text-green-800", label: "Completed" },
  ADMIN_REJECTED: { bg: "bg-red-200", text: "text-red-800", label: "Rejected" },
};

const AllRequests = () => {
  return withMaterialTable(() => null, {
    title: "All Requests",
    hideAddButton: true,
    disableDefaultActions: false,

    columns: [
      { accessorKey: "bookingId", header: "Booking ID" },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "vehicle",
        header: "Vehicle",
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold">{row.original.brand || "-"}</span>
            <span className="text-gray-600 text-sm">{row.original.model || "-"}</span>
            <span className="text-gray-500 text-sm">{row.original.variant || "-"}</span>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        Cell: ({ cell }) => cell.getValue() || "-",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-bold ${
                statusColors[value]?.bg
              } ${statusColors[value]?.text}`}
            >
              {statusColors[value]?.label || value}
            </span>
          );
        },
      },
    ],

    getData: async () => {
      try {
        const response = await new ApiService().apiget(ServerUrl.API_GET_ALLPDIREQUEST);
        const data = response?.data?.data || [];
        // Map data fields if required
        return data.map((item) => ({
          ...item,
          id: item._id, // Required by some table libs for keys/updates
        }));
      } catch (err) {
        console.error("Error fetching requests:", err);
        toast.error("Failed to load requests");
        return [];
      }
    },

    updateData: async (row) => {
      try {
        const response = await new ApiService().apiput(
          `${ServerUrl.API_GET_INSPECTION_UPDATE}/${row.id}`,
          row
        );
        toast.success("Request updated successfully");
        return response?.data || row;
      } catch (err) {
        console.error("Error updating request:", err);
        toast.error("Failed to update request");
        throw err;
      }
    },

    deleteData: async (id) => {
      try {
        const response = await new ApiService().apidelete(
          `${ServerUrl.API_GET_INSPECTION_DELETE}/${id}`
        );
        toast.success("Request deleted successfully");
        return response?.data || id;
      } catch (err) {
        console.error("Error deleting request:", err);
        toast.error("Failed to delete request");
        throw err;
      }
    },
  })();
};

export default AllRequests;
