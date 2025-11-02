// Blog Post Loader - Loads individual blog post content
(function() {
    // Get slug from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        showError('No blog post specified');
        return;
    }

    // Sample post data (will be replaced when you add posts via CMS)
    const samplePost = {
        title: "Welcome to Our Blog",
        date: "2025-01-15",
        author: "Dr. Zahraa Babiker",
        category: "Pharmacy News",
        excerpt: "Welcome to the WellPharma Pharmacy blog!",
        image: "images/pharmacy-interior.jpg",
        tags: ["Welcome", "Pharmacy News", "Health Tips"],
        body: `Welcome to the WellPharma Pharmacy blog! We're excited to share expert health tips, medication advice, and wellness insights with you.

## What You'll Find Here

Our blog will feature:

- **Medication Tips**: Learn about proper medication storage, usage, and interactions
- **Seasonal Health**: Stay updated on flu season, allergy tips, and seasonal wellness
- **Pharmacy News**: Announcements about new services and pharmacy updates
- **Health & Wellness**: General health advice and preventive care tips

## Stay Connected

We're committed to being your trusted health resource in Randallstown. Check back regularly for new posts, or visit us in person for personalized care.

### Visit Us Today

- **Address**: 9818 Liberty Rd Ste B, Randallstown, MD 21133
- **Phone**: (410) 698-9068
- **Hours**: Monday - Friday, 10:00 AM - 6:00 PM

We look forward to serving you!`
    };

    // Function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to render post
    function renderPost(post) {
        // Update page title and meta
        document.getElementById('pageTitle').textContent = `${post.title} | WellPharma Pharmacy`;
        document.getElementById('pageDescription').content = post.excerpt;

        // Update header
        document.getElementById('postCategory').textContent = post.category;
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postDate').textContent = formatDate(post.date);
        document.getElementById('postAuthor').textContent = `By ${post.author}`;

        // Update featured image
        if (post.image) {
            document.getElementById('featuredImageContainer').innerHTML = `
                <img src="${post.image}" alt="${post.title}" loading="eager">
            `;
        }

        // Parse and render markdown content
        const contentHtml = marked.parse(post.body);
        document.getElementById('blogContent').innerHTML = contentHtml;

        // Render tags
        if (post.tags && post.tags.length > 0) {
            document.getElementById('blogTags').innerHTML = post.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
        }
    }

    // Function to show error
    function showError(message) {
        document.getElementById('blogHeaderContent').innerHTML = `
            <h1 class="blog-title">Post Not Found</h1>
            <p>${message}</p>
        `;
        document.getElementById('blogContent').innerHTML = `
            <p>We couldn't find this blog post. It may have been moved or deleted.</p>
            <p><a href="blog.html" style="color: rgb(77,123,107);">← Back to Blog</a></p>
        `;
    }

    // Load post
    async function loadPost() {
        try {
            // Try to load from JSON file or API
            const response = await fetch(`/_posts/${slug}.json`);
            if (response.ok) {
                const post = await response.json();
                renderPost(post);
            } else {
                // If specific post doesn't exist, try loading from posts.json
                const allPostsResponse = await fetch('/_posts/posts.json');
                if (allPostsResponse.ok) {
                    const data = await allPostsResponse.json();
                    const post = data.posts.find(p => p.slug === slug);
                    if (post) {
                        renderPost(post);
                    } else {
                        showError('Post not found in archive');
                    }
                } else {
                    // Show sample post for demo
                    if (slug === 'welcome-to-our-blog') {
                        renderPost(samplePost);
                    } else {
                        showError('Post file not found');
                    }
                }
            }
        } catch (error) {
            console.error('Error loading post:', error);
            // Show sample post for demo purposes
            if (slug === 'welcome-to-our-blog') {
                renderPost(samplePost);
            } else {
                showError('Error loading post');
            }
        }
    }

    // Initialize
    loadPost();
})();
