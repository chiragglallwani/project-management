"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function AISummaryContent({
  summaryText,
}: {
  summaryText: string;
}) {
  if (!summaryText) return null;

  function renameStatus(status: string): string {
    switch (status.toLowerCase()) {
      case "done":
        return "Done";
      case "in-progress":
        return "In Progress";
      case "blocked":
        return "Blocked";
      case "to-do":
        return "To Do";
      default:
        return status;
    }
  }

  summaryText = summaryText.replace(/([A-Za-z-]+)/g, (match) =>
    renameStatus(match)
  );

  return (
    <div className="space-y-4 text-gray-800 custom-scrollbar">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{summaryText}</ReactMarkdown>
    </div>
  );
}
