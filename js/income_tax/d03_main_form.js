// D-03 Main Form JavaScript
// Load user data from sessionStorage and populate the form

window.onload = function() {
    loadUserData();
    setupCheckboxListeners();
};

// Setup checkbox listeners to ensure only one checkbox per question is selected
function setupCheckboxListeners() {
    const questions = [
        { yes: 'q1_yes', no: 'q1_no' },
        { yes: 'q2_yes', no: 'q2_no' },
        { yes: 'q3_yes', no: 'q3_no' },
        { yes: 'q4_yes', no: 'q4_no' },
        { yes: 'q5_yes', no: 'q5_no' },
        { yes: 'q6_yes', no: 'q6_no' },
        { yes: 'q7_yes', no: 'q7_no' }
    ];
    
    questions.forEach(question => {
        const yesCheckbox = document.getElementById(question.yes);
        const noCheckbox = document.getElementById(question.no);
        
        if (yesCheckbox && noCheckbox) {
            yesCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    noCheckbox.checked = false;
                }
            });
            
            noCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    yesCheckbox.checked = false;
                }
            });
        }
    });
}

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
        
        // Save initial data to localStorage for use in annex pages
        const initialData = {
            fiscalYear: userData.fiscalYear || '',
            pan: userData.pan || '',
            taxpayerName: userData.username || '',
            iro: 'आन्तरिक राजस्व कार्यालय भरतपुर',
            submissionNumber: submissionNumber,
            submissionNo: submissionNumber,
            username: userData.username || '',
            officeCode: '17'
        };
        localStorage.setItem('d03_return_data', JSON.stringify(initialData));
        
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
    // Validate taxpayer type is selected
    const taxpayerType = document.getElementById('taxpayerType').value;
    if (!taxpayerType) {
        showValidationPopup('कृपया करदाताको किसिम चयन गर्नुहोस्');
        return;
    }
    
    // Validate section 4 checkboxes
    const section4Questions = [
        { yes: 'q1_yes', no: 'q1_no' },
        { yes: 'q2_yes', no: 'q2_no' },
        { yes: 'q3_yes', no: 'q3_no' },
        { yes: 'q4_yes', no: 'q4_no' },
        { yes: 'q5_yes', no: 'q5_no' },
        { yes: 'q6_yes', no: 'q6_no' },
        { yes: 'q7_yes', no: 'q7_no' }
    ];
    
    let allAnswered = true;
    for (let question of section4Questions) {
        const yesChecked = document.getElementById(question.yes)?.checked || false;
        const noChecked = document.getElementById(question.no)?.checked || false;
        if (!yesChecked && !noChecked) {
            allAnswered = false;
            break;
        }
    }
    
    if (!allAnswered) {
        showSection4Warning();
        return;
    }
    
    // Collect all form data
    const formData = {
        submissionNumber: document.getElementById('submissionNo').textContent,
        submissionNo: document.getElementById('submissionNo').textContent,
        fiscalYear: document.getElementById('fiscalYear').value,
        pan: document.getElementById('pan').value,
        firmName: document.getElementById('firmName').value,
        taxpayerName: document.getElementById('firmName').value,
        name: document.getElementById('firmName').value,
        email: document.getElementById('email').value,
        mobile: document.getElementById('mobile').value,
        iro: document.getElementById('iro').value,
        taxpayerType: taxpayerType,
        registrationDate: new Date().toISOString(),
        officeCode: '17'
    };
    
    // Save to localStorage
    const d03Submissions = JSON.parse(localStorage.getItem('d03Submissions') || '[]');
    d03Submissions.push(formData);
    localStorage.setItem('d03Submissions', JSON.stringify(d03Submissions));
    
    // Also save to d03_return_data for use in annex pages and preview
    localStorage.setItem('d03_return_data', JSON.stringify(formData));
    
    // Show popup with submission number
    showSubmissionPopup(formData.submissionNumber);
    
    console.log('D-03 form registered:', formData);
}

function showSubmissionPopup(submissionNumber) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = 'background: #E8EEF7; padding: 0; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 320px; border: 2px solid #B8C5D6;';
    
    modal.innerHTML = `
        <div style="background: linear-gradient(to bottom, #E8EEF7, #D0DBEB); padding: 6px 12px; border-bottom: 1px solid #B8C5D6; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0;">
            <h3 style="margin: 0; color: #1F548A; font-size: 12px; font-weight: bold;">SUCCESS</h3>
            <button onclick="this.closest('.modal-overlay').remove()" style="background: none; border: none; color: #666; font-size: 16px; cursor: pointer; padding: 0; width: 18px; height: 18px; line-height: 16px;">×</button>
        </div>
        <div style="padding: 15px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(to bottom, #4A90E2, #2E5C8A); display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 24px; font-weight: bold; font-family: serif;">i</span>
                </div>
                <h4 style="margin: 0; color: #333; font-size: 14px;">Successfully Saved !!!</h4>
            </div>
            <p style="margin: 6px 0 3px 0; color: #333; font-size: 11px;">सब्मिशन नं. दिएनुहोस्</p>
            <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #000;">${submissionNumber}</p>
            <button id="modalOkBtn" style="padding: 4px 30px; background: linear-gradient(to bottom, #F0F0F0, #D8D8D8); border: 1px solid #999; cursor: pointer; font-size: 12px; border-radius: 3px; color: #333;">OK</button>
        </div>
    `;
    
    overlay.className = 'modal-overlay';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Handle OK button click
    document.getElementById('modalOkBtn').onclick = function() {
        // Remove modal
        document.body.removeChild(overlay);
        
        // Hide Register button and show Update/Enter Annex buttons
        document.getElementById('registerBtn').style.display = 'none';
        document.getElementById('actionButtons').style.display = 'block';
    };
}

function showValidationPopup(message) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;';
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = 'background: #E8EEF7; padding: 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); width: 350px; border: 2px solid #B8C5D6;';
    
    modal.innerHTML = `
        <div style="background: linear-gradient(to bottom, #E8EEF7, #D0DBEB); padding: 8px 15px; border-bottom: 1px solid #B8C5D6; display: flex; justify-content: space-between; align-items: center; border-radius: 6px 6px 0 0;">
            <h3 style="margin: 0; color: #1F548A; font-size: 14px; font-weight: bold;">सूचना</h3>
            <button onclick="this.closest('.validation-overlay').remove()" style="background: none; border: none; color: #666; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px; line-height: 18px;">×</button>
        </div>
        <div style="padding: 20px; text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(to bottom, #E2A94A, #C68A2E); display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-size: 28px; font-weight: bold; font-family: serif;">!</span>
                </div>
                <h4 style="margin: 0; color: #333; font-size: 16px;">${message}</h4>
            </div>
            <button id="validationOkBtn" style="padding: 5px 35px; background: linear-gradient(to bottom, #F0F0F0, #D8D8D8); border: 1px solid #999; cursor: pointer; font-size: 13px; border-radius: 3px; color: #333;">OK</button>
        </div>
    `;
    
    overlay.className = 'validation-overlay';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Handle OK button click
    document.getElementById('validationOkBtn').onclick = function() {
        document.body.removeChild(overlay);
    };
}

// Show section 4 warning modal
function showSection4Warning() {
    const modal = document.getElementById('section4WarningModal');
    modal.style.display = 'flex';
}

// Close section 4 warning modal
function closeSection4Warning() {
    const modal = document.getElementById('section4WarningModal');
    modal.style.display = 'none';
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

// Print page function
function printPage() {
    window.print();
}
