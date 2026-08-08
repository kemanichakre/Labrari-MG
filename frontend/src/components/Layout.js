// ============================================================
// Layout Component — Professional Dashboard Layout
// ============================================================
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppFooter from "./AppFooter";
import Toast from "./Toast";

const Layout = ({ darkMode, onToggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "success" });
  };

  return (
    <div className={`app-layout ${darkMode ? "dark-mode" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      </div>
      <main className="main-panel">
        <Outlet context={{ showToast }} />
        <AppFooter />
      </main>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default Layout;

