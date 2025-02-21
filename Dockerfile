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
# Copy only production dependencies
COPY package.json pnpm-lock.yaml ./
# Copy prisma schema first
COPY --from=builder /app/prisma ./prisma
# Copy built files
COPY --from=builder /app/dist ./dist
# Copy the Prisma client from builder
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Install production dependencies
RUN pnpm install --frozen-lockfile --prod
# Expose port
EXPOSE 3000
CMD ["node", "dist/index.js"]
