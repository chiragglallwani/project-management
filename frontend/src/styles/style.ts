import { TaskStatus } from "@/types/types";

export const STATUS_COLORS: Record<
  TaskStatus,
  { bg: string; border: string; text: string; cardBg: string }
> = {
  [TaskStatus.ToDo]: {
    bg: "bg-blue-100/80",
    border: "border-blue-500",
    text: "text-blue-700/90",
    cardBg: "bg-blue-300/60",
  },
  [TaskStatus.InProgress]: {
    bg: "bg-yellow-100/80",
    border: "border-yellow-500",
    text: "text-yellow-700",
    cardBg: "bg-yellow-200/80",
  },
  [TaskStatus.Blocked]: {
    bg: "bg-red-100/80",
    border: "border-red-500",
    text: "text-red-700",
    cardBg: "bg-red-300/80",
  },
  [TaskStatus.Done]: {
    bg: "bg-green-100/80",
    border: "border-green-500",
    text: "text-green-700",
    cardBg: "bg-green-200/80",
  },
};
