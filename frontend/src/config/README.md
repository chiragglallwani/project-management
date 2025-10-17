# API Configuration

This directory contains the API configuration for communicating with the backend server.

## Files

- `api.ts` - Main API client configuration and utilities
- `api-examples.ts` - Usage examples and patterns
- `README.md` - This documentation

## Setup

### 1. Environment Variables

Create a `.env.local` file in the frontend root directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Backend Configuration (for reference)
# PORT=3001
# MONGO_URI=mongodb://localhost:27017/project-management
```

**Note:** The `NEXT_PUBLIC_` prefix is required for Next.js to expose the environment variable to the browser.

### 2. Backend Server

Make sure your backend server is running on the configured port (default: 3001).

## Usage

### Basic Usage

```typescript
import { apiClient, API_ENDPOINTS } from "@/config/api";

// GET request
const response = await apiClient.get(API_ENDPOINTS.PROJECTS);

// POST request
const newProject = await apiClient.post(API_ENDPOINTS.PROJECTS, {
  name: "New Project",
  description: "Project description",
});
```

### Using Individual Methods

```typescript
import { get, post, put, del } from "@/config/api";

const projects = await get("/projects");
const newProject = await post("/projects", projectData);
const updatedProject = await put("/projects/123", updateData);
const deletedProject = await del("/projects/123");
```

### Error Handling

```typescript
import { handleApiError, isApiError, ApiError } from "@/config/api";

try {
  const response = await apiClient.get("/projects");
  // Handle success
} catch (error) {
  if (isApiError(error)) {
    console.error("API Error:", error.message, "Status:", error.status);
  } else {
    console.error("Unexpected error:", handleApiError(error));
  }
}
```

### TypeScript Support

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
}

const response = await apiClient.get<Project[]>("/projects");
// response.data is now typed as Project[]
```

## API Client Features

### HTTP Methods

- `get<T>(endpoint, options?)` - GET request
- `post<T>(endpoint, data?, options?)` - POST request
- `put<T>(endpoint, data?, options?)` - PUT request
- `patch<T>(endpoint, data?, options?)` - PATCH request
- `delete<T>(endpoint, options?)` - DELETE request

### Error Handling

- Custom `ApiError` class with status codes and details
- Automatic error parsing from API responses
- Network error handling
- Helper functions for error handling in components

### Response Handling Helpers

- `getResponseData<T>(response)` - Extract data from any response format
- `isSuccessResponse(response)` - Check if response is successful
- `getErrorMessage(response)` - Get error message from response
- `extractData<T>(response)` - Extract data from different response fields

### Type Safety

- Generic type support for request/response data
- TypeScript interfaces for API responses
- Type guards for error checking

## API Endpoints

The following endpoints are predefined in `API_ENDPOINTS`:

- `PROJECTS: '/projects'` - Project management
- `TASKS: '/tasks'` - Task management
- `AI_ASSISTANT: '/ai'` - AI assistant features

## Response Format

The API client handles different response formats from the backend controllers:

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  // Data can be at root level or nested
  data?: T;
  // Backend specific fields
  projects?: T; // For GET /projects
  project?: T; // For GET /projects/:id
  tasks?: T; // For GET /tasks
  response?: string; // For AI assistant responses
}
```

### Backend Response Patterns

- **Projects**: `{ projects: [...], success: true }`
- **Single Project**: `{ project: {...}, success: true }`
- **Tasks**: `{ tasks: [...], success: true }`
- **Success Messages**: `{ success: true, message: "..." }`
- **AI Assistant**: `{ success: true, response: "..." }` or direct text response

## Custom Headers and Options

```typescript
// With custom headers
const response = await apiClient.get("/projects", {
  headers: {
    Authorization: "Bearer your-token-here",
    "X-Custom-Header": "custom-value",
  },
});

// With query parameters
const queryParams = new URLSearchParams({ status: "active", limit: "10" });
const response = await apiClient.get(`/projects?${queryParams}`);
```

## Integration with Services

The API client is designed to work with service layer functions. See `src/module/projects/service.ts` for an example of how to integrate the API client with your business logic.

## Examples

For comprehensive usage examples, see `api-examples.ts` in this directory.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS enabled for your frontend domain
2. **Environment Variables**: Ensure `NEXT_PUBLIC_API_URL` is set correctly
3. **Network Errors**: Check if the backend server is running and accessible
4. **Type Errors**: Make sure to provide proper TypeScript types for your data

### Debug Mode

To enable debug logging, you can add console logs in the API client or use browser dev tools to inspect network requests.

## Best Practices

1. **Use TypeScript**: Always provide types for your API responses
2. **Handle Errors**: Always wrap API calls in try-catch blocks
3. **Use Service Layer**: Don't call the API client directly from components
4. **Consistent Error Handling**: Use the provided error handling utilities
5. **Environment Configuration**: Use environment variables for different deployment environments
