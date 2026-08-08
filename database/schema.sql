-- ============================================================
-- Library Management System - Database Schema
-- ============================================================
-- This script creates the library_db database and the books table.
-- Run this script using: mysql -u root -p < database/schema.sql
-- ============================================================

-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS library_db;

-- Switch to the library_db database
USE library_db;

-- ============================================================
-- Books Table
-- ============================================================
-- This table stores all book-related information.
-- Each book has a unique ID, metadata about the book,
-- quantity tracking for inventory, and timestamps.
-- ============================================================
CREATE TABLE IF NOT EXISTS books (
    -- Primary Key: Auto-incrementing unique identifier for each book
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Book title (cannot be empty)
    title VARCHAR(255) NOT NULL,
    
    -- Author name (cannot be empty)
    author VARCHAR(255) NOT NULL,
    
    -- ISBN: International Standard Book Number (must be unique)
    -- Only one book can have a specific ISBN
    isbn VARCHAR(20) NOT NULL UNIQUE,
    
    -- Category: Genre or category of the book (e.g., Fiction, Science, History)
    category VARCHAR(100) NOT NULL,
    
    -- Year the book was published
    published_year INT,
    
    -- Total quantity: How many copies the library owns
    quantity INT NOT NULL DEFAULT 1,
    
    -- Available quantity: How many copies are currently available for issue
    -- This must always be <= quantity
    available_quantity INT NOT NULL DEFAULT 1,
    
    -- Timestamp: Automatically set when a book record is created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamp: Automatically updated when a book record is modified
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraint: Available quantity cannot exceed total quantity
    CONSTRAINT chk_available_quantity CHECK (available_quantity >= 0 AND available_quantity <= quantity)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Indexes for better query performance
-- ============================================================

-- Index on title to speed up search queries
CREATE INDEX idx_title ON books(title);

-- Index on author to speed up search queries
CREATE INDEX idx_author ON books(author);

-- Index on category to speed up filter queries
CREATE INDEX idx_category ON books(category);

-- ============================================================
-- Sample Data (Optional)
-- ============================================================
-- Uncomment the following INSERT statements to populate the
-- database with sample books for development and testing.
-- ============================================================

-- INSERT INTO books (title, author, isbn, category, published_year, quantity, available_quantity) VALUES
-- ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 1925, 3, 3),
-- ('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 1960, 2, 1),
-- ('A Brief History of Time', 'Stephen Hawking', '978-0553380163', 'Science', 1988, 2, 2),
-- ('The Art of Programming', 'Donald Knuth', '978-0201896831', 'Technology', 1968, 1, 0),
-- ('1984', 'George Orwell', '978-0451524935', 'Fiction', 1949, 4, 4),
-- ('The Selfish Gene', 'Richard Dawkins', '978-0198788607', 'Science', 1976, 2, 2),
-- ('Clean Code', 'Robert C. Martin', '978-0132350884', 'Technology', 2008, 3, 3),
-- ('Sapiens', 'Yuval Noah Harari', '978-0062316097', 'History', 2011, 5, 4);

