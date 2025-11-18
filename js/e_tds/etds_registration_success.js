// E-TDS Registration Success Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get registration data from sessionStorage
    const registrationData = JSON.parse(sessionStorage.getItem('etds_registration_success') || '{}');

    if (registrationData && registrationData.submissionNumber) {
        // Populate the page with registration data
        document.getElementById('submissionNumber').textContent = registrationData.submissionNumber;
        document.getElementById('username').textContent = registrationData.username || '';
        document.getElementById('withholderNo').textContent = registrationData.username || '';
        document.getElementById('withholderName').textContent = registrationData.withholderName || '';
        document.getElementById('iroName').textContent = registrationData.iroName || '';
        document.getElementById('tsoName').textContent = registrationData.tsoName || '';
        document.getElementById('phone').textContent = registrationData.phone || '';
        document.getElementById('address').textContent = registrationData.address || '';
        document.getElementById('dateFrom').textContent = registrationData.dateFrom || '';
        document.getElementById('dateTo').textContent = registrationData.dateTo || '';
        document.getElementById('dateType').textContent = registrationData.dateType || '';
    }

    // New Submission button - reload registration form
    document.getElementById('btnNewSubmission').addEventListener('click', function() {
        // Clear session data
        sessionStorage.removeItem('etds_registration_success');
        
        // Send message to parent to load registration form in iframe
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                action: 'loadContent',
                url: 'html/e_tds/etds_home.html'
            }, '*');
        } else {
            // If not in iframe, navigate directly
            window.location.href = 'etds_home.html';
        }
    });

    // Enter Transaction button - could navigate to transaction entry page
    document.getElementById('btnEnterTransaction').addEventListener('click', function() {
        alert('ट्रान्स्याकशन एन्ट्री फिचर आउँदै छ। (Transaction entry feature coming soon.)');
        // In future, this could navigate to a transaction entry form
    });
});
