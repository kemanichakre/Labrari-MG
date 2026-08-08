// ============================================================
// Book Form Component
// ============================================================
// This form is used for both ADDING a new book and EDITING an
// existing book. It receives initialData as a prop — if null,
// it's in "add" mode; if it has values, it's in "edit" mode.
// ============================================================

import React, { useState, useEffect } from "react";

const BookForm = ({ initialData, onSave, onCancel }) => {
  // Determine if we're in edit mode
  const isEditing = initialData !== null;

  // ============================================================
  // Form State
  // ============================================================
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    published_year: "",
    quantity: 1,
    available_quantity: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ============================================================
  // Populate form when editing an existing book
  // ============================================================
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        isbn: initialData.isbn || "",
        category: initialData.category || "",
        published_year: initialData.published_year || "",
        quantity: initialData.quantity || 1,
        available_quantity: initialData.available_quantity || 1,
      });
    }
  }, [initialData]);

  // ============================================================
  // Handle Input Changes
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "available_quantity" || name === "published_year"
        ? value === "" ? "" : Number(value)
        : value,
    }));
    // Clear the field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  // ============================================================
  // Client-Side Validation
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!formData.author.trim()) {
      newErrors.author = "Author is required.";
    }
    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required.";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }
    if (formData.published_year !== "" && (formData.published_year < 1000 || formData.published_year > new Date().getFullYear())) {
      newErrors.published_year = `Enter a valid year (1000-${new Date().getFullYear()}).`;
    }
    if (formData.quantity < 0) {
      newErrors.quantity = "Quantity cannot be negative.";
    }
    if (formData.available_quantity < 0) {
      newErrors.available_quantity = "Available quantity cannot be negative.";
    }
    if (formData.available_quantity > formData.quantity) {
      newErrors.available_quantity = "Available quantity cannot exceed total quantity.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // Handle Form Submission
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      await onSave(formData);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        "An error occurred. Please try again.";
      setServerError(message);

      // If it's a duplicate ISBN error, highlight the isbn field
      if (message.toLowerCase().includes("isbn")) {
        setErrors((prev) => ({ ...prev, isbn: "This ISBN already exists." }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "✏️ Edit Book" : "📕 Add New Book"}
      </h2>

      {/* Server Error */}
      {serverError && (
        <div className="error-message" style={{ marginBottom: 0 }}>
          ⚠️ {serverError}
        </div>
      )}

      {/* Title & Author Row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? "error" : ""}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="author">
            Author *
          </label>
          <input
            id="author"
            name="author"
            type="text"
            className={`form-input ${errors.author ? "error" : ""}`}
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
          {errors.author && <span className="form-error">{errors.author}</span>}
        </div>
      </div>

      {/* ISBN & Category Row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="isbn">
            ISBN *
          </label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            className={`form-input ${errors.isbn ? "error" : ""}`}
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
          />
          {errors.isbn && <span className="form-error">{errors.isbn}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category *
          </label>
          <input
            id="category"
            name="category"
            type="text"
            className={`form-input ${errors.category ? "error" : ""}`}
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Fiction, Science"
          />
          {errors.category && (
            <span className="form-error">{errors.category}</span>
          )}
        </div>
      </div>

      {/* Published Year & Quantity Row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="published_year">
            Published Year
          </label>
          <input
            id="published_year"
            name="published_year"
            type="number"
            className={`form-input ${errors.published_year ? "error" : ""}`}
            value={formData.published_year}
            onChange={handleChange}
            placeholder="e.g., 2024"
          />
          {errors.published_year && (
            <span className="form-error">{errors.published_year}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="quantity">
            Total Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            className={`form-input ${errors.quantity ? "error" : ""}`}
            value={formData.quantity}
            onChange={handleChange}
          />
          {errors.quantity && (
            <span className="form-error">{errors.quantity}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="available_quantity">
            Available Qty
          </label>
          <input
            id="available_quantity"
            name="available_quantity"
            type="number"
            min="0"
            className={`form-input ${errors.available_quantity ? "error" : ""}`}
            value={formData.available_quantity}
            onChange={handleChange}
          />
          {errors.available_quantity && (
            <span className="form-error">{errors.available_quantity}</span>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : isEditing
            ? "Update Book"
            : "Add Book"}
        </button>
      </div>
    </form>
  );
};

export default BookForm;

