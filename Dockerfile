# Stage 1: Build the Next.js Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend source and build static export
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Go Backend
FROM golang:1.23-alpine AS backend-builder
WORKDIR /app/backend
# Copy go.mod and go.sum and download dependencies
COPY backend/go.mod backend/go.sum ./
RUN go mod download
# Copy the rest of the backend source and build the binary
COPY backend/ ./
RUN go build -o server ./cmd/server/main.go

# Stage 3: Final Production Image
FROM alpine:latest
WORKDIR /app

# Install basic compilers for local execution in the container
# If the container lacks these, the Godbolt fallback API will seamlessly take over!
RUN apk add --no-cache gcc g++ python3 nodejs bash

# Copy the frontend static build (out folder)
COPY --from=frontend-builder /app/frontend/out ./frontend/out

# Copy the compiled Go binary
COPY --from=backend-builder /app/backend/server ./server

# Render dynamically assigns a PORT environment variable, defaulting to 8080
ENV PORT=8080
EXPOSE ${PORT}

# Run the Go server (which serves both the API and the static frontend)
CMD ["./server"]
