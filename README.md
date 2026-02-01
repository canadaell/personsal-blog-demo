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

---
*Created by Mingde Zhou*
