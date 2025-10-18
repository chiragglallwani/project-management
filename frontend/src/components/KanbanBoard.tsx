"use client";
import {
  Project,
  Task,
  TaskFormInputs,
  TaskStatus,
  ToastType,
} from "@/types/types";
import { ChevronLeft, PlusIcon, SparklesIcon } from "lucide-react";
import { useMemo, useState } from "react";
import KanbanStatusLane from "@/components/KanbanStatusLane";
import TaskFormModal from "@/components/form/TaskFormModal";
import SummaryModal from "@/components/SummaryModal";
import QnAModal from "@/components/QnAModal";
import Link from "next/link";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/module/tasks/actions";
import { useToast } from "@/hooks/useToast";
import DeleteModal from "./DeleteModal";

type KanbanBoardProps = {
  currentProject: Project;
  tasks: Task[];
};

export default function KanbanBoard({
  currentProject,
  tasks,
}: KanbanBoardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isQnAModalOpen, setIsQnAModalOpen] = useState(false);
  const [qnaTask, setQnATask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<{
    type: "delete" | "unblock";
    newStatus: TaskStatus;
    taskId: string;
  }>({ type: "delete", newStatus: TaskStatus.InProgress, taskId: "" });
  const { showToast } = useToast();

  const groupedTasks = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
      },
      {} as Record<TaskStatus, Task[]>
    );
  }, [tasks]);

  const handleOpenCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (data: TaskFormInputs) => {
    try {
      if (editingTask) {
        const response = await updateTaskAction(editingTask.id, data);
        if (response.success) {
          showToast(response.message ?? "", ToastType.Success);
          setIsTaskModalOpen(false);
        } else {
          showToast(
            response.message || "Failed to update task",
            ToastType.Error
          );
        }
      } else {
        const response = await createTaskAction(data);
        if (response.success) {
          showToast(response.message ?? "", ToastType.Success);
          setIsTaskModalOpen(false);
        } else {
          showToast(
            response.message || "Failed to create task",
            ToastType.Error
          );
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  function handleDeleteModal(taskId: string) {
    setModalOpen(true);
    setModalType({
      type: "delete",
      newStatus: editingTask?.status || TaskStatus.InProgress,
      taskId: taskId,
    });
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await deleteTaskAction(taskId);
      if (response.success) {
        showToast(response.message ?? "", ToastType.Success);
      } else {
        showToast(response.message || "Failed to delete task", ToastType.Error);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setModalOpen(false);
    setModalType({
      type: "delete",
      newStatus: TaskStatus.InProgress,
      taskId: "",
    });
  };

  // Drag and Drop Logic Handler
  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    // Blocked status requires blockReason input before final update
    if (newStatus === TaskStatus.Blocked && !taskToUpdate.blockReason) {
      // If a user drags to 'blocked' without a reason, open the edit modal
      setEditingTask({ ...taskToUpdate, status: newStatus });
      setIsTaskModalOpen(true);
      return;
    }

    if (
      taskToUpdate.status === TaskStatus.Blocked &&
      newStatus !== TaskStatus.Blocked &&
      modalType.taskId === ""
    ) {
      setModalOpen(true);
      setModalType({
        type: "unblock",
        newStatus: newStatus,
        taskId: taskId,
      });
      return;
    }

    try {
      const data = {
        ...taskToUpdate,
        status: newStatus,
        blockReason:
          (taskToUpdate.blockReason ?? "")?.length > 0 &&
          newStatus !== TaskStatus.Blocked
            ? ""
            : taskToUpdate.blockReason,
      };
      const response = await updateTaskAction(taskId, data);
      if (!response.success) {
        showToast(
          response.message || "Failed to update task status",
          ToastType.Error
        );
      }
      setModalOpen(false);
      setModalType({
        type: "unblock",
        newStatus: newStatus,
        taskId: "",
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // AI Q&A Handler
  const handleQnA = (task: Task) => {
    setQnATask(task);
    setIsQnAModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-white p-4 md:p-6 transition duration-300">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-6 transition duration-300">
        <div className="mb-4 md:mb-0">
          <Link
            href="/"
            className="flex items-center space-x-1 text-indigo-500 hover:text-indigo-700 hover:underline hover:cursor-pointer underline-offset-2 underline text-md font-medium mb-1 transition duration-150 group"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 transition duration-300">
            {currentProject.name.slice(0, 1).toUpperCase() +
              currentProject.name.slice(1)}
          </h1>
          <p className="text-lg text-gray-700 line-clamp-2 transition duration-300">
            {currentProject.description || "No description provided."}
          </p>
        </div>

        <div className="flex space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsSummaryModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-lg shadow-green-500/50 disabled:opacity-50"
            disabled={tasks.length === 0}
            style={{ transitionDelay: "100ms" }}
          >
            <SparklesIcon className="w-5 h-5" />
            <span>AI Summary</span>
          </button>
          <button
            onClick={handleOpenCreateTask}
            className="flex-1 justify-center flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 hover:cursor-pointer"
            style={{ transitionDelay: "200ms" }}
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </header>

      {/* Kanban Board Area (Responsive Horizontal Scroll) */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="block md:flex md:space-x-6 h-full md:min-h-full pb-6 md:overflow-x-auto md:overflow-y-hidden">
          {Object.values(TaskStatus).map((status) => (
            <KanbanStatusLane
              key={status}
              status={status}
              tasks={groupedTasks[status] || []}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteModal}
              onStatusChange={handleStatusChange}
              onQnATask={handleQnA}
            />
          ))}
        </div>
      </main>

      {/* <main className="block md:hidden flex-1 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {Object.values(TaskStatus).map((status) => (
            <KanbanRows
              key={status}
              status={status}
              tasks={groupedTasks[status] || []}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteModal}
              onStatusChange={handleStatusChange}
              onQnATask={handleQnA}
            />
          ))}
        </div>
      </main> */}

      {/* Modals */}
      <TaskFormModal
        task={editingTask}
        projectId={currentProject.id}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
      />
      <SummaryModal
        currentProject={currentProject}
        tasks={tasks}
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
      />
      <QnAModal
        task={qnaTask}
        isOpen={isQnAModalOpen}
        onClose={() => setIsQnAModalOpen(false)}
      />
      <DeleteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onDelete={() =>
          modalType.type === "delete"
            ? handleDeleteTask(modalType.taskId)
            : handleStatusChange(modalType.taskId, modalType.newStatus)
        }
        actionText={modalType.type === "delete" ? "Delete" : "Unblock"}
        title={modalType.type === "delete" ? "Delete Task" : "Unblock Task"}
        description={
          modalType.type === "delete"
            ? "Are you sure you want to delete this task? This action cannot be undone."
            : "Unblocking this task will clear the block reason. Are you sure you are unblocked now?"
        }
      />
    </div>
  );
}
