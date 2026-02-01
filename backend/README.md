# Personal Blog Backend

This is the Go backend for the Personal Blog application, using PostgreSQL as the database.

## 🛠 Prerequisites

- Go 1.25+
- PostgreSQL
- Make (Optional, but recommended for commands)

## 🚀 Quick Start (Local Development)

### 1. Configure Database
Ensure your PostgreSQL service is running and create a database (e.g., `blog_db`).

Update `config.yaml` with your local database credentials:
```yaml
database:
  host: "localhost"
  port: "5432"
  user: "postgres"
  password: "your_password"
  dbname: "blog_db"
  sslmode: "disable"
```

### 2. Run Database Migrations
Before starting the server, you need to initialize the database schema.

**Option A: Using psql (Simple)**
If you have the PostgreSQL client installed:
```bash
# Create the database if it doesn't exist
psql -U postgres -c "CREATE DATABASE blog_db;"

# Import the schema
psql -U postgres -d blog_db -f migrations/000001_init_schema.up.sql
```

**Option B: Using golang-migrate (Recommended for CI/CD)**
Install the tool:
```bash
brew install golang-migrate
```
Run migration:
```bash
migrate -path migrations -database "postgres://postgres:password@localhost:5432/blog_db?sslmode=disable" up
```

### 3. Start the Server
```bash
go run cmd/main.go
```
The server will start on port specified in `config.yaml` (default `:8080`).

---

## 📦 Build for Production

To compile the application into a single binary:

```bash
# General build
go build -o blog-backend cmd/main.go

# Cross-compilation for Linux (common for servers)
GOOS=linux GOARCH=amd64 go build -o blog-backend-linux cmd/main.go
```

## 🚢 Deployment Guide

### Files to Deploy
You need to transfer the following files to your server (e.g., `/opt/blog-backend/`):
1. **Binary**: `blog-backend-linux` (Renamed to `server` or similar)
2. **Config**: `config.yaml` (Ensure production DB credentials are set)
3. **Migrations**: `migrations/` folder (For database initialization)

### Step-by-Step Deployment

1. **Transfer Files**
   Use `scp` to upload files to your server:
   ```bash
   # Example assuming you are in the backend directory
   scp blog-backend-linux user@your-server-ip:/opt/blog-backend/server
   scp config.yaml user@your-server-ip:/opt/blog-backend/
   scp -r migrations user@your-server-ip:/opt/blog-backend/
   ```

2. **Setup on Server**
   SSH into your server and make the binary executable:
   ```bash
   ssh user@your-server-ip
   cd /opt/blog-backend
   chmod +x server
   ```

3. **Initialize Database (First Time Only)**
   Run the migration using `psql` (assuming Postgres is installed on the server):
   ```bash
   psql -U postgres -d blog_db -f migrations/000001_init_schema.up.sql
   ```

4. **Run the Application**
   ```bash
   ./server
   ```
   *Note: For a persistent service, consider using Systemd or Docker.*

---

## 🐳 Docker (Alternative)
You can also use the provided `Dockerfile` to build and run the application in a container.

```bash
docker build -t blog-backend .
docker run -p 8080:8080 --env-file .env blog-backend
```
