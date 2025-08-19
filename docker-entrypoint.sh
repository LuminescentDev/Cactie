#!/bin/sh
set -e

echo "Starting application setup..."

# Generate Prisma client (in case it wasn't properly copied)
echo "Generating Prisma client..."
pnpm exec prisma generate

echo "Database setup complete, starting application..."

# Start the application
exec "$@"
