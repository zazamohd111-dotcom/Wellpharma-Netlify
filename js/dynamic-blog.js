// Dynamic Blog Content Loader
class DynamicBlogLoader {
    constructor() {
        this.blogs = this.loadBlogs();
        this.categories = this.loadCategories();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadContent());
        } else {
            this.loadContent();
        }
    }

    loadContent() {
        this.loadBlogSlider();
        this.loadCategoryPills();
    }

    loadBlogs() {
        const stored = localStorage.getItem('wellpharma_blogs');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default blogs if none in localStorage
        return [
            {
                id: 1,
                title: "Pill organizers: Your guide to medication management",
                image: "images/blog-pill-organizers.jpg",
                alt: "Pill organizers: Your guide to medication management",
                link: "#pill-organizers"
            },
            {
                id: 2,
                title: "Custom compounding: Personalized medications for your needs",
                image: "images/blog-compounding.png",
                alt: "Custom compounding: Personalized medications for your needs",
                link: "#compounding"
            },
            {
                id: 3,
                title: "Your complete guide to birth control options",
                image: "images/blog-birth-control.jpg",
                alt: "Your complete guide to birth control options",
                link: "#birth-control"
            },
            {
                id: 4,
                title: "Essential vaccines: What adults need to know",
                image: "images/blog-vaccines.jpg",
                alt: "Essential vaccines: What adults need to know",
                link: "#vaccines"
            }
        ];
    }

    loadCategories() {
        const stored = localStorage.getItem('wellpharma_categories');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default categories if none in localStorage
        return [
            {
                id: 1,
                title: "Compounding",
                subtitle: "Custom Medications",
                link: "#compounding",
                class: "category-compounding"
            },
            {
                id: 2,
                title: "Hormonal Imbalance",
                subtitle: "Women's health",
                link: "#hormonal-imbalance",
                class: "category-hormonal-imbalance"
            },
            {
                id: 3,
                title: "Pill Identifier",
                subtitle: "Identify Your Pills",
                link: "https://www.drugs.com/imprints.php",
                class: "category-weight-loss"
            },
            {
                id: 4,
                title: "Diabetes Prevention",
                subtitle: "Community Health",
                link: "#diabetes-prevention",
                class: "category-diabetes-prevention"
            },
            {
                id: 5,
                title: "Hormone Testing",
                subtitle: "Health Analysis",
                link: "#hormone-testing",
                class: "category-hormone-testing"
            }
        ];
    }

    loadBlogSlider() {
        const sliderTrack = document.querySelector('.blog-slider-track');
        if (!sliderTrack) return;

        // Generate blog cards
        const blogCards = this.blogs.map(blog => this.generateBlogCard(blog)).join('');
        
        // Generate duplicate cards for seamless loop
        const duplicateCards = this.blogs.map(blog => this.generateBlogCard(blog)).join('');
        
        // Update slider content
        sliderTrack.innerHTML = blogCards + duplicateCards;
    }

    generateBlogCard(blog) {
        const isExternal = blog.link.startsWith('http');
        return `
            <div class="blog-card">
                <div class="blog-card-image">
                    <img src="${blog.image}" alt="${blog.alt}" loading="lazy">
                    <div class="blog-card-overlay">
                        <h3>${blog.title}</h3>
                    </div>
                </div>
                <a href="${blog.link}" class="blog-explore-btn"${isExternal ? ' target="_blank"' : ''}>Explore</a>
            </div>`;
    }

    loadCategoryPills() {
        const categoryContainer = document.querySelector('.blog-categories');
        if (!categoryContainer) return;

        // Generate category pills
        const categoryPills = this.categories.map(category => this.generateCategoryPill(category)).join('');
        
        // Update category content
        categoryContainer.innerHTML = categoryPills;
    }

    generateCategoryPill(category) {
        const isExternal = category.link.startsWith('http');
        return `
            <a href="${category.link}" class="category-pill ${category.class}"${isExternal ? ' target="_blank"' : ''}>
                <span class="category-title">${category.title}</span>
                <span class="category-subtitle">${category.subtitle}</span>
            </a>`;
    }

    // Method to refresh content (can be called after admin updates)
    refresh() {
        this.blogs = this.loadBlogs();
        this.categories = this.loadCategories();
        this.loadContent();
    }
}

// Initialize dynamic blog loader
const dynamicBlogLoader = new DynamicBlogLoader();

// Listen for storage changes to update content when admin makes changes
window.addEventListener('storage', (e) => {
    if (e.key === 'wellpharma_blogs' || e.key === 'wellpharma_categories') {
        dynamicBlogLoader.refresh();
    }
});

// Expose refresh function globally for manual refresh if needed
window.refreshBlogContent = () => {
    dynamicBlogLoader.refresh();
};