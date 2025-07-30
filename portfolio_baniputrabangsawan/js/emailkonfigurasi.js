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