# Build Stage
FROM node:20-alpine AS builder
RUN npm install -g pnpm@10.4.0
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml ./
# Copy Prisma schema
COPY prisma ./prisma
# Install dependencies
RUN pnpm install --frozen-lockfile
# Generate Prisma client
RUN pnpm dlx prisma generate
# Copy source files
COPY tsconfig.json ./
COPY src ./src 
# Build the project
RUN pnpm build

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm@10.4.0
# Copy package files and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma
# Install production dependencies
RUN pnpm install --frozen-lockfile --prod
# Generate Prisma client in production environment
RUN pnpm dlx prisma generate
# Copy built files
COPY --from=builder /app/dist ./dist
# Expose port
EXPOSE 3000
CMD ["node", "dist/index.js"]
