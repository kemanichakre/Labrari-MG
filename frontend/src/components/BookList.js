// ============================================================
// Book List Component
// ============================================================
// Displays all books in a responsive table with Edit and Delete
// actions. Shows a loading spinner while fetching data and an
// empty state when no books match the current search/filter.
// ============================================================

import React from "react";
import BookItem from "./BookItem";
import "./BookList.css";

const BookList = ({ books, loading, onEdit, onDelete }) => {
  // Loading state
  if (loading) {
    return (
      <div className="book-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className="book-list-container">
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No books found</h3>
          <p>
            Try adjusting your search or filter, or add a new book to get
            started.
          </p>
        </div>
      </div>
    );
  }

  // Table view
  return (
    <div className="book-list-container">
      <div className="table-header">
        <h3>Book Collection ({books.length})</h3>
      </div>
      <div className="table-wrapper">
        <table className="book-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Year</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <BookItem
                key={book.id}
                book={book}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;

