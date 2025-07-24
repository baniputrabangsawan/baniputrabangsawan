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

// Enhanced Navigation functionality for mobile
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    const themeToggle = document.getElementById('themeToggle');
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-menu-overlay';
    overlay.id = 'navMenuOverlay';
    document.body.appendChild(overlay);

    // Hamburger menu toggle with improved functionality
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking on overlay
    overlay.addEventListener('click', () => {
        closeMobileMenu();
    });

    // Close menu when clicking on nav link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't prevent default for navigation
            closeMobileMenu();
        });
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide mobile menu on scroll (optional)
        if (Math.abs(window.scrollY - lastScrollY) > 50 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
        lastScrollY = window.scrollY;
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Functions for mobile menu control
    function toggleMobileMenu() {
        const isActive = hamburger.classList.contains('active');
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Focus management for accessibility
        navMenu.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item
        const firstNavLink = navMenu.querySelector('.nav-link');
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 300);
        }
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Focus management for accessibility
        navMenu.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-expanded', 'false');
        
        // Return focus to hamburger button
        hamburger.focus();
    }

    // Initialize ARIA attributes
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'navMenu');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navMenu.setAttribute('aria-expanded', 'false');
}

// Enhanced theme toggle function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    
    // Update theme toggle button text for screen readers
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Enhanced active navigation highlighting
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPosition = window.scrollY + 200; // Offset for better UX

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current || 
            (current === '' && link.getAttribute('data-section') === 'home')) {
            link.classList.add('active');
        }
    });
}

// Smooth scroll function with mobile optimization
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Enhanced click handler for navigation
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link') || e.target.matches('.hero-cta')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Touch gesture support for mobile menu (optional enhancement)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
}, { passive: true });

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    // Only handle swipes when menu is open
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        // Swipe up to close menu
        if (swipeDistance > swipeThreshold) {
            const hamburger = document.getElementById('hamburger');
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.getElementById('navMenuOverlay').classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    }
}

// Improved mobile performance
if ('IntersectionObserver' in window) {
    const mobileOptimization = () => {
        const isMobile = window.innerWidth <= 768;
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        if (isMobile) {
            // Reduce animations on mobile for better performance
            animatedElements.forEach(el => {
                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
        }
    };
    
    window.addEventListener('resize', mobileOptimization);
    mobileOptimization(); // Run on load
}

// Ensure proper initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional mobile-specific initialization here
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        // Ensure hamburger has proper structure
        if (hamburger.children.length < 3) {
            hamburger.innerHTML = '<span></span><span></span><span></span>';
        }
    }
});