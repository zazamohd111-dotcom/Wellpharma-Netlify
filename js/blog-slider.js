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
    
    // Touch/swipe support for mobile with drag functionality
    let touchStartX = 0;
    let touchEndX = 0;
    let touchCurrentX = 0;
    let isTouching = false;
    let touchTimer = null;
    let isPaused = false;
    let isDragging = false;
    let initialTransform = 0;
    let currentScrollPosition = 0;

    function getTransformValue() {
        const style = window.getComputedStyle(sliderTrack);
        const matrix = style.transform || style.webkitTransform;
        if (matrix === 'none') return 0;
        const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrixValues[4]) || 0;
    }

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchCurrentX = touchStartX;
        isTouching = true;
        isDragging = false;

        // Clear any existing timer
        if (touchTimer) {
            clearTimeout(touchTimer);
        }

        // Only pause on track touch (not cards), always prepare for dragging
        if (!isPaused) {
            // First touch - pause and prepare for dragging
            sliderTrack.style.animationPlayState = 'paused';
            isPaused = true;

            // Get current scroll position
            initialTransform = getTransformValue();
            currentScrollPosition = initialTransform;
        } else {
            // Already paused - just update position for potential drag
            initialTransform = getTransformValue();
            currentScrollPosition = initialTransform;
        }
    });

    sliderTrack.addEventListener('touchmove', (e) => {
        if (!isTouching) return;

        touchCurrentX = e.changedTouches[0].screenX;
        const diff = touchCurrentX - touchStartX;
        const absDiff = Math.abs(diff);

        // If moved more than 10px, start dragging
        if (absDiff > 10) {
            isDragging = true;
            e.preventDefault();

            // Disable animation completely while dragging
            sliderTrack.style.animation = 'none';

            // Apply transform based on finger movement
            const newPosition = initialTransform + diff;
            sliderTrack.style.transform = `translateX(${newPosition}px)`;
            currentScrollPosition = newPosition;
        }
    });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        isTouching = false;

        if (isDragging) {
            // User was dragging - restore animation in paused state at current position
            isDragging = false;

            // Restore the animation but keep it paused at the dragged position
            // The transform is already set from touchmove
            sliderTrack.style.animation = 'slideLeft 50s linear infinite';
            sliderTrack.style.animationPlayState = 'paused';

            // Keep the current transform so it stays where user dragged it
            isPaused = true;

            // Auto-resume after 1 second
            touchTimer = setTimeout(() => {
                if (!isTouching && isPaused) {
                    // Remove manual transform and resume
                    sliderTrack.style.transform = '';
                    sliderTrack.style.animationPlayState = 'running';
                    isPaused = false;
                }
            }, 1000); // 1 second delay
        } else {
            // Was a tap without drag - keep paused and set auto-resume
            if (isPaused) {
                touchTimer = setTimeout(() => {
                    if (!isTouching && isPaused) {
                        sliderTrack.style.animationPlayState = 'running';
                        isPaused = false;
                    }
                }, 1000); // 1 second delay
            }
        }
    });

    // Individual card touch for toggle pause/play
    blogCards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            // Only handle if not already touching the track
            if (!isTouching) {
                // Clear any existing timer
                if (touchTimer) {
                    clearTimeout(touchTimer);
                }

                // Toggle: if paused, resume; if playing, pause
                if (isPaused) {
                    // Resume from current paused position
                    sliderTrack.style.transform = '';
                    sliderTrack.style.animationPlayState = 'running';
                    isPaused = false;
                } else {
                    // Pause at current position
                    sliderTrack.style.animationPlayState = 'paused';
                    isPaused = true;

                    // Auto-resume after 1 second
                    touchTimer = setTimeout(() => {
                        if (!isTouching && isPaused) {
                            sliderTrack.style.animationPlayState = 'running';
                            isPaused = false;
                        }
                    }, 1000); // 1 second delay
                }
            }
        });
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