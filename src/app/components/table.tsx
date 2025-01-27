import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { format } from "date-fns";

import { Header } from "@/app/components/header";
import { useAppSelector } from "@/app/redux";
import { cn } from "@/lib/utils";
import { Priority, Status, useGetTasksQuery } from "@/state/api";

const statusColors = {
  [Status.TO_DO]: "bg-[#2563EB]",
  [Status.WORK_IN_PROGRESS]: "bg-[#059669]",
  [Status.UNDER_REVIEW]: "bg-[#D97706]",
  [Status.COMPLETED]: "bg-[#000000]",
};

const priorityColors = {
  [Priority.BACKLOG]: "bg-gray-200 text-gray-700",
  [Priority.LOW]: "bg-blue-200 text-blue-700",
  [Priority.MEDIUM]: "bg-green-200 text-green-700",
  [Priority.HIGH]: "bg-yellow-200 text-yellow-700",
  [Priority.URGENT]: "bg-red-200 text-red-700",
};

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 100 },
  { field: "description", headerName: "Description", width: 300 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span
        className={cn(
          "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
          statusColors[params.value as Status],
        )}
      >
        {params.value || "Unknown"}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
    renderCell: (params) => (
      <div
        className={cn(
          "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
          priorityColors[(params.value as Priority) ?? Priority.BACKLOG],
        )}
      >
        {params.value || "Unknown"}
      </div>
    ),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 230,
    renderCell: (params) => (
      <div className="flex h-full items-center justify-start gap-2 overflow-x-auto">
        {params.value?.split(",").map((tag: string) => (
          <div
            key={tag}
            className="rounded-full bg-gray-200 px-2 text-xs font-semibold leading-5 text-gray-700"
          >
            {tag}
          </div>
        )) || []}
      </div>
    ),
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
    renderCell: (params) => (
      <div>
        {params.value
          ? format(new Date(params.value), "dd/MM/yyyy")
          : "Unknown"}
      </div>
    ),
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
    renderCell: (params) => (
      <div>
        {params.value
          ? format(new Date(params.value), "dd/MM/yyyy")
          : "Unknown"}
      </div>
    ),
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => <div>{params.value?.username || "Unknown"}</div>,
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => <div>{params.value?.username || "Unassigned"}</div>,
  },
];

const Table = ({
  projectId,
  setIsNewTaskModalOpen,
}: {
  projectId: string;
  setIsNewTaskModalOpen: (isOpen: boolean) => void;
}) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({
    projectId: Number(projectId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="h-fit w-full px-4 py-8 xl:px-6">
      <Header name="Table" textSize="text-lg">
        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
        >
          Add Task
        </button>
      </Header>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className="border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200"
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
  );
};

export { Table };
