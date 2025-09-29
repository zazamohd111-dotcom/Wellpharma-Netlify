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

## How to Update Blogs/Categories Without Claude

### Using the Admin Panel:
1. Open `admin-enhanced.html` in your browser
2. Add/edit blogs or categories
3. Click "Copy Code" button
4. Open `index.html` in a text editor
5. Search for `<!-- Blog Cards -->` or `<!-- Category Pills -->`
6. Replace the section with copied code
7. Save the file

### Deploy Changes:
```bash
git add index.html
git commit -m "Update blogs/categories"
git push origin master
```

### Blog HTML Location in index.html:
Look for: `<!-- Blog Cards -->` around line 470-520

### Category HTML Location in index.html:
Look for: `<!-- Category Pills -->` around line 528-550