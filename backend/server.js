// ============================================================
// Server Entry Point
// ============================================================
// This is the main file that starts the Express server.
// It configures middleware, registers routes, and listens
// for incoming HTTP requests on a specified port.
// ============================================================

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/books");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/validation");

// Initialize Express application
const app = express();

// ============================================================
// Middleware Configuration
// ============================================================

// CORS — Allows the React frontend (on a different port) to
// make requests to this backend without being blocked by the
// browser's same-origin policy.
app.use(cors());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

// Body parser — Converts incoming JSON request bodies into
// JavaScript objects available at req.body
app.use(express.json());

// URL-encoded parser — Handles form submissions
app.use(express.urlencoded({ extended: true }));

// ============================================================
// Routes
// ============================================================

// Health check endpoint — useful for Docker health checks
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Mount book routes at /api/books
app.use("/api/books", bookRoutes);

// ============================================================
// Error Handling
// ============================================================

// 404 handler — for undefined routes
app.use(notFoundHandler);

// Global error handler — catches all unhandled errors
app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Library Management API is running on port ${PORT}`);
  console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
});

// ============================================================
// Graceful Shutdown
// ============================================================
const shutdown = async (signal) => {
  console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log("🛑 HTTP server closed.");
    const pool = require("./config/db");
    try {
      await pool.end();
      console.log("🗄️  Database pool closed.");
    } catch (err) {
      console.error("❌ Error closing database pool:", err.message);
    }
    process.exit(0);
  });
  setTimeout(() => {
    console.error("💥 Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
