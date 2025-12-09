// D-03 Form Page JavaScript

function proceedToD03Form() {
    // Navigate to D-03 main form page in the parent iframe
    if (window.parent && window.parent !== window) {
        // We're in an iframe, load the main form in the same iframe
        window.location.href = 'd03_main_form.html';
    } else {
        // Direct access, just navigate
        window.location.href = 'd03_main_form.html';
    }
}

// Load user data when page loads
window.addEventListener('DOMContentLoaded', function() {
    // First try to get from sessionStorage (current registration)
    const currentUser = sessionStorage.getItem('d03_current_registration');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        
        // Populate the values in the page (handle both submissionNo and submissionNumber)
        document.getElementById('submissionNo').textContent = userData.submissionNumber || userData.submissionNo || '';
        document.getElementById('userName').textContent = userData.username || '';
        document.getElementById('panNo').textContent = userData.pan || '';
    } else {
        // Fallback to localStorage
        const d03Users = JSON.parse(localStorage.getItem('d03Users') || '[]');
        
        if (d03Users.length > 0) {
            const lastUser = d03Users[d03Users.length - 1];
            
            // Populate the values in the page
            document.getElementById('submissionNo').textContent = lastUser.submissionNo || '';
            document.getElementById('userName').textContent = lastUser.username || '';
            document.getElementById('panNo').textContent = lastUser.pan || '';
        }
    }
});
