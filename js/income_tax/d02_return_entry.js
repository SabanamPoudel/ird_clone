// D-02 Return Entry JavaScript

function registerD02User() {
    const username = document.getElementById('d02-username-input').value.trim();
    const password = document.getElementById('d02-password-input').value.trim();
    const repassword = document.getElementById('d02-repassword-input').value.trim();
    const pan = document.getElementById('d02-pan-input').value.trim();
    const fiscalYear = document.getElementById('d02-fiscal-input').value.trim();
    const email = document.getElementById('d02-email-input').value.trim();
    const contact = document.getElementById('d02-contact-input').value.trim();
    
    // Validation
    if (!username) {
        alert('कृपया प्रयोगकर्ताको नाम भर्नुहोस् । (Please enter Username)');
        return;
    }
    
    if (!password) {
        alert('कृपया पासवर्ड भर्नुहोस् । (Please enter Password)');
        return;
    }
    
    if (password !== repassword) {
        alert('पासवर्ड मिलेन । (Passwords do not match)');
        return;
    }
    
    if (!pan) {
        alert('कृपया स्थायी लेखा नम्बर भर्नुहोस् । (Please enter PAN)');
        return;
    }
    
    if (pan.length !== 9 || !/^\d+$/.test(pan)) {
        alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ । (PAN must be 9 digits)');
        return;
    }
    
    if (!fiscalYear) {
        alert('कृपया आर्थिक वर्ष छान्नुहोस् । (Please select Fiscal Year)');
        return;
    }
    
    if (!contact) {
        alert('कृपया सम्पर्क नम्बर भर्नुहोस् । (Please enter Contact Number)');
        return;
    }
    
    if (contact.length !== 10 || !/^\d+$/.test(contact)) {
        alert('सम्पर्क नम्बर १० अंकको हुनुपर्छ । (Contact Number must be 10 digits)');
        return;
    }
    
    // Generate submission number
    const timestamp = new Date().getTime();
    const submissionNo = 'D02-' + timestamp.toString().slice(-8);
    
    // Save to localStorage
    let d02Users = JSON.parse(localStorage.getItem('d02Users') || '[]');
    
    const newUser = {
        submissionNo: submissionNo,
        username: username,
        password: password,
        pan: pan,
        fiscalYear: fiscalYear,
        email: email,
        contact: contact,
        registeredDate: new Date().toISOString()
    };
    
    d02Users.push(newUser);
    localStorage.setItem('d02Users', JSON.stringify(d02Users));
    
    alert('दर्ता सफल भयो ! (Registration Successful!)\n\n' +
          'तपाईंको सब्मिशन नं.: ' + submissionNo + '\n' +
          'प्रयोगकर्ताको नाम: ' + username + '\n' +
          'आर्थिक वर्ष: ' + fiscalYear + '\n\n' +
          'कृपया यो सब्मिशन नं. सुरक्षित राख्नुहोस् ।\n' +
          '(Please save this Submission Number)');
    
    console.log('D-02 User registered:', newUser);
    
    // Reset form
    resetD02Form();
}

function resetD02Form() {
    document.getElementById('d02-username-input').value = '';
    document.getElementById('d02-password-input').value = '';
    document.getElementById('d02-repassword-input').value = '';
    document.getElementById('d02-pan-input').value = '';
    document.getElementById('d02-fiscal-input').value = '';
    document.getElementById('d02-email-input').value = '';
    document.getElementById('d02-contact-input').value = '';
}
