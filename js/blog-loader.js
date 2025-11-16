// Blog Loader - Loads blog posts from _posts folder
(function() {
    const blogGrid = document.getElementById('blogGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allPosts = [];

    // Sample posts structure (will be replaced when you add posts via CMS)
    // This demonstrates the expected format
    const samplePosts = [
        {
            title: "Welcome to Our Blog",
            date: "2025-01-15",
            author: "Dr. Zahraa Babiker",
            category: "Pharmacy News",
            excerpt: "Welcome to the WellPharma Pharmacy blog! Here you'll find expert health tips, medication advice, and wellness insights from your trusted local pharmacy.",
            image: "images/pharmacy-interior.jpg",
            slug: "welcome-to-our-blog"
        }
    ];

    // Function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Function to create blog card HTML
    function createBlogCard(post) {
        return `
            <article class="blog-card" data-category="${post.category}">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="blog-card-content">
                    <span class="blog-card-category">${post.category}</span>
                    <h2 class="blog-card-title">${post.title}</h2>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-meta">
                        <span class="blog-card-date">${formatDate(post.date)}</span>
                        <span class="blog-card-author">${post.author}</span>
                    </div>
                    <a href="/blog/${post.slug}.html" class="read-more">
                        Read More →
                    </a>
                </div>
            </article>
        `;
    }

    // Function to render posts
    function renderPosts(posts) {
        if (posts.length === 0) {
            blogGrid.innerHTML = `
                <div class="no-posts" style="grid-column: 1/-1;">
                    <h2>No posts found</h2>
                    <p>We haven't published any posts in this category yet. Check back soon!</p>
                    <p style="margin-top: 2rem;"><strong>Pharmacy Owners:</strong> Visit <a href="/admin" style="color: rgb(77,123,107);">/admin</a> to write your first blog post!</p>
                </div>
            `;
        } else {
            blogGrid.innerHTML = posts.map(post => createBlogCard(post)).join('');
        }
    }

    // Function to filter posts
    function filterPosts(category) {
        if (category === 'all') {
            renderPosts(allPosts);
        } else {
            const filtered = allPosts.filter(post => post.category === category);
            renderPosts(filtered);
        }
    }

    // Load posts from _posts folder (via GitHub API or build process)
    async function loadPosts() {
        try {
            // Try to load from a generated JSON file (created by Netlify build)
            const response = await fetch('/api/posts.json');
            if (response.ok) {
                const data = await response.json();
                allPosts = data.posts;
                renderPosts(allPosts);
            } else {
                // If no posts.json exists, show sample posts
                allPosts = samplePosts;
                renderPosts(allPosts);
            }
        } catch (error) {
            console.log('No posts found, showing sample posts');
            allPosts = samplePosts;
            renderPosts(allPosts);
        }
    }

    // Event listeners for filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter posts
            const category = this.getAttribute('data-category');
            filterPosts(category);
        });
    });

    // Initialize
    loadPosts();
})();
