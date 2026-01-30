import Modal from "./Modal";

const toneStyles = {
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-green-500 text-white hover:bg-green-600",
  neutral:
    "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900",
};

const ConfirmDialog = ({
  isOpen,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition ${toneStyles[tone]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
