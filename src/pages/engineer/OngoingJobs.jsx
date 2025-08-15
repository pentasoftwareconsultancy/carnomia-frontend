import React from "react";
import { useNavigate } from "react-router-dom";
import withMaterialTable from "../../components/constants/withMaterialTable";
import ApiService from "../../core/services/api.service";
import ServerUrl from "../../core/constants/serverUrl.constant";
import StorageService from "../../core/services/storage.service";
import { APPLICATION_CONSTANTS } from "../../core/constants/app.constant";
import { Button } from "@mui/material";

const OngoingJobs = () => {
  const navigate = useNavigate();

  const tableConfig = {
    title: "Ongoing Jobs – PDI in Progress",
    hideAddButton: true, // 🔹 custom flag to tell HOC to hide Add button
    disableDefaultActions: true, // 🔹 custom flag to hide built-in actions column

    columns: [
      { accessorKey: "bookingId", header: "Booking ID" },
      { accessorKey: "customerName", header: "Customer Name" },
      { accessorKey: "customerMobile", header: "Mobile" },
      { accessorKey: "brandModel", header: "Brand & Model" },
      { accessorKey: "status", header: "Status" },
      {
        id: "continue",
        header: "Action",
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() =>
              navigate("/engineer/dashboard/report/" + row.original._id, {
                state: { job: row.original },
              })
            }
          >
            Continue for Inspection
          </Button>
        ),
      },
    ],

    getData: async () => {
      const user = JSON.parse(
        StorageService.getData(APPLICATION_CONSTANTS.STORAGE.USER_DETAILS)
      );
      const res = await new ApiService().apiget(
        `${ServerUrl.API_GET_ALL_REQUESTS_BY_ENGINEER}/${user.userId}`
      );
      const ongoing =
        res.data?.data
          ?.filter(
            (job) =>
              job.status ===
              APPLICATION_CONSTANTS.REQUEST_STATUS.IN_PROGRESS.value
          )
          .map((job) => ({
            ...job,
            brandModel: `${job.brand} ${job.model}`,
          })) || [];
      return ongoing;
    },
  };

  const WrappedTable = withMaterialTable(null, tableConfig);
  return <WrappedTable />;
};

export default OngoingJobs;
