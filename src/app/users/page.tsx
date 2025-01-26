"use client";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";

import Image from "next/image";

import { Header } from "@/app/components/header";
import { useAppSelector } from "@/app/redux";
import { useGetUsersQuery } from "@/state/api";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

const columns: GridColDef[] = [
  { field: "userId", headerName: "ID", width: 100 },
  { field: "username", headerName: "Username", width: 150 },
  {
    field: "profilePictureUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex size-full items-center justify-center">
        <div className="size-9">
          <Image
            src={`/${params.value}`}
            alt={params.row.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
];

const UsersPage = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !users) return <div>Error fetching users</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Users" />
      <div className="h-fit w-full">
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.userId}
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

export default UsersPage;
