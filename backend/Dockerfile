# Build Stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/main.go

# Run Stage
FROM alpine:latest

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/config.yaml . 
# 注意：config.yaml 如果不同环境不同，可以用 config map 或 环境变量覆盖

EXPOSE 8080

CMD ["./main"]
