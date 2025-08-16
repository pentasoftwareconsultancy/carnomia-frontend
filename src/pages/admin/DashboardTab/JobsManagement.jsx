import React from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const JobsManagement = withMaterialTable(() => null, {
  title: "Jobs Management",
  hideAddButton: true, // Hides the Add button
  disableDefaultActions: false, // Keep View/Edit/Delete actions
  showAddButton: false,

  columns: [
    { accessorKey: "bookingId", header: "Booking ID" },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "engineer_name", header: "Engineer" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "engineer_assignedSlot", header: "Slot" },
   
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

  viewData: async (row) => row,
  addData: async (row) => row,
  updateData: async (row) => row,
  deleteData: async (id) => id,
});

export default JobsManagement;