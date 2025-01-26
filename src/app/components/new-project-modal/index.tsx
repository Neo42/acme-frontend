"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { formatISO } from "date-fns";
import z from "zod";

import { Modal } from "@/app/components/modal";
import { cn } from "@/lib/utils";
import { useCreateProjectMutation } from "@/state/api";

const NewProjectModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    teamId: "",
  });
  const { name, description, startDate, endDate } = formData;
  const [error, setError] = useState<z.ZodError | null>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
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
      const formattedEndDate = formatISO(new Date(endDate), {
        representation: "complete",
      });

      await createProject({
        ...formData,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error);
      }
    }
  };

  const formFieldClassNames =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-secondary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        teamId: "",
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
          }}
          className={formFieldClassNames}
        />
        <textarea
          name="description"
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
          }}
          className={formFieldClassNames}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            ref={startDateRef}
            value={startDate}
            max={endDateRef.current?.value || undefined}
            onChange={(e) => {
              setFormData({ ...formData, startDate: e.target.value });
            }}
            className={formFieldClassNames}
          />
          <input
            type="date"
            ref={endDateRef}
            value={endDate}
            min={startDateRef.current?.value || undefined}
            onChange={(e) => {
              setFormData({ ...formData, endDate: e.target.value });
            }}
            className={formFieldClassNames}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !!error}
          className={cn(
            "mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
            (isLoading || !!error) && "cursor-not-allowed opacity-50",
          )}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export { NewProjectModal };
