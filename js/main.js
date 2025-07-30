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

// Portfolio
// Portfolio data with blue theme
const portfolioData = [
    {
        id: 1,
        title: "Teknik belajar pomodoro",
        description: "Aplikasi Pomodoro modern berbasis HTML, CSS, dan JavaScript dengan antarmuka biru yang elegan dan responsif. Fitur lengkap termasuk pengatur waktu kerja, istirahat pendek, dan istirahat panjang yang dapat disesuaikan, daftar tugas (to-do list) terintegrasi, progress bar animasi, notifikasi suara, serta mode gelap/terang untuk pengalaman pengguna yang lebih nyaman.",
        image: "images/pomodoro.png",
        category: "web",
        tech: ["HTML", "TailwindCSS", "Javascript"],
        demo: "#",
        github: "https://github.com/baniputrabangsawan"
    },
    {
        id: 2,
        title: "Spin kelompok acak",
        description: "Aplikasi Spin Piket Kelas interaktif yang dibangun dengan HTML, CSS, dan JavaScript. Memiliki fitur roda putar untuk pemilihan nama siswa secara acak, pengelompokan otomatis untuk piket, tombol reset, dan antarmuka hijau yang bersih dan responsif sehingga mudah digunakan di perangkat mobile maupun desktop.",
        image: "images/spin.png",
        category: "web",
        tech: ["HTML", "CSS", "Javascript"],
        demo: "#",
        github: "https://github.com/baniputrabangsawan"
    },
];

// Gallery data with blue theme
const galleryData = [
    {
        id: 1,
        title: "Soon",
        description: "",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='web' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%232563eb;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231d4ed8;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23web)' rx='10'/%3E%3Ctext x='200' y='160' font-family='Arial' font-size='50' fill='white' text-anchor='middle'%3E💻%3C/text%3E%3C/svg%3E"
    },
];

// Portfolio functionality
function initializePortfolio() {
    renderPortfolioItems();
    initializePortfolioFilters();
    initializeLightbox();
}

function renderPortfolioItems() {
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';

    const filteredItems = currentFilter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === currentFilter);

    filteredItems.forEach((item, index) => {
        const portfolioItem = createPortfolioItem(item, index);
        portfolioGrid.appendChild(portfolioItem);
    });

    // Animate portfolio items
    setTimeout(() => {
        const items = portfolioGrid.querySelectorAll('.portfolio-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

function createPortfolioItem(item, index) {
    const portfolioItem = document.createElement('div');
    portfolioItem.className = 'portfolio-item';
    portfolioItem.style.opacity = '0';
    portfolioItem.style.transform = 'translateY(30px)';
    portfolioItem.style.transition = 'all 0.6s ease';

    portfolioItem.innerHTML = `
        <div class="portfolio-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-overlay">
                <div class="portfolio-links">
                    <a href="${item.demo}" class="portfolio-link" aria-label="View demo">
                        <i class="fas fa-eye"></i>
                    </a>
                    <a href="${item.github}" class="portfolio-link" aria-label="View code">
                        <i class="fab fa-github"></i>
                    </a>
                    <button class="portfolio-link" onclick="openLightbox(${index})" aria-label="View full image">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-description">${item.description}</p>
            <div class="portfolio-tech">
                ${item.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        </div>
    `;

    return portfolioItem;
}

function initializePortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update current filter
            currentFilter = btn.getAttribute('data-filter');
            
            // Re-render portfolio items
            renderPortfolioItems();
        });
    });
}

// Animation
// Custom cursor
function initializeCustomCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .skill-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Particle background
function initializeParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particles.appendChild(particle);

        // Remove particle after animation and create new one
        particle.addEventListener('animationend', () => {
            if (particle.parentNode) {
                particle.remove();
                createParticle();
            }
        });
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Typing effect
function initializeTypingEffect() {
    const typingElement = document.getElementById('typingText');
    
    function typeText() {
        if (typingIndex < typingText.length) {
            typingElement.textContent += typingText.charAt(typingIndex);
            typingIndex++;
            setTimeout(typeText, 100);
        } else {
            setTimeout(eraseText, 2000);
        }
    }

    function eraseText() {
        if (typingIndex > 0) {
            typingElement.textContent = typingText.substring(0, typingIndex - 1);
            typingIndex--;
            setTimeout(eraseText, 50);
        } else {
            setTimeout(typeText, 500);
        }
    }

    typeText();
}

// emailkonfigurasi
// EmailJS Configuration
// Inisialisasi EmailJS dengan Public Key Anda
emailjs.init("WYUTpG5uGHo1aXZw1");

// EmailJS Service Configuration
const EMAIL_CONFIG = {
    serviceId: 'service_cdc8512',
    templateId: 'template_1dicw5i',
    publicKey: 'WYUTpG5uGHo1aXZw1'
};

// CSS untuk animasi notification (auto-inject)
const notificationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

// Inject CSS styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Enhanced Email Validation Function
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if email exists using Gmail API approach
async function checkEmailExists(email) {
    try {
        // Method 1: Try to check if email domain exists and is valid
        const domain = email.split('@')[1];
        
        // Common email providers that we know exist
        const knownProviders = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
            'aol.com', 'icloud.com', 'live.com', 'msn.com',
            'yandex.com', 'protonmail.com', 'zoho.com'
        ];
        
        if (knownProviders.includes(domain.toLowerCase())) {
            return { exists: true, provider: domain };
        }
        
        // Method 2: Try a simple fetch to check domain validity
        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
            const data = await response.json();
            
            if (data.Answer && data.Answer.length > 0) {
                return { exists: true, provider: domain };
            }
        } catch (dnsError) {
            console.log('DNS check failed:', dnsError);
        }
        
        // Method 3: If all else fails, assume email might not be registered
        return { exists: false, provider: domain };
        
    } catch (error) {
        console.log('Email validation error:', error);
        // If validation fails, assume email is valid to avoid false positives
        return { exists: true, provider: 'unknown' };
    }
}

