# Deploy NexToddlers to GitHub Pages

## 📋 Prerequisites
- GitHub account
- Git installed on your computer

## 🚀 Deployment Steps

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `nextoddlers` (or any name you prefer)
3. Description: "English learning app for toddlers"
4. Make it **Public** (required for free GitHub Pages)
5. Click "Create repository"

### 2. Initialize Git and Push Code
Open terminal in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - NexToddlers PWA"

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/chwellofficial-source/nextoddlers.git
# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Deploy to GitHub Pages
After pushing to GitHub, run:

```bash
npm run deploy
```

This will:
- Build your app
- Deploy to GitHub Pages automatically
- Create a `gh-pages` branch

### 4. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source", select branch: `gh-pages`
5. Click "Save"

### 5. Access Your App
Your app will be available at:
```
https://YOUR_USERNAME.github.io/nextoddlers/
```

Wait 2-3 minutes for the first deployment to complete.

## 📱 Installing as PWA

### On Mobile (iOS/Android):
1. Open the GitHub Pages URL in Safari (iOS) or Chrome (Android)
2. Tap the Share button (iOS) or Menu (Android)
3. Tap "Add to Home Screen"
4. The app will install like a native app!

### On Desktop:
1. Open the GitHub Pages URL in Chrome/Edge
2. Click the install icon (⊕) in the address bar
3. Click "Install"

## 🔄 Update Your App

Whenever you make changes:

```bash
# Save your changes
git add .
git commit -m "Description of changes"
git push

# Deploy new version
npm run deploy
```

## 🎯 Custom Domain (Optional)

If you want a custom domain like `nextoddlers.com`:

1. Buy a domain from Namecheap, Google Domains, etc.
2. Add a file named `CNAME` to `/public` folder with your domain
3. Configure DNS settings in your domain provider
4. Follow GitHub's custom domain guide

## ⚠️ Important Notes

- **Base Path**: The app is configured with base: '/nextoddlers/'
- If you name your repo differently, update `base` in `vite.config.ts`
- First deployment takes 2-3 minutes
- Updates are usually instant

## 🐛 Troubleshooting

**App shows 404 error:**
- Check that GitHub Pages is enabled in Settings
- Verify the `gh-pages` branch exists
- Wait a few minutes after first deployment

**App doesn't load correctly:**
- Verify the repo name matches the `base` in `vite.config.ts`
- Clear browser cache and reload

**PWA not installing:**
- Ensure you're using HTTPS (GitHub Pages uses HTTPS automatically)
- Check that icons and manifest are loading correctly

## 📞 Need Help?
Contact: Merve Cabezas
Phone: +90 (531) 859 84 94
