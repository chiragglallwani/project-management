import ProjectView from "@/components/ProjectView";
import { getProjectAction } from "@/module/projects/actions";
import { getTasksByProjectIdAction } from "@/module/tasks/actions";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: { id: string };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  try {
    const [project, tasks] = await Promise.all([
      getProjectAction(id),
      getTasksByProjectIdAction(id),
    ]);

    if (!project || !tasks.success) {
      notFound();
    }

    return <ProjectView project={project} tasks={tasks.data || []} />;
  } catch (error) {
    console.error("Failed to fetch project or tasks:", error);
    notFound();
  }
}
