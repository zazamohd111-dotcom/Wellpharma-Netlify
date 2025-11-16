// Latest News Loader - Loads latest posts from Netlify CMS for homepage Latest News section
(function() {
    async function loadLatestNews() {
        const newsGrid = document.getElementById('latest-news-grid');
        if (!newsGrid) return;

        try {
            const response = await fetch('/api/posts.json');
            if (response.ok) {
                const data = await response.json();
                // Get latest 3 posts for the news section
                const posts = data.posts.slice(0, 3);

                if (posts.length > 0) {
                    // Clear loading message
                    newsGrid.innerHTML = '';

                    // Add news cards
                    posts.forEach(post => {
                        const newsCard = document.createElement('article');
                        newsCard.className = 'news-card';
                        newsCard.innerHTML = `
                            <div class="news-card-image">
                                <img src="${post.image}" alt="${post.title}" loading="lazy">
                                <span class="news-category">${post.category}</span>
                            </div>
                            <div class="news-card-content">
                                <h3>${post.title}</h3>
                                <p class="news-excerpt">${post.excerpt}</p>
                                <div class="news-meta">
                                    <span class="news-date">${formatDate(post.date)}</span>
                                    <span class="news-author">by ${post.author}</span>
                                </div>
                                <a href="/blog/${post.slug}.html" class="read-more-link">Read More →</a>
                            </div>
                        `;
                        newsGrid.appendChild(newsCard);
                    });
                } else {
                    // No posts yet
                    newsGrid.innerHTML = `
                        <div class="no-news" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                            <p>No news articles yet. Check back soon!</p>
                        </div>
                    `;
                }
            } else {
                // API not available, show nothing or fallback
                newsGrid.innerHTML = '';
                // Hide the entire section if no content
                const section = document.getElementById('latest-news');
                if (section) section.style.display = 'none';
            }
        } catch (error) {
            console.log('Latest news not available yet');
            // Hide the section if there's an error
            const section = document.getElementById('latest-news');
            if (section) section.style.display = 'none';
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Load posts when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLatestNews);
    } else {
        loadLatestNews();
    }
})();