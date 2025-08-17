import React, { useEffect, useState } from "react";
import withMaterialTable from "../../../components/constants/withMaterialTable";
import ApiService from "../../../core/services/api.service";
import ServerUrl from "../../../core/constants/serverUrl.constant";

const JobsManagement = () => {
  const [engineers, setEngineers] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await new ApiService().apiget(
          ServerUrl.API_GET_ALL_USERS_BY_ROLES + "/engineer"
        );
        
        const engineerList = response?.data?.data || [];
        setEngineers(
          engineerList.map((e) => ({
            label: e.name,
            value: e._id, // send _id to backend
          }))
        );
      } catch (err) {
        console.error("Error fetching engineers:", err);
      }
    };

    setSlots([
      { label: "Morning (9AM - 12PM)", value: "Morning" },
      { label: "Afternoon (12PM - 3PM)", value: "Afternoon" },
      { label: "Evening (3PM - 6PM)", value: "Evening" },
    ]);

    fetchEngineers();
  }, []);

  return withMaterialTable(() => null, {
    title: "Jobs Management",
    hideAddButton: true,
    disableDefaultActions: false,

    columns: [
      { accessorKey: "bookingId", header: "Booking ID" },
      { accessorKey: "customerName", header: "Customer" },
      {
        accessorKey: "engineer_name",
        header: "Engineer",
        editVariant: "select",
        editSelectOptions: engineers,
      },
      { accessorKey: "date", header: "Date" },
      {
        accessorKey: "engineer_assignedSlot",
        header: "Slot",
        editVariant: "select",
        editSelectOptions: slots,
      },
    ],

    getData: async () => {
      try {
        const response = await new ApiService().apiget(
          ServerUrl.API_GET_ALLPDIREQUEST
        );
        return (response?.data?.data || []).map((item) => ({
          ...item,
          id: item._id,
        }));
      } catch (err) {
        console.error("Error fetching jobs:", err);
        return [];
      }
    },

    updateData: async (row) => {
      try {
        const engineer = engineers.find(e => e.value === row.engineer_name);
        const payload = {
          id: row.id,
          engineer_name: engineer?.label || row.engineer_name,
          engineer_assignedSlot: row.engineer_assignedSlot,
        };

        const response = await new ApiService().apiput(
          ServerUrl.API_GET_INSPECTION_UPDATE,
          payload
        );
        return response?.data || row;
      } catch (err) {
        console.error("Error updating job:", err);
        throw err;
      }
    },

    deleteData: async (id) => {
      try {
        const response = await new ApiService().apidelete(
          `${ServerUrl.API_GET_INSPECTION_DELETE}/${id}`
        );
        return response?.data || id;
      } catch (err) {
        console.error("Error deleting job:", err);
        throw err;
      }
    },
  })();
};

export default JobsManagement;
