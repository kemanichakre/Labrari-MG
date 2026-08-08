# 📚 Library Pro — Professional Library Management System

A full-stack library management application built with **React 19**, **Node.js/Express**, and **MySQL**. Features a modern UI with dark mode, analytics dashboard, card catalog view, and full CRUD operations.

---

## ✨ Features

- **Dashboard** — Real-time statistics with pie charts (category distribution) and bar charts (recent activity)
- **Book Management** — Full CRUD (Create, Read, Update, Delete) with form validation
- **Search & Filter** — Real-time search by title/author with 300ms debounce, filter by category
- **Table & Card Views** — Toggle between traditional table view and modern card catalog view
- **Dark Mode** — Full dark theme with CSS variables, persisted to localStorage
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Pagination** — 10/20/50 items per page with page navigation
- **Toast Notifications** — Animated slide-in success/error/info notifications
- **Confirm Dialogs** — Custom modal confirmations for destructive actions
- **Reports & Analytics** — Category distribution charts and inventory status
- **CSV Export** — Export book inventory to CSV from the Reports page
- **Animations** — Smooth page transitions and hover effects with Framer Motion
- **Docker Support** — Ready-to-deploy with Docker Compose

---

## 🏗️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, React Router 7, Recharts     |
| Backend    | Node.js, Express 4, mysql2             |
| Database   | MySQL 8.0                               |
| Styling    | CSS with Custom Properties (Dark Mode) |
| Animations | Framer Motion                           |
| Deploy     | Docker, Nginx (frontend)               |

---

## 🚀 Getting Started

### Option 1: Local Development (Without Docker)

#### Prerequisites

- **Node.js** v18+
- **MySQL** 8.0 running locally
- **npm** or **yarn**

#### Step 1: Setup Database

```bash
# Run the schema file to create the database and tables
mysql -u root -p < database/schema.sql
```

#### Step 2: Configure Backend

```bash
cd backend

# Create a .env file
echo "DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=library_db
DB_PORT=3306
PORT=5000" > .env

# Install dependencies
npm install

# Start backend (runs on http://localhost:5000)
npm run dev
```

#### Step 3: Configure Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start frontend (runs on http://localhost:3000)
npm start
```

> The frontend's `package.json` includes `"proxy": "http://localhost:5000"` so API calls are proxied automatically.

#### Or Use the start.bat Script

Simply double-click `start.bat` (Windows) to start both servers automatically.

### Option 2: Docker Deployment

```bash
# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000/api
```

To stop:
```bash
docker-compose down
```

To remove volumes (reset database):
```bash
docker-compose down -v
```

---

## 📖 API Reference

### Base URL

```
http://localhost:5000/api
```

### Endpoints

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/api/health`                | Health check                         |
| GET    | `/api/books`                 | Get all books (optional `?search=&category=`) |
| GET    | `/api/books/:id`             | Get a single book by ID              |
| POST   | `/api/books`                 | Create a new book                    |
| PUT    | `/api/books/:id`             | Update an existing book              |
| DELETE | `/api/books/:id`             | Delete a book                        |
| GET    | `/api/books/categories`      | Get all distinct categories          |
| GET    | `/api/books/stats/dashboard` | Get dashboard statistics             |

### Request Body (POST/PUT)

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "category": "Fiction",
  "published_year": 1925,
  "quantity": 3,
  "available_quantity": 3
}
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Book added successfully!"
}
```

---

## 📁 Project Structure

```
labrari-mg/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   └── bookController.js   # Request handlers
│   ├── middleware/
│   │   └── validation.js       # Input validation & error handlers
│   ├── models/
│   │   └── book.js             # Database queries
│   ├── routes/
│   │   └── books.js            # API route definitions
│   ├── server.js               # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppFooter.js    # Footer with version info
│   │   │   ├── BookCatalog.js  # Card grid view
│   │   │   ├── BookForm.js     # Add/Edit form
│   │   │   ├── BookItem.js     # Table row component
│   │   │   ├── BookList.js     # Table view
│   │   │   ├── ConfirmDialog.js # Custom confirm modal
│   │   │   ├── Layout.js       # Main layout with sidebar
│   │   │   ├── Pagination.js   # Page navigation
│   │   │   ├── Sidebar.js      # Navigation sidebar
│   │   │   └── Toast.js        # Animated notifications
│   │   ├── hooks/
│   │   │   └── useDebounce.js  # 300ms debounce hook
│   │   ├── pages/
│   │   │   ├── BooksPage.js    # Book listing page
│   │   │   ├── BookDetailsPage.js
│   │   │   ├── DashboardPage.js # Analytics dashboard
│   │   │   ├── ReportsPage.js  # Reports & charts
│   │   │   └── SettingsPage.js # App configuration
│   │   ├── services/
│   │   │   └── api.js          # Axios API service
│   │   ├── App.js              # Root component with routing
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   └── schema.sql              # MySQL schema with indexes
├── docker-compose.yml
├── start.bat                   # Windows local dev launcher
└── README.md
```

---

## 🎨 Features Showcase

### Dashboard
- 6 stat cards with icons (Total Books, Copies, Available, Issued, Authors, Categories)
- Donut chart showing book distribution by category
- Bar chart showing books added in the last 7 days
- Recent books section with quick links

### Book Catalog View
- Card-based grid layout (responsive: 4 cols desktop, 2 tablet, 1 mobile)
- Auto-generated gradient covers with book title initials
- Category badges with dynamic colors
- Availability status indicator
- Quick Edit/Delete actions

### Dark Mode
- Toggle in sidebar
- Persisted to localStorage
- Smooth transition between themes
- Proper contrast in all components

---

## 🛠️ Development

### Run Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Linting

```bash
npm run lint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push: `git push origin feature/my-feature'
5. Open a Pull Request

---

## 📄 License

MIT License — see LICENSE file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev)
- [Recharts](https://recharts.org)
- [Framer Motion](https://www.framer.com/motion)
- [Express](https://expressjs.com)
- [MySQL](https://www.mysql.com)

