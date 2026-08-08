// ============================================================
// Book Item Component
// ============================================================
// Renders a single row in the book table. Shows book details
// and provides Edit/Delete action buttons.
// ============================================================

import React from "react";
import "./BookItem.css";

const BookItem = ({ book, index, onEdit, onDelete }) => {
  // Determine availability status for visual indicator
  const isAvailable = book.available_quantity > 0;
  const statusText = isAvailable ? "Available" : "Issued";
  const statusClass = isAvailable ? "status-available" : "status-issued";

  return (
    <tr>
      <td className="cell-index" data-label="#">{index + 1}</td>
      <td className="cell-title" data-label="Title">
        <span className="book-title-text">{book.title}</span>
      </td>
      <td data-label="Author">{book.author}</td>
      <td className="cell-isbn" data-label="ISBN">{book.isbn}</td>
      <td data-label="Category">
        <span className="category-badge">{book.category}</span>
      </td>
      <td data-label="Year">{book.published_year || "—"}</td>
      <td className="cell-qty" data-label="Qty">
        {book.available_quantity}/{book.quantity}
      </td>
      <td data-label="Status">
        <span className={`status-badge ${statusClass}`}>{statusText}</span>
      </td>
      <td className="cell-actions" data-label="Actions">
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
      </td>
    </tr>
  );
};

export default BookItem;

