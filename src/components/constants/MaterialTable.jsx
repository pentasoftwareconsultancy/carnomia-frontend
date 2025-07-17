// MaterialTable.jsx
import React from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";

const MaterialTable = ({
  title = "Table",
  columns,
  data = [],
  onAdd,
  addButtonLabel = "Add",
  enableAddButton = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ my: 3, overflowX: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
        {enableAddButton && (
          <Button variant="contained" onClick={onAdd}>
            {addButtonLabel}
          </Button>
        )}
      </Box>

      <Paper elevation={2}>
        <Box sx={{ minWidth: isMobile ? 600 : "100%" }}>
          <MaterialReactTable
  columns={columns}
  data={data}
  enableRowSelection={false}
  muiTableContainerProps={{ sx: { overflow: "unset" } }}
  muiTableBodyCellProps={{ sx: { whiteSpace: "nowrap", padding: "2px 4px" } }}
  muiTableHeadCellProps={{ sx: { whiteSpace: "nowrap", padding: "2px 4px" } }}
/>
        </Box>
      </Paper>
    </Box>
  );
};

export default MaterialTable;