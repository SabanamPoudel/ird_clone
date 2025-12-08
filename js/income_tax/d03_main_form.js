// D-03 Main Form JavaScript
// Load user data from sessionStorage and populate the form

window.onload = function() {
    loadUserData();
};

function loadUserData() {
    // Get data from sessionStorage (saved during registration)
    const currentRegistration = sessionStorage.getItem('d03_current_registration');
    
    if (currentRegistration) {
        const userData = JSON.parse(currentRegistration);
        
        // Generate or use existing submission number
        const submissionNumber = userData.submissionNumber || generateSubmissionNumber();
        
        // Populate basic form fields
        document.getElementById('submissionNo').textContent = submissionNumber;
        document.getElementById('fiscalYear').value = userData.fiscalYear || '';
        document.getElementById('pan').value = userData.pan || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('mobile').value = userData.contact || '';
        
        // Set IRO field
        document.getElementById('iro').value = 'आन्तरिक राजस्व कार्यालय भरतपुर';
        
        // Get PAN registration data (this should come from PAN registration system)
        // For now, we'll use the username as firm name
        // In a real system, this would query a PAN database
        const panNumber = userData.pan;
        
        // TODO: Fetch actual PAN holder data from backend/database
        // For now, using placeholder data structure
        const panData = getPanHolderData(panNumber);
        
        if (panData) {
            document.getElementById('firmName').value = panData.name || userData.username || '';
            document.getElementById('houseNo').value = panData.houseNo || '';
            document.getElementById('wardNo').value = panData.wardNo || '';
            document.getElementById('tole').value = panData.streetName || '';
            document.getElementById('municipality').value = panData.municipality || '';
            document.getElementById('district').value = panData.district || '';
            document.getElementById('phone').value = panData.phone || '';
        } else {
            // Fallback to registration data
            document.getElementById('firmName').value = userData.username || '';
            document.getElementById('houseNo').value = '';
            document.getElementById('wardNo').value = '';
            document.getElementById('tole').value = '';
            document.getElementById('municipality').value = '';
            document.getElementById('district').value = '';
            document.getElementById('phone').value = '';
        }
        
        console.log('D-03 form data loaded successfully');
    } else {
        console.warn('No registration data found in sessionStorage');
        // Optionally redirect back to registration page
        // window.location.href = 'd03_return_entry.html';
    }
}

// Function to get PAN holder data
// In a real application, this would query a backend API or database
function getPanHolderData(panNumber) {
    // Mock PAN database - in production this would be an API call
    const panDatabase = {
        '610015263': {
            name: 'खाना बिज्ञानको एकीकृत प्रा.लि.',
            houseNo: '००',
            wardNo: '9',
            streetName: 'हालिक चोक',
            municipality: '',
            district: 'भरतपुर',
            phone: ''
        }
        // Add more PAN records as needed
    };
    
    return panDatabase[panNumber] || null;
}

function registerForm() {
    // Collect all form data
    const formData = {
        submissionNumber: document.getElementById('submissionNo').textContent,
        fiscalYear: document.getElementById('fiscalYear').value,
        pan: document.getElementById('pan').value,
        firmName: document.getElementById('firmName').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        iro: document.getElementById('iro').value,
        registrationDate: new Date().toISOString()
    };
    
    // No validation needed - just save and switch buttons
    
    // Save to localStorage
    const d03Submissions = JSON.parse(localStorage.getItem('d03Submissions') || '[]');
    d03Submissions.push(formData);
    localStorage.setItem('d03Submissions', JSON.stringify(d03Submissions));
    
    // Hide Register button and show Update/Enter Annex buttons
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('actionButtons').style.display = 'block';
    
    console.log('D-03 form registered:', formData);
}

// Function to update form
function updateForm() {
    alert('Update functionality will be implemented here.');
    // TODO: Implement update logic
}

// Function to enter annex
function enterAnnex() {
    window.location.href = 'd03_set_annex.html';
}

// Function to go back to registration page
function goBack() {
    if (confirm('के तपाई पक्का हुनुहुन्छ? परिवर्तनहरू बचत हुने छैनन्।\n\nAre you sure? Changes will not be saved.')) {
        window.location.href = 'd03_return_entry.html';
    }
}

// Function to generate random submission number
function generateSubmissionNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return '820' + timestamp.toString().slice(-9) + String(random).padStart(4, '0');
}
