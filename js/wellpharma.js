// WellPharma Pharmacy Main JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
    
    // Stripe-Style Dropdown Navigation
    const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
    
    dropdownItems.forEach(item => {
        const navLink = item.querySelector('.nav-link');
        
        // Add click functionality for both mobile and desktop
        navLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle this dropdown
            item.classList.toggle('active');
            
            // Close other dropdowns
            dropdownItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        const isDropdownClick = e.target.closest('.nav-item.dropdown');
        if (!isDropdownClick) {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Desktop mode - remove mobile classes
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Close dropdowns when clicking dropdown links
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Cache header height to avoid repeated DOM queries
                if (!window.cachedHeaderHeight) {
                    const header = document.querySelector('.header');
                    window.cachedHeaderHeight = header ? header.offsetHeight : 80;
                }
                
                // Much larger padding for contact section to show full card
                const targetHref = this.getAttribute('href');
                let extraPadding = 40; // Default padding
                
                if (targetHref === '#contact') {
                    // Different padding for desktop vs mobile
                    if (window.innerWidth > 768) {
                        extraPadding = 180; // Even larger padding for desktop contact section
                    } else {
                        extraPadding = 120; // Mobile padding
                    }
                }
                
                const totalOffset = window.cachedHeaderHeight + extraPadding;
                
                // Use requestAnimationFrame to batch DOM reads
                requestAnimationFrame(() => {
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - totalOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                });
            }
        });
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const toggle = this.querySelector('.faq-toggle');
            
            // Close all other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = null;
                    otherQuestion.querySelector('.faq-toggle').textContent = '+';
                }
            });
            
            // Toggle current FAQ with requestAnimationFrame to prevent forced reflow
            this.classList.toggle('active');
            
            requestAnimationFrame(() => {
                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    toggle.textContent = '+';
                } else {
                    // Read DOM property first
                    const scrollHeight = answer.scrollHeight;
                    // Then write to DOM
                    answer.style.maxHeight = scrollHeight + "px";
                    toggle.textContent = '−';
                }
            });
        });
    });
    
    // Form Submission (if contact form exists)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Here you would normally send the data to a server
            console.log('Form submitted:', data);
            
            // Show success message
            alert('Thank you for your message! We will get back to you within 24 hours.');
            contactForm.reset();
        });
    }
    
    // Lazy Loading Images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past 100px
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add shadow on scroll
        if (scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animation on Scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            animateOnScroll.observe(element);
        });
    }
});

// Utility function for formatting phone numbers
function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}