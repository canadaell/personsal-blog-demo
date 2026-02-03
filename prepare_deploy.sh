#!/bin/bash
set -e

# Configuration
DIST_DIR="deploy_dist"
SERVER_USER="opc" # Example, user should change
SERVER_IP="your_server_ip" # Example

echo "cleaning up old dist..."
rm -rf "$DIST_DIR"
mkdir "$DIST_DIR"

echo "=========================================="
echo "1. Building Backend (Go) for Linux..."
echo "=========================================="
cd backend
GOOS=linux GOARCH=amd64 go build -o backend_server ./cmd/main.go
# Copy config and binary
cp backend_server "../$DIST_DIR/"
cp config.yaml "../$DIST_DIR/"
cd ..

echo "=========================================="
echo "2. Building Frontend (Next.js)..."
echo "=========================================="
cd frontend
# Install deps if needed (assuming done)
# npm install
npm run build

echo "Preparing Frontend Standalone..."
# Create directory structure in dist
mkdir -p "../$DIST_DIR/frontend"

# Copy standalone build
# Note: Dependent on how Next.js standalone is generated. 
# Usually it's in .next/standalone
if [ -d ".next/standalone" ]; then
    cp -r .next/standalone/* "../$DIST_DIR/frontend/"
else
    echo "Error: .next/standalone not found. Ensure output: 'standalone' is in next.config.ts"
    exit 1
fi

# Copy static assets (Required for standalone)
# public -> frontend/public
# .next/static -> frontend/.next/static
cp -r public "../$DIST_DIR/frontend/public"
mkdir -p "../$DIST_DIR/frontend/.next"
cp -r .next/static "../$DIST_DIR/frontend/.next/static"

cd ..

echo "=========================================="
echo "3. Copying Database Config..."
echo "=========================================="
cp docker-compose.db.yml "$DIST_DIR/"

echo "=========================================="
echo "Build Complete! Artifacts are in '$DIST_DIR/'"
echo "=========================================="
echo "Instructions:"
echo "1. Upload '$DIST_DIR' to your server."
echo "   Example: scp -r $DIST_DIR user@server-ip:~/"
echo "2. On Server:"
echo "   cd $DIST_DIR"
echo "   docker-compose -f docker-compose.db.yml up -d  (Start DB)"
echo "   ./backend_server &  (Start Backend)"
echo "   cd frontend && node server.js  (Start Frontend)"
echo "=========================================="
