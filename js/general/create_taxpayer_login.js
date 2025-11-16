// Create Taxpayer Login JavaScript

window.captchaText2 = '';

document.addEventListener('DOMContentLoaded', function() {
    // Generate captcha
    generateCaptcha2();
    
    // Add event listeners
    const createBtn = document.getElementById('createTaxpayerBtn');
    const clearBtn = document.getElementById('clearTaxpayerBtn');
    
    if (createBtn) {
        createBtn.addEventListener('click', createTaxpayer);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }
});

function generateCaptcha2() {
    const canvas = document.getElementById('captchaCanvas2');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate random captcha text
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    window.captchaText2 = captcha;
    
    // Draw background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    ctx.font = 'italic 20px cursive';
    ctx.fillStyle = '#333';
    ctx.fillText(captcha, 10, 22);
    
    // Add some noise lines
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
}

function createTaxpayer() {
    const panInput = document.getElementById('panInput');
    const taxpayerNameInput = document.getElementById('taxpayerNameInput');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const emailInput = document.getElementById('emailInput');
    const mobileInput = document.getElementById('mobileInput');
    const captchaInput = document.getElementById('captchaInput');
    
    const pan = panInput.value.trim();
    const taxpayerName = taxpayerNameInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();
    const captchaEntered = captchaInput.value.trim();
    
    // Validate PAN
    if (!pan || pan.length !== 9) {
        alert('कृपया ९ अंकको स्थायी लेखा नम्बर भर्नुहोस् । (Please enter 9-digit PAN Number)');
        panInput.focus();
        return;
    }
    
    // Validate Password
    if (!password) {
        alert('कृपया पासवर्ड भर्नुहोस् । (Please enter Password)');
        passwordInput.focus();
        return;
    }
    
    // Validate password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@#%^&*]/.test(password);
    const hasNoSpace = !/\s/.test(password);
    
    if (!hasNoSpace) {
        alert('पासवर्डमा खाली ठाउँ हुनु हुँदैन। (Password should not contain spaces)');
        return;
    }
    if (!hasUpperCase) {
        alert('कम्तीमा एउटा ठूलो अक्षर (A-Z) हुनुपर्छ। (At least one capital letter required)');
        return;
    }
    if (!hasLowerCase) {
        alert('कम्तीमा एउटा सानो अक्षर (a-z) हुनुपर्छ। (At least one small letter required)');
        return;
    }
    if (!hasNumber) {
        alert('कम्तीमा एउटा अंक (0-9) हुनुपर्छ। (At least one number required)');
        return;
    }
    if (!hasSpecialChar) {
        alert('कम्तीमा एउटा विशेष चिन्ह (@#%^&*) हुनुपर्छ। (At least one special character required)');
        return;
    }
    
    // Confirm password match
    if (password !== confirmPassword) {
        alert('पासवर्ड मेल खाएन ! (Passwords do not match!)');
        confirmPasswordInput.focus();
        return;
    }
    
    // Validate Captcha
    if (!captchaEntered) {
        alert('कृपया CAPTCHA भर्नुहोस् । (Please enter CAPTCHA)');
        captchaInput.focus();
        return;
    }
    
    if (captchaEntered !== window.captchaText2) {
        alert('गलत CAPTCHA ! (Incorrect CAPTCHA!)');
        captchaInput.value = '';
        generateCaptcha2();
        return;
    }
    
    // Get existing taxpayers from localStorage
    let taxpayers = JSON.parse(localStorage.getItem('taxpayers') || '[]');
    
    // Check if PAN already exists
    if (taxpayers.find(t => t.pan === pan)) {
        alert('यो स्थायी लेखा नम्बर पहिले नै दर्ता भइसकेको छ ! (This PAN is already registered!)');
        return;
    }
    
    // Check if username already exists
    if (taxpayers.find(t => t.username === username)) {
        alert('यो प्रयोगकर्ताको नाम पहिले नै प्रयोग भइसकेको छ ! (This username is already taken!)');
        return;
    }
    
    // Create new taxpayer
    const newTaxpayer = {
        pan: pan,
        taxpayerName: taxpayerName || 'Taxpayer',
        username: username || pan,
        password: password,
        email: email,
        mobile: mobile,
        registeredDate: new Date().toISOString()
    };
    
    taxpayers.push(newTaxpayer);
    localStorage.setItem('taxpayers', JSON.stringify(taxpayers));
    
    alert('दर्ता सफल भयो ! (Registration Successful!)\n\n' +
          'PAN: ' + pan + '\n' +
          'Username: ' + (username || pan) + '\n\n' +
          'कृपया लगइन गर्न "Taxpayer Login" मा जानुहोस् ।\n' +
          '(Please go to "Taxpayer Login" to login)');
    
    // Clear form
    clearForm();
}

function clearForm() {
    document.getElementById('panInput').value = '';
    document.getElementById('taxpayerNameInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('confirmPasswordInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('mobileInput').value = '';
    document.getElementById('captchaInput').value = '';
    generateCaptcha2();
}
