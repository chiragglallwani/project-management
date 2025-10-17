"use client";
import { Project, Task } from "@/types/types";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import Modal from "./Modal";
import { Loader2, RefreshCcw } from "lucide-react";

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

  const generateSummary = useCallback(async () => {
    if (!currentProject || tasks.length === 0)
      return setSummary("No tasks available to summarize.");

    setIsLoading(true);
    setSummary("");

    try {
      // todo: call the api to get the summary
      // setSummary(summary from response of api call)
    } catch (error) {
      setSummary("Error generating summary. Check the console for API issues.");
    } finally {
      setIsLoading(false);
    }
  }, [currentProject, tasks]);

  useEffect(() => {
    if (isOpen) {
      generateSummary(); // Auto-generate when opened
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
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Analysis powered by Gemini
          </p>
          <button
            onClick={generateSummary}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-150 disabled:opacity-50 dark:bg-indigo-700 dark:text-indigo-100 dark:hover:bg-indigo-600 shadow-md shadow-indigo-500/10"
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
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600 shadow-inner min-h-[150px] transition duration-300">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {summary}
            </p>
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
