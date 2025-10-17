"use server";

import { handleApiError } from "@/config/api";
import { assistWithTaskService, summarizeProjectService } from "./service";

export async function summarizeProjectAction(projectId: string) {
  try {
    const response = await summarizeProjectService(projectId);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error summarizing project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function assistWithTaskAction(
  taskId: string,
  question: string,
  projectId?: string
) {
  try {
    const response = await assistWithTaskService(taskId, question, projectId);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error assisting with task:", error);
    throw new Error(handleApiError(error));
  }
}
