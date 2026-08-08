// ============================================================
// BookCatalog Component — Card-Based Grid View for All Books
// ============================================================
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  "Fiction": "#667eea",
  "Science": "#10b981",
  "Technology": "#f59e0b",
  "History": "#ef4444",
  "Philosophy": "#8b5cf6",
  "Art": "#ec4899",
  "Biography": "#3b82f6",
  "Education": "#14b8a6",
  "Business": "#f97316",
  "Health": "#22c55e",
};

const getCategoryColor = (category) => {
  const colors = Object.values(CATEGORY_COLORS);
  let hash = 0;
  for (let i = 0; i < (category || "").length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (title) => {
  return (title || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const BookCatalog = ({ books, onEdit, onDelete }) => {
  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📭</span>
        <h3>No books found</h3>
        <p>Try adjusting your search or filter, or add a new book to get started.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="book-catalog-grid"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {books.map((book, index) => {
        const bgColor = getCategoryColor(book.category);
        const isAvailable = book.available_quantity > 0;

        return (
          <motion.div
            key={book.id}
            className="book-catalog-card"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
          >
            {/* Book Cover / Avatar */}
            <Link to={`/books/${book.id}`} className="catalog-cover-link">
              <div className="catalog-cover" style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)` }}>
                <span className="catalog-cover-initials">{getInitials(book.title)}</span>
                <span className="catalog-cover-icon">📖</span>
              </div>
            </Link>

            {/* Book Info */}
            <div className="catalog-body">
              <Link to={`/books/${book.id}`} className="catalog-title-link">
                <h4 className="catalog-title">{book.title}</h4>
              </Link>
              <p className="catalog-author">by {book.author}</p>

              <div className="catalog-meta">
                <span className="catalog-isbn">{book.isbn}</span>
                <span className="catalog-year">{book.published_year || "—"}</span>
              </div>

              <div className="catalog-badges">
                <span className="category-badge" style={{
                  background: `${bgColor}18`,
                  color: bgColor,
                }}>
                  {book.category}
                </span>
                <span className={`status-badge ${isAvailable ? "status-available" : "status-issued"}`}>
                  {isAvailable ? "Available" : "Issued"}
                </span>
              </div>

              <div className="catalog-stats">
                <div className="catalog-stat">
                  <span className="catalog-stat-label">Total</span>
                  <span className="catalog-stat-value">{book.quantity}</span>
                </div>
                <div className="catalog-stat">
                  <span className="catalog-stat-label">Available</span>
                  <span className="catalog-stat-value">{book.available_quantity}</span>
                </div>
              </div>

              <div className="catalog-actions">
                <button
                  className="btn btn-edit btn-sm"
                  onClick={() => onEdit(book)}
                  title="Edit book"
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-delete btn-sm"
                  onClick={() => onDelete(book.id)}
                  title="Delete book"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default BookCatalog;

