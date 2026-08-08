// ============================================================
// API Service
// ============================================================
// This service uses Axios to communicate with the backend API.
// All API calls are centralized here, making it easy to update
// the base URL or add authentication headers later.
// ============================================================

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ============================================================
// Books API
// ============================================================

export const getBooks = async (search = "", category = "") => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  const response = await api.get("/books", { params });
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/books/categories");
  return response.data;
};

// ============================================================
// Dashboard & Reports API
// ============================================================

export const getDashboardStats = async () => {
  const response = await api.get("/books/stats/dashboard");
  return response.data;
};

export default api;
