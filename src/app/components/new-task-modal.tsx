"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { formatISO } from "date-fns";
import z from "zod";

import { Modal } from "@/app/components/modal";
import { cn } from "@/lib/utils";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";

const NewTaskModal = ({
  isOpen,
  onClose,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    tags: "",
    startDate: "",
    dueDate: "",
    authorUserId: "",
    assignedUserId: "",
  });
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    authorUserId,
    assignedUserId,
  } = formData;
  const [error, setError] = useState<z.ZodError | null>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, "Title is required"),
        authorUserId: z.string().min(1, "Author User ID is required"),
      }),
    [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (error) return;

      const formattedStartDate = formatISO(new Date(startDate), {
        representation: "complete",
      });
      const formattedDueDate = formatISO(new Date(dueDate), {
        representation: "complete",
      });

      await createTask({
        ...formData,
        status: status as Status,
        priority: priority as Priority,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: parseInt(authorUserId),
        assignedUserId: parseInt(assignedUserId),
        projectId: parseInt(projectId),
      });

      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        status: "",
        priority: "",
        tags: "",
        authorUserId: "",
        assignedUserId: "",
        startDate: "",
        dueDate: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      setError(null);
    }
  }, [formData, formSchema]);

  const inputClassNames =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-secondary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  const selectClassNames =
    "mb-4 block w-full rounded border border-gray-300 p-2 dark:border-dark-secondary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
          className={inputClassNames}
        />
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
          className={inputClassNames}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            value={status}
            onChange={(e) => {
              setFormData({ ...formData, status: e.target.value as Status });
            }}
            className={selectClassNames}
          >
            <option value="">Select Status</option>
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => {
              setFormData({
                ...formData,
                priority: e.target.value as Priority,
              });
            }}
            className={selectClassNames}
          >
            <option value="">Select Priority</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => {
            setFormData({ ...formData, tags: e.target.value });
          }}
          className={inputClassNames}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            ref={startDateRef}
            value={startDate}
            max={dueDateRef.current?.value || undefined}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value });
            }}
            className={inputClassNames}
          />
          <input
            type="date"
            ref={dueDateRef}
            value={dueDate}
            min={startDateRef.current?.value || undefined}
            onChange={(e) => {
              setFormData({ ...formData, dueDate: e.target.value });
            }}
            className={inputClassNames}
          />
        </div>
        <input
          type="text"
          placeholder="Author User ID"
          value={authorUserId}
          onChange={(e) => {
            setFormData({ ...formData, authorUserId: e.target.value });
          }}
          className={inputClassNames}
        />
        <input
          type="text"
          placeholder="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => {
            setFormData({ ...formData, assignedUserId: e.target.value });
          }}
          className={inputClassNames}
        />
        <button
          type="submit"
          disabled={isLoading || !!error}
          className={cn(
            "mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
            (isLoading || !!error) && "cursor-not-allowed opacity-50",
          )}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export { NewTaskModal };
