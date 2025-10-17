"use client";
import { toastConfigs, ToastData } from "@/types/types";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

const TOAST_TIMEOUT_MS = 4000;
const ANIMATION_DURATION_MS = 300;

type ToastProps = {
  toast: ToastData;
  onClose: (id: string) => void;
};

export default function Toast({ toast, onClose }: ToastProps) {
  const { Icon, bg, text, primaryColor } = toastConfigs[toast.type];
  const [isVisible, setIsVisible] = useState(false);

  // Auto-hide logic and animation control
  useEffect(() => {
    // 1. Start the 'slideIn' animation immediately
    setIsVisible(true);

    // 2. Set timeout for auto-dismiss
    const timer = setTimeout(() => {
      setIsVisible(false); // Start slideOut animation
      setTimeout(() => onClose(toast.id), ANIMATION_DURATION_MS); // Close after animation
    }, TOAST_TIMEOUT_MS);

    // 3. Cleanup: clear timer if component unmounts or toast changes
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), ANIMATION_DURATION_MS);
  };

  const containerClasses = `
        flex items-start p-4 rounded-xl shadow-2xl transition-all duration-${ANIMATION_DURATION_MS} space-x-3 
        transform 
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        ${bg} ${text}
        w-full max-w-sm
    `;

  return (
    <div className={containerClasses}>
      {/* Icon */}
      <div className={`flex-shrink-0 pt-0.5 ${primaryColor}`}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Message Content */}
      <div className="flex-1">
        <p className="text-sm font-semibold">{toast.message}</p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-full opacity-80 hover:opacity-100 transition duration-150"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
