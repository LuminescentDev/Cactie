# Use the official Node.js 23 Alpine image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# Enable corepack instead of a global npm install
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --allow-build=@prisma/client,@prisma/engines,bufferutil,prisma,utf-8-validate

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Expose port (if your bot has a web server)
EXPOSE 3000

# Start the bot
CMD ["pnpm", "start"]