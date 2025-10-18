"use server";

import { ProjectFormInputs } from "@/types/types";
import {
  createProjectService,
  deleteProjectService,
  getProjectService,
  getProjectsService,
  updateProjectService,
} from "@/module/projects/service";
import { handleApiError } from "@/config/api";
import { revalidatePath } from "next/cache";

export async function createProjectAction(formData: ProjectFormInputs) {
  try {
    const response = await createProjectService(formData);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/projects");
    return response.message;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getProjectsAction() {
  try {
    const response = await getProjectsService();
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getProjectAction(id: string) {
  try {
    const response = await getProjectService(id);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function updateProjectAction(
  id: string,
  formData: ProjectFormInputs
) {
  try {
    const response = await updateProjectService(id, formData);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/projects");
    return response.message;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const response = await deleteProjectService(id);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/projects");
    return response.message;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error(handleApiError(error));
  }
}
