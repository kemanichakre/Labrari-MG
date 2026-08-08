// ============================================================
// Book Model
// ============================================================
// This model handles all database operations related to books.
// It acts as the data access layer — the controller calls these
// functions, and they interact directly with MySQL.
//
// FALLBACK MODE: If MySQL is unavailable, the model will load
// data from the seed JSON files (seed/books.json, seed/dashboard.json)
// and operate entirely in-memory.
// ============================================================

const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

// ============================================================
// Helper: Check if database is available
// ============================================================
let dbAvailable = true;

const checkDb = async () => {
  try {
    await pool.execute("SELECT 1");
    dbAvailable = true;
  } catch (err) {
    if (dbAvailable) {
      console.log("⚠️  MySQL unavailable — switching to seed data fallback mode.");
    }
    dbAvailable = false;
  }
  return dbAvailable;
};

// Initial check (non-blocking)
checkDb();

// ============================================================
// Helper: Load seed books from JSON
// ============================================================
let cachedBooks = null;
const getSeedBooks = () => {
  if (cachedBooks) return cachedBooks;
  const booksPath = path.join(__dirname, "..", "..", "seed", "books.json");
  const raw = fs.readFileSync(booksPath, "utf-8");
  const books = JSON.parse(raw);
  // Map seed format to DB format
  cachedBooks = books.map((b, i) => ({
    id: b.id || i + 1,
    title: b.title,
    author: b.author,
    isbn: b.isbn,
    category: b.category,
    published_year: b.publishedYear || null,
    quantity: b.totalCopies || 1,
    available_quantity: b.availableCopies !== undefined ? b.availableCopies : b.totalCopies || 1,
    created_at: b.dateAdded ? new Date(b.dateAdded).toISOString() : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  return cachedBooks;
};

// ============================================================
// Helper: Load dashboard stats from JSON
// ============================================================
const getSeedDashboardStats = () => {
  const dashboardPath = path.join(__dirname, "..", "..", "seed", "dashboard.json");
  const raw = fs.readFileSync(dashboardPath, "utf-8");
  const data = JSON.parse(raw);
  return data.data;
};

// ============================================================
// Get all books with optional search and category filter
// ============================================================
const getAllBooks = async (search, category) => {
  if (!(await checkDb())) {
    // Fallback: filter from seed data
    let books = getSeedBooks();

    if (search) {
      const s = search.toLowerCase();
      books = books.filter(
        (b) => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s)
      );
    }

    if (category) {
      books = books.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    // Sort by created_at DESC
    books.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return books;
  }

  let query = "SELECT * FROM books WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (title LIKE ? OR author LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  query += " ORDER BY created_at DESC";

  const [rows] = await pool.execute(query, params);
  return rows;
};

// ============================================================
// Get a single book by ID
// ============================================================
const getBookById = async (id) => {
  if (!(await checkDb())) {
    const books = getSeedBooks();
    return books.find((b) => b.id === parseInt(id)) || null;
  }

  const [rows] = await pool.execute("SELECT * FROM books WHERE id = ?", [id]);
  return rows[0];
};

// ============================================================
// Create a new book
// ============================================================
const createBook = async (bookData) => {
  const {
    title,
    author,
    isbn,
    category,
    published_year,
    quantity,
    available_quantity,
  } = bookData;

  if (!(await checkDb())) {
    // Fallback: add to in-memory cache
    const books = getSeedBooks();
    const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const newBook = {
      id: newId,
      title,
      author,
      isbn,
      category: category || "",
      published_year: published_year || null,
      quantity: quantity || 1,
      available_quantity: available_quantity !== undefined ? available_quantity : quantity || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cachedBooks.unshift(newBook);
    return newBook;
  }

  const [result] = await pool.execute(
    `INSERT INTO books (title, author, isbn, category, published_year, quantity, available_quantity)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      author,
      isbn,
      category,
      published_year || null,
      quantity,
      available_quantity !== undefined ? available_quantity : quantity,
    ]
  );

  return getBookById(result.insertId);
};

// ============================================================
// Update an existing book
// ============================================================
const updateBook = async (id, bookData) => {
  const {
    title,
    author,
    isbn,
    category,
    published_year,
    quantity,
    available_quantity,
  } = bookData;

  if (!(await checkDb())) {
    const books = getSeedBooks();
    const index = books.findIndex((b) => b.id === parseInt(id));
    if (index === -1) return null;

    const updatedBook = {
      ...books[index],
      title: title || books[index].title,
      author: author || books[index].author,
      isbn: isbn || books[index].isbn,
      category: category || books[index].category,
      published_year: published_year !== undefined ? published_year : books[index].published_year,
      quantity: quantity !== undefined ? quantity : books[index].quantity,
      available_quantity: available_quantity !== undefined ? available_quantity : books[index].available_quantity,
      updated_at: new Date().toISOString(),
    };
    cachedBooks[index] = updatedBook;
    return updatedBook;
  }

  await pool.execute(
    `UPDATE books
     SET title = ?, author = ?, isbn = ?, category = ?,
         published_year = ?, quantity = ?, available_quantity = ?
     WHERE id = ?`,
    [
      title,
      author,
      isbn,
      category,
      published_year || null,
      quantity,
      available_quantity,
      id,
    ]
  );

  return getBookById(id);
};

// ============================================================
// Delete a book by ID
// ============================================================
const deleteBook = async (id) => {
  if (!(await checkDb())) {
    const books = getSeedBooks();
    const index = books.findIndex((b) => b.id === parseInt(id));
    if (index === -1) return false;
    cachedBooks.splice(index, 1);
    return true;
  }

  const [result] = await pool.execute("DELETE FROM books WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

// ============================================================
// Get distinct categories for the filter dropdown
// ============================================================
const getAllCategories = async () => {
  if (!(await checkDb())) {
    const books = getSeedBooks();
    const categories = [...new Set(books.map((b) => b.category))];
    return categories.sort();
  }

  const [rows] = await pool.execute(
    "SELECT DISTINCT category FROM books ORDER BY category ASC"
  );
  return rows.map((row) => row.category);
};

// ============================================================
// Get dashboard statistics
// ============================================================
const getDashboardStats = async () => {
  if (!(await checkDb())) {
    return getSeedDashboardStats();
  }

  const results = await Promise.all([
    pool.execute("SELECT COUNT(*) AS totalBooks FROM books"),
    pool.execute("SELECT COUNT(DISTINCT author) AS totalAuthors FROM books"),
    pool.execute("SELECT COUNT(DISTINCT category) AS totalCategories FROM books"),
    pool.execute("SELECT COALESCE(SUM(quantity), 0) AS totalCopies FROM books"),
    pool.execute("SELECT COALESCE(SUM(available_quantity), 0) AS availableCopies FROM books"),
    pool.execute("SELECT COUNT(*) AS issuedBooks FROM books WHERE available_quantity = 0"),
    pool.execute("SELECT category, COUNT(*) AS count FROM books GROUP BY category ORDER BY count DESC"),
    pool.execute("SELECT DATE(created_at) AS date, COUNT(*) AS count FROM books GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7"),
    pool.execute("SELECT * FROM books ORDER BY created_at DESC LIMIT 5"),
  ]);

  return {
    totalBooks: results[0][0][0].totalBooks,
    totalAuthors: results[1][0][0].totalAuthors,
    totalCategories: results[2][0][0].totalCategories,
    totalCopies: results[3][0][0].totalCopies,
    availableCopies: results[4][0][0].availableCopies,
    issuedBooks: results[5][0][0].issuedBooks,
    categoryDistribution: results[6][0],
    recentActivity: results[7][0],
    recentBooks: results[8][0],
  };
};

// Export all functions so the controller can use them
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getAllCategories,
  getDashboardStats,
};
