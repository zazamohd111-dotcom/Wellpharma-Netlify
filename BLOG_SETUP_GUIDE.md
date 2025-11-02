# WellPharma Blog System - Setup Guide

## ✅ What's Been Set Up

Your website now has a complete blog system powered by Netlify CMS! Here's what's new:

### New Pages
- **blog.html** - Main blog archive page showing all posts
- **blog-post.html** - Template for individual blog articles
- **/admin** - Netlify CMS admin interface for writing posts

### Files Created
```
_posts/                          # Blog posts stored here (markdown files)
├── 2025-01-15-welcome-to-our-blog.md
blog.html                        # Blog archive/listing page
blog-post.html                   # Individual post template
js/blog-loader.js               # Loads posts on blog.html
js/blog-post-loader.js          # Loads individual posts
admin/config.yml                # Updated with blog collection
images/blog/                     # Folder for blog images
```

## 📝 How to Write Your First Blog Post

### Option 1: Using Netlify CMS (Recommended - Easiest!)

1. **Push your changes to GitHub**
   ```bash
   git push origin master
   ```

2. **Wait for Netlify to deploy** (2-3 minutes)
   - Visit: https://golden-kataifi-90edfd.netlify.app/

3. **Access the CMS**
   - Go to: https://golden-kataifi-90edfd.netlify.app/admin
   - Click "Login with Netlify Identity"
   - You may need to enable Netlify Identity first (see setup below)

4. **Write Your Post**
   - Click "Blog Articles" → "New Blog Article"
   - Fill in:
     - Title
     - Publish Date
     - Author (defaults to Dr. Zahraa Babiker)
     - Featured Image (upload from your computer)
     - Excerpt (2-3 sentence summary)
     - Body (write your article in markdown or rich text)
     - Category (select from dropdown)
     - Tags (optional)
     - Featured Post (check to show in homepage carousel later)
   - Click "Publish"
   - Your post will auto-commit to GitHub and deploy!

### Option 2: Manual (For Advanced Users)

1. Create a new file in `_posts/` folder:
   ```
   _posts/2025-01-20-your-post-title.md
   ```

2. Add front matter and content:
   ```markdown
   ---
   title: Your Post Title
   date: 2025-01-20T10:00:00.000Z
   author: Dr. Zahraa Babiker
   image: /images/blog/your-image.jpg
   excerpt: Short summary of your post
   category: Medication Tips
   tags:
     - Health
     - Pharmacy
   featured: false
   ---

   Your blog content here in markdown...
   ```

3. Commit and push to GitHub

## 🔧 One-Time Netlify Identity Setup

To use the /admin CMS, you need to enable Netlify Identity:

1. **Log in to Netlify**
   - Go to: https://app.netlify.com/
   - Find your WellPharma site

2. **Enable Identity**
   - Go to: Site Settings → Identity
   - Click "Enable Identity"

3. **Configure Registration**
   - Under "Registration preferences" → Select "Invite only"
   - This prevents random people from accessing your CMS

4. **Enable Git Gateway**
   - Scroll down to "Services" → Git Gateway
   - Click "Enable Git Gateway"

5. **Invite Yourself**
   - Go to Identity tab
   - Click "Invite users"
   - Enter your email
   - Check your email and accept the invitation
   - Set your password

6. **You're Ready!**
   - Visit: https://your-site.netlify.app/admin
   - Login with your email and password
   - Start writing!

## 📂 Blog Categories Available

- Medication Tips
- Vaccines & Immunizations
- Health & Wellness
- Pharmacy News
- Birth Control
- Senior Care

## 🎨 Current Setup Summary

### What Stayed the Same ✅
- Your homepage carousel with 4 existing blog posts (unchanged)
- All existing pages and services
- No changes to current functionality

### What's New ✅
- Dedicated **blog.html** page at: /blog.html
- Category filtering on blog page
- Easy content management via /admin
- Professional blog post templates
- SEO-friendly structure
- Mobile responsive design

## 📱 How It Works

1. **You write** a post via /admin (or manually in _posts/)
2. **Netlify CMS commits** it to GitHub automatically
3. **Netlify deploys** the changes within 2-3 minutes
4. **Visitors see** your new post on blog.html
5. **No manual HTML editing** needed!

## 🔗 URLs

- Blog Archive: `https://your-site.netlify.app/blog.html`
- Individual Posts: `https://your-site.netlify.app/blog-post.html?slug=post-name`
- Admin CMS: `https://your-site.netlify.app/admin`

## 💡 Blog Content Ideas

Great topics for pharmacy blogs:

1. **Seasonal Health**
   - Flu season tips
   - Allergy management
   - Summer sun safety

2. **Medication Safety**
   - How to store medications
   - Understanding drug interactions
   - Reading prescription labels

3. **Service Announcements**
   - New services (like birth control prescribing)
   - Extended hours
   - Special promotions

4. **Health Education**
   - Vaccine schedules
   - Chronic disease management
   - Preventive care tips

5. **Community News**
   - Local health events
   - Pharmacy team spotlights
   - Patient success stories

## ⚠️ Important Notes

- **Existing carousel blogs** (pill-organizers.html, glp1-medications.html, etc.) are SEPARATE from this new blog system
- They will continue to work exactly as before
- You can eventually migrate them to the CMS system if you want
- For now, you have both systems running independently

## 🚀 Next Steps

1. Push your changes: `git push origin master`
2. Enable Netlify Identity (see setup above)
3. Visit /admin and write your first post!
4. Test it on blog.html
5. Share your blog URL with customers!

## ❓ Questions?

If you need help:
- Check CLAUDE.md for general instructions
- Review this guide
- Test the /admin interface
- The sample "Welcome" post shows the format

---

**Need to update this guide?** Just ask Claude to modify BLOG_SETUP_GUIDE.md
