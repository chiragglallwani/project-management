"use client";
import Modal from "./Modal";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description: string;
  actionText?: string;
};

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  title,
  description,
  actionText = "Delete",
}: DeleteModalProps) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <div>
        <p className="text-sm text-gray-800 my-4">{description}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-100  bg-gray-600 rounded-lg hover:bg-gray-300 transition duration-150 hover:text-black hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-900 transition duration-150 disabled:opacity-50 hover:cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
