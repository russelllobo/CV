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

    // ===== Sticky Section Header (Mobile Only) =====
    const stickyHeader = document.querySelector('.sticky-header');
    const stickyHeaderText = document.querySelector('.sticky-header-text');

    if (stickyHeader && stickyHeaderText && window.innerWidth <= 640) {
        // Get all section titles to observe
        const sectionTitles = document.querySelectorAll('.section-title');
        let currentSection = null;
        let intersectingTitles = new Map();

        // Update sticky header based on which title is currently crossing the top
        const updateStickyHeader = () => {
            // Find all titles that have crossed above the trigger point
            let activeTitle = null;
            let minTop = Infinity;
            
            sectionTitles.forEach(title => {
                const rect = title.getBoundingClientRect();
                const titleTop = rect.top;
                
                // Title has crossed the trigger point if it's at or above it (top <= 80)
                // We want the one that's lowest on screen but still above the trigger
                if (titleTop <= 80) {
                    // Among titles above trigger, pick the one closest to it (highest top value)
                    if (titleTop > minTop || activeTitle === null) {
                        minTop = titleTop;
                        activeTitle = title;
                    }
                }
            });
            
            // If no title has crossed the trigger point, hide pill
            // Only show pill starting from experience section, not during about
            if (!activeTitle) {
                stickyHeader.classList.remove('visible');
                currentSection = null;
                return;
            }
            
            if (activeTitle) {
                const section = activeTitle.closest('section');
                const titleText = activeTitle.textContent;
                const titleRect = activeTitle.getBoundingClientRect();
                
                // Only show pill starting from experience section
                // Delay showing in experience by 100px scroll (about 1/4 of typical viewport)
                if (section.id === 'about') {
                    stickyHeader.classList.remove('visible');
                    currentSection = null;
                    return;
                }
                
                // In experience section, only show after scrolling a bit into it
                if (section.id === 'experience' && titleRect.top > -100) {
                    stickyHeader.classList.remove('visible');
                    currentSection = null;
                    return;
                }
                
                // Only update if section changed
                if (currentSection !== section.id) {
                    currentSection = section.id;
                    
                    // Measure the new text width using a hidden element
                    const measureSpan = document.createElement('span');
                    measureSpan.style.cssText = `
                        position: absolute;
                        visibility: hidden;
                        white-space: nowrap;
                        font-family: var(--font-display);
                        font-size: 0.75rem;
                        font-weight: 600;
                        letter-spacing: 0.03em;
                    `;
                    measureSpan.textContent = titleText;
                    document.body.appendChild(measureSpan);
                    const newWidth = measureSpan.offsetWidth + 40; // +40 for padding (20px each side)
                    document.body.removeChild(measureSpan);
                    
                    // Get the sticky header content element
                    const stickyHeaderContent = stickyHeader.querySelector('.sticky-header-content');
                    
                    // Crossfade: fade out, change text, fade in with width animation
                    stickyHeaderText.classList.remove('active');
                    
                    setTimeout(() => {
                        stickyHeaderText.textContent = titleText;
                        stickyHeaderContent.style.width = newWidth + 'px';
                        stickyHeaderText.classList.add('active');
                    }, 150);
                }
                
                stickyHeader.classList.add('visible');
            } else {
                stickyHeader.classList.remove('visible');
                currentSection = null;
            }
        };

        // Use IntersectionObserver to detect when titles cross the viewport top
        // rootMargin pushes the detection line 80px from the top
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const title = entry.target;
                const section = title.closest('section');
                
                if (section) {
                    // Store intersection ratio for this title
                    if (entry.isIntersecting) {
                        intersectingTitles.set(section.id, {
                            title: title,
                            boundingClientRect: entry.boundingClientRect
                        });
                    } else {
                        intersectingTitles.delete(section.id);
                    }
                }
                
                updateStickyHeader();
            });
        }, {
            // Detect when any part of the title crosses the threshold line
            threshold: 0,
            // The rootMargin creates a detection line at 80px from top
            // Negative value means "inside the viewport"
            rootMargin: '-80px 0px 0px 0px'
        });

        // Observe each section title
        sectionTitles.forEach(title => {
            titleObserver.observe(title);
        });

        // Also update on scroll for smoothness (handles cases where intersection observer might miss)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Check if we're near the bottom of the page
                    const scrollPosition = window.scrollY + window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;
                    const isNearBottom = (documentHeight - scrollPosition) < 100;
                    
                    if (isNearBottom) {
                        stickyHeader.classList.remove('visible');
                    } else {
                        updateStickyHeader();
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateStickyHeader();
        
        // ===== Expandable Menu Functionality =====
        const stickyHeaderContent = stickyHeader.querySelector('.sticky-header-content');
        const stickyNav = stickyHeader.querySelector('.sticky-header-nav');
        const navItems = stickyHeader.querySelectorAll('.sticky-nav-item');
        
        // Toggle expanded state on click
        stickyHeaderContent.addEventListener('click', (e) => {
            // Don't toggle if clicking a nav link (let it handle navigation)
            if (e.target.closest('.sticky-nav-item')) {
                return;
            }
            
            stickyHeader.classList.toggle('expanded');
            
            // Update active state on nav items when opening
            if (stickyHeader.classList.contains('expanded') && currentSection) {
                navItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.section === currentSection);
                });
            }
        });
        
        // Handle nav item clicks
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetSection = document.getElementById(item.dataset.section);
                if (targetSection) {
                    // Collapse menu
                    stickyHeader.classList.remove('expanded');
                    
                    // Get the section title to calculate scroll position
                    const sectionTitle = targetSection.querySelector('.section-title');
                    const targetElement = sectionTitle || targetSection;
                    const rect = targetElement.getBoundingClientRect();
                    const scrollTarget = window.scrollY + rect.top - 16;
                    
                    // Smooth scroll so pill covers the heading (pill is at top: 12px)
                    window.scrollTo({
                        top: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (stickyHeader.classList.contains('expanded') && 
                !stickyHeader.contains(e.target)) {
                stickyHeader.classList.remove('expanded');
            }
        });
        
        // Collapse pill when user scrolls
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (stickyHeader.classList.contains('expanded')) {
                const currentScrollY = window.scrollY;
                // Only collapse if there's actual scroll movement (not just initial state)
                if (Math.abs(currentScrollY - lastScrollY) > 5) {
                    stickyHeader.classList.remove('expanded');
                }
                lastScrollY = currentScrollY;
            }
        }, { passive: true });
        
        // Update nav item active state when section changes
        const originalUpdateStickyHeader = updateStickyHeader;
        updateStickyHeader = function() {
            const prevSection = currentSection;
            originalUpdateStickyHeader();
            
            // If section changed and menu is expanded, update active states
            if (currentSection !== prevSection && stickyHeader.classList.contains('expanded')) {
                navItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.section === currentSection);
                });
            }
        };
    }

    // ===== Page Load Animation =====
    if (!prefersReducedMotion) {
        document.body.classList.add('page-loaded');
    }
});
