import ProjectManager from "@/components/ProjectManager";
import { getProjectsAction } from "@/module/projects/actions";
export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await getProjectsAction();
  if (!projects) {
    return <div>No projects found</div>;
  }
  return <ProjectManager projects={projects} />;
}
