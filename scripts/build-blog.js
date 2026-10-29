const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

// Configure marked options
marked.setOptions({
  breaks: true,
  gfm: true
});

// Site details used for canonical URLs and structured data
const SITE_URL = 'https://www.wellpharmapharmacy.com';
const ORGANIZATION = {
  '@type': 'Pharmacy',
  '@id': `${SITE_URL}/#organization`,
  name: 'WellPharma Pharmacy',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/wellpharma-logo.png`
  }
};
const DEFAULT_AUTHOR = 'Dr. Zahraa Babiker';
const AUTHORS = {
  'Dr. Zahraa Babiker': {
    '@type': 'Person',
    '@id': `${SITE_URL}/#zahraa-babiker`,
    name: 'Dr. Zahraa Babiker',
    honorificSuffix: 'PharmD',
    jobTitle: 'Owner & Licensed Pharmacist',
    description: 'PharmD with over 15 years of pharmaceutical expertise',
    worksFor: { '@id': `${SITE_URL}/#organization` }
  }
};

// Escape text for use inside HTML attributes
const escapeAttr = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const absoluteUrl = (url) => (/^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`);

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// Build the BlogPosting / WebPage / BreadcrumbList JSON-LD for a post
function buildPostSchema(post, wordCount) {
  const url = `${SITE_URL}/blog/${post.slug}.html`;
  const author = AUTHORS[post.author] || { '@type': 'Person', name: post.author };
  const datePublished = new Date(post.date).toISOString();
  const dateModified = new Date(post.updated || post.date).toISOString();

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title.slice(0, 110),
        description: post.excerpt,
        image: [absoluteUrl(post.image)],
        datePublished,
        dateModified,
        author,
        publisher: ORGANIZATION,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        articleSection: post.category,
        keywords: post.tags.join(', '),
        wordCount,
        inLanguage: 'en-US'
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: post.title,
        description: post.excerpt,
        isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: 'WellPharma Pharmacy' },
        primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(post.image) },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        lastReviewed: dateModified,
        reviewedBy: AUTHORS[post.author] ? { '@id': author['@id'] } : undefined,
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog.html` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url }
        ]
      }
    ]
  };

  // Escape "<" so post text can never close the script tag early
  return JSON.stringify(schema, null, 2).replace(/</g, '\\u003c');
}

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
const now = new Date();

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
    updated: data.updated || null,
    author: data.author || DEFAULT_AUTHOR,
    category: data.category || 'Health & Wellness',
    excerpt: data.excerpt || content.substring(0, 200).replace(/[#*\[\]]/g, '').trim() + '...',
    image: data.image || '/images/pharmacy-interior.jpg',
    slug: slug,
    featured: data.featured || false,
    tags: data.tags || [],
    content: htmlContent
  };

  // Always add to posts array (for JSON), but only create HTML if post date is in the past
  posts.push(post);

  // Skip creating individual HTML file for future-dated posts
  const postDate = new Date(post.date);
  if (postDate > now) {
    console.log(`⏰ Skipping future post: ${post.title} (scheduled for ${post.date})`);
    return;
  }

  const postUrl = `${SITE_URL}/blog/${slug}.html`;
  const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  const authorInfo = AUTHORS[post.author];
  const authorLabel = authorInfo ? `${post.author}, ${authorInfo.honorificSuffix}` : post.author;
  const wasUpdated = post.updated && new Date(post.updated) > new Date(post.date);

  // Create individual blog post HTML file
  const blogPostHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeAttr(post.title)} | WellPharma Pharmacy</title>
    <meta name="description" content="${escapeAttr(post.excerpt)}">
    <meta name="author" content="${escapeAttr(post.author)}">
    <link rel="canonical" href="${postUrl}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${escapeAttr(post.title)}">
    <meta property="og:description" content="${escapeAttr(post.excerpt)}">
    <meta property="og:url" content="${postUrl}">
    <meta property="og:image" content="${escapeAttr(absoluteUrl(post.image))}">
    <meta property="og:site_name" content="WellPharma Pharmacy">
    <meta property="article:published_time" content="${new Date(post.date).toISOString()}">
    <meta property="article:modified_time" content="${new Date(post.updated || post.date).toISOString()}">
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">
${buildPostSchema(post, wordCount)}
    </script>
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
                    <time datetime="${new Date(post.date).toISOString()}">${formatDate(post.date)}</time>
                    • <span>By ${authorLabel}</span>
                    • <span>${post.category}</span>
                    ${wasUpdated ? `<br><span>Last reviewed: <time datetime="${new Date(post.updated).toISOString()}">${formatDate(post.updated)}</time></span>` : ''}
                </div>
            </header>
            <img src="${post.image}" alt="${escapeAttr(post.title)}" class="blog-post-image">
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