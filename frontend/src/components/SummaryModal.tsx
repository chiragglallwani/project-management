"use client";
import { Project, Task, ToastType } from "@/types/types";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import Modal from "./Modal";
import { Loader2, RefreshCcw } from "lucide-react";
import { summarizeProjectAction } from "@/module/Aiassisstant/actions";
import { useToast } from "@/hooks/useToast";
import AISummaryContent from "@/components/AISummaryContent";

type SummaryModalProps = {
  currentProject: Project | null;
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
};

export default function SummaryModal({
  currentProject,
  tasks,
  isOpen,
  onClose,
}: SummaryModalProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const generateSummary = useCallback(async () => {
    if (!currentProject || tasks.length === 0)
      return setSummary("No tasks available to summarize.");

    setIsLoading(true);
    setSummary("");

    try {
      const response = await summarizeProjectAction(currentProject.id);
      if (!response.success) {
        showToast(
          response.message || "Failed to generate summary",
          ToastType.Error,
        );
      }
      setSummary(response.data || "");
    } catch {
      showToast(
        "Error generating summary. Check the console for API issues.",
        ToastType.Error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, tasks]);

  useEffect(() => {
    if (isOpen) {
      //generateSummary(); // Auto-generate when opened
    }
  }, [isOpen, generateSummary]);

  return (
    <Modal
      title={`AI Project Summary: ${currentProject?.name}`}
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2 border-gray-200 dark:border-gray-700">
          <p className="text-md font-medium text-gray-500 ">
            Analysis powered by Gemini
          </p>
          <button
            onClick={generateSummary}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-lg transition duration-150 disabled:opacity-50 bg-indigo-700 text-white hover:bg-indigo-600 hover:cursor-pointer shadow-md shadow-indigo-500/10"
            disabled={isLoading || tasks.length === 0}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            <span>{isLoading ? "Regenerating..." : "Regenerate"}</span>
          </button>
        </div>

        {summary ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-400 shadow-inner min-h-[150px] transition duration-300">
            <AISummaryContent summaryText={summary} />
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400 transition duration-300">
            {tasks.length === 0 ? (
              "Add tasks to generate a summary."
            ) : isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Click 'Regenerate' to start."
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
