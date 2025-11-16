// Homepage Blog Loader - Loads latest 4 blog posts for homepage display
(function() {
    async function loadHomepagePosts() {
        const blogContainer = document.querySelector('.blog-slider-track');
        if (!blogContainer) return;

        try {
            const response = await fetch('/api/posts.json');
            if (response.ok) {
                const data = await response.json();
                const posts = data.posts.slice(0, 4); // Get latest 4 posts

                if (posts.length > 0) {
                    // Clear existing static content
                    blogContainer.innerHTML = '';

                    // Add blog cards
                    posts.forEach(post => {
                        const blogCard = `
                            <article class="blog-card">
                                <div class="blog-card-image">
                                    <picture>
                                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                                    </picture>
                                    <div class="blog-card-overlay">
                                        <h3>${post.title}</h3>
                                    </div>
                                </div>
                                <a href="/blog/${post.slug}.html" class="blog-explore-btn">Explore</a>
                            </article>
                        `;
                        blogContainer.innerHTML += blogCard;
                    });

                    // Add duplicate cards for seamless loop animation
                    posts.forEach(post => {
                        const blogCard = `
                            <article class="blog-card">
                                <div class="blog-card-image">
                                    <picture>
                                        <img src="${post.image}" alt="${post.title}" loading="lazy">
                                    </picture>
                                    <div class="blog-card-overlay">
                                        <h3>${post.title}</h3>
                                    </div>
                                </div>
                                <a href="/blog/${post.slug}.html" class="blog-explore-btn">Explore</a>
                            </article>
                        `;
                        blogContainer.innerHTML += blogCard;
                    });
                }
            }
        } catch (error) {
            console.log('Could not load dynamic blog posts, keeping static content');
        }
    }

    // Load posts when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHomepagePosts);
    } else {
        loadHomepagePosts();
    }
})();