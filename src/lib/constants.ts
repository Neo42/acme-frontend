import { Priority, Status } from "@/state/api";

export const statusColors = {
  [Status.TO_DO]: "bg-[#2563EB]",
  [Status.WORK_IN_PROGRESS]: "bg-[#059669]",
  [Status.UNDER_REVIEW]: "bg-[#D97706]",
  [Status.COMPLETED]: "bg-[#000000]",
} as const;

export const priorityColors = {
  [Priority.BACKLOG]: "bg-gray-200 text-gray-700",
  [Priority.LOW]: "bg-blue-200 text-blue-700",
  [Priority.MEDIUM]: "bg-green-200 text-green-700",
  [Priority.HIGH]: "bg-yellow-200 text-yellow-700",
  [Priority.URGENT]: "bg-red-200 text-red-700",
} as const;
