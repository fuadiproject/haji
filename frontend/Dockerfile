# Multi-stage build untuk production
FROM node:20-alpine AS base

# Install dependencies yang diperlukan untuk build
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (termasuk devDependencies untuk build)
RUN npm ci && npm cache clean --force

# Build stage
FROM base AS builder
COPY . .

# Set environment variables for build time
ARG API_BASE_URL
ARG API_BPH_URL
ENV API_BASE_URL=$API_BASE_URL
ENV API_BPH_URL=$API_BPH_URL

RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init untuk proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", ".output/server/index.mjs"]
