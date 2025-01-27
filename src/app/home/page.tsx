"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  PieChart,
  Cell,
} from "recharts";

import { Header } from "@/app/components/header";
import { useAppSelector } from "@/app/redux";
import { COLORS } from "@/lib/constants";
import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";

const Page = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useGetTasksQuery({
    projectId: 1,
  });
  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoadingTasks || isLoadingProjects) return <div>Loading...</div>;
  if (isTasksError || !tasks || !projects)
    return <div>Error Fetching Data</div>;

  const taskPriorityCounts = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      acc[task.priority as Priority] =
        (acc[task.priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskPrioritySummary = Object.keys(taskPriorityCounts).map(
    (priority) => ({
      priority,
      count: taskPriorityCounts[priority],
    }),
  );

  const projectStatusCounts = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatusSummary = Object.keys(projectStatusCounts).map(
    (status) => ({
      status,
      count: projectStatusCounts[status],
    }),
  );

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
  ];

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  console.log({ projectStatusSummary });
  return (
    <div className="size-full bg-gray-100 bg-transparent p-8">
      <Header name="Project Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Summary
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskPrioritySummary}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="priority" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} fillOpacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status Summary
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="count"
                nameKey="status"
                data={projectStatusSummary}
                fill={chartColors.pieFill}
                label
              >
                {projectStatusSummary.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.5}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div className="h-[400px] w-full">
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={isLoadingTasks}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
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
        </div>
      </div>
    </div>
  );
};

export default Page;
