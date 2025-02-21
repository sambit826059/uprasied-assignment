# Build stage
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

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm@10.4.0

# Copy only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built files and necessary runtime dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma

# Copy environment variables
COPY .env .

EXPOSE 3000

CMD ["node", "dist/index.js"]

