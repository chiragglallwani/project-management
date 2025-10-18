"use server";

import { ApiResponse, handleApiError } from "@/config/api";
import { Task, TaskFormInputs } from "@/types/types";
import {
  createTaskService,
  deleteTaskService,
  getTasksService,
  updateTaskService,
} from "./service";
import { revalidatePath } from "next/cache";

export async function createTaskAction(formData: TaskFormInputs) {
  try {
    const response = await createTaskService(formData);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/projects");
    revalidatePath("/tasks");
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getTasksByProjectIdAction(
  projectId: string
): Promise<ApiResponse<Task[]>> {
  try {
    const response = await getTasksService(projectId);
    if (!response.success) {
      throw new Error(response.message || "Failed to fetch tasks");
    }
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(handleApiError(error));
  }
}

export async function updateTaskAction(id: string, formData: TaskFormInputs) {
  try {
    const response = await updateTaskService(id, formData);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/tasks");
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error(handleApiError(error));
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const response = await deleteTaskService(id);
    if (!response.success) {
      throw new Error(response.message);
    }
    revalidatePath("/tasks");
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(handleApiError(error));
  }
}
