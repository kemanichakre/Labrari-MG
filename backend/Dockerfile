# ============================================================
# Backend Dockerfile
# ============================================================
# Multi-stage build:
#   1. Install dependencies
#   2. Run the Node.js application
#
# Base image: Node.js 18 (Alpine for small size)
# ============================================================

FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for layer caching)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to start the server
CMD ["node", "server.js"]

