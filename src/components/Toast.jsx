import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "linear-gradient(135deg, #0BAA60, #00D371)",
    error: "linear-gradient(135deg, #CD192F, #D74759)",
    info: "linear-gradient(135deg, #3F9DFB, #7D7AFF)",
  };

  return (
    <div
      className="fixed bottom-4 right-4 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 border border-white/30 backdrop-blur"
      style={{ background: colors[type] }}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default Toast;
