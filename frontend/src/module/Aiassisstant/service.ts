import {
  apiClient,
  API_ENDPOINTS,
  handleApiError,
  isSuccessResponse,
  getErrorMessage,
  ApiResponse,
} from "@/config/api";

export async function summarizeProjectService(
  projectId: string,
): Promise<ApiResponse<string>> {
  try {
    const response: ApiResponse<string> = await apiClient.post(
      `${API_ENDPOINTS.AI_ASSISTANT}/summarize-project`,
      {
        projectId,
      },
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error summarizing project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function assistWithTaskService(
  taskId: string,
  question: string,
  projectId?: string,
): Promise<ApiResponse<string>> {
  try {
    const response: ApiResponse<string> = await apiClient.post(
      `${API_ENDPOINTS.AI_ASSISTANT}/ask`,
      {
        taskId,
        question,
        projectId,
      },
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error getting task assistance:", error);
    throw new Error(handleApiError(error));
  }
}
