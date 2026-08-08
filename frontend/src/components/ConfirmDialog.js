// ============================================================
// ConfirmDialog Component — Custom Confirmation Modal
// ============================================================
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = "Delete", cancelText = "Cancel", variant = "danger" }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="confirm-dialog"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="confirm-icon">
            {variant === "danger" ? "⚠️" : "ℹ️"}
          </div>
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-message">{message}</p>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              className={`btn ${variant === "danger" ? "btn-delete" : "btn-primary"}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;

