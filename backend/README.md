# Personal Blog Backend

This is the Go backend for the Personal Blog application, built with Gin and GORM, using PostgreSQL as the database and Cloudflare R2 for object storage.

## 🛠 Prerequisites

- **Go**: 1.22+
- **Database**: PostgreSQL 14+
- **Object Storage**: Cloudflare R2 (Compatible with AWS S3 API)

## 🚀 Quick Start (Local Development)

### 1. Configure Database, R2 and Auth
Copy `config.example.yaml` to `config.yaml` and fill in real values:
```yaml
server:
  port: ":8080"

database:
  host: "localhost"
  port: "5432"
  user: "postgres"
  password: "your_password"
  dbname: "blog_db"
  sslmode: "disable"

r2:
  account_id: "<your-cloudflare-account-id>"
  access_key_id: "<your-r2-access-key-id>"
  secret_access_key: "<your-r2-secret-access-key>"
  bucket_name: "<your-bucket-name>"
  public_domain: "https://your-custom-domain.com" # No trailing slash

auth:
  jwt_secret: "<strong-random-secret-at-least-32-chars>"
  # Optional bootstrap admin on first startup:
  initial_admin_username: ""
  initial_admin_email: ""
  initial_admin_password: ""

cors:
  allowed_origins:
    - "http://localhost:3000"
```

If `initial_admin_*` is set, backend will create that admin only when the username does not exist.
`cors.allowed_origins` should contain your frontend origins (no wildcard).

### 2. Run Database Migrations
Initialize the database schema using `psql` or `golang-migrate`.
```bash
# Using psql (Simple)
psql -U postgres -d blog_db -f migrations/000001_init_schema.up.sql
```

### 3. Start the Server
```bash
go run cmd/main.go
```
The server will start on port specified in `config.yaml` (default `:8080`).

---

## 📦 Deployment Guide

### Configuration via Environment Variables
For production, it is recommended to override sensitive configuration using environment variables or a secure `config.yaml`.
The application uses `viper`, so specific environment mapping might need setup, but typically you build a production `config.yaml` and mount it to the application.
Examples: `AUTH_JWT_SECRET`, `AUTH_INITIAL_ADMIN_USERNAME`, `AUTH_INITIAL_ADMIN_EMAIL`, `AUTH_INITIAL_ADMIN_PASSWORD`.

### Cloudflare R2 Setup
To enable image uploads:
1.  Create a **R2 Bucket** in Cloudflare Dashboard.
2.  Create **R2 API Tokens** with `Object Read & Write` permissions.
3.  (Recommended) Connect a **Custom Domain** to your R2 bucket for public access to images.
4.  Fill in the `r2` section in `config.yaml` with these credentials.

### Deploy to Remote Server
1.  **Build Binary**:
    ```bash
    GOOS=linux GOARCH=amd64 go build -o server cmd/main.go
    ```
2.  **Transfer Files**: Upload `server` binary and secure `config.yaml` to your server.
3.  **Run**: `./server` (Use Systemd or Docker for process management).

---

## 📑 API Documentation

### Public Endpoints

| Method | Endpoint | Description | Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/ping` | Health check | - |
| `POST` | `/login` | Admin login | Body: `{username, password}` |
| `GET` | `/posts` | List published posts | `page` (>=1), `pageSize` (1-50), `type` (article/plog/project), `sub_type` (tech/life) |
| `GET` | `/posts/:id` | Get post details | - |

### Admin Endpoints (Protected)
*Requires `Authorization: Bearer <token>` header or `token` cookie.*

| Method | Endpoint | Description | Body / Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/check` | Verify auth token | - |
| `GET` | `/admin/stats` | Dashboard statistics | - |
| `GET` | `/admin/posts` | List all posts (drafts & published) | `page` (>=1), `pageSize` (1-100) |
| `POST` | `/admin/posts` | Create new post | JSON Post Object |
| `PUT` | `/admin/posts/:id` | Update existing post | JSON Post Object |
| `DELETE` | `/admin/posts/:id` | Delete post | - |
| `POST` | `/admin/upload` | Upload image to R2 | Multipart Form: `file` |

### Post Object Structure (Example)
```json
{
  "type": "article",
  "sub_type": "tech",
  "title": "My New Post",
  "summary": "This is a summary...",
  "status": "published", // or "draft"
  "content": { ...Tiptap JSON Content... }
}
```

---

## 🐳 Docker
Build and run using Docker:
```bash
docker build -t blog-backend .
docker run -p 8080:8080 -v $(pwd)/config.yaml:/app/config.yaml blog-backend
```
