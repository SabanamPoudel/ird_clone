// D-04 Return Entry JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Register button click handler
    const registerBtn = document.querySelector('#btnD04Register button');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const username = document.getElementById('d04-username-input').value.trim();
            const password = document.getElementById('d04-password-input').value;
            const repassword = document.getElementById('d04-repassword-input').value;
            const pan = document.getElementById('d04-pan-input').value.trim();
            const fiscalYear = document.getElementById('d04-fiscal-input').value;
            const email = document.getElementById('d04-email-input').value.trim();
            const contact = document.getElementById('d04-contact-input').value.trim();
            
            // Validation
            if (!username) {
                alert('कृपया प्रयोगकर्ताको नाम भर्नुहोस् । (Please enter Username)');
                document.getElementById('d04-username-input').focus();
                return;
            }
            
            if (!password) {
                alert('कृपया पासवर्ड भर्नुहोस् । (Please enter Password)');
                document.getElementById('d04-password-input').focus();
                return;
            }
            
            if (password.length < 6) {
                alert('पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ । (Password must be at least 6 characters)');
                document.getElementById('d04-password-input').focus();
                return;
            }
            
            if (!repassword) {
                alert('कृपया पुनः पासवर्ड भर्नुहोस् । (Please re-enter Password)');
                document.getElementById('d04-repassword-input').focus();
                return;
            }
            
            if (password !== repassword) {
                alert('पासवर्ड मिलेन । (Passwords do not match)');
                document.getElementById('d04-repassword-input').focus();
                return;
            }
            
            if (!pan) {
                alert('कृपया स्थायी लेखा नम्बर भर्नुहोस् । (Please enter PAN)');
                document.getElementById('d04-pan-input').focus();
                return;
            }
            
            if (!/^\d{9}$/.test(pan)) {
                alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ । (PAN must be 9 digits)');
                document.getElementById('d04-pan-input').focus();
                return;
            }
            
            if (!fiscalYear) {
                alert('कृपया आर्थिक वर्ष छान्नुहोस् । (Please select Fiscal Year)');
                document.getElementById('d04-fiscal-input').focus();
                return;
            }
            
            if (!contact) {
                alert('कृपया सम्पर्क नम्बर भर्नुहोस् । (Please enter Contact Number)');
                document.getElementById('d04-contact-input').focus();
                return;
            }
            
            if (!/^\d{10}$/.test(contact)) {
                alert('सम्पर्क नम्बर १० अंकको हुनुपर्छ । (Contact Number must be 10 digits)');
                document.getElementById('d04-contact-input').focus();
                return;
            }
            
            // Email validation (optional)
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('कृपया मान्य इमेल ठेगाना भर्नुहोस् । (Please enter a valid email address)');
                document.getElementById('d04-email-input').focus();
                return;
            }
            
            // Generate submission number
            const timestamp = new Date().getTime();
            const submissionNo = 'D04-' + timestamp.toString().slice(-8);
            
            // Save to localStorage
            let d04Users = JSON.parse(localStorage.getItem('d04Users') || '[]');
            
            // Check if username already exists
            const existingUser = d04Users.find(user => user.username === username);
            if (existingUser) {
                alert('यो प्रयोगकर्ता नाम पहिले नै प्रयोग भइसकेको छ । (This username is already taken)');
                document.getElementById('d04-username-input').focus();
                return;
            }
            
            // Check if PAN already exists
            const existingPAN = d04Users.find(user => user.pan === pan);
            if (existingPAN) {
                alert('यो स्थायी लेखा नम्बर पहिले नै दर्ता भइसकेको छ । (This PAN is already registered)');
                document.getElementById('d04-pan-input').focus();
                return;
            }
            
            const newUser = {
                submissionNo: submissionNo,
                username: username,
                password: password,
                pan: pan,
                fiscalYear: fiscalYear,
                email: email,
                contact: contact,
                registeredDate: new Date().toISOString(),
                formType: 'Self Assessment(D-04)',
                formCode: 'Self-AssessmentD04'
            };
            
            d04Users.push(newUser);
            localStorage.setItem('d04Users', JSON.stringify(d04Users));
            
            alert('दर्ता सफल भयो ! (Registration Successful!)\n\n' +
                  'तपाईंको सब्मिशन नं.: ' + submissionNo + '\n' +
                  'प्रयोगकर्ताको नाम: ' + username + '\n' +
                  'स्थायी लेखा नम्बर: ' + pan + '\n' +
                  'आर्थिक वर्ष: ' + fiscalYear + '\n\n' +
                  'कृपया यो सब्मिशन नं. सुरक्षित राख्नुहोस् ।\n' +
                  'Please save this submission number for future reference.');
            
            // Reset form
            resetForm();
        });
    }
    
    // Reset button click handler
    const resetBtn = document.querySelector('#btnD04Reset button');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('के तपाईं फारम रिसेट गर्न चाहनुहुन्छ? (Do you want to reset the form?)')) {
                resetForm();
            }
        });
    }
    
    // Function to reset form
    function resetForm() {
        document.getElementById('d04-username-input').value = '';
        document.getElementById('d04-password-input').value = '';
        document.getElementById('d04-repassword-input').value = '';
        document.getElementById('d04-pan-input').value = '';
        document.getElementById('d04-fiscal-input').value = '';
        document.getElementById('d04-email-input').value = '';
        document.getElementById('d04-contact-input').value = '';
        document.getElementById('d04-username-input').focus();
    }
    
    // PAN input - only allow numbers
    const panInput = document.getElementById('d04-pan-input');
    if (panInput) {
        panInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Contact input - only allow numbers
    const contactInput = document.getElementById('d04-contact-input');
    if (contactInput) {
        contactInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
        });
    }
    
    // Focus on first field on load
    setTimeout(function() {
        document.getElementById('d04-username-input').focus();
    }, 100);
});
