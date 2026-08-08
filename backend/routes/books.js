// ============================================================
// Book Routes
// ============================================================
// This file defines all the API endpoints for the books resource.
// Each route maps an HTTP method + URL path to a controller function.
// ============================================================

const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { validateBook } = require("../middleware/validation");

// ============================================================
// Route Definitions
// ============================================================

// GET /api/books/stats/dashboard   → Get dashboard statistics (must be BEFORE /:id)
// GET /api/books/categories        → Get all distinct categories (must be BEFORE /:id)
// GET /api/books                   → Get all books (with optional search/filter)
// GET /api/books/:id               → Get a single book by ID
// POST /api/books                  → Create a new book (with validation)
// PUT /api/books/:id               → Update an existing book (with validation)
// DELETE /api/books/:id            → Delete a book

router.get("/stats/dashboard", bookController.getDashboardStats);
router.get("/categories", bookController.getAllCategories);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", validateBook, bookController.createBook);
router.put("/:id", validateBook, bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
