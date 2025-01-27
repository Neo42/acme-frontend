import { Project } from "@/state/api";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="mb-3 rounded border p-4 shadow">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
    </div>
  );
};

export { ProjectCard };
