"use client";

import { PlusSquare } from "lucide-react";

import { Header } from "@/app/components/header";
import { TaskCard } from "@/app/components/task-card";
import { useGetTasksQuery } from "@/state/api";

type ListProps = {
  projectId: string;
  setIsNewTaskModalOpen: (isOpen: boolean) => void;
};

const List = ({ projectId, setIsNewTaskModalOpen }: ListProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({
    projectId: Number(projectId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header name="List">
          <button onClick={() => setIsNewTaskModalOpen(true)}>
            <PlusSquare />
          </button>
        </Header>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
};

export { List };
