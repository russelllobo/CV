// Minimal interactions

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('section > .container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // CV Preview functionality
    const cvLink = document.getElementById('cv-link');
    const cvPanel = document.getElementById('cv-panel');
    const cvLinkText = cvLink ? cvLink.querySelector('.cv-link-text') : null;
    const cvClose = cvPanel ? cvPanel.querySelector('.cv-preview-close') : null;

    if (cvLink && cvPanel) {
        const isMobile = window.matchMedia('(max-width: 640px)').matches || 'ontouchstart' in window;
        let isPreviewVisible = false;
        const defaultText = cvLinkText ? cvLinkText.textContent : 'cv';
        const promptText = 'click again to open';
        const pdfUrl = cvLink.getAttribute('href');
        
        if (isMobile) {
            // Mobile: click to toggle preview, image click opens PDF
            cvLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isPreviewVisible) {
                    document.body.classList.add('cv-hover');
                    isPreviewVisible = true;
                    if (cvLinkText) cvLinkText.textContent = promptText;
                    // Scroll so CV preview is visible with some padding at top
                    setTimeout(() => {
                        const cvPanelElement = document.getElementById('cv-panel');
                        if (cvPanelElement) {
                            const yOffset = -80; // Offset from top to ensure full image visible
                            const y = cvPanelElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }, 100);
                } else {
                    window.open(pdfUrl, '_blank');
                    document.body.classList.remove('cv-hover');
                    isPreviewVisible = false;
                    if (cvLinkText) cvLinkText.textContent = defaultText;
                }
            });

            // Mobile: close button handler
            if (cvClose) {
                cvClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.body.classList.remove('cv-hover');
                    isPreviewVisible = false;
                    if (cvLinkText) cvLinkText.textContent = defaultText;
                });
            }
        } else {
            // Desktop: hover to preview, click opens PDF
            cvLink.addEventListener('mouseenter', () => {
                document.body.classList.add('cv-hover');
            });
            
            cvLink.addEventListener('mouseleave', () => {
                if (!isPreviewVisible) {
                    document.body.classList.remove('cv-hover');
                }
            });

            cvLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isPreviewVisible) {
                    document.body.classList.add('cv-hover');
                    isPreviewVisible = true;
                    if (cvLinkText) cvLinkText.textContent = promptText;
                } else {
                    window.open(pdfUrl, '_blank');
                    document.body.classList.remove('cv-hover');
                    isPreviewVisible = false;
                    if (cvLinkText) cvLinkText.textContent = defaultText;
                }
            });

            if (cvClose) {
                cvClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.body.classList.remove('cv-hover');
                    isPreviewVisible = false;
                    if (cvLinkText) cvLinkText.textContent = defaultText;
                });
            }
        }
    }
});
