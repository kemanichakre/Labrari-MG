// ============================================================
// Seed Data Script
// ============================================================
// Run this script to import seed data into the database:
//   node backend/seedData.js
//
// This script reads books from seed/books.json and inserts
// them into the books table in the database.
// ============================================================

const fs = require("fs");
const path = require("path");
const pool = require("./config/db");

const seedBooks = async () => {
  try {
    console.log("📖 Reading seed data from seed/books.json...");
    const booksPath = path.join(__dirname, "..", "seed", "books.json");
    const booksData = fs.readFileSync(booksPath, "utf-8");
    const books = JSON.parse(booksData);

    console.log(`✅ Found ${books.length} books to import.`);

    // Insert each book
    let inserted = 0;
    for (const book of books) {
      try {
        await pool.execute(
          `INSERT INTO books (title, author, isbn, category, published_year, quantity, available_quantity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            book.title,
            book.author,
            book.isbn,
            book.category,
            book.publishedYear || null,
            book.totalCopies || 1,
            book.availableCopies !== undefined ? book.availableCopies : book.totalCopies || 1,
          ]
        );
        inserted++;
        process.stdout.write(`\r📚 Imported ${inserted}/${books.length} books`);
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          console.log(`\n⚠️  Duplicate ISBN: ${book.isbn} - "${book.title}" skipped`);
        } else {
          console.error(`\n❌ Error inserting "${book.title}":`, err.message);
        }
      }
    }

    console.log(`\n\n✅ Seed import complete! ${inserted} books imported successfully.`);

    // Display summary
    const [rows] = await pool.execute(
      "SELECT COUNT(*) AS total, SUM(quantity) AS copies, SUM(available_quantity) AS available FROM books"
    );
    console.log(`📊 Database Summary:`);
    console.log(`   Total Books: ${rows[0].total}`);
    console.log(`   Total Copies: ${rows[0].copies}`);
    console.log(`   Available Copies: ${rows[0].available}`);

    // Show category distribution
    const [categories] = await pool.execute(
      "SELECT category, COUNT(*) AS count FROM books GROUP BY category ORDER BY count DESC"
    );
    console.log(`\n📊 Books by Category:`);
    categories.forEach((cat) => {
      console.log(`   ${cat.category}: ${cat.count}`);
    });
  } catch (error) {
    console.error("❌ Seed script failed:", error.message);
  } finally {
    await pool.end();
    console.log("🔌 Database connection closed.");
  }
};

// Run the seed script
seedBooks();

