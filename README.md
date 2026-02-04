# Personal Blog Demo

> A modern, full-stack personal blogging platform designed with a microservices-ready architecture, focusing on performance, scalability, and ease of deployment.

## Project Overview

This project is a comprehensive demonstration of a full-stack web application. It adopts a **Monorepo** architecture to manage both frontend and backend codebases efficiently. The goal is to build a production-grade personal blog that includes:

-   **High Performance**: Powered by a Go backend.
-   **Modern UI**: Responsive and dynamic frontend experience.
-   **DevOps Best Practices**: Containerized with Docker, automated CI/CD pipelines, and deployed behind a secure Reverse Proxy (Nginx) with HTTPS.

## Technology Stack

### Backend (API Service)
-   **Language**: [Go](https://go.dev/) (Golang)
-   **Framework**: [Gin](https://github.com/gin-gonic/gin) - A HTTP web framework written in Go (Golang). It features a Martini-like API with much better performance.
-   **Database**: [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database.
-   **ORM**: [GORM](https://gorm.io/) - The fantastic ORM library for Golang.
-   **Configuration**: [Viper](https://github.com/spf13/viper) - Go configuration with fangs.

### Frontend (Client App)
-   **Framework**: [Next.js](https://nextjs.org/) - The React Framework for the Web.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.

### Infrastructure & DevOps
-   **Containerization**: Docker & Docker Compose
-   **Web Server**: Nginx (Reverse Proxy)
-   **CI/CD**: GitHub Actions – Automated build and deployment pipeline (planned), triggered on main branch updates.

## Features (Planned)

-   [ ] **User Authentication**: Admin login and session management.
-   [ ] **Content Management**: Create, edit, and delete blog posts (Markdown support).
-   [ ] **Public View**: Article listing, reading mode, and comments.
-   [ ] **Media Management**: Image upload and hosting integration.
-   [ ] **SEO Optimization**: Server-side rendering (if applicable) and meta tag management.

## Project Structure

```text
.
├── backend/        # Go backend (Gin + GORM)
│   ├── cmd/        # Application entrypoint
│   ├── internal/   # Business logic
│   └── config/     # Configuration
├── frontend/       # Next.js frontend
├── docker/         # Docker & Nginx configuration
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
-   [Go](https://go.dev/dl/) (v1.20+)
-   [Docker](https://www.docker.com/) 
```bash
docker compose up -d
```
-   Node.js (for frontend)

### Development Setup

#### Deployment Overview

The application is deployed on a self-managed server. All services are containerized using Docker and orchestrated via Docker Compose. Nginx acts as a reverse proxy, routing traffic to frontend and backend services and handling HTTPS termination.

PostgreSQL data is persisted using server-attached block storage, while user-uploaded images are stored in Cloudflare R2 and delivered via CDN.

#### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Run the server:
   ```bash
   go run cmd/main.go
   ```

#### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```


## Manual Deployment Guide

Since the project uses a separate domain for the backend API, the frontend needs to be built with the correct environment variable baked in.

### 1. Local Machine: Build & Transfer

Run these commands in the root directory of the project:

**Step 1.1: Build Frontend Image**
Ensure you inject the correct production API URL.
```bash
docker build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_API_URL=https://api.zhouming.de \
  --no-cache \
  -t blog-frontend ./frontend
```

**Step 1.2: Save & Compress Image**
Export the built image to a gzipped tarball.
```bash
docker save blog-frontend | gzip > blog-frontend.tar.gz
```

**Step 1.3: Transfer to Server**
Copy the file to your server (replace `ubuntu@213.32.18.39` with your actual user/IP).
```bash
scp blog-frontend.tar.gz ubuntu@213.32.18.39:~/
```

### 2. Remote Server: Load & Restart

SSH into your server and run:

```bash
# 1. Load the new image
docker load < blog-frontend.tar.gz

# 2. Go to your deployment directory
cd ~/blog_deploy

# 3. Force recreate the frontend container
docker compose up -d --force-recreate frontend
```

### 3. Backend Deployment (If needed)

If you have updated the Go backend code:

**Step 3.1: Build & Transfer**
```bash
# Build
docker build --platform linux/amd64 -t blog-backend ./backend

# Save & Compress
docker save blog-backend | gzip > blog-backend.tar.gz

# Transfer
scp blog-backend.tar.gz ubuntu@213.32.18.39:~/
```

**Step 3.2: Server - Load & Restart**
```bash
# Load image
docker load < blog-backend.tar.gz

# Restart service
cd ~/blog_deploy
docker compose up -d --force-recreate backend
```

---
*Created by Mingde Zhou*
