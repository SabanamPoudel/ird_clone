// VAT Return Login JavaScript

function validateForm() {
    const submissionNo = document.getElementById('submissionNoInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    if (!submissionNo) {
        alert('कृपया सब्मिशन नं. भर्नुहोस्!\nPlease enter Submission Number!');
        return false;
    }

    if (!username) {
        alert('कृपया प्रयोगकर्ताको नाम भर्नुहोस्!\nPlease enter Username!');
        return false;
    }

    if (!password) {
        alert('कृपया पासवर्ड भर्नुहोस्!\nPlease enter Password!');
        return false;
    }

    return true;
}

function loginVATReturn() {
    if (!validateForm()) {
        return;
    }

    const submissionNo = document.getElementById('submissionNoInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    // Get taxpayers from localStorage
    const taxpayers = JSON.parse(localStorage.getItem('taxpayers')) || [];

    // Find matching taxpayer
    const taxpayer = taxpayers.find(tp => 
        tp.username === username && 
        tp.password === password
    );

    if (taxpayer) {
        alert('VAT Return Login Successful!\nसब्मिशन नं.: ' + submissionNo + '\nWelcome, ' + taxpayer.taxpayerName);
        console.log('Login successful for taxpayer:', taxpayer);
        console.log('Submission Number:', submissionNo);
        
        // Store submission number for the form
        sessionStorage.setItem('vatSubmissionNo', submissionNo);
        sessionStorage.setItem('vatTaxpayerName', taxpayer.taxpayerName);
        sessionStorage.setItem('vatPAN', taxpayer.pan);
        
        // Load VAT returns form in parent window
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                action: 'loadPage',
                page: 'html/vat/vat_returns_form.html'
            }, '*');
        } else {
            // If not in iframe, redirect directly
            window.location.href = 'vat_returns_form.html';
        }
    } else {
        alert('Login Failed!\nInvalid Username or Password\nलगइन असफल!\nगलत प्रयोगकर्ताको नाम वा पासवर्ड');
    }
}

function resetForm() {
    document.getElementById('submissionNoInput').value = '';
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
}
