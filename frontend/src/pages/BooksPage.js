// ============================================================
// Books Page — Full Book List with Search, Filter & Catalog View
// ============================================================
import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import BookForm from "../components/BookForm";
import BookList from "../components/BookList";
import BookCatalog from "../components/BookCatalog";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import Dashboard from "../components/Dashboard";
import useDebounce from "../hooks/useDebounce";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  getCategories,
} from "../services/api";

const BooksPage = () => {
  const { showToast } = useOutletContext();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBooks(debouncedSearch, selectedCategory);
      setBooks(response.data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (showToast) {
      // Listen for navigation state notifications
    }
  }, [showToast]);

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        showToast("Book updated successfully!", "success");
      } else {
        await createBook(bookData);
        showToast("Book added successfully!", "success");
      }
      fetchBooks();
      fetchCategories();
      handleCloseForm();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteBook(deleteConfirm);
      showToast("Book deleted successfully!", "success");
      fetchBooks();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book.");
    }
    setDeleteConfirm(null);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
  };

  // Pagination
  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1 className="page-title">Books Collection</h1>
        <p className="page-subtitle">Manage your library inventory</p>
      </div>

      <Dashboard books={books} loading={loading} />

      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-bar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
            title="Table View"
          >
            📋
          </button>
          <button
            className={`view-toggle-btn ${viewMode === "catalog" ? "active" : ""}`}
            onClick={() => setViewMode("catalog")}
            title="Catalog View"
          >
            🖼️
          </button>
        </div>
        <button className="btn btn-primary" onClick={handleAddBook}>
          + Add New Book
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">✕</button>
        </div>
      )}

      {viewMode === "table" ? (
        <>
          <BookList
            books={paginatedBooks}
            loading={loading}
            onEdit={handleEditBook}
            onDelete={(id) => setDeleteConfirm(id)}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={books.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </>
      ) : (
        <>
          <BookCatalog
            books={paginatedBooks}
            onEdit={handleEditBook}
            onDelete={(id) => setDeleteConfirm(id)}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={books.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseForm}>✕</button>
            <BookForm
              initialData={editingBook}
              onSave={handleSaveBook}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Book"
          message="Are you sure you want to delete this book? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </motion.div>
  );
};

export default BooksPage;

