// Blog and Category Management System
class BlogManager {
    constructor() {
        this.blogs = this.loadBlogs();
        this.categories = this.loadCategories();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderBlogs();
        this.renderCategories();
        this.loadInitialData();
    }

    loadInitialData() {
        // Load initial data if none exists
        if (this.blogs.length === 0) {
            this.blogs = [
                {
                    id: 1,
                    title: "Pill Organization for Aging in Place: Your Guide to Safe Medication Management",
                    image: "images/blog-pill-organizers.jpg",
                    alt: "Pill Organization for Aging in Place: Your Guide to Safe Medication Management",
                    link: "pill-organizers.html"
                },
                {
                    id: 2,
                    title: "GLP-1 Medications (Ozempic/Wegovy): Essential Supplements and Testing for Success",
                    image: "images/glp1 medication.jpg",
                    alt: "GLP-1 Medications (Ozempic/Wegovy): Essential Supplements and Testing for Success",
                    link: "glp1-medications.html"
                },
                {
                    id: 3,
                    title: "Birth Control Options and Side Effects: Get Prescriptions at Your Pharmacy",
                    image: "images/blog-birth-control.jpg",
                    alt: "Birth Control Options and Side Effects: Get Prescriptions at Your Pharmacy",
                    link: "birth-control.html"
                },
                {
                    id: 4,
                    title: "What Vaccines Do Adults Need? 2025 Flu & COVID Guide",
                    image: "images/blog-vaccines.jpg",
                    alt: "What Vaccines Do Adults Need? 2025 Flu & COVID Guide",
                    link: "vaccines.html"
                }
            ];
            this.saveBlogs();
        }

        if (this.categories.length === 0) {
            this.categories = [
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
            this.saveCategories();
        }
    }

    setupEventListeners() {
        document.getElementById('blog-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBlog();
        });

        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });
    }

    // Blog Management
    loadBlogs() {
        const stored = localStorage.getItem('wellpharma_blogs');
        return stored ? JSON.parse(stored) : [];
    }

    saveBlogs() {
        localStorage.setItem('wellpharma_blogs', JSON.stringify(this.blogs));
        this.generateBlogCode();
    }

    saveBlog() {
        const id = document.getElementById('blog-id').value;
        const title = document.getElementById('blog-title').value;
        const image = document.getElementById('blog-image').value;
        const alt = document.getElementById('blog-alt').value;
        const link = document.getElementById('blog-link').value;

        if (!title || !image || !alt || !link) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const blog = { title, image, alt, link };

        if (id) {
            // Edit existing
            const index = this.blogs.findIndex(b => b.id == id);
            if (index !== -1) {
                blog.id = parseInt(id);
                this.blogs[index] = blog;
            }
        } else {
            // Add new
            blog.id = Date.now();
            this.blogs.push(blog);
        }

        this.saveBlogs();
        this.renderBlogs();
        this.clearBlogForm();
        this.showMessage('Blog saved successfully!', 'success');
    }

    editBlog(id) {
        const blog = this.blogs.find(b => b.id == id);
        if (blog) {
            document.getElementById('blog-id').value = blog.id;
            document.getElementById('blog-title').value = blog.title;
            document.getElementById('blog-image').value = blog.image;
            document.getElementById('blog-alt').value = blog.alt;
            document.getElementById('blog-link').value = blog.link;
            
            // Switch to blogs tab
            this.switchTab('blogs');
        }
    }

    deleteBlog(id) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            this.blogs = this.blogs.filter(b => b.id != id);
            this.saveBlogs();
            this.renderBlogs();
            this.showMessage('Blog deleted successfully', 'success');
        }
    }

    renderBlogs() {
        const container = document.getElementById('blog-list');
        container.innerHTML = '';

        if (this.blogs.length === 0) {
            container.innerHTML = '<p>No blog posts yet. Add your first blog post above!</p>';
            return;
        }

        this.blogs.forEach(blog => {
            const blogDiv = document.createElement('div');
            blogDiv.className = 'blog-item';
            blogDiv.innerHTML = `
                <h4>${blog.title}</h4>
                <p><strong>Link:</strong> <a href="${blog.link}" target="_blank">${blog.link}</a></p>
                <img src="${blog.image}" alt="${blog.alt}" class="preview-image" onerror="this.style.display='none'">
                <div class="item-actions">
                    <button class="btn" onclick="blogManager.editBlog(${blog.id})">Edit</button>
                    <button class="btn btn-danger" onclick="blogManager.deleteBlog(${blog.id})">Delete</button>
                </div>
            `;
            container.appendChild(blogDiv);
        });
    }

    // Category Management
    loadCategories() {
        const stored = localStorage.getItem('wellpharma_categories');
        return stored ? JSON.parse(stored) : [];
    }

    saveCategories() {
        localStorage.setItem('wellpharma_categories', JSON.stringify(this.categories));
        this.generateCategoryCode();
    }

    saveCategory() {
        const id = document.getElementById('category-id').value;
        const title = document.getElementById('category-title').value;
        const subtitle = document.getElementById('category-subtitle').value;
        const link = document.getElementById('category-link').value;
        const cssClass = document.getElementById('category-class').value;

        if (!title || !subtitle || !link || !cssClass) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        const category = { title, subtitle, link, class: cssClass };

        if (id) {
            // Edit existing
            const index = this.categories.findIndex(c => c.id == id);
            if (index !== -1) {
                category.id = parseInt(id);
                this.categories[index] = category;
            }
        } else {
            // Add new
            category.id = Date.now();
            this.categories.push(category);
        }

        this.saveCategories();
        this.renderCategories();
        this.clearCategoryForm();
        this.showMessage('Category saved successfully!', 'success');
    }

    editCategory(id) {
        const category = this.categories.find(c => c.id == id);
        if (category) {
            document.getElementById('category-id').value = category.id;
            document.getElementById('category-title').value = category.title;
            document.getElementById('category-subtitle').value = category.subtitle;
            document.getElementById('category-link').value = category.link;
            document.getElementById('category-class').value = category.class;
            
            // Switch to categories tab
            this.switchTab('categories');
        }
    }

    deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.categories = this.categories.filter(c => c.id != id);
            this.saveCategories();
            this.renderCategories();
            this.showMessage('Category deleted successfully', 'success');
        }
    }

    renderCategories() {
        const container = document.getElementById('category-list');
        container.innerHTML = '';

        if (this.categories.length === 0) {
            container.innerHTML = '<p>No categories yet. Add your first category above!</p>';
            return;
        }

        this.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <h4>${category.title}</h4>
                <p><strong>Subtitle:</strong> ${category.subtitle}</p>
                <p><strong>Link:</strong> <a href="${category.link}" target="_blank">${category.link}</a></p>
                <p><strong>CSS Class:</strong> ${category.class}</p>
                <div class="item-actions">
                    <button class="btn" onclick="blogManager.editCategory(${category.id})">Edit</button>
                    <button class="btn btn-danger" onclick="blogManager.deleteCategory(${category.id})">Delete</button>
                </div>
            `;
            container.appendChild(categoryDiv);
        });
    }

    // Code Generation
    generateBlogCode() {
        const blogHTML = this.blogs.map(blog => `
                            <div class="blog-card">
                                <div class="blog-card-image">
                                    <img src="${blog.image}" alt="${blog.alt}" loading="lazy">
                                    <div class="blog-card-overlay">
                                        <h3>${blog.title}</h3>
                                    </div>
                                </div>
                                <a href="${blog.link}" class="blog-explore-btn"${blog.link.startsWith('http') ? ' target="_blank"' : ''}>Explore</a>
                            </div>`).join('\n                            ');

        // Duplicate for seamless loop
        const duplicateHTML = this.blogs.map(blog => `
                            <div class="blog-card">
                                <div class="blog-card-image">
                                    <img src="${blog.image}" alt="${blog.alt}" loading="lazy">
                                    <div class="blog-card-overlay">
                                        <h3>${blog.title}</h3>
                                    </div>
                                </div>
                                <a href="${blog.link}" class="blog-explore-btn"${blog.link.startsWith('http') ? ' target="_blank"' : ''}>Explore</a>
                            </div>`).join('\n                            ');

        // Store the generated code
        localStorage.setItem('wellpharma_blog_html', blogHTML + '\n                            \n                            <!-- Duplicate cards for seamless loop -->' + duplicateHTML);
    }

    generateCategoryCode() {
        const categoryHTML = this.categories.map(category => `
                    <a href="${category.link}" class="category-pill ${category.class}"${category.link.startsWith('http') ? ' target="_blank"' : ''}>
                        <span class="category-title">${category.title}</span>
                        <span class="category-subtitle">${category.subtitle}</span>
                    </a>`).join('\n                    ');

        // Store the generated code
        localStorage.setItem('wellpharma_category_html', categoryHTML);
    }

    // Utility Functions
    clearBlogForm() {
        document.getElementById('blog-form').reset();
        document.getElementById('blog-id').value = '';
    }

    clearCategoryForm() {
        document.getElementById('category-form').reset();
        document.getElementById('category-id').value = '';
    }

    showMessage(message, type) {
        const container = document.getElementById('message-container');
        container.innerHTML = `<div class="${type}-message">${message}</div>`;
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    switchTab(tab) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tabEl => {
            tabEl.classList.remove('active');
        });

        // Show selected tab content
        document.getElementById(`${tab}-tab`).classList.add('active');
        
        // Add active class to clicked tab
        event.target.classList.add('active');
    }

    // Export/Import Functions
    exportData() {
        const data = {
            blogs: this.blogs,
            categories: this.categories,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wellpharma-blog-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Data exported successfully!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.blogs && data.categories) {
                    this.blogs = data.blogs;
                    this.categories = data.categories;
                    this.saveBlogs();
                    this.saveCategories();
                    this.renderBlogs();
                    this.renderCategories();
                    this.showMessage('Data imported successfully!', 'success');
                } else {
                    this.showMessage('Invalid file format', 'error');
                }
            } catch (error) {
                this.showMessage('Error reading file: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Tab switching function (global)
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab').forEach(tabEl => {
        tabEl.classList.remove('active');
    });

    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Form clearing functions (global)
function clearBlogForm() {
    blogManager.clearBlogForm();
}

function clearCategoryForm() {
    blogManager.clearCategoryForm();
}

function exportData() {
    blogManager.exportData();
}

function importData(event) {
    blogManager.importData(event);
}

// Initialize the blog manager when the page loads
let blogManager;
document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});