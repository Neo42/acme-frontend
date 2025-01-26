"use client";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

import { Header } from "@/app/components/header";
import { useAppSelector } from "@/app/redux";
import { useGetTeamsQuery } from "@/state/api";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 200,
  },
];

const TeamsPage = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams) return <div>Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div className="h-fit w-full">
        <DataGrid
          rows={teams || []}
          columns={columns}
          getRowId={(row) => row.id}
          className="border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200"
          pagination
          slots={{ toolbar: CustomToolbar }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              color: isDarkMode ? "#e5e7eb" : "",
              "& [role='row'] > *": {
                backgroundColor: isDarkMode ? "#1d1f21" : "white",
                borderColor: isDarkMode ? "#2d3135" : "",
              },
            },
            "& .MuiIconButton-root": {
              color: isDarkMode ? "#a3a3a3" : "",
            },
            "& .MuiTablePagination-root": {
              color: isDarkMode ? "#a3a3a3" : "",
            },
            "& .MuiTablePagination-selectIcon": {
              color: isDarkMode ? "#a3a3a3" : "",
            },
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .MuiDataGrid-row": {
              borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
            },
            "& .MuiDataGrid-withBorderColor": {
              borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TeamsPage;
