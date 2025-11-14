// Load user data on page load
document.addEventListener('DOMContentLoaded', function() {
    const loginData = JSON.parse(localStorage.getItem('lastLoginAttempt') || '{}');
    
    if (loginData.panNumber) {
        document.getElementById('pan').value = loginData.panNumber;
    } else {
        // If no login data, redirect to login
        alert('Please login first');
        window.location.href = 'taxpayer_login.html';
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
});

function submitVoucher() {
    const voucherType = document.getElementById('voucherType').value;
    const amount = document.getElementById('amount').value;
    const paymentDate = document.getElementById('paymentDate').value;
    
    // Validation
    if (!voucherType) {
        alert('कृपया भाउचर प्रकार छान्नुहोस् (Please select voucher type)');
        return;
    }
    
    if (!amount || amount <= 0) {
        alert('कृपया मान्य रकम प्रविष्ट गर्नुहोस् (Please enter valid amount)');
        return;
    }
    
    if (!paymentDate) {
        alert('कृपया भुक्तानी मिति छान्नुहोस् (Please select payment date)');
        return;
    }
    
    // Here you would normally submit to server
    alert('भाउचर सफलतापूर्वक पेश गरियो! (Voucher submitted successfully!)');
    
    // Clear form
    document.getElementById('voucherType').value = '';
    document.getElementById('amount').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
}

function goBack() {
    if (confirm('के तपाईं फिर्ता जान चाहनुहुन्छ? (Do you want to go back?)')) {
        window.location.href = 'taxpayer_dashboard.html';
    }
}
