import { Project, Task, TaskStatus } from "@/types/types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Frontend Kanban Build",
    description:
      "Build the responsive React/TS/Tailwind frontend for the new project management tool.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    name: "Backend API Development",
    description: "Implement Express controllers and Mongoose schemas.",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Setup RHF & Zod",
    description: "Integrate react-hook-form and Zod for forms.",
    status: TaskStatus.Done,
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Implement Drag and Drop",
    description: "Create native D&D for kanban columns.",
    status: TaskStatus.ToDo,
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Design Mobile Layout",
    description: "Ensure all components are responsive.",
    status: TaskStatus.InProgress,
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Finalize Project Endpoints",
    description: "Review and secure CRUD endpoints for projects.",
    status: TaskStatus.Blocked,
    blockReason: "Waiting for security review from team lead.",
    projectId: "proj-2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Write Task Controllers",
    description: "Finish createTask, getTasks, updateTask, and deleteTask.",
    status: TaskStatus.Done,
    projectId: "proj-2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-6",
    title: "Create AI Integration Route",
    description: "Implement /ai/summary and /ai/assist endpoints.",
    status: TaskStatus.ToDo,
    projectId: "proj-2",
    createdAt: new Date().toISOString(),
  },
];
