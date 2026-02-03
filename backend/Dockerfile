# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -o server cmd/main.go

# Runtime Stage
FROM alpine:latest

WORKDIR /app

# Install certificates for external APIs (like R2)
RUN apk --no-cache add ca-certificates tzdata

# Copy binary from builder
COPY --from=builder /app/server .
# Copy migrations (if needed at runtime)
# COPY --from=builder /app/migrations ./migrations

# Expose port
EXPOSE 8080

# Command to run (expecting config.yaml to be mounted or env vars provided)
CMD ["./server"]
