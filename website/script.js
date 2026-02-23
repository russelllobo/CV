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

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
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
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // ===== Accordion Sections =====
    document.querySelectorAll('.page-link[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const drawer = document.getElementById(btn.dataset.target);
            if (!drawer) return;

            const isOpen = drawer.classList.contains('open');

            document.querySelectorAll('.section-drawer.open').forEach(d => {
                d.classList.remove('open');
                const b = document.querySelector(`[data-target="${d.id}"]`);
                if (b) b.setAttribute('aria-expanded', 'false');
            });

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

    // ===== Stat Counter Animation =====
    // Animates stat values from 0 to their final number when they scroll into view
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    if (statValues.length && !prefersReducedMotion) {
        const animateCount = (el) => {
            const target = parseFloat(el.dataset.count);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const startTime = performance.now();

            el.classList.add('counting');

            const step = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic for a satisfying deceleration
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                el.textContent = prefix + current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = prefix + target + suffix;
                    // Keep accent color briefly, then fade back
                    setTimeout(() => el.classList.remove('counting'), 600);
                }
            };

            requestAnimationFrame(step);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small delay so the accordion has time to fully open
                    setTimeout(() => animateCount(entry.target), 200);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statValues.forEach(el => {
            // Set initial display to 0
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            el.textContent = prefix + '0' + suffix;
            statsObserver.observe(el);
        });
    }
});
