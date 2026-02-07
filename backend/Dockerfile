# Backend Dockerfile for GoldenLoft
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files from backend to root to install all dependencies at parent level
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies (will be in /app/node_modules)
RUN npm ci --only=production && npm cache clean --force

# Install dev dependencies for building
FROM base AS builder
WORKDIR /app

# Install all dependencies including devDependencies at root
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

# Copy backend and shared directories maintaining relative structure
COPY backend ./backend/
COPY shared ./shared/

# Switch to backend directory for Prisma and Build
WORKDIR /app/backend
# Generate Prisma Client (generated into /app/node_modules)
RUN npx prisma generate
# Build the application using npx nest directly to skip formatting step
RUN npx nest build

# Production image
FROM base AS runner
WORKDIR /app/backend

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nestjs

# Copy necessary files from deps and builder
# Note: node_modules is at /app/node_modules
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ../node_modules
COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/backend/package*.json ./

# Create uploads directory
RUN mkdir -p /app/backend/uploads/birds && \
  chown -R nestjs:nodejs /app/backend/uploads

USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/backend/src/main.js"]
