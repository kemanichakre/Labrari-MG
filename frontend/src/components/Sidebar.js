// ============================================================
// Sidebar Navigation Component
// ============================================================
import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ darkMode, onToggleDarkMode }) => {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/books", label: "All Books", icon: "📚" },
    { path: "/add-book", label: "Add Book", icon: "➕" },
    { path: "/reports", label: "Reports", icon: "📈" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">📚</div>
        <h2 className="sidebar-title">Library Pro</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {/* Dark Mode Toggle */}
        <button className="dark-mode-toggle" onClick={onToggleDarkMode} title="Toggle dark mode">
          <span className="dark-mode-icon">{darkMode ? "☀️" : "🌙"}</span>
          <span className="dark-mode-label">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <p>© {new Date().getFullYear()}</p>
        <p className="sidebar-version">v2.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;

