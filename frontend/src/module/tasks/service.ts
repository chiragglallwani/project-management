import { Task, TaskFormInputs } from "@/types/types";
import {
  apiClient,
  API_ENDPOINTS,
  handleApiError,
  ApiResponse,
  isSuccessResponse,
  getErrorMessage,
} from "@/config/api";

export async function createTaskService(
  formData: TaskFormInputs
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.post(
      API_ENDPOINTS.TASKS,
      formData
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getTasksService(
  projectId: string
): Promise<ApiResponse<Task[]>> {
  try {
    const response: ApiResponse<Task[]> = await apiClient.get(
      `${API_ENDPOINTS.TASKS}?projectId=${projectId}`
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(handleApiError(error));
  }
}

export async function updateTaskService(
  id: string,
  formData: Partial<TaskFormInputs>
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.put(
      `${API_ENDPOINTS.TASKS}/${id}`,
      formData
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error(handleApiError(error));
  }
}

export async function deleteTaskService(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.delete(
      `${API_ENDPOINTS.TASKS}/${id}`
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(handleApiError(error));
  }
}
