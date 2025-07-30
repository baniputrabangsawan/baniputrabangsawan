// Global variables
let currentFilter = 'all';
let currentTheme = localStorage.getItem('theme') || 'light';
let currentLightboxIndex = 0;
let typingIndex = 0;
let typingText = 'Bani Putra Bangsawan';
let isTyping = true;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Fallback: Hide loading screen after window load
window.addEventListener('load', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }, 500);
});

function initializeApp() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Initialize components
    try {
        initializeParticles();
        initializeCustomCursor();
        initializeScrollEffects();
        initializeNavigation();
        initializeTypingEffect();
        initializePortfolio();
        initializeGallery();
        initializeContactForm();
        initializeSkillBars();
        initializeCounters();
        
        // Hide loading screen immediately after initialization
        hideLoadingScreen();
    } catch (error) {
        console.error('Initialization error:', error);
        // Still hide loading screen even if there's an error
        hideLoadingScreen();
    }
}

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 600);
        }
    }, 800);
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('themeToggle');

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// Gallery functionality
function initializeGallery() {
    renderGalleryItems();
}

function renderGalleryItems() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    galleryData.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        galleryGrid.appendChild(galleryItem);
    });

    // Animate gallery items
    setTimeout(() => {
        const items = galleryGrid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'translateY(30px)';
    galleryItem.style.transition = 'all 0.6s ease';

    galleryItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="gallery-image" loading="lazy">
        <div class="gallery-overlay">
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-description">${item.description}</p>
            <button class="gallery-view-btn" onclick="openGalleryLightbox(${index})" aria-label="View full image">
                View Full Image
            </button>
        </div>
    `;

    return galleryItem;
}

// Gallery lightbox functions
function openGalleryLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    currentLightboxIndex = index;
    lightboxImage.src = galleryData[index].image;
    lightboxImage.alt = galleryData[index].title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function navigateGalleryLightbox(direction) {
    if (direction === 'prev') {
        currentLightboxIndex = currentLightboxIndex === 0 
            ? galleryData.length - 1 
            : currentLightboxIndex - 1;
    } else {
        currentLightboxIndex = currentLightboxIndex === galleryData.length - 1 
            ? 0 
            : currentLightboxIndex + 1;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = galleryData[currentLightboxIndex].image;
    lightboxImage.alt = galleryData[currentLightboxIndex].title;
}

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    const filteredItems = currentFilter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === currentFilter);

    currentLightboxIndex = index;
    lightboxImage.src = filteredItems[index].image;
    lightboxImage.alt = filteredItems[index].title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    const filteredItems = currentFilter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === currentFilter);

    if (direction === 'prev') {
        currentLightboxIndex = currentLightboxIndex === 0 
            ? filteredItems.length - 1 
            : currentLightboxIndex - 1;
    } else {
        currentLightboxIndex = currentLightboxIndex === filteredItems.length - 1 
            ? 0 
            : currentLightboxIndex + 1;
    }

    const lightboxImage = document.getElementById('lightboxImage');
    lightboxImage.src = filteredItems[currentLightboxIndex].image;
    lightboxImage.alt = filteredItems[currentLightboxIndex].title;
}

// Scroll effects
function initializeScrollEffects() {
    const scrollTopBtn = document.getElementById('scrollTop');

    // Scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Trigger specific animations
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Skill bars animation
function initializeSkillBars() {
    // This will be triggered by intersection observer
}

function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        }, index * 200);
    });
}

// Counter animation
function initializeCounters() {
    // This will be triggered by intersection observer
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
            } else {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    });
}

// Contact form functionality
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const formControls = form.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('blur', () => validateField(control));
            control.addEventListener('input', () => clearFieldError(control));
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        default:
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (field.id === 'message' && value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
    }

    updateFieldValidation(field, isValid, errorMessage);
    return isValid;
}

function updateFieldValidation(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    field.classList.remove('error', 'success');
    if (errorElement) {
        errorElement.classList.remove('show');
    }

    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    } else if (field.value.trim()) {
        field.classList.add('success');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// UPDATED: Handle form submit dengan EmailJS integration
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    
    // Validasi email sebelum kirim
    const emailInput = document.getElementById('email');
    const emailValue = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(emailValue)) {
        showErrorNotification('Format email tidak valid! Silakan periksa kembali.');
        return;
    }
    
    // Validate all fields
    const formControls = form.querySelectorAll('.form-control');
    let isFormValid = true;
    
    formControls.forEach(control => {
        if (!validateField(control)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Kirim email menggunakan EmailJS
        await emailjs.sendForm(
            'service_cdc8512',
            'template_1dicw5i',
            form
        );
        
        // Show success message
        showSuccessNotification('Pesan berhasil dikirim! Terima kasih.');
        form.reset();
        
        // Clear field validation states
        formControls.forEach(control => {
            control.classList.remove('error', 'success');
        });
        
    } catch (error) {
        console.error('Error:', error);
        showErrorNotification('Maaf, terjadi kesalahan. Silakan coba lagi.');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// NOTE: Notification functions are now handled by emailKonfigurasi.js
// All showSuccessNotification() and showErrorNotification() calls will use
// the functions from emailKonfigurasi.js with Poppins font and smooth green color

// Legacy showNotification for backward compatibility
function showNotification(message, type) {
    if (type === 'success' || type === 'berhasil') {
        showSuccessNotification(message);
    } else {
        showErrorNotification(message);
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add smooth scrolling for navigation links
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link') || e.target.matches('.hero-cta')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// CSS animations for slideInRight/slideOutRight are now handled by emailKonfigurasi.js

// Enhanced mobile navigation with improved spacing and touch interactions
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('themeToggle');
    
    // Create overlay for mobile menu
    let overlay = document.getElementById('navMenuOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-menu-overlay';
        overlay.id = 'navMenuOverlay';
        document.body.appendChild(overlay);
    }

    // Enhanced hamburger menu toggle
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking on overlay
    overlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close menu when clicking on nav link with smooth transition
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add smooth closing animation
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    closeMobileMenu();
                }, 100);
            }
        });
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Tab navigation within mobile menu
        if (e.key === 'Tab' && navMenu.classList.contains('active')) {
            const focusableElements = navMenu.querySelectorAll('.nav-link');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Improved header scroll effect with mobile optimization
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-close mobile menu on significant scroll
        if (Math.abs(scrollY - lastScrollY) > 100 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Enhanced theme toggle with better mobile UX
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
        
        // Add visual feedback for mobile
        if (window.innerWidth <= 768) {
            themeToggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 150);
        }
    });

    // Active navigation highlighting with mobile optimization
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100), { passive: true });

    // Handle window resize with debouncing
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        
        // Recalculate navigation spacing
        adjustNavigationSpacing();
    }, 250));

    // Touch gesture improvements
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    navMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        const swipeDistanceX = touchStartX - touchEndX;
        const swipeDistanceY = touchStartY - touchEndY;
        
        // Swipe up or right to close menu
        if ((swipeDistanceY > swipeThreshold) || (swipeDistanceX < -swipeThreshold)) {
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    }

    // Functions for mobile menu control with improved animations
    function toggleMobileMenu() {
        const isActive = hamburger.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        // Add opening animation
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
        
        // ARIA attributes
        navMenu.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-expanded', 'true');
        
        // Focus management with delay for animation
        setTimeout(() => {
            const firstNavLink = navMenu.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }, 300);
        
        // Animate menu items
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }

    function closeMobileMenu() {
        // Add closing animation
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }, index * 30);
        });
        
        setTimeout(() => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset menu items
            menuItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
            });
        }, 200);
        
        // ARIA attributes
        navMenu.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Return focus to hamburger
        hamburger.focus();
    }

    // Adjust navigation spacing dynamically
    function adjustNavigationSpacing() {
        if (window.innerWidth <= 768) {
            const nav = document.querySelector('.nav');
            const logo = document.querySelector('.logo');
            const themeToggle = document.getElementById('themeToggle');
            const hamburger = document.getElementById('hamburger');
            
            // Ensure proper spacing
            if (nav && logo && themeToggle && hamburger) {
                nav.style.display = 'flex';
                nav.style.justifyContent = 'space-between';
                nav.style.alignItems = 'center';
                nav.style.gap = '1rem';
                
                logo.style.marginRight = 'auto';
                themeToggle.style.marginLeft = 'auto';
                themeToggle.style.marginRight = '1rem';
                hamburger.style.marginLeft = '0.5rem';
            }
        }
    }

    // Initialize proper spacing on load
    adjustNavigationSpacing();

    // Initialize ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navMenu');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navMenu.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('role', 'navigation');
    navMenu.setAttribute('aria-label', 'Main navigation');
}

// Enhanced theme toggle with mobile optimizations
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Add smooth transition for theme change
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    // Update theme toggle button for screen readers
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.title = 'Switch to light mode';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.title = 'Switch to dark mode';
    }
    
    // Mobile haptic feedback simulation
    if (window.innerWidth <= 768 && 'vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.title = 'Switch to light mode';
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.title = 'Switch to dark mode';
    }
}

// Enhanced active navigation highlighting with mobile optimization
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPosition = window.scrollY + (window.innerHeight * 0.3);

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    // Default to home if no section is active
    if (!current && window.scrollY < 100) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
}

// Enhanced smooth scroll with mobile optimization
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const header = document.getElementById('header');
    const headerHeight = header ? header.offsetHeight : 70;
    const targetPosition = section.offsetTop - headerHeight - 20;
    
    // Use different scroll behavior for mobile
    const isMobile = window.innerWidth <= 768;
    const scrollOptions = {
        top: targetPosition,
        behavior: isMobile ? 'auto' : 'smooth' // Auto scroll for better mobile performance
    };
    
    // For mobile, use manual smooth scroll for better control
    if (isMobile) {
        smoothScrollTo(targetPosition, 600);
    } else {
        window.scrollTo(scrollOptions);
    }
}

// Custom smooth scroll function for mobile
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth animation
        const ease = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + (distance * ease));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Easing function
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Enhanced click handler for navigation with mobile improvements
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link') || e.target.matches('.hero-cta')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        
        // Add visual feedback for mobile
        if (window.innerWidth <= 768) {
            e.target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
        
        scrollToSection(targetId);
    }
});

// Mobile performance optimizations
if ('IntersectionObserver' in window) {
    const mobileOptimization = () => {
        const isMobile = window.innerWidth <= 768;
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        if (isMobile) {
            // Reduce animations on mobile for better performance
            animatedElements.forEach(el => {
                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
            
            // Disable parallax effects on mobile
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(el => {
                el.style.transform = 'none';
            });
        }
    };
    
    window.addEventListener('resize', debounce(mobileOptimization, 250));
    mobileOptimization(); // Run on load
}

// Mobile viewport height fix
function setMobileViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', debounce(setMobileViewportHeight, 250));
setMobileViewportHeight();

// Enhanced initialization with mobile focus
document.addEventListener('DOMContentLoaded', function() {
    // Ensure hamburger has proper structure
    const hamburger = document.getElementById('hamburger');
    if (hamburger && hamburger.children.length < 3) {
        hamburger.innerHTML = '<span></span><span></span><span></span>';
    }
    
    // Add mobile-specific classes
    if (window.innerWidth <= 768) {
        document.body.classList.add('mobile-device');
    }
    
    // Prevent zoom on input focus for iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
            });
            input.addEventListener('blur', () => {
                input.style.fontSize = '';
            });
        });
    }
    
    // Initialize mobile touch events
    initializeMobileTouchEvents();
});

// Mobile touch events initialization
function initializeMobileTouchEvents() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button, .btn, .nav-link, .social-link');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
        
        button.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
}

// Service Worker registration for mobile performance (optional)
if ('serviceWorker' in navigator && window.innerWidth <= 768) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Mobile battery optimization
if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2) {
            // Reduce animations when battery is low
            document.body.classList.add('low-battery');
            const style = document.createElement('style');
            style.textContent = `
                .low-battery * {
                    animation-duration: 0.1s !important;
                    transition-duration: 0.1s !important;
                }
            `;
            document.head.appendChild(style);
        }
    });
}