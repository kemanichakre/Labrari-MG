// ============================================================
// Dashboard Component
// ============================================================
// Displays summary statistics about the library's book collection.
// Shows total books, unique authors, categories, and available books.
// ============================================================

import React from "react";
import "./Dashboard.css";

const Dashboard = ({ books, loading }) => {
  // Calculate statistics from the books array
  const totalBooks = books.length;
  const totalQuantity = books.reduce((sum, book) => sum + (book.quantity || 0), 0);
  const availableBooks = books.filter(
    (book) => book.available_quantity > 0
  ).length;
  const uniqueAuthors = new Set(books.map((book) => book.author)).size;

  const stats = [
    {
      label: "Total Books",
      value: totalBooks,
      icon: "📚",
      color: "#667eea",
    },
    {
      label: "Total Copies",
      value: totalQuantity,
      icon: "📖",
      color: "#f59e0b",
    },
    {
      label: "Available",
      value: availableBooks,
      icon: "✅",
      color: "#10b981",
    },
    {
      label: "Authors",
      value: uniqueAuthors,
      icon: "✍️",
      color: "#ef4444",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card stat-loading">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <div className="skeleton-text">Loading...</div>
              <div className="skeleton-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dashboard">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stat-card"
          style={{ borderLeftColor: stat.color }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-info">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

