// ============================================================
// Request Validation Middleware
// ============================================================
// This middleware validates incoming data before it reaches
// the controller. It checks for required fields, data types,
// and business rules (e.g., quantity constraints).
// ============================================================

// ============================================================
// Validate book data for CREATE and UPDATE operations
// ============================================================
const validateBook = (req, res, next) => {
  const { title, author, isbn, quantity, available_quantity } = req.body;
  const errors = [];

  // Title is required
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("Title is required and must be a non-empty string.");
  }

  // Author is required
  if (!author || typeof author !== "string" || author.trim().length === 0) {
    errors.push("Author is required and must be a non-empty string.");
  }

  // ISBN is required and must be a string
  if (!isbn || typeof isbn !== "string" || isbn.trim().length === 0) {
    errors.push("ISBN is required and must be a non-empty string.");
  }

  // Quantity must be a non-negative integer
  if (quantity !== undefined) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 0) {
      errors.push("Quantity must be a non-negative integer.");
    }
  }

  // Available quantity must be a non-negative integer
  if (available_quantity !== undefined) {
    const availQty = Number(available_quantity);
    if (!Number.isInteger(availQty) || availQty < 0) {
      errors.push("Available quantity must be a non-negative integer.");
    }
  }

  // Available quantity cannot exceed total quantity
  if (
    quantity !== undefined &&
    available_quantity !== undefined &&
    Number(available_quantity) > Number(quantity)
  ) {
    errors.push("Available quantity cannot exceed total quantity.");
  }

  // If there are validation errors, return them immediately
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  // If validation passes, proceed to the controller
  next();
};

// ============================================================
// 404 Handler — for unknown routes
// ============================================================
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

// ============================================================
// Global Error Handler — catches unhandled errors
// ============================================================
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);

  // Handle MySQL duplicate entry errors
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "A book with this ISBN already exists.",
    });
  }

  // Handle MySQL foreign key constraint errors
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      success: false,
      message: "Referenced record not found.",
    });
  }

  // Generic server error
  res.status(500).json({
    success: false,
    message: "Internal server error. Please try again later.",
  });
};

module.exports = {
  validateBook,
  notFoundHandler,
  errorHandler,
};

