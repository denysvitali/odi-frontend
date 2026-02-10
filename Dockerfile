# Build stage
FROM node:lts-alpine AS builder

# Install pnpm
RUN npm i -g pnpm

WORKDIR /app

# Copy only package files for caching
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom entrypoint if needed (keeping existing)
COPY ./docker/entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
