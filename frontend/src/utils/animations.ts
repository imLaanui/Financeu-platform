// Scroll Reveal Animation
export function initScrollReveal() {
    const config = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, config);

    function observeElements() {
        const elements = document.querySelectorAll(
            '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
        );
        elements.forEach(el => observer.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeElements);
    } else {
        observeElements();
    }

    // Re-observe dynamically added elements
    (window as any).revealNewElements = observeElements;
}

// Page Transition
export function initPageTransitions() {
    const links = document.querySelectorAll<HTMLAnchorElement>(
        'a[href^="/"]:not([target="_blank"]), a[href^="./"]:not([target="_blank"]), a[href$=".html"]:not([target="_blank"])'
    );

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || link.hostname !== window.location.hostname) return;
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => window.location.href = href, 300);
        });
    });

    window.addEventListener('load', () => { document.body.style.opacity = '1'; });
}

// Button Click Feedback
export function initButtonFeedback() {
    const buttons = document.querySelectorAll<HTMLButtonElement>(
        '.btn-primary:not(.nav-links .btn-primary), .btn-outline:not(.nav-links .btn-outline), button'
    );

    buttons.forEach(button => {
        if (button.closest('.nav-links')) return;
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = '', 150);
        });
    });
}

// Smooth Scroll
export function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === '#!') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.pushState) history.pushState(null, '', href);
        });
    });
}

// Parallax Hero Section
export function initHeroParallax() {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero || window.innerWidth <= 768) return;
    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
            const shapes = hero.querySelectorAll<HTMLElement>('.hero-visual-shapes .shape');
            shapes.forEach((el, i) => el.style.transform = `translateY(${-scrolled * (0.1 + i * 0.05)}px)`);
        }
        ticking = false;
    };

    const requestParallaxUpdate = () => { if (!ticking) { window.requestAnimationFrame(updateParallax); ticking = true; } };
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
}

// Prefetch Critical Pages
export function initPrefetchPages() {
    const criticalPages = ['index.html', 'about.html', 'curriculum.html', 'dashboard.html'];
    document.addEventListener('mouseover', (e) => {
        if ((e.target as HTMLElement).tagName === 'A') {
            const href = (e.target as HTMLAnchorElement).getAttribute('href');
            if (href && criticalPages.some(page => href.includes(page))) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = href;
                document.head.appendChild(link);
            }
        }
    }, { passive: true });
}
