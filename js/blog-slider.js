// Blog slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const sliderTrack = document.querySelector('.blog-slider-track');
    const prevButton = document.querySelector('.blog-slider-prev');
    const nextButton = document.querySelector('.blog-slider-next');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (!sliderTrack || blogCards.length === 0) return;
    
    // Pause animation on hover (CSS handles this but we'll ensure it works)
    sliderTrack.addEventListener('mouseenter', () => {
        sliderTrack.style.animationPlayState = 'paused';
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        sliderTrack.style.animationPlayState = 'running';
    });
    
    // Manual navigation
    let currentIndex = 0;
    const cardWidth = 504; // Card width + gap
    const totalCards = 4; // Original cards (we have duplicates)
    
    function pauseAnimation() {
        sliderTrack.style.animation = 'none';
    }
    
    function resumeAnimation() {
        sliderTrack.style.animation = 'slideLeft 50s linear infinite';
    }
    
    function scrollToIndex(index) {
        pauseAnimation();
        sliderTrack.style.transform = `translateX(-${index * cardWidth}px)`;
        
        // Resume animation after a delay
        setTimeout(() => {
            currentIndex = index % totalCards;
            resumeAnimation();
        }, 500);
    }
    
    // Previous button
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            scrollToIndex(currentIndex);
        });
    }
    
    // Next button
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            scrollToIndex(currentIndex);
        });
    }
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseAnimation();
    });
    
    sliderTrack.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });
    
    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        resumeAnimation();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - go to next
                currentIndex = (currentIndex + 1) % totalCards;
            } else {
                // Swiped right - go to previous
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            }
            scrollToIndex(currentIndex);
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevButton) {
            prevButton.click();
        } else if (e.key === 'ArrowRight' && nextButton) {
            nextButton.click();
        }
    });
});