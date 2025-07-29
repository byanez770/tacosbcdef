// Tacos Baja California 664 - Presentation JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initScrollAnimations();
    initPillarInteractions();
    initWhatsAppTracking();
});

// Navigation functionality
function initNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');

    // Smooth scroll for navigation dots
    navDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = dot.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active dot
                navDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation dot based on scroll position
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                const sectionHeight = section.offsetHeight;
                
                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            if (current) {
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${current}`) {
                        dot.classList.add('active');
                    }
                });
            }
        }, 100);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenu');
    const mobileMenu = document.getElementById('mobileMenuOverlay');
    const menuLinks = mobileMenu.querySelectorAll('a');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close menu
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            
            // Scroll to section
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    });
}

// Scroll animations using IntersectionObserver
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Animate specific elements within sections
                animateSectionElements(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections except hero
    const sections = document.querySelectorAll('.section:not(.hero-section)');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animate elements within sections
function animateSectionElements(section) {
    // Animate FODA cards
    if (section.id === 'diagnostico') {
        const fodaCards = section.querySelectorAll('.foda-card');
        fodaCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // Animate timeline items
    if (section.id === 'objetivos') {
        const timelineItems = section.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    // Animate pillar cards
    if (section.id === 'estrategia') {
        const pillarCards = section.querySelectorAll('.pillar-card');
        pillarCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 150);
        });
    }

    // Animate media circles
    if (section.id === 'media') {
        const mediaCircles = section.querySelectorAll('.media-circle');
        mediaCircles.forEach((circle, index) => {
            setTimeout(() => {
                animatePercentage(circle);
            }, index * 200);
        });
    }
}

// Animate percentage numbers
function animatePercentage(circle) {
    const percentageElement = circle.querySelector('.percentage');
    const targetValue = parseInt(circle.getAttribute('data-percentage'));
    let currentValue = 0;
    const increment = targetValue / 30;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        percentageElement.textContent = Math.round(currentValue) + '%';
    }, 50);
}

// Pillar card interactions
function initPillarInteractions() {
    const pillarCards = document.querySelectorAll('.pillar-card');
    
    pillarCards.forEach(card => {
        const desc = card.querySelector('.pillar-desc');
        
        if (!desc) return;
        
        // Mouse enter event
        card.addEventListener('mouseenter', () => {
            desc.style.opacity = '1';
            desc.style.height = 'auto';
            desc.style.maxHeight = '100px';
            desc.style.padding = '8px 0 0 0';
            desc.style.transition = 'all 0.3s ease';
        });
        
        // Mouse leave event
        card.addEventListener('mouseleave', () => {
            desc.style.opacity = '0';
            desc.style.height = '0';
            desc.style.maxHeight = '0';
            desc.style.padding = '0';
        });
        
        // Touch support for mobile devices
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            
            // Close all other descriptions first
            pillarCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherDesc = otherCard.querySelector('.pillar-desc');
                    if (otherDesc) {
                        otherDesc.style.opacity = '0';
                        otherDesc.style.height = '0';
                        otherDesc.style.maxHeight = '0';
                        otherDesc.style.padding = '0';
                    }
                }
            });
            
            // Toggle current description
            const isVisible = desc.style.opacity === '1';
            
            if (isVisible) {
                desc.style.opacity = '0';
                desc.style.height = '0';
                desc.style.maxHeight = '0';
                desc.style.padding = '0';
            } else {
                desc.style.opacity = '1';
                desc.style.height = 'auto';
                desc.style.maxHeight = '100px';
                desc.style.padding = '8px 0 0 0';
                desc.style.transition = 'all 0.3s ease';
            }
        });
    });
}

// WhatsApp tracking - Fixed to not interfere with link functionality
function initWhatsAppTracking() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-float, .btn-whatsapp');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Don't prevent default - let the link work normally
            // Just track the click for analytics
            console.log('WhatsApp button clicked:', button.textContent || 'WhatsApp');
            
            // Analytics tracking (if available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'WhatsApp',
                    'event_label': 'Pedidos',
                    'value': 1
                });
            }
            
            // Ensure the link opens - force open if needed
            if (button.href && button.href.includes('wa.me')) {
                // Let the browser handle the link normally
                return true;
            }
        });
    });
}

// Initialize CSS animations for elements that should animate in
function initCSSAnimations() {
    // Set initial states for animated elements
    const fodaCards = document.querySelectorAll('.foda-card');
    fodaCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease';
    });

    const pillarCards = document.querySelectorAll('.pillar-card');
    pillarCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.6s ease';
    });
}

// Call CSS animations initialization
initCSSAnimations();

// Smooth scroll for internal anchor links only
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToNextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToPrevSection();
    }
});

function scrollToNextSection() {
    const sections = document.querySelectorAll('.section');
    const currentScrollY = window.pageYOffset;
    
    for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].offsetTop;
        if (sectionTop > currentScrollY + 100) {
            sections[i].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            break;
        }
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('.section');
    const currentScrollY = window.pageYOffset;
    
    for (let i = sections.length - 1; i >= 0; i--) {
        const sectionTop = sections[i].offsetTop;
        if (sectionTop < currentScrollY - 100) {
            sections[i].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            break;
        }
    }
}

// Add loading animation
function initLoadingAnimation() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

initLoadingAnimation();

// Add enhanced hover effects for interactive elements
function initEnhancedEffects() {
    // Add ripple effect to buttons (but not WhatsApp links)
    const buttons = document.querySelectorAll('.btn-primary:not([href*="wa.me"])');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                background-color: rgba(255,255,255,0.7);
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

initEnhancedEffects();

// Add intersection observer for fade-in animations
function initFadeInAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.stat-item, .help-item, .timeline-content');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

initFadeInAnimations();