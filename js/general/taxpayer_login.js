// Taxpayer Login JavaScript

// Global captcha text variable
let captchaText = '';

// Generate Captcha
function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate random captcha text (6 characters - mix of letters and numbers)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    captchaText = '';
    for (let i = 0; i < 6; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Set background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise lines
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    // Draw text with different colors and positions
    ctx.font = '20px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < captchaText.length; i++) {
        ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.save();
        ctx.translate(15 + i * 15, 15);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }
    
    // Add some noise dots
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
}

// Initialize captcha on page load
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial captcha
    generateCaptcha();
    
    // Reload captcha button
    const reloadBtn = document.getElementById('button-1058-btnEl');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            generateCaptcha();
            // Clear captcha input
            document.getElementById('captchaInput').value = '';
        });
    }
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    console.log('Login button found:', loginBtn);
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            console.log('Login button clicked!');
            e.preventDefault();
            
            // Get form values
            const panNumber = document.getElementById('panNumber').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const captchaInput = document.getElementById('captchaInput').value.trim();
            
            // Validation
            if (!panNumber) {
                alert('कृपया स्थायी लेखा नम्बर प्रविष्ट गर्नुहोस्। (Please enter PAN Number)');
                document.getElementById('panNumber').focus();
                return;
            }
            
            if (panNumber.length !== 9) {
                alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ। (PAN Number must be 9 digits)');
                document.getElementById('panNumber').focus();
                return;
            }
            
            if (!username) {
                alert('कृपया प्रयोगकर्ताको नाम प्रविष्ट गर्नुहोस्। (Please enter Username)');
                document.getElementById('username').focus();
                return;
            }
            
            if (!password) {
                alert('कृपया पासवर्ड प्रविष्ट गर्नुहोस्। (Please enter Password)');
                document.getElementById('password').focus();
                return;
            }
            
            if (!captchaInput) {
                alert('कृपया Captcha प्रविष्ट गर्नुहोस्। (Please enter Captcha)');
                document.getElementById('captchaInput').focus();
                return;
            }
            
            // Validate captcha (case-insensitive)
            if (captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
                alert('Captcha मेल खाएन। कृपया पुन: प्रयास गर्नुहोस्। (Captcha does not match. Please try again)');
                generateCaptcha();
                document.getElementById('captchaInput').value = '';
                document.getElementById('captchaInput').focus();
                return;
            }
            
            // Create login data object
            const loginData = {
                panNumber: panNumber,
                username: username,
                password: password,
                ipAddress: '127.0.0.1', // Default IP address
                timestamp: new Date().toLocaleString()
            };
            
            // Log to console
            console.log('=== Taxpayer Login Attempt ===');
            console.log('PAN Number:', loginData.panNumber);
            console.log('Username:', loginData.username);
            console.log('IP Address:', loginData.ipAddress);
            console.log('Timestamp:', loginData.timestamp);
            console.log('Full Data:', loginData);
            console.log('==============================');
            
            // Save to localStorage
            const loginAttempts = JSON.parse(localStorage.getItem('taxpayerLoginAttempts') || '[]');
            loginAttempts.push(loginData);
            localStorage.setItem('taxpayerLoginAttempts', JSON.stringify(loginAttempts));
            localStorage.setItem('lastLoginAttempt', JSON.stringify(loginData));
            
            // Redirect to dashboard
            window.location.href = 'taxpayer_dashboard.html';
        });
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear all fields
            document.getElementById('panNumber').value = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('captchaInput').value = '';
            
            // Regenerate captcha
            generateCaptcha();
            
            console.log('Form cleared');
        });
    }
    
    // PAN Number validation (numbers only, max 9 digits)
    const panInput = document.getElementById('panNumber');
    if (panInput) {
        panInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 9) {
                this.value = this.value.substring(0, 9);
            }
        });
    }
    
    // Enter key support
    const formInputs = [
        document.getElementById('panNumber'),
        document.getElementById('username'),
        document.getElementById('password'),
        document.getElementById('captchaInput')
    ];
    
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    loginBtn.click();
                }
            });
        }
    });
});

console.log('Taxpayer Login page loaded');
