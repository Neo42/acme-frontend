"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { Kanban } from "@/app/components/kanban";
import { NewTaskModal } from "@/app/components/new-task-modal";
import { ProjectHeader } from "@/app/components/project-header";
import { Table } from "@/app/components/table";
import { Timeline } from "@/app/components/timeline";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("kanban");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  return (
    <div>
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projectId={projectId as string}
      />

      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "kanban" && typeof projectId === "string" && (
        <Kanban
          projectId={projectId}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )}

      {activeTab === "timeline" && typeof projectId === "string" && (
        <Timeline
          projectId={projectId}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )}

      {activeTab === "table" && typeof projectId === "string" && (
        <Table
          projectId={projectId}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )}
    </div>
  );
};

export default ProjectPage;
