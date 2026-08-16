#!/usr/bin/env bash
set -e

echo "===================================================="
echo "   Code Task IDE — macOS Local Builder              "
echo "===================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ Architecture: $(uname -m)"

# 1. Setup Engine & Embed Agent
echo ""
echo ">>> Step 1: Setting up Engine and Embedding Agent..."
node scripts/setup.mjs

# 2. Compile & Package
echo ""
echo ">>> Step 2: Compiling & Packaging macOS App..."
if [ "$(uname -m)" = "arm64" ]; then
    node scripts/build.mjs --target=darwin-arm64
else
    node scripts/build.mjs --target=darwin-x64
fi

echo ""
echo "🎉 [DONE] Code Task IDE for macOS built successfully!"
