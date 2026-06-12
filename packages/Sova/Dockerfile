# Use the official Node.js 23 Alpine image
FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port (if your bot has a web server)
EXPOSE 3000

# Start the bot
CMD ["bun", "start"]
