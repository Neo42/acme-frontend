import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { format } from "date-fns";
import { EllipsisVertical, MessageCircle, Plus } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Priority,
  Status,
  Task,
  useGetTasksQuery,
  useUpdateTaskStatusMutation,
} from "@/state/api";

type KanbanProps = {
  projectId: string;
  setIsNewTaskModalOpen: (isOpen: boolean) => void;
};

const Kanban = ({ projectId, setIsNewTaskModalOpen }: KanbanProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(projectId) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const handleUpdateTaskStatus = (taskId: number, newStatus: Status) => {
    updateTaskStatus({ taskId, status: newStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.values(Status).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            setIsNewTaskModalOpen={setIsNewTaskModalOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: Status;
  tasks: Task[];
  onUpdateTaskStatus: (taskId: number, newStatus: Status) => void;
  setIsNewTaskModalOpen: (isOpen: boolean) => void;
};
const TaskColumn = ({
  status,
  tasks,
  onUpdateTaskStatus,
  setIsNewTaskModalOpen,
}: TaskColumnProps) => {
  const statusColors = {
    [Status.TO_DO]: "bg-[#2563EB]",
    [Status.WORK_IN_PROGRESS]: "bg-[#059669]",
    [Status.UNDER_REVIEW]: "bg-[#D97706]",
    [Status.COMPLETED]: "bg-[#000000]",
  };

  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: number }) => onUpdateTaskStatus(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  const taskCount = tasks.filter((task) => task.status === status).length;
  const statusColor = statusColors[status];

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={cn(
        "rounded-lg py-2 sm:px-2 xl:py-4",
        isOver && "bg-blue-100 dark:bg-neutral-950",
      )}
    >
      <div className="mb-3 flex w-full">
        <div className={cn("w-2 rounded-s-lg", statusColor)} />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span className="ml-2 inline-block size-[1.5rem] rounded-full bg-gray-200 p-1 text-center text-sm leading-none text-neutral-500 dark:bg-dark-tertiary">
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="flex size-6 items-center justify-center rounded dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>
            <button
              className="flex size-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [, drag] = useDrag({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const taskTagsList = task.tags?.split(",") || [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "dd/MM/yyyy")
    : null;

  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "dd/MM/yyyy")
    : null;

  const numberOfComments = task.comments?.length || 0;

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={cn(
        "mb-4 translate-x-0 translate-y-0 overflow-hidden rounded-xl bg-white p-4 shadow dark:bg-dark-secondary",
      )}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://acme-s3-images.s3.ap-southeast-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-md"
        />
      )}

      <div className="px-3 py-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <PriorityTag priority={task.priority} />
            <div className="flex gap-2">
              {taskTagsList.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex size-6 items-center justify-center rounded dark:text-white">
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="my-3 flex items-center justify-between">
          <h4 className="text-base font-bold dark:text-white">{task.title}</h4>
          {task.points && (
            <span className="text-xs font-semibold dark:text-white">
              {task.points} pts
            </span>
          )}
        </div>

        <div className="mb-2 text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate} - {formattedDueDate}
        </div>

        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>

        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        <div className="mt-3 flex items-center justify-between">
          <div className="group flex -space-x-2 overflow-visible">
            {task.assignee && (
              <Image
                src={`https://acme-s3-images.s3.ap-southeast-2.amazonaws.com/${task.assignee.profilePictureUrl}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="size-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                src={`https://acme-s3-images.s3.ap-southeast-2.amazonaws.com/${task.author.profilePictureUrl}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="size-8 rounded-full border-2 border-white object-cover transition-all duration-200 group-hover:translate-x-2 dark:border-dark-secondary"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageCircle size={16} />
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriorityTag = ({ priority }: { priority: Task["priority"] }) => {
  const priorityColors = {
    [Priority.BACKLOG]: "bg-gray-200 text-gray-700",
    [Priority.LOW]: "bg-blue-200 text-blue-700",
    [Priority.MEDIUM]: "bg-green-200 text-green-700",
    [Priority.HIGH]: "bg-yellow-200 text-yellow-700",
    [Priority.URGENT]: "bg-red-200 text-red-700",
  };

  const priorityColor = priorityColors[priority ?? Priority.BACKLOG];

  return (
    <div
      className={cn(
        "rounded-full px-2 py-1 text-xs font-semibold",
        priorityColor,
      )}
    >
      {priority}
    </div>
  );
};

export { Kanban };
