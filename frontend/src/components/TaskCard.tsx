import { STATUS_COLORS } from "@/styles/style";
import { Task, TaskStatus } from "@/types/types";
import { HelpCircle, PencilIcon, TrashIcon } from "lucide-react";

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onQnA: (task: Task) => void;
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onQnA,
}: TaskCardProps) {
  const { border, text, cardBg } = STATUS_COLORS[task.status];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Transfer the task ID and project ID
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("projectId", task.projectId);
    e.currentTarget.classList.add("opacity-40", "shadow-2xl");
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-40", "shadow-2xl");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${cardBg} rounded-xl shadow-md mb-4 border ${border} transition duration-300 hover:shadow-xl cursor-grab active:cursor-grabbing`}
      style={{ transitionDelay: "50ms" }} // Transition delay
    >
      <h4
        className={`${text} font-semibold text-lg mb-1 line-clamp-3 px-4 pt-4`}
      >
        {task.title}
      </h4>
      <p className={`${text} text-sm line-clamp-5 mb-3 px-4`}>
        {task.description}
      </p>

      {task.status === TaskStatus.Blocked && task.blockReason && (
        <div className="text-xs italic p-1.5 mb-2 border-none text-red-900 px-4 border">
          Blocker: {task.blockReason}
        </div>
      )}

      <div
        className={`flex justify-end text-xs font-medium border-t ${border} px-4 py-2`}
      >
        <div className="flex space-x-2">
          <button
            onClick={() => onQnA(task)}
            className="p-2 rounded-full text-indigo-800 hover:bg-indigo-400  transition duration-150 hover:cursor-pointer"
            title="AI Question & Answer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="hover:cursor-pointer p-2 rounded-full text-blue-900 hover:bg-blue-400 transition duration-150"
            title="Edit Task"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 rounded-full text-red-500 hover:bg-red-300 hover:cursor-pointer transition duration-150"
            title="Delete Task"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
