// ===== Portfolio Interactions =====

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const setTheme = (theme, save = true) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) localStorage.setItem('theme', theme);
    };

    const isMobile = window.innerWidth <= 640;
    const savedTheme = localStorage.getItem('theme');

    if (isMobile) {
        setTheme(prefersDark.matches ? 'dark' : 'light', false);
    } else if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(prefersDark.matches ? 'dark' : 'light', false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    prefersDark.addEventListener('change', (e) => {
        if (window.innerWidth <= 640 || !localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // ===== Accordion Sections =====
    document.querySelectorAll('.page-link[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const drawer = document.getElementById(btn.dataset.target);
            if (!drawer) return;

            const isOpen = drawer.classList.contains('open');

            // Close all
            document.querySelectorAll('.section-drawer.open').forEach(d => {
                d.classList.remove('open');
                const b = document.querySelector(`[data-target="${d.id}"]`);
                if (b) b.setAttribute('aria-expanded', 'false');
            });

            // Open this one if it was closed
            if (!isOpen) {
                drawer.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== Page Load Animation =====
    if (!prefersReducedMotion) {
        document.body.classList.add('page-loaded');
    }
});
