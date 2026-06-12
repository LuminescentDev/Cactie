# Use the official Bun Alpine image
FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# 1. Copy root workspace files
COPY package.json bun.lock* ./

# 2. Copy package configurations for ALL required workspaces
# This keeps your Docker layers cached perfectly
COPY packages/Sova/package.json ./packages/Sova/
COPY packages/DrizzleSchema/package.json ./packages/DrizzleSchema/

# 3. Install dependencies (Bun will now successfully link the workspaces)
RUN bun install

# 4. Copy the actual source code for everything
COPY . .

# Expose port (if your bot has a web server)
EXPOSE 3000

# 5. Start the bot via the workspace filter
CMD ["bun", "--filter", "Sova", "start:bot"]