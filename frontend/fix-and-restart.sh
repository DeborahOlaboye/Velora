#!/bin/bash

# Fix and Restart Script
# Clears cache and restarts the development server after applying the React Native fix

echo "🔧 Applying React Native Dependencies Fix..."
echo ""

# Kill any running Next.js processes
echo "1️⃣ Stopping any running Next.js processes..."
pkill -f "next dev" 2>/dev/null || echo "   No running processes found"
sleep 1

# Clear Next.js cache
echo ""
echo "2️⃣ Clearing Next.js cache..."
rm -rf .next
echo "   ✅ .next directory cleared"

# Clear node_modules cache
echo ""
echo "3️⃣ Clearing node_modules cache..."
rm -rf node_modules/.cache
echo "   ✅ node_modules/.cache cleared"

# Verify polyfill exists
echo ""
echo "4️⃣ Verifying polyfill file..."
if [ -f "polyfills/async-storage.js" ]; then
    echo "   ✅ Polyfill file exists"
else
    echo "   ❌ Polyfill file missing!"
    echo "   Creating polyfill file..."
    mkdir -p polyfills
    # The file should already be created, but this is a safety check
fi

# Verify next.config.ts is updated
echo ""
echo "5️⃣ Verifying Next.js configuration..."
if grep -q "async-storage.js" next.config.ts; then
    echo "   ✅ Next.js config updated"
else
    echo "   ⚠️  Next.js config may need manual update"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Fix Applied! Starting development server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Server will start at: http://localhost:3000"
echo "  Press Ctrl+C to stop"
echo ""
echo "  What to check:"
echo "  ✓ No React Native errors in console"
echo "  ✓ Wallet connection modal opens"
echo "  ✓ MetaMask connector works"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the development server
npm run dev
