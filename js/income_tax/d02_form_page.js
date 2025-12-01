// D-02 Form Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load registration data
    loadD02RegistrationData();
});

function loadD02RegistrationData() {
    const registrationData = JSON.parse(sessionStorage.getItem('d02_current_registration') || '{}');
    
    if (!registrationData.pan) {
        alert('कृपया पहिले दर्ता गर्नुहोस्। (Please register first)');
        window.location.href = 'd02_return_entry.html';
        return;
    }
    
    // Display registration details
    document.getElementById('submissionNo').textContent = registrationData.submissionNo || '';
    document.getElementById('userName').textContent = registrationData.username || '';
    document.getElementById('panNo').textContent = registrationData.pan || '';
    
    console.log('D-02 Registration Data:', registrationData);
}

function proceedToD02Form() {
    // Redirect to the D-02 main form page
    window.location.href = 'd02_main_form.html';
}
