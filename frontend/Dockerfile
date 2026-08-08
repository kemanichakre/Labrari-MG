# ============================================================
# Frontend Dockerfile
# ============================================================
# Multi-stage build:
#   1. Build stage: Compile React app with Node.js
#   2. Production stage: Serve built files with Nginx
#
# Why two stages?
#   - Node.js image is large (~1GB) because it has build tools
#   - Nginx image is small (~20MB) for serving static files
#   - We only need the built files (in /build) in production
# ============================================================

# ---- Stage 1: Build the React App ----
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build for production
COPY . .
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Copy the built React app from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Nginx starts automatically (default command)
CMD ["nginx", "-g", "daemon off;"]

