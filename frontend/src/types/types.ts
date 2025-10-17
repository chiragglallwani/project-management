import { ProjectSchema, TaskSchema } from "@/schema/schema";
import { CheckCircle, ClipboardList, RefreshCcw, XCircle } from "lucide-react";
import z from "zod";

// Task Status Enum
export enum TaskStatus {
  ToDo = "to-do",
  InProgress = "in-progress",
  Blocked = "blocked",
  Done = "done",
}

// Task Status Display Map
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: "To Do",
  [TaskStatus.InProgress]: "In Progress",
  [TaskStatus.Blocked]: "Blocked",
  [TaskStatus.Done]: "Done",
};

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; Icon: React.ElementType }
> = {
  [TaskStatus.ToDo]: {
    label: TASK_STATUS_LABEL[TaskStatus.ToDo],
    Icon: ClipboardList,
  },
  [TaskStatus.InProgress]: {
    label: TASK_STATUS_LABEL[TaskStatus.InProgress],
    Icon: RefreshCcw,
  },
  [TaskStatus.Blocked]: {
    label: TASK_STATUS_LABEL[TaskStatus.Blocked],
    Icon: XCircle,
  },
  [TaskStatus.Done]: {
    label: TASK_STATUS_LABEL[TaskStatus.Done],
    Icon: CheckCircle,
  },
};

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  blockReason?: string;
  projectId: string;
  createdAt: string;
}

export type ProjectFormInputs = z.infer<typeof ProjectSchema>;

export type TaskFormInputs = z.infer<typeof TaskSchema>;

export interface UpdateTaskReqBody {
  title?: string;
  description?: string;
  status?: TaskStatus;
  blockReason?: string;
  projectId?: string;
}

export enum ToastType {
  Success = "success",
  Error = "error",
}

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastConfig {
  Icon: React.ElementType;
  bg: string;
  text: string;
  primaryColor: string;
  defaultDesc: string;
}

export const toastConfigs: Record<ToastType, ToastConfig> = {
  [ToastType.Success]: {
    Icon: CheckCircle,
    bg: "bg-green-600",
    text: "text-white",
    primaryColor: "text-green-300",
    defaultDesc: "Operation completed successfully.",
  },
  [ToastType.Error]: {
    Icon: XCircle,
    bg: "bg-red-600",
    text: "text-white",
    primaryColor: "text-red-300",
    defaultDesc: "An unexpected error occurred.",
  },
};
