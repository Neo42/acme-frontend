"use client";

import { useState } from "react";

import {
  type LucideIcon,
  Clock,
  Filter,
  Grid3x3,
  PlusSquare,
  Search,
  Share2,
  SquareKanban,
} from "lucide-react";

import { Header } from "@/app/components/header";
import { NewProjectModal } from "@/app/components/new-project-modal";
import { cn } from "@/lib/utils";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />

      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header name="Project Design Development">
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
          >
            <PlusSquare className="mr-2 size-5" />
            New Project
          </button>
        </Header>
      </div>

      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 py-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="kanban"
            icon={SquareKanban}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="timeline"
            icon={Clock}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="table"
            icon={Grid3x3}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="size-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="size-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="dark:bg-background-dark rounded-md border py-1 pl-10 pr-4 text-sm focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            />
            <Search className="absolute left-3 top-2 size-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: LucideIcon;
  setActiveTab: (tab: string) => void;
  activeTab: string;
};

const TabButton = ({
  name,
  icon: Icon,
  setActiveTab,
  activeTab,
}: TabButtonProps) => {
  const isActive = activeTab === name;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={cn(
        "relative flex items-center gap-2 rounded-md px-1 py-2 capitalize text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4",
        isActive && "text-blue-600 after:bg-blue-600 dark:text-white",
      )}
    >
      <Icon className="size-5" />
      {name}
    </button>
  );
};

export { ProjectHeader };