// Advanced email validation with existence check
async function validateEmailExistence(email) {
    // First check format
    if (!validateEmailFormat(email)) {
        return { isValid: false, message: 'Format email tidak valid' };
    }
    
    // Then check if email exists
    const emailCheck = await checkEmailExists(email);
    
    if (!emailCheck.exists) {
        return { 
            isValid: false, 
            message: 'Email Anda belum terdaftar di Google atau provider email yang valid' 
        };
    }
    
    return { isValid: true, message: 'Email valid' };
}

// Enhanced Form Validation with email existence check
async function validateContactForm(form) {
    const errors = [];
    
    // Get form fields
    const firstName = form.querySelector('#firstName, [name="nama_depan"]');
    const lastName = form.querySelector('#lastName, [name="nama_belakang"]');
    const email = form.querySelector('#email, [name="email"]');
    const subject = form.querySelector('#subject, [name="subjek"]');
    const message = form.querySelector('#message, [name="pesan"]');
    
    // Validate first name
    if (firstName && !firstName.value.trim()) {
        errors.push('Nama depan harus diisi');
    }
    
    // Validate last name
    if (lastName && !lastName.value.trim()) {
        errors.push('Nama belakang harus diisi');
    }
    
    // Validate email format and existence
    if (!email || !email.value.trim()) {
        errors.push('Email harus diisi');
    } else {
        const emailValidation = await validateEmailExistence(email.value.trim());
        if (!emailValidation.isValid) {
            errors.push(emailValidation.message);
        }
    }
    
    // Validate message
    if (!message || !message.value.trim()) {
        errors.push('Pesan harus diisi');
    } else if (message.value.trim().length < 10) {
        errors.push('Pesan minimal 10 karakter');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Send Email Function
async function sendEmailViaEmailJS(form) {
    try {
        const response = await emailjs.sendForm(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            form
        );
        
        console.log('EmailJS Success:', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        
        // Handle specific EmailJS errors
        let errorMessage = 'Terjadi kesalahan saat mengirim email.';
        
        if (error.status === 400) {
            errorMessage = 'Data form tidak valid.';
        } else if (error.status === 402) {
            errorMessage = 'Layanan email tidak tersedia.';
        } else if (error.status === 403) {
            errorMessage = 'Akses ditolak.';
        } else if (error.status === 429) {
            errorMessage = 'Terlalu banyak permintaan. Coba lagi nanti.';
        }
        
        return { 
            success: false, 
            error: errorMessage,
            originalError: error 
        };
    }
}

// Button State Management
function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const loadingSpinner = button.querySelector('.loading-spinner');
    
    if (isLoading) {
        button.disabled = true;
        button.classList.add('loading');
        
        if (btnText) btnText.textContent = 'Mengirim...';
        if (loadingSpinner) loadingSpinner.style.display = 'block';
    } else {
        button.disabled = false;
        button.classList.remove('loading');
        
        if (btnText) btnText.textContent = 'Kirim Pesan';
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Success Notification
function showSuccessNotification(message) {
    createNotification(message, 'success');
}

// Error Notification
function showErrorNotification(message) {
    createNotification(message, 'error');
}

// Info Notification (for loading states)
function showInfoNotification(message) {
    createNotification(message, 'info');
}

// Generic Notification Creator
function createNotification(message, type = 'success') {
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const isInfo = type === 'info';
    
    let bgColor = '#10b981'; // Default green
    if (isError) bgColor = '#dc2626'; // Red
    if (isInfo) bgColor = '#3b82f6'; // Blue
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 320px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after different durations
    const duration = isInfo ? 2000 : 4000; // Info messages shorter
    
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Click to remove immediately
    notification.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    return notification;
}

// Remove Notification with Animation
function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// Main Email Sending Handler with email existence validation
async function handleEmailSubmission(form) {
    const submitButton = form.querySelector('#submitBtn, [type="submit"]');
    
    try {
        // Set loading state
        setButtonLoading(submitButton, true);
        
        // Show checking email message
        showInfoNotification('Memvalidasi email...');
        
        // Validate form (including email existence)
        const validation = await validateContactForm(form);
        if (!validation.isValid) {
            showErrorNotification(validation.errors[0]);
            return false;
        }
        
        // Send email
        const result = await sendEmailViaEmailJS(form);
        
        if (result.success) {
            showSuccessNotification('Pesan berhasil dikirim! Terima kasih.');
            form.reset();
            
            // Clear any validation states
            const formControls = form.querySelectorAll('.form-control');
            formControls.forEach(control => {
                control.classList.remove('error', 'success');
            });
            
            return true;
        } else {
            showErrorNotification(result.error);
            return false;
        }
        
    } catch (error) {
        console.error('Email submission error:', error);
        showErrorNotification('Terjadi kesalahan yang tidak terduga.');
        return false;
    } finally {
        // Reset button state
        setButtonLoading(submitButton, false);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('EmailJS Configuration loaded');
    
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not found. Please include EmailJS script before this file.');
        return;
    }
    
    console.log('EmailJS initialized with service:', EMAIL_CONFIG.serviceId);
});

// Export functions for global access
window.EmailJSHelper = {
    sendEmail: handleEmailSubmission,
    showSuccess: showSuccessNotification,
    showError: showErrorNotification,
    validateForm: validateContactForm,
    config: EMAIL_CONFIG
};