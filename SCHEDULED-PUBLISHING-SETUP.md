# Scheduled Blog Publishing Setup Guide

## Overview
Your blog now supports scheduled publishing! Posts with future dates will remain hidden until their publish date, and they'll automatically appear every Wednesday at 7 AM when GitHub Actions triggers a Netlify rebuild.

## ✅ What's Been Configured

1. **Date Filtering** - Future-dated posts are hidden from your website
2. **Build Script** - Skips generating HTML for scheduled posts
3. **GitHub Actions** - Automated weekly builds every Wednesday at 7 AM EST

## 🔧 Final Setup Steps (One-Time Only)

### Step 1: Create a Netlify Build Hook

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your WellPharma site
3. Go to **Site Settings** → **Build & deploy** → **Continuous deployment**
4. Scroll down to **Build hooks**
5. Click **Add build hook**
6. Name it: `Scheduled Blog Publishing`
7. Select branch: `master`
8. Click **Save**
9. **Copy the webhook URL** (it will look like: `https://api.netlify.com/build_hooks/xxxxx`)

### Step 2: Add Build Hook to GitHub Secrets

1. Go to your GitHub repository: https://github.com/YOUR-USERNAME/YOUR-REPO
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Name: `NETLIFY_BUILD_HOOK`
6. Value: Paste the webhook URL from Step 1
7. Click **Add secret**

### Step 3: Push Changes to GitHub

Run these commands to push the scheduled publishing code:

```bash
git add .
git commit -m "Add scheduled blog publishing feature"
git push origin master
```

### Step 4: Verify GitHub Actions is Enabled

1. Go to your GitHub repository
2. Click the **Actions** tab
3. If you see "Workflows aren't being run on this repository", click **Enable workflows**
4. You should see "Scheduled Blog Publishing" workflow listed

## 📅 How to Use Scheduled Publishing

### Publishing a Scheduled Post

1. Go to https://golden-kataifi-90edfd.netlify.app/admin
2. Create a new blog post
3. Set the **Publish Date** to a future Wednesday (any time works, but posts go live at 7 AM)
4. Click **Publish**

**What happens:**
- ✅ Post is saved to GitHub immediately
- ✅ Post remains hidden on your website
- ✅ Every Wednesday at 7 AM, GitHub Actions triggers a Netlify build
- ✅ Post automatically appears on its scheduled date

### Best Practices

- **Schedule for Wednesdays** - Since auto-builds run Wednesdays at 7 AM
- **Use future dates** - Any Wednesday in the future works
- **Multiple posts** - You can schedule multiple posts for the same or different dates

### Manual Publishing (Between Wednesdays)

If you need to publish a post immediately or on a non-Wednesday:

**Option 1: Set date to today/past**
- Change the publish date to today or any past date
- Post will appear on next build

**Option 2: Trigger manual build**
- Go to GitHub → Actions tab
- Click "Scheduled Blog Publishing" workflow
- Click "Run workflow" button
- Select branch: master
- Click "Run workflow"

## 🕐 Timezone Configuration

The workflow is currently set to **7 AM Eastern Time (EST/EDT)**:

- **Winter (EST)**: Runs at 12:00 UTC = 7:00 AM EST
- **Summer (EDT)**: You'll need to adjust to 11:00 UTC for 7:00 AM EDT

### To Change the Time

Edit `.github/workflows/scheduled-publish.yml`:

```yaml
schedule:
  - cron: '0 12 * * 3'  # Minute Hour DayOfMonth Month DayOfWeek
```

**Cron format:** `minute hour day month weekday`
- Minute: 0-59
- Hour: 0-23 (UTC time)
- Day: 1-31
- Month: 1-12
- Weekday: 0-6 (0 = Sunday, 3 = Wednesday)

**Examples:**
- Every Wednesday at 7 AM EST: `'0 12 * * 3'`
- Every Monday at 9 AM EST: `'0 14 * * 1'`
- Every day at 6 AM EST: `'0 11 * * *'`

Use https://crontab.guru/ to help create custom schedules.

## 🧪 Testing

### Test the Entire System

1. Create a test post with tomorrow's date
2. Verify it doesn't appear on blog.html
3. Go to GitHub → Actions → "Scheduled Blog Publishing" → "Run workflow"
4. Wait 2-3 minutes for build to complete
5. Check your live site - post should still be hidden
6. Change post date to today
7. Trigger workflow again
8. Post should now appear!

## 📊 Monitoring

- **View scheduled builds**: GitHub → Actions tab
- **Build history**: Netlify dashboard → Deploys
- **Workflow runs**: Every Wednesday at 7 AM automatically

## ❓ Troubleshooting

### Posts aren't appearing on scheduled date

1. Check GitHub Actions ran successfully (Actions tab)
2. Check Netlify build completed (Netlify dashboard)
3. Verify post date is in the past (compare to server time)
4. Hard refresh your browser (Ctrl+F5)

### Workflow not running

1. Verify `NETLIFY_BUILD_HOOK` secret is set correctly
2. Check Actions are enabled in your repository
3. Look for error messages in Actions tab

### Need immediate publish

1. Go to Netlify dashboard
2. Click "Trigger deploy" → "Deploy site"
3. Or use GitHub Actions "Run workflow" button

## 🔄 How It Works

1. You create a post with a future date in Netlify CMS
2. Post is committed to GitHub in `_posts/` folder
3. Build runs, but `build-blog.js` skips creating HTML for future posts
4. Frontend (`blog-loader.js`) filters out future-dated posts
5. Every Wednesday at 7 AM, GitHub Actions triggers Netlify rebuild
6. Build script checks dates again - now the post is in the past!
7. HTML is generated and post appears on website

## 📝 Files Modified

- `js/blog-loader.js` - Filters future posts on frontend
- `scripts/build-blog.js` - Skips building future post HTML
- `.github/workflows/scheduled-publish.yml` - Weekly automation

## Support

If you encounter issues, check:
- GitHub Actions logs for workflow errors
- Netlify deploy logs for build errors
- Browser console for JavaScript errors
