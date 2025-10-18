import { Project, ProjectFormInputs } from "@/types/types";
import {
  apiClient,
  API_ENDPOINTS,
  handleApiError,
  isSuccessResponse,
  getErrorMessage,
  ApiResponse,
} from "@/config/api";

export async function createProjectService(
  formData: ProjectFormInputs
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.post(
      API_ENDPOINTS.PROJECTS,
      formData
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getProjectsService(): Promise<ApiResponse<Project[]>> {
  try {
    const response: ApiResponse<Project[]> = await apiClient.get(
      API_ENDPOINTS.PROJECTS,
      {
        next: {
          revalidate: 0,
        },
      }
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getProjectService(
  id: string
): Promise<ApiResponse<Project>> {
  try {
    const response: ApiResponse<Project> = await apiClient.get(
      `${API_ENDPOINTS.PROJECTS}/${id}`
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function updateProjectService(
  id: string,
  formData: ProjectFormInputs
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.put(
      `${API_ENDPOINTS.PROJECTS}/${id}`,
      formData
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error(handleApiError(error));
  }
}

export async function deleteProjectService(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const response: ApiResponse<void> = await apiClient.delete(
      `${API_ENDPOINTS.PROJECTS}/${id}`
    );

    if (!isSuccessResponse(response)) {
      throw new Error(getErrorMessage(response));
    }

    return response;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error(handleApiError(error));
  }
}
