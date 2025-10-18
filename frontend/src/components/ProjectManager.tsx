"use client";
import { Project, ProjectFormInputs, ToastType } from "@/types/types";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useCallback } from "react";
import ProjectFormModal from "@/components/form/ProjectFormModal";
import { useRouter } from "next/navigation";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/module/projects/actions";
import { useToast } from "@/hooks/useToast";
import DeleteModal from "./DeleteModal";
import SearchBar from "./SearchBar";

type ProjectManagerProps = {
  projects: Project[];
};

export default function ProjectManager({ projects }: ProjectManagerProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const handleCreateProject = async (data: ProjectFormInputs) => {
    try {
      const message = await createProjectAction(data);
      if (message) {
        showToast(message, ToastType.Success);
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      showToast("Failed to create project", ToastType.Error);
    }
  };

  async function handleUpdateProject(data: ProjectFormInputs) {
    try {
      if (!project) {
        showToast("No Project Id found to update", ToastType.Error);
        return;
      }
      const message = await updateProjectAction(project.id, data);
      setIsFormModalOpen(false);
      setProject(null);
      if (message) {
        showToast(message, ToastType.Success);
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      showToast("Failed to update project", ToastType.Error);
      setIsFormModalOpen(false);
      setProject(null);
    }
  }

  async function handleDeleteProject() {
    try {
      if (!project) {
        showToast("No Project Id found to delete", ToastType.Error);
        return;
      }
      const message = await deleteProjectAction(project.id);
      setIsDeleteModalOpen(false);
      setProject(null);
      if (message) {
        showToast(message, ToastType.Success);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast("Failed to delete project", ToastType.Error);
      setIsDeleteModalOpen(false);
      setProject(null);
    }
  }

  const handleUpdate = useCallback((e: React.MouseEvent, toOpen: Project) => {
    e.stopPropagation();
    // Ensure project state is set before opening modal
    setProject(toOpen);
    // Use setTimeout to ensure state update happens before modal opens
    setTimeout(() => {
      setIsFormModalOpen(true);
    }, 0);
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
    const project = projects.find((project) => project.id === id);
    if (project) {
      setProject(project);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 h-screen text-black transition duration-300">
      <header className="flex justify-between items-center mb-8 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-extrabold flex items-center space-x-3">
          <span>Project Dashboard</span>
        </h1>
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="flex items-center sm:space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 hover:cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </header>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex justify-between items-start bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition duration-300 cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:border-2"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex flex-col justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900 truncate pr-2">
                  {project.name.slice(0, 1).toUpperCase() +
                    project.name.slice(1)}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {project.description || "No description provided."}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                  Created On: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 ">
                <button
                  onClick={(e) => handleDelete(e, project.id)}
                  className="text-red-500  hover:text-red-400 p-1 rounded-full transition duration-150 hover:bg-red-50 hover:cursor-pointer"
                  title="Delete Project"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => handleUpdate(e, project)}
                  className="text-blue-500  hover:text-blue-400 p-1 rounded-full transition duration-150 hover:bg-blue-50 hover:cursor-pointer"
                  title="Edit Project"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3 text-center">
            <p className="text-lg text-gray-500 italic">
              No projects found. Click &quot;New Project&quot; to start
              organizing!
            </p>
          </div>
        )}
      </div>
      <ProjectFormModal
        title={project ? "Update Project" : "Create New Project"}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={project ? handleUpdateProject : handleCreateProject}
        initialValues={{
          name: project?.name || "",
          description: project?.description || "",
        }}
        actionButtonText={project ? "Update Project" : "Create Project"}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteProject}
        title="Delete Project"
        description="Are you sure you want to delete this project and all its tasks? This action cannot be undone."
      />
    </div>
  );
}
