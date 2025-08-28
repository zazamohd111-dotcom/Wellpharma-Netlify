/**
 * WellPharma Testimonials Slider
 * Continuous sliding animation without breaks - matches WordPress design
 */

document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial');
    
    if (!sliderTrack || testimonialCards.length === 0) return;
    
    // Pause animation on hover
    sliderTrack.addEventListener('mouseenter', () => {
        sliderTrack.style.animationPlayState = 'paused';
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        sliderTrack.style.animationPlayState = 'running';
    });
    
    // Touch support for mobile - pause on touch
    sliderTrack.addEventListener('touchstart', () => {
        sliderTrack.style.animationPlayState = 'paused';
    });
    
    sliderTrack.addEventListener('touchend', () => {
        sliderTrack.style.animationPlayState = 'running';
    });
});

// Fade in animation for testimonials when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (!testimonialsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    observer.observe(testimonialsSection);
});