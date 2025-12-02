# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm 8 (compatible with lockfileVersion 6.0)
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm 8 (compatible with lockfileVersion 6.0)
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3333

# Start the application
CMD ["node", "build/bin/server.js"]
