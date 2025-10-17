// Helper to match status text with its color class
const getStatusColorClass = (statusText: string): string => {
  switch (statusText.toUpperCase()) {
    case "DONE":
      return "text-green-500 dark:text-green-400";
    case "IN-PROGRESS":
      return "text-yellow-500 dark:text-yellow-400";
    case "TO-DO":
      return "text-blue-500 dark:text-blue-400";
    case "BLOCKED":
      return "text-red-500 dark:text-red-400";
    default:
      return "text-gray-900 dark:text-gray-100";
  }
};
export default function AISummaryContent({
  summaryText,
}: {
  summaryText: string;
}) {
  if (!summaryText) return null;

  // Split the entire summary by sections defined by double newline, or specific headers
  const parts = summaryText.split(/\n\s*\n/);

  return (
    <div className="space-y-4 text-gray-800 custom-scrollbar">
      {parts.map((part, index) => {
        const trimmedPart = part.trim();
        if (!trimmedPart) return null;

        if (trimmedPart.startsWith("###")) {
          return (
            <h2 key={index} className="text-2xl font-extrabold text-gray-900">
              {trimmedPart.replace(/\#\#\#|:/g, "").trim()}
            </h2>
          );
        }

        // 1. Check for **HEADERS**: **Task Status Overview:**, **Key Blockers:**, **Suggested Next Steps:**
        if (trimmedPart.startsWith("**") && trimmedPart.endsWith(":")) {
          return (
            <h4
              key={index}
              className="text-lg font-bold text-indigo-600  border-b border-gray-200 pb-1 mt-4"
            >
              {/* Remove leading/trailing ** and : */}
              {trimmedPart.replace(/\*\*|:/g, "").trim()}
            </h4>
          );
        }

        // 2. Check for LISTS (Status Overview or Next Steps)
        if (trimmedPart.startsWith("*") || trimmedPart.startsWith("1.")) {
          const lines = trimmedPart.split("\n").filter((line) => line.trim());

          const isNumberedList = trimmedPart.startsWith("1.");
          const ListTag = isNumberedList ? "ol" : "ul";
          const listStyle = isNumberedList ? "list-decimal" : "list-disc";

          return (
            <ListTag
              key={index}
              className={`ml-6 ${listStyle} space-y-2 text-sm`}
            >
              {lines.map((line, lineIndex) => {
                // Strip list marker (e.g., `* ` or `1. `)
                const content = line
                  .trim()
                  .replace(/^[\*\d]+\.?\s*/, "")
                  .trim();

                // Enhanced styling for status lines (e.g., **DONE**: 1 task)
                const statusMatch = content.match(
                  /^\*\*([A-Z-]+)\*\*:\s*(.*)$/,
                );

                if (statusMatch) {
                  const statusKey = statusMatch[1]; // e.g., DONE
                  const statusValue = statusMatch[2]; // e.g., 1 task
                  const colorClass = getStatusColorClass(statusKey);

                  return (
                    <li key={lineIndex} className="text-sm">
                      <span className={`font-bold ${colorClass}`}>
                        {statusKey}
                      </span>
                      <span className="text-gray-700">: {statusValue}</span>
                    </li>
                  );
                }

                // General list item formatting (bolding within the content)
                const boldedContent = content
                  .split("**")
                  .map((textPart, i) =>
                    i % 2 === 1 ? (
                      <strong key={i}>{textPart}</strong>
                    ) : (
                      <span key={i}>{textPart}</span>
                    ),
                  );

                return <li key={lineIndex}>{boldedContent}</li>;
              })}
            </ListTag>
          );
        }

        const paragraphs = trimmedPart.split("\n");
        return (
          <div key={index} className="space-y-2 text-base">
            {paragraphs.map((p, pIndex) => {
              const line = p.trim();
              if (!line) return null;

              // Check for the main title on the first line
              if (
                index === 0 &&
                pIndex === 0 &&
                line.startsWith("**Project Summary:")
              ) {
                return (
                  <h2
                    key={pIndex}
                    className="text-2xl font-extrabold text-gray-900"
                  >
                    {line.replace(/\*\*|Project Summary:\s*/g, "").trim()}
                  </h2>
                );
              }

              // Simple paragraph with line breaks
              const styledLine = line
                .split("**")
                .map((textPart, i) =>
                  i % 2 === 1 ? (
                    <strong key={i}>{textPart}</strong>
                  ) : (
                    <span key={i}>{textPart}</span>
                  ),
                );

              return (
                <p key={pIndex} className="text-gray-600 ">
                  {styledLine}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
