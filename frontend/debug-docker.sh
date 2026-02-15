#!/bin/bash

# Script de debug Docker pour identifier le problème yarn.lock

echo "🔍 Debug Docker Build Issues"
echo "=============================="
echo ""

# Check current directory
echo "📁 Current directory:"
pwd
echo ""

# Check if in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    echo "   Run this script from the frontend directory"
    exit 1
fi

# Check files
echo "📋 Files in frontend directory:"
ls -lh package.json yarn.lock 2>/dev/null || echo "⚠️  yarn.lock not found"
echo ""

# Check Dockerfile
echo "📄 Dockerfile content (first 15 lines):"
head -15 Dockerfile
echo ""

# Check .dockerignore
echo "🚫 .dockerignore content:"
if [ -f ".dockerignore" ]; then
    cat .dockerignore
else
    echo "   No .dockerignore file"
fi
echo ""

# Check parent .dockerignore
echo "🚫 Parent .dockerignore content:"
if [ -f "../.dockerignore" ]; then
    cat ../.dockerignore
else
    echo "   No parent .dockerignore file"
fi
echo ""

# Try to build with verbose output
echo "🔨 Attempting Docker build..."
echo ""
docker build --no-cache --progress=plain . 2>&1 | head -50

echo ""
echo "=============================="
echo "✅ Debug complete"
echo ""
echo "💡 Common fixes:"
echo "1. Make sure yarn.lock exists: ls -la yarn.lock"
echo "2. Check .dockerignore doesn't exclude yarn.lock"
echo "3. Try: docker build --no-cache ."
echo "4. Try alternative Dockerfile: docker build -f Dockerfile.flexible ."
