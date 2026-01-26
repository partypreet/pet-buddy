#!/bin/bash

# Bunny Buddy - Quick Deployment Script
# This script helps you deploy Bunny Buddy to GitHub Pages

echo "🐰 Bunny Buddy - GitHub Pages Deployment"
echo "=========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username cannot be empty"
    exit 1
fi

# Update package.json with the correct homepage
echo "🔧 Updating package.json with your GitHub username..."
sed -i.bak "s/YOUR_GITHUB_USERNAME/$GITHUB_USERNAME/g" package.json
rm package.json.bak 2>/dev/null || true

echo "✅ Updated homepage to: https://$GITHUB_USERNAME.github.io/bunny-buddy"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Initialize git if not already initialized
if [ ! -d .git ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit - Bunny Buddy virtual pet game"

# Add remote
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$GITHUB_USERNAME/bunny-buddy.git" 2>/dev/null || \
git remote set-url origin "https://github.com/$GITHUB_USERNAME/bunny-buddy.git"

# Create main branch and push
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Push failed. Make sure you've created the repository on GitHub:"
    echo "   https://github.com/new"
    echo ""
    echo "Repository name: bunny-buddy"
    echo "Keep it public and DON'T initialize with README"
    echo ""
    echo "After creating the repository, run this script again."
    exit 1
fi

echo "✅ Pushed to GitHub"
echo ""

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npm run deploy

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo ""
echo "============================================"
echo "🎉 SUCCESS! Bunny Buddy is being deployed!"
echo "============================================"
echo ""
echo "📍 Your game will be available at:"
echo "   https://$GITHUB_USERNAME.github.io/bunny-buddy"
echo ""
echo "⏱️  GitHub Pages takes 1-5 minutes to build"
echo ""
echo "📋 Next steps:"
echo "   1. Go to: https://github.com/$GITHUB_USERNAME/bunny-buddy"
echo "   2. Click Settings → Pages"
echo "   3. Under 'Source', select 'gh-pages' branch"
echo "   4. Click Save"
echo "   5. Wait a few minutes and visit your game!"
echo ""
echo "🐰 Enjoy your Bunny Buddy! 💕"
