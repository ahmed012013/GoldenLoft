FROM node:18-alpine

RUN apk add --no-cache openssl


WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

# Install all dependencies (including workspaces)
RUN npm ci

# Copy source code
COPY backend backend
COPY shared shared

# Build the backend
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]
