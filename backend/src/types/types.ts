export type TaskStatus = "to-do" | "in-progress" | "blocked" | "done";

export interface IProject {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

/**
 * Interface for the Task document.
 */
export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  blockReason?: string;
  projectId: string;
  createdAt: Date;
}
