// ============================================================
// Book Controller
// ============================================================
// This controller sits between the routes and the model.
// It handles HTTP requests, calls the appropriate model function,
// and sends back HTTP responses with proper status codes.
// ============================================================

const bookModel = require("../models/book");

// ============================================================
// GET /books
// GET /books?search=keyword
// GET /books?category=Fiction
// GET /books?search=keyword&category=Fiction
// ============================================================
const getAllBooks = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const books = await bookModel.getAllBooks(search, category);

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET /books/:id
// ============================================================
const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookModel.getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// POST /books
// ============================================================
const createBook = async (req, res, next) => {
  try {
    const newBook = await bookModel.createBook(req.body);

    res.status(201).json({
      success: true,
      message: "Book added successfully!",
      data: newBook,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PUT /books/:id
// ============================================================
const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingBook = await bookModel.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found.`,
      });
    }

    const updatedBook = await bookModel.updateBook(id, req.body);

    res.status(200).json({
      success: true,
      message: "Book updated successfully!",
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// DELETE /books/:id
// ============================================================
const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await bookModel.deleteBook(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Book with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET /books/categories
// ============================================================
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await bookModel.getAllCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET /books/stats/dashboard
// ============================================================
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await bookModel.getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllCategories,
  getDashboardStats,
};
