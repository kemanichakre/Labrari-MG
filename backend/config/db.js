// ============================================================
// Database Connection Configuration
// ============================================================
// This file creates a MySQL connection pool using the mysql2
// package. A connection pool is used instead of a single
// connection because:
// 1. It automatically manages multiple connections
// 2. It handles connection failures gracefully
// 3. It improves performance by reusing connections
// 4. It prevents connection leaks in production
// ============================================================

const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool with settings from .env file
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "library_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,    // Queue queries when all connections are in use
  connectionLimit: 10,          // Maximum number of connections in the pool
  queueLimit: 0,               // Unlimited queue length (0 = unlimited)
  enableKeepAlive: true,       // Keep connections alive to prevent timeouts
  keepAliveInitialDelay: 0,    // Start keep-alive immediately
});

// ============================================================
// Test database connection on startup
// ============================================================
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL database connected successfully!");
    connection.release(); // Release connection back to pool
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Don't exit the process — the server can still start and
    // will show errors when queries are attempted
  }
};

// Run the connection test
testConnection();

// Export the pool so other modules can use it
module.exports = pool;

