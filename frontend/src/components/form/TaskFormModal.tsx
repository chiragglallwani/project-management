"use client";
import { TaskSchema } from "@/schema/schema";
import {
  Task,
  TASK_STATUS_CONFIG,
  TaskFormInputs,
  TaskStatus,
} from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import { Loader2 } from "lucide-react";

type TaskFormModalProps = {
  task: Task | null;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskFormInputs) => Promise<void>;
};

export default function TaskFormModal({
  task,
  projectId,
  isOpen,
  onClose,
  onSave,
}: TaskFormModalProps) {
  const isEdit = !!task;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || TaskStatus.ToDo,
      blockReason: task?.blockReason || "",
      projectId: projectId,
    },
  });

  const currentStatus = watch("status");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        blockReason: task.blockReason || "",
        projectId: task.projectId,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: TaskStatus.ToDo,
        blockReason: "",
        projectId: projectId,
      });
    }
  }, [task, projectId, isOpen, reset]);

  async function onSubmit(data: TaskFormInputs): Promise<void> {
    await onSave(data);
    onClose();
  }

  return (
    <Modal
      title={isEdit ? "Edit Task" : "Create New Task"}
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("projectId")} />
        <div>
          <label
            htmlFor="task-title"
            className="block text-md font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="Enter task title"
            {...register("title")}
            className="mt-1 block w-full text-md rounded-md text-gray-800 focus:border-indigo-500 focus:ring-indigo-500 p-2 transition duration-200 border border-gray-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="task-description"
            className="block text-md font-medium text-gray-700 "
          >
            Description
          </label>
          <textarea
            id="task-description"
            placeholder="Describe your task"
            rows={3}
            {...register("description")}
            className="mt-1 block w-full text-gray-800 rounded-md border-gray-500 border focus:border-indigo-500 focus:ring-indigo-500 p-2 transition duration-200"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="block md:hidden">
          <label
            htmlFor="task-status"
            className="block text-md font-medium text-gray-700 "
          >
            Status
          </label>
          <select
            id="task-status"
            {...register("status")}
            className="mt-1 block w-full rounded-md border-gray-500 border text-gray-800 focus:border-indigo-500 focus:ring-indigo-500 p-2 capitalize transition duration-200"
          >
            {Object.entries(TASK_STATUS_CONFIG).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        {currentStatus === TaskStatus.Blocked && (
          <div className="bg-red-50  p-3 rounded-lg border border-red-700 transition duration-300">
            <label
              htmlFor="task-blockreason"
              className="block text-md font-medium text-red-700"
            >
              Block Reason (Required)
            </label>
            <input
              id="task-blockreason"
              type="text"
              {...register("blockReason")}
              placeholder="What is blocking this task?"
              className="mt-1 block w-full rounded-md border-red-300 border focus:border-red-500 focus:ring-red-500 p-2 transition duration-200 text-red-700"
            />
            {errors.blockReason && (
              <p className="mt-1 text-sm text-red-500">
                {errors.blockReason.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border rounded-lg hover:bg-gray-600 transition duration-150 hover:text-white hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-800 transition duration-150 disabled:opacity-50 hover:cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mx-4" />
            ) : isEdit ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
