"use client";
import { Project, Task } from "@/types/types";
import KanbanBoard from "@/components/KanbanBoard";

type ProjectViewProps = {
  project: Project;
  tasks: Task[];
};

export default function ProjectView({ project, tasks }: ProjectViewProps) {
  return (
    <div className="min-h-screen font-sans">
      <KanbanBoard currentProject={project as Project} tasks={tasks} />
    </div>
  );
}
