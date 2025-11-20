#!/bin/bash

# Restart Development Server Script
# This script properly restarts the Next.js development server

echo "🔄 Restarting Velora Development Server..."
echo ""

# Kill any running Next.js processes
echo "1️⃣ Stopping any running Next.js processes..."
pkill -f "next dev" 2>/dev/null || echo "   No running processes found"
sleep 1

# Clear Next.js cache
echo ""
echo "2️⃣ Clearing Next.js cache..."
rm -rf .next
echo "   ✅ Cache cleared"

# Clear node_modules cache (optional, uncomment if needed)
# echo ""
# echo "3️⃣ Clearing node_modules cache..."
# rm -rf node_modules/.cache
# echo "   ✅ Cache cleared"

echo ""
echo "3️⃣ Starting development server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Server will start at: http://localhost:3000"
echo "  Press Ctrl+C to stop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the development server
npm run dev
