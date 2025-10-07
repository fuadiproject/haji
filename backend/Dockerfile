# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache dumb-init python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Stage 2: Prisma Client Generation
FROM deps AS prisma-builder
COPY prisma ./prisma
RUN npx prisma generate

# Stage 3: Production
FROM node:20-alpine AS runner
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 appuser

# Set working directory
WORKDIR /app

# Copy from previous stages
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=prisma-builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy application source
COPY . .

# Use non-root user
USER appuser

# Environment
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# Expose Express port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node --version || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js", "--mode=api"]