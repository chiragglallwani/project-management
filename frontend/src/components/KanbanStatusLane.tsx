"use client";
import { STATUS_COLORS } from "@/styles/style";
import { Task, TASK_STATUS_CONFIG, TaskStatus } from "@/types/types";
import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import { ChevronLeft } from "lucide-react";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onQnATask: (task: Task) => void;
};

export default function KanbanStatusLane({
  status,
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onQnATask,
}: KanbanColumnProps) {
  const { border, text, bg } = STATUS_COLORS[status];
  const [isDropping, setIsDropping] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Prevent default behavior to allow dropping
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropping(true);
  };

  const handleDragLeave = () => {
    setIsDropping(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDropping(false);

    const taskId = e.dataTransfer.getData("taskId");

    if (taskId) {
      onStatusChange(taskId, status);
    }
  };

  const handleToggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-shrink-0 flex-1 rounded-xl p-4 ${bg} shadow-xl md:h-full flex flex-col transition duration-300 ${
        isDropping ? `ring-4 ${border} ring-opacity-50` : ""
      } 
      md:w-80 md:flex md:flex-col md:h-full w-full block mb-4`}
    >
      <div className="hidden md:flex md:flex-col h-full">
        <h3 className={`text-xl font-bold mb-4 capitalize pb-2 ${text}`}>
          <span className="flex items-center space-x-2">
            {(() => {
              const IconComponent = TASK_STATUS_CONFIG[status]?.Icon;
              return IconComponent ? (
                <IconComponent className="w-5 h-5" />
              ) : null;
            })()}
            <span>{TASK_STATUS_CONFIG[status]?.label || status}</span>
            <span className="text-sm font-normal text-gray-700  ml-1">
              ({tasks.length})
            </span>
          </span>
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onQnA={onQnATask}
            />
          ))}
        </div>
      </div>

      <div className="block md:hidden">
        {/* Mobile Accordion Header/Button */}
        <button
          onClick={handleToggleMobile}
          // Styling for the button to look like a full header
          className={`w-full flex justify-between items-center rounded-lg transition duration-200 `}
        >
          <h3 className={`text-xl font-bold capitalize ${text}`}>
            <span className="flex items-center space-x-2">
              {(() => {
                const IconComponent = TASK_STATUS_CONFIG[status]?.Icon;
                return IconComponent ? (
                  <IconComponent className="w-5 h-5" />
                ) : null;
              })()}
              <span>{TASK_STATUS_CONFIG[status]?.label || status}</span>
              <span className="text-sm font-normal text-gray-700  ml-1">
                ({tasks.length})
              </span>
            </span>
          </h3>
          {/* Chevron icon for expand/collapse indicator */}
          <ChevronLeft
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
              isMobileOpen ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>

        {/* Mobile Accordion Content (Collapsible) */}
        <div
          // Use max-height and opacity for smooth collapse transition
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 pt-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onQnA={onQnATask}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
