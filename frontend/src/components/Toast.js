// ============================================================
// Toast Component — Animated Notification Popups
// ============================================================
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  const colors = {
    success: { bg: "#d1fae5", border: "#a7f3d0", text: "#065f46" },
    error: { bg: "#fee2e2", border: "#fecaca", text: "#991b1b" },
    info: { bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" },
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{
            background: colors[type].bg,
            border: `1px solid ${colors[type].border}`,
            color: colors[type].text,
          }}
        >
          <div className="toast-icon">{icons[type]}</div>
          <div className="toast-message">{message}</div>
          <button className="toast-close" onClick={onClose}>
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

