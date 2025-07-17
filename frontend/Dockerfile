# Base image for Node.js
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Build the Next.js app
RUN npm run build

# Serve the built app
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm install -g serve
CMD ["serve", "-s", "out", "-l", "3000"]
