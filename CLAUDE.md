# Claude Instructions for WellPharma Pharmacy Website

## Important Guidelines

### Git Workflow
- **NEVER push commits to GitHub without explicit user verification**
- Always create commits locally when changes are made
- Wait for user confirmation before running `git push`
- Ask: "Should I push these changes to GitHub now?" before pushing

### Project Structure
- Main website: index.html
- Styles: css/main.css
- Images: images/ directory
- WebP images: Image.webp/ directory
- Admin panel: admin-enhanced.html (for easy content updates)

### Deployment
- Site is hosted on Netlify
- Live URL: https://golden-kataifi-90edfd.netlify.app/
- Changes pushed to GitHub automatically deploy to Netlify

### Development Notes
- When updating categories/health tools, update both index.html and corresponding CSS classes
- Maintain existing color schemes unless specifically requested to change
- Test locally before committing changes

## How to Update Blogs

### Using Netlify CMS (Recommended):
1. Go to https://golden-kataifi-90edfd.netlify.app/admin
2. Login with your Netlify Identity account
3. Click "Blog Articles" → "New Blog Article"
4. Write and publish your post
5. Netlify automatically builds and deploys changes

### Blog System Architecture:
- **Markdown posts** stored in `_posts/` folder
- **Build script** (`scripts/build-blog.js`) converts markdown to HTML
- **Generated files**:
  - Individual blog pages in `/blog/` folder
  - JSON feed at `/api/posts.json`
- **Dynamic loading** on homepage and blog.html via JavaScript

### Manual Blog Updates:
1. Create markdown file in `_posts/` folder
2. Run `npm run build` to generate HTML files
3. Commit and push all changes

### Homepage Blog Carousel:
- Automatically shows latest 4 posts from `/api/posts.json`
- Static fallback content if build hasn't run yet

### Category HTML Location in index.html:
Look for: `<!-- Category Pills -->` around line 528-550