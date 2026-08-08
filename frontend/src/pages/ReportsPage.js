// ============================================================
// Reports Page — Category & Inventory Reports
// ============================================================
import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { getDashboardStats, getBooks } from "../services/api";

const COLORS = ["#667eea", "#764ba2", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("category");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, booksRes] = await Promise.all([
          getDashboardStats(),
          getBooks(),
        ]);
        setStats(statsRes.data);
        setAllBooks(booksRes.data);
      } catch (err) {
        console.error("Failed to load reports data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportCSV = () => {
    const headers = ["Title,Author,ISBN,Category,Year,Quantity,Available,Status"];
    const rows = allBooks.map((b) =>
      `"${b.title}","${b.author}","${b.isbn}","${b.category}","${b.published_year || ""}",${b.quantity},${b.available_quantity},"${b.available_quantity > 0 ? "Available" : "Issued"}"`
    );
    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "library_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  const pieData = (stats?.categoryDistribution || []).map((item) => ({
    name: item.category,
    value: item.count,
  }));

  const inventoryData = [
    { name: "Available", value: stats?.availableCopies || 0 },
    { name: "Issued", value: stats?.issuedBooks || 0 },
    { name: "Total Copies", value: stats?.totalCopies || 0 },
  ];

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Data insights and export tools</p>
      </div>

      {/* Tab Navigation */}
      <div className="reports-tabs">
        <button
          className={`tab-btn ${activeTab === "category" ? "active" : ""}`}
          onClick={() => setActiveTab("category")}
        >
          Category Distribution
        </button>
        <button
          className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory Status
        </button>
        <button className="btn btn-primary export-btn" onClick={exportCSV}>
          📥 Export CSV
        </button>
      </div>

      {activeTab === "category" && (
        <div className="chart-card full-width">
          <h3 className="chart-title">Books by Category</h3>
          {pieData.length > 0 ? (
            <div className="report-chart-container">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="report-table">
                <h4>Category Breakdown</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pieData.map((item, i) => (
                      <tr key={i}>
                        <td><span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} /> {item.name}</td>
                        <td>{item.value}</td>
                        <td>{((item.value / pieData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="empty-chart">No data available</div>
          )}
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="chart-card full-width">
          <h3 className="chart-title">Inventory Status</h3>
          <div className="report-chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[inventoryData[0], inventoryData[1]]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="report-table">
              <h4>Summary</h4>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td><strong>{item.value}</strong></td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td>Utilization Rate</td>
                    <td><strong>
                      {stats?.totalCopies > 0
                        ? `${((stats.totalCopies - stats.availableCopies) / stats.totalCopies * 100).toFixed(1)}%`
                        : "0%"}
                    </strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsPage;

