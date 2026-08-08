// ============================================================
// Book Details Page — Full Book Information
// ============================================================
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getBookById, deleteBook } from "../services/api";
import ConfirmDialog from "../components/ConfirmDialog";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBookById(id);
        setBook(response.data);
      } catch (err) {
        setError("Book not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteBook(id);
      navigate("/books", { state: { notification: "Book deleted successfully!" } });
    } catch (err) {
      setError("Failed to delete book.");
    }
    setShowConfirm(false);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="page-container">
        <div className="error-message">{error || "Book not found"}</div>
        <Link to="/books" className="btn btn-primary">Back to Books</Link>
      </div>
    );
  }

  const isAvailable = book.available_quantity > 0;

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <Link to="/books" className="back-link">&larr; Back to Books</Link>
        <h1 className="page-title">{book.title}</h1>
        <p className="page-subtitle">by {book.author}</p>
      </div>

      <div className="book-details-card">
        <div className="book-details-grid">
          <div className="book-detail-section">
            <h3>Book Information</h3>
            <div className="detail-row">
              <span className="detail-label">ISBN</span>
              <span className="detail-value">{book.isbn}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category</span>
              <span className="detail-value">
                <span className="category-badge">{book.category}</span>
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Published Year</span>
              <span className="detail-value">{book.published_year || "N/A"}</span>
            </div>
          </div>

          <div className="book-detail-section">
            <h3>Inventory</h3>
            <div className="detail-row">
              <span className="detail-label">Total Copies</span>
              <span className="detail-value">{book.quantity}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Available</span>
              <span className="detail-value">{book.available_quantity}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className={`status-badge ${isAvailable ? "status-available" : "status-issued"}`}>
                {isAvailable ? "Available" : "Issued"}
              </span>
            </div>
          </div>

          <div className="book-detail-section">
            <h3>Timestamps</h3>
            <div className="detail-row">
              <span className="detail-label">Added On</span>
              <span className="detail-value">
                {new Date(book.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">
                {new Date(book.updated_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="book-detail-actions">
          <button className="btn btn-edit" onClick={() => navigate(`/books`, { state: { editBook: book } })}>
            ✏️ Edit Book
          </button>
          <button className="btn btn-delete" onClick={() => setShowConfirm(true)}>
            🗑️ Delete Book
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete Book"
          message={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </motion.div>
  );
};

export default BookDetailsPage;

