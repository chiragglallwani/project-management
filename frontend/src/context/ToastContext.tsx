"use client";
import Toast from "@/components/Toast";
import { ToastData, ToastType } from "@/types/types";
import { createContext, useCallback, useState } from "react";

interface ToastContextValue {
  showToast: (message: string, type: ToastType) => void;
}

// Create a context with a default dummy value
export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * The context provider that manages toast state and renders the fixed container.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const newToast: ToastData = {
      id: crypto.randomUUID(),
      message,
      type,
    };
    // Add the new toast to the list
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const hideToast = useCallback((id: string) => {
    // Remove the toast from the list
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Container - Fixed position on the screen */}
      <div
        aria-live="assertive"
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-3 p-4 w-full md:max-w-sm pointer-events-none"
      >
        {/* Only the current list of toasts are rendered here */}
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <Toast toast={t} onClose={hideToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
