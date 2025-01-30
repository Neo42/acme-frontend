"use client";

import { useState } from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { format } from "date-fns";
import { useParams } from "next/navigation";

import { Header } from "@/app/components/header";
import { NewTaskModal } from "@/app/components/new-task-modal";
import { TaskCard } from "@/app/components/task-card";
import { useAppSelector } from "@/app/redux";
import { cn } from "@/lib/utils";
import {
  Priority,
  Status,
  useGetAuthUserQuery,
  useGetTasksByUserQuery,
} from "@/state/api";

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
          "inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white",
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
            className="rounded-full bg-blue-100 px-2 text-xs leading-5 text-gray-700"
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

const PriorityPage = () => {
  const { priority } = useParams();
  const [view, setView] = useState<"list" | "table">("list");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const { data: currentUser } = useGetAuthUserQuery({});
  const userId = currentUser?.userDetails?.userId ?? null;

  const {
    data: tasks,
    isLoading,
    isError: isTasksError,
  } = useGetTasksByUserQuery(userId || 0, {
    skip: !userId,
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const filteredTasks = tasks?.filter(
    (task) => task.priority?.toLowerCase() === priority,
  );

  if (isTasksError || !tasks) {
    return <div>Error fetching tasks</div>;
  }

  return (
    <div className="m-5 p-4">
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
      <Header name="Priority Page">
        <button
          className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setIsNewTaskModalOpen(true)}
        >
          Add Task
        </button>
      </Header>
      <div className="mb-4 flex justify-start">
        <button
          onClick={() => setView("list")}
          className={cn(
            "rounded-l px-4 py-2",
            view === "list" ? "bg-gray-300" : "bg-white",
          )}
        >
          List
        </button>
        <button
          onClick={() => setView("table")}
          className={cn(
            "rounded-r px-4 py-2",
            view === "table" ? "bg-gray-300" : "bg-white",
          )}
        >
          Table
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {view === "list" && (
            <div className="grid grid-cols-1 gap-4">
              {filteredTasks?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
          {view === "table" && (
            <div className="w-full">
              <DataGrid
                rows={filteredTasks || []}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
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
          )}
        </>
      )}
    </div>
  );
};

export default PriorityPage;
