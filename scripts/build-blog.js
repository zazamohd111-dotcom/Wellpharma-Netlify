const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true
});

// Directories
const postsDir = path.join(__dirname, '..', '_posts');
const outputDir = path.join(__dirname, '..', 'api');
const blogPagesDir = path.join(__dirname, '..', 'blog');

// Ensure output directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(blogPagesDir)) {
  fs.mkdirSync(blogPagesDir, { recursive: true });
}

// Read all markdown files from _posts
const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const posts = [];

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse frontmatter and content
  const { data, content } = matter(fileContent);

  // Extract slug from filename
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace('.md', '');

  // Convert markdown to HTML
  const htmlContent = marked.parse(content);

  // Create post object
  const post = {
    title: data.title,
    date: data.date,
    author: data.author || 'Dr. Zahraa Babiker',
    category: data.category || 'Health & Wellness',
    excerpt: data.excerpt || content.substring(0, 200).replace(/[#*\[\]]/g, '').trim() + '...',
    image: data.image || '/images/pharmacy-interior.jpg',
    slug: slug,
    featured: data.featured || false,
    tags: data.tags || [],
    content: htmlContent
  };

  posts.push(post);

  // Create individual blog post HTML file
  const blogPostHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} | WellPharma Pharmacy</title>
    <meta name="description" content="${post.excerpt}">
    <link rel="stylesheet" href="../css/main.css">
    <style>
        .blog-post-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }
        .blog-post-header {
            margin-bottom: 2rem;
        }
        .blog-post-meta {
            color: #666;
            margin: 1rem 0;
        }
        .blog-post-image {
            width: 100%;
            max-height: 400px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 2rem;
        }
        .blog-post-content {
            line-height: 1.8;
            font-size: 1.1rem;
        }
        .blog-post-content h2 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        .blog-post-content p {
            margin-bottom: 1rem;
        }
        .back-to-blog {
            display: inline-block;
            margin-bottom: 2rem;
            color: rgb(77, 123, 107);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="blog-post-container">
        <a href="../blog.html" class="back-to-blog">← Back to Blog</a>
        <article class="blog-post">
            <header class="blog-post-header">
                <h1>${post.title}</h1>
                <div class="blog-post-meta">
                    <span>${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    • <span>${post.author}</span>
                    • <span>${post.category}</span>
                </div>
            </header>
            <img src="${post.image}" alt="${post.title}" class="blog-post-image">
            <div class="blog-post-content">
                ${post.content}
            </div>
        </article>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(blogPagesDir, `${slug}.html`), blogPostHtml);
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Write posts.json for API access
fs.writeFileSync(
  path.join(outputDir, 'posts.json'),
  JSON.stringify({ posts }, null, 2)
);

console.log(`✅ Built ${posts.length} blog posts`);
console.log('📁 Generated files:');
console.log('  - api/posts.json (for dynamic loading)');
console.log(`  - ${posts.length} individual blog post HTML files in /blog/`);