// Scroll Reveal Animation
// Detects when elements enter the viewport and reveals them

(function() {
    'use strict';

    // Configuration
    const config = {
        threshold: 0.15, // Percentage of element that needs to be visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing (better performance)
                observer.unobserve(entry.target);
            }
        });
    }, config);

    // Observe all elements with scroll-reveal classes
    function observeElements() {
        const elements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
        );

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeElements);
    } else {
        observeElements();
    }

    // Re-observe elements if new content is added dynamically
    window.revealNewElements = function() {
        observeElements();
    };

})();

// Page Transition Effect
// Adds smooth fade-out when navigating to another page
(function() {
    'use strict';

    // Only add transition for internal links
    const internalLinks = document.querySelectorAll('a[href^="/"]:not([target="_blank"]), a[href^="./"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's a hash link (anchor)
            if (href.startsWith('#')) {
                return;
            }

            // Skip if it's an external link
            if (this.hostname !== window.location.hostname) {
                return;
            }

            e.preventDefault();

            // Add fade-out class to body
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease-out';

            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });

    // Fade in when page loads
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

})();

// Enhanced Button Click Feedback
(function() {
    'use strict';

    // Add active class on button click for better feedback
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline, button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            this.style.transform = 'scale(0.95)';

            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

})();

// Smooth Scroll Enhancement for Anchor Links
(function() {
    'use strict';

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip empty hash links
            if (href === '#' || href === '#!') {
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });

})();

// Parallax Effect for Hero Section (subtle)
(function() {
    'use strict';

    const hero = document.querySelector('.hero');

    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        // Only apply parallax in hero section view
        if (scrolled < heroHeight) {
            const parallaxElements = hero.querySelectorAll('.hero-visual-shapes .shape');

            parallaxElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Only enable parallax on desktop
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }

})();

// Preload Critical Pages for Instant Navigation
(function() {
    'use strict';

    const criticalPages = ['index.html', 'about.html', 'curriculum.html', 'dashboard.html'];

    // Preload on hover
    document.addEventListener('mouseover', function(e) {
        if (e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href && criticalPages.some(page => href.includes(page))) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = href;
                document.head.appendChild(link);
            }
        }
    }, { passive: true });

})();
