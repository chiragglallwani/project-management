import { TASK_STATUS_CONFIG, TaskStatus } from "@/types/types";
import { z } from "zod";
// 1. Project Schema
export const ProjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters.").max(100),
  description: z
    .string()
    .max(500)
    .min(10, "Description must be at least 10 characters."),
});

export const TaskSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters.").max(100),
    description: z
      .string()
      .max(500)
      .min(10, "Description must be at least 10 characters."),
    status: z.enum(
      Object.keys(TASK_STATUS_CONFIG) as [TaskStatus, ...TaskStatus[]]
    ),
    blockReason: z.string().optional(),
    projectId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.status === TaskStatus.Blocked &&
      (!data.blockReason || data.blockReason.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Block reason is required when status changing to 'blocked'.",
        path: ["blockReason"],
      });
    }
  });
