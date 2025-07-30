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

