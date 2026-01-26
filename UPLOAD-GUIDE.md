# 🐰 Upload Bunny Buddy to GitHub (Web Interface Method)

This is the EASIEST way to get your game on GitHub without using command line!

## 📦 Step 1: Download the Project

You should have received a file called: **bunny-buddy-project.zip**

1. Download this ZIP file
2. Extract/unzip it on your computer
3. You'll see a folder called `bunny-buddy-project` with these files:
   ```
   bunny-buddy-project/
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── index.js
   │   └── BunnyBuddy.jsx
   ├── .gitignore
   ├── DEPLOYMENT.md
   ├── deploy.sh
   ├── package.json
   └── README.md
   ```

## 🌐 Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **+** button in the top right corner
3. Select **New repository**
4. Fill in:
   - **Repository name:** `bunny-buddy`
   - **Description:** "Virtual pet rabbit game 🐰"
   - **Public** (must be public for free GitHub Pages)
   - ⚠️ **DO NOT** check "Add a README file"
   - ⚠️ **DO NOT** check "Add .gitignore"
   - ⚠️ **DO NOT** add a license
5. Click **Create repository**

## 📤 Step 3: Upload Files via Web Interface

### Method A: Drag and Drop (Recommended)

1. On your new empty repository page, you'll see "Quick setup"
2. Look for the text: **"uploading an existing file"**
3. Click that link OR scroll down and click **"uploading an existing file"**
4. **IMPORTANT:** Before uploading, you need to update one file:
   - Open the `package.json` file in a text editor
   - Find the line: `"homepage": "https://YOUR_GITHUB_USERNAME.github.io/bunny-buddy"`
   - Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username
   - Save the file
5. Now drag ALL the files from the `bunny-buddy-project` folder into the upload area
6. Make sure you're dragging the CONTENTS of the folder, not the folder itself
7. You should see these files being uploaded:
   - `.gitignore`
   - `deploy.sh`
   - `DEPLOYMENT.md`
   - `package.json`
   - `README.md`
   - `public/` folder
   - `src/` folder
8. Scroll down and click **Commit changes**

### Method B: GitHub Desktop (Alternative)

1. Download [GitHub Desktop](https://desktop.github.com)
2. Install and sign in
3. Click **File** → **Add Local Repository**
4. Select your `bunny-buddy-project` folder
5. Click **Publish repository**
6. Make sure "Keep this code private" is UNCHECKED
7. Click **Publish repository**

## 🚀 Step 4: Deploy to GitHub Pages

Now you have two options:

### Option A: Using GitHub Actions (Easiest!)

1. Go to your repository: `https://github.com/YOUR_USERNAME/bunny-buddy`
2. Click **Actions** tab at the top
3. Click **"set up a workflow yourself"**
4. Delete everything and paste this:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

5. Click **Commit changes**
6. The deployment will start automatically!
7. Wait 2-3 minutes for it to finish

### Option B: Using Your Computer Terminal

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Navigate to your project folder:
   ```bash
   cd path/to/bunny-buddy-project
   ```
3. Run the deployment script:
   ```bash
   # Mac/Linux:
   ./deploy.sh
   
   # Windows:
   bash deploy.sh
   ```
4. Follow the prompts!

## ⚙️ Step 5: Enable GitHub Pages

1. Go to your repository
2. Click **Settings** (gear icon)
3. Click **Pages** in the left sidebar
4. Under "Source":
   - Branch: Select **`gh-pages`**
   - Folder: **`/ (root)`**
5. Click **Save**

## 🎉 Step 6: Visit Your Game!

Your game will be live at:
```
https://YOUR_USERNAME.github.io/bunny-buddy
```

⏱️ **Note:** It takes 2-5 minutes for GitHub Pages to build your site the first time.

## 📱 Test on Mobile

1. Open the URL on your phone's browser
2. **iOS:** Tap Share → Add to Home Screen
3. **Android:** Tap Menu → Add to home screen
4. Now you have a Bunny Buddy app icon! 📱

## 🔄 Making Updates Later

When you want to update your game:

### Via Web Interface:
1. Go to your repository
2. Click on the file you want to edit
3. Click the pencil icon (Edit)
4. Make changes
5. Scroll down and click **Commit changes**
6. GitHub Actions will automatically redeploy!

### Via Computer:
1. Make changes to your local files
2. Upload the changed files again
3. OR use the deploy.sh script

## ❓ Troubleshooting

### "404 - Page not found"
- Wait 5 minutes and try again
- Check Settings → Pages shows a green checkmark
- Make sure branch is set to `gh-pages`

### "Site not building"
- Check Actions tab for errors
- Make sure package.json has correct homepage URL

### "Files not uploading"
- Try uploading in smaller batches
- Make sure you're uploading file contents, not the folder
- Try using GitHub Desktop instead

## 🎊 You're Done!

Your Bunny Buddy game is now:
- ✅ Live on the internet
- ✅ Playable on any device
- ✅ Shareable with friends
- ✅ Installable as a mobile app

Share your creation! 🐰💕

---

**Need more help?** Check the DEPLOYMENT.md file for detailed instructions!
