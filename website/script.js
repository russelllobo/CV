// ===== Elegant Portfolio Interactions =====
// Swiss Design + Apple HIG Inspired

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const getThemePreference = () => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return prefersDark.matches ? 'dark' : 'light';
    };
    
    const setTheme = (theme, save = true) => {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem('theme', theme);
        }
    };
    
    // Initial theme - don't save if using system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(prefersDark.matches ? 'dark' : 'light', false);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark', true);
        });
    }
    
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // ===== Sidebar Navigation =====
    const sidebarNav = document.querySelector('.sidebar-nav');
    const heroSection = document.getElementById('hero');
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = ['about', 'experience', 'projects', 'skills', 'contact'];
    const sectionElements = sections.map(id => document.getElementById(id)).filter(Boolean);

    // Show sidebar after scrolling past hero, hide at contact section
    const contactSection = document.getElementById('contact');
    let isPastHero = false;
    let isAtContact = false;

    const updateSidebarVisibility = () => {
        if (isPastHero && !isAtContact) {
            sidebarNav.classList.add('visible');
        } else {
            sidebarNav.classList.remove('visible');
        }
    };

    if (sidebarNav && heroSection) {
        const heroObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isPastHero = !entry.isIntersecting;
                    updateSidebarVisibility();
                });
            },
            { 
                threshold: 0,
                rootMargin: '-10% 0px 0px 0px'
            }
        );
        heroObserver.observe(heroSection);
    }

    // Hide sidebar when footer comes into view (wait until very bottom)
    const footer = document.querySelector('footer');
    if (sidebarNav && footer) {
        const footerObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isAtContact = entry.isIntersecting;
                    updateSidebarVisibility();
                });
            },
            { 
                threshold: 0.5
            }
        );
        footerObserver.observe(footer);
    }

    // Active section detection using scroll position
    const updateActiveSection = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let currentSection = null;
        
        sectionElements.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        // Update active state on nav dots
        navDots.forEach(dot => {
            if (dot.dataset.section === currentSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    if (navDots.length > 0 && sectionElements.length > 0) {
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        updateActiveSection(); // Initial check
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Animated Stat Counters =====
    const animateCounter = (element, target, suffix = '', prefix = '') => {
        if (prefersReducedMotion) {
            element.textContent = prefix + target + suffix;
            return;
        }

        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        element.classList.add('counting');
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart for natural deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.round(startValue + (target - startValue) * easeProgress);
            
            element.textContent = prefix + currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.classList.remove('counting');
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    // Observe stat values for counter animation
    const statValues = document.querySelectorAll('.stat-value');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                
                const text = entry.target.textContent;
                
                // Parse "35%" format
                if (text.includes('%')) {
                    const num = parseInt(text);
                    animateCounter(entry.target, num, '%');
                }
                // Parse "~8 hrs" format
                else if (text.includes('hrs')) {
                    const num = parseInt(text.replace('~', ''));
                    animateCounter(entry.target, num, ' hrs', '~');
                }
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statObserver.observe(stat));

    // ===== Enhanced Scroll Reveal Animations =====
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Add reveal class to sections and observe
    document.querySelectorAll('section > .container').forEach(el => {
        if (!prefersReducedMotion) {
            el.classList.add('reveal');
            revealObserver.observe(el);
        }
    });

    // Add stagger animation to skills lists
    document.querySelectorAll('.skills-category ul').forEach(ul => {
        if (!prefersReducedMotion) {
            ul.classList.add('stagger-children');
            revealObserver.observe(ul);
        }
    });

    // ===== CV Link - Simple PDF Open =====
    const cvLink = document.getElementById('cv-link');
    
    if (cvLink) {
        cvLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(cvLink.getAttribute('href'), '_blank');
        });
    }

    // ===== Builder Typewriter Effect =====
    const builderSpan = document.querySelector('.highlight-builder');
    
    if (builderSpan && !prefersReducedMotion) {
        const finalText = builderSpan.textContent;
        const typeSpeed = 100; // ms per character
        const startDelay = 800; // ms after page load
        
        // Clear initial text and prepare for typing
        builderSpan.textContent = '';
        builderSpan.classList.add('typing');
        builderSpan.style.width = 'auto';
        builderSpan.style.display = 'inline-block';
        
        // Start typing after delay
        setTimeout(() => {
            let charIndex = 0;
            
            const typeNextChar = () => {
                if (charIndex < finalText.length) {
                    builderSpan.textContent += finalText[charIndex];
                    charIndex++;
                    setTimeout(typeNextChar, typeSpeed);
                } else {
                    // Typing complete - stop cursor blink and fade it out
                    setTimeout(() => {
                        builderSpan.classList.remove('typing');
                        builderSpan.classList.add('typing-complete');
                    }, 400);
                }
            };
            
            typeNextChar();
        }, startDelay);
    }

    // ===== Page Load Animation =====
    if (!prefersReducedMotion) {
        document.body.classList.add('page-loaded');
    }
});
