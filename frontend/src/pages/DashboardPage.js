// ============================================================
// Dashboard Page — Professional Overview with Charts
// ============================================================
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { getDashboardStats } from "../services/api";

const COLORS = ["#667eea", "#764ba2", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Books", value: stats.totalBooks, icon: "📚", color: "#667eea" },
    { label: "Total Copies", value: stats.totalCopies, icon: "📖", color: "#f59e0b" },
    { label: "Available", value: stats.availableCopies, icon: "✅", color: "#10b981" },
    { label: "Issued", value: stats.issuedBooks, icon: "🔴", color: "#ef4444" },
    { label: "Authors", value: stats.totalAuthors, icon: "✍️", color: "#3b82f6" },
    { label: "Categories", value: stats.totalCategories, icon: "🏷️", color: "#764ba2" },
  ];

  const pieData = (stats.categoryDistribution || []).map((item) => ({
    name: item.category,
    value: item.count,
  }));

  const barData = (stats.recentActivity || [])
    .map((item) => ({
      date: item.date ? item.date.slice(5) : "N/A",
      books: item.count,
    }))
    .reverse();

  return (
    <motion.div
      className="page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Library overview and statistics</p>
      </motion.div>

      {/* Stat Cards */}
      <motion.div className="stats-grid" variants={itemVariants}>
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card-modern" style={{ borderLeftColor: stat.color }}>
            <div className="stat-card-icon">{stat.icon}</div>
            <div className="stat-card-info">
              <div className="stat-card-value">{stat.value}</div>
              <div className="stat-card-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div className="dashboard-grid" variants={itemVariants}>
        {/* Category Distribution Pie Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Books by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No data available</div>
          )}
          <div className="chart-legend">
            {pieData.map((item, i) => (
              <span key={i} className="legend-item">
                <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                {item.name} ({item.value})
              </span>
            ))}
          </div>
        </div>

        {/* Recent Activity Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Books Added (Last 7 Days)</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="books" fill="url(#colorGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">No recent activity</div>
          )}
        </div>
      </motion.div>

      {/* Recent Books */}
      <motion.div className="recent-books-section" variants={itemVariants}>
        <div className="section-header">
          <h3>Recent Books</h3>
          <Link to="/books" className="view-all-link">View All</Link>
        </div>
        <div className="recent-books-grid">
          {stats.recentBooks?.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id} className="recent-book-card">
              <div className="recent-book-icon">📕</div>
              <div className="recent-book-info">
                <h4>{book.title}</h4>
                <p>{book.author}</p>
                <span className="recent-book-category">{book.category}</span>
              </div>
              <span className={`status-badge-sm ${book.available_quantity > 0 ? "available" : "issued"}`}>
                {book.available_quantity > 0 ? "Available" : "Issued"}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;

