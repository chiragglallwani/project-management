"use client";
import { Task, ToastType } from "@/types/types";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Loader2, SparklesIcon } from "lucide-react";
import { assistWithTaskAction } from "@/module/Aiassisstant/actions";
import AISummaryContent from "@/components/AISummaryContent";
import { useToast } from "@/hooks/useToast";

type QnAModalProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function QnAModal({ task, isOpen, onClose }: QnAModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setAnswer("");
      setQuestion("");
    }
  }, [isOpen]);

  const handleAsk = async () => {
    if (!question.trim() || !task) return;

    setIsLoading(true);
    setAnswer("");

    try {
      const response = await assistWithTaskAction(
        task.id,
        question,
        task.projectId,
      );
      console.log(response);
      if (!response.success) {
        showToast(response.message || "Failed to get answer", ToastType.Error);
      }
      setAnswer(response.data || "");
    } catch {
      setAnswer(
        "Error fetching AI response. Check the console for API issues.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={`AI Task Assistant: ${task?.title}`}
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-2xl"
    >
      {task && (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100  rounded-lg border border-gray-200 ">
            <p className="text-sm font-semibold text-gray-700  mb-1">
              Task Context:
            </p>
            <p className="text-md italic text-gray-600  line-clamp-2">
              {task.description || "No description provided."}
            </p>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this task (e.g., 'What is the main blocker?' or 'What is the next step?')"
            rows={2}
            className="mt-1 text-gray-800 block w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-2 transition duration-200"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAsk}
              className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50 shadow-lg shadow-indigo-500/50"
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SparklesIcon className="w-4 h-4" />
              )}
              <span>Ask Gemini</span>
            </button>
          </div>

          {answer && (
            <div className="border-t pt-4 mt-4 border-gray-200">
              <h4 className="font-semibold text-md text-gray-800 mb-2">
                AI Answer:
              </h4>
              <AISummaryContent summaryText={answer} />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
