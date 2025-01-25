"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import Kanban from "@/app/projects/kanban";
// import List from "@/app/projects/list";
import ProjectHeader from "@/app/projects/project-header";

const ProjectPage = () => {
  const { id: projectId } = useParams();
  const [activeTab, setActiveTab] = useState("Kanban");
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  return (
    <div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Kanban" && typeof projectId === "string" && (
        <Kanban
          projectId={projectId}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )}
      {/* {activeTab === "List" && typeof projectId === "string" && (
        <List
          projectId={projectId}
          setIsNewTaskModalOpen={setIsNewTaskModalOpen}
        />
      )} */}
    </div>
  );
};

export default ProjectPage;
