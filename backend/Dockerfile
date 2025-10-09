# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production
FROM node:20-alpine AS production
# Install dumb-init
RUN apk add --no-cache dumb-init
# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY --chown=appuser:nodejs index.js ./
COPY --chown=appuser:nodejs src/ ./src/
COPY --chown=appuser:nodejs prisma/ ./prisma/
# Generate Prisma client
RUN npx prisma generate
# Use non-root user
USER appuser
# Environment
ENV NODE_ENV=production
# Expose port
EXPOSE 3000
# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node --version || exit 1

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "index.js", "--mode=api"]