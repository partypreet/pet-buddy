# 🚀 Bunny Buddy Deployment Guide

## Quick Start - GitHub Pages Deployment

### Prerequisites
- GitHub account
- Git installed on your computer
- Node.js and npm installed

### Step-by-Step Instructions

#### 1️⃣ Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **+** icon in the top right → **New repository**
3. Repository name: `bunny-buddy`
4. Description: "Virtual pet rabbit game"
5. Keep it **Public** (required for free GitHub Pages)
6. **DO NOT** check "Add a README file"
7. Click **Create repository**

#### 2️⃣ Prepare Your Local Files

1. Download all the project files to a folder on your computer
2. Open `package.json` in a text editor
3. Find this line:
   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/bunny-buddy",
   ```
4. Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username
5. Save the file

#### 3️⃣ Deploy from Command Line

Open your terminal/command prompt and run:

```bash
# Navigate to the bunny-buddy folder
cd path/to/bunny-buddy

# Install dependencies (first time only)
npm install

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Bunny Buddy virtual pet game"

# Connect to GitHub (replace YOUR_GITHUB_USERNAME)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bunny-buddy.git

# Push to GitHub
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
npm run deploy
```

#### 4️⃣ Configure GitHub Pages

1. Go to your repository: `https://github.com/YOUR_GITHUB_USERNAME/bunny-buddy`
2. Click **Settings** (gear icon at top)
3. Scroll down and click **Pages** in the left sidebar
4. Under "Source":
   - Branch: Select `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

#### 5️⃣ Wait and Visit

- GitHub takes 1-5 minutes to build your site
- Visit: `https://YOUR_GITHUB_USERNAME.github.io/bunny-buddy`
- 🎉 Your game is live!

---

## 📱 Mobile Testing

### Test on Your Phone

1. Open the deployed URL on your mobile browser
2. For iOS: Tap the Share button → **Add to Home Screen**
3. For Android: Tap menu → **Add to Home screen**
4. Now you can play Bunny Buddy like a native app!

### Mobile Features
- ✅ Touch controls work perfectly
- ✅ Drag and drop food/water items
- ✅ Responsive layout adapts to screen size
- ✅ No accidental zooming
- ✅ Saves progress locally

---

## 🔄 Making Updates

After making changes to the code:

```bash
# Add changes
git add .

# Commit with a message
git commit -m "Updated bunny animations"

# Push to GitHub
git push

# Redeploy to GitHub Pages
npm run deploy
```

Your site will update in 1-5 minutes!

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org)

### Problem: Page shows 404
**Solutions**:
1. Wait 5 minutes - GitHub needs time to build
2. Check Settings → Pages shows green checkmark
3. Verify branch is set to `gh-pages`
4. Clear browser cache and reload

### Problem: Game doesn't load
**Solutions**:
1. Check browser console (F12) for errors
2. Verify `homepage` in package.json matches your GitHub username
3. Try incognito/private browsing mode

### Problem: Can't push to GitHub
**Solutions**:
1. Check you're logged into GitHub
2. Verify repository exists
3. Try: `git remote -v` to check remote URL
4. May need to authenticate with GitHub token

### Problem: Styles look broken
**Solution**: Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)

---

## 📁 Project Structure

```
bunny-buddy/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── index.js            # React entry point
│   └── BunnyBuddy.jsx      # Main game component
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
```

---

## 🌐 Alternative Deployment Options

### Netlify (Easier alternative)
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build command: `npm run build`
4. Publish directory: `build`
5. Click Deploy!

### Vercel
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click Deploy!

---

## 💡 Tips

- **Custom Domain**: You can add a custom domain in GitHub Pages settings
- **HTTPS**: GitHub Pages automatically serves over HTTPS
- **Analytics**: Add Google Analytics to track visitors
- **PWA**: The game can be installed as a Progressive Web App
- **Updates**: Use semantic versioning for your commits

---

## 🎮 After Deployment

Share your game:
- Tweet the link with #BunnyBuddy
- Share on Reddit, Discord, etc.
- Send to friends and family
- Get feedback and iterate!

---

## 📞 Need Help?

- Check the [GitHub Pages docs](https://docs.github.com/en/pages)
- Review the README.md for game features
- Open an issue on GitHub for bugs

Happy deploying! 🐰💕
