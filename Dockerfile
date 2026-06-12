# Switch to the slim Debian-based image
FROM node:23-slim

# Set working directory
WORKDIR /app

# Enable corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (We can drop the child-concurrency since slim has better overhead handling)
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

EXPOSE 3000

CMD ["pnpm", "start"]