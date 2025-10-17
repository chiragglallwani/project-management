"use client";
import { ProjectSchema } from "@/schema/schema";
import { ProjectFormInputs } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import { Loader2 } from "lucide-react";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormInputs) => Promise<void>;
  initialValues: ProjectFormInputs | undefined;
  actionButtonText: string;
  title: string;
};

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSave,
  initialValues = { name: "", description: "" },
  actionButtonText = "Create Project",
  title = "Create New Project",
}: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProjectFormInputs>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (data: ProjectFormInputs) => {
    await onSave(data);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    } else if (initialValues) {
      reset(initialValues);
    }
  }, [isOpen, initialValues, reset]);

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-md text-black font-medium"
          >
            Project Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-black border focus:border-indigo-500 focus:ring-indigo-500 text-gray-800 p-2 transition duration-200"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-md font-medium text-black"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register("description")}
            className="mt-1 block w-full rounded-md border-black border focus:border-indigo-500 focus:ring-indigo-500  p-2 transition duration-200"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>
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
            ) : (
              actionButtonText
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
