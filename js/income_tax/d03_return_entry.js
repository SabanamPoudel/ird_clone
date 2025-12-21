function showAdditionalFieldsD03() {
    const fiscalYear = document.getElementById('d03-fiscal-input').value;
    if (fiscalYear) {
        document.getElementById('d03-transactionAmountRow').style.display = '';
        document.getElementById('d03-profitAmountRow').style.display = '';
        document.getElementById('d03-professionTypeRow').style.display = '';
    } else {
        document.getElementById('d03-transactionAmountRow').style.display = 'none';
        document.getElementById('d03-profitAmountRow').style.display = 'none';
        document.getElementById('d03-professionTypeRow').style.display = 'none';
        document.getElementById('d03-otherIncomeRow').style.display = 'none';
    }
}

function showOtherIncomeCheckbox() {
    const professionType = document.getElementById('d03-profession-input').value;
    if (professionType) {
        document.getElementById('d03-otherIncomeRow').style.display = '';
    } else {
        document.getElementById('d03-otherIncomeRow').style.display = 'none';
    }
}
// D-03 Return Entry JavaScript

function registerD03User() {
    const username = document.getElementById('d03-username-input').value.trim();
    const password = document.getElementById('d03-password-input').value.trim();
    const repassword = document.getElementById('d03-repassword-input').value.trim();
    const pan = document.getElementById('d03-pan-input').value.trim();
    const fiscalYear = document.getElementById('d03-fiscal-input').value.trim();
    const email = document.getElementById('d03-email-input').value.trim();
    const contact = document.getElementById('d03-contact-input').value.trim();
    
    // Validation
    if (!username) {
        alert('कृपया प्रयोगकर्ताको नाम भर्नुहोस् ।\nPlease enter Username!');
        return;
    }
    
    if (!password) {
        alert('कृपया पासवर्ड भर्नुहोस् ।\nPlease enter Password!');
        return;
    }
    
    if (password !== repassword) {
        alert('पासवर्ड मिलेन ।\nPasswords do not match!');
        return;
    }
    
    if (!pan) {
        alert('कृपया स्थायी लेखा नम्बर भर्नुहोस् ।\nPlease enter PAN!');
        return;
    }
    
    if (pan.length !== 9 || !/^\d+$/.test(pan)) {
        alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ ।\nPAN must be 9 digits!');
        return;
    }
    
    if (!fiscalYear) {
        alert('कृपया आर्थिक वर्ष छान्नुहोस् ।\nPlease select Fiscal Year!');
        return;
    }
    
    if (!contact) {
        alert('कृपया सम्पर्क नम्बर भर्नुहोस् ।\nPlease enter Contact Number!');
        return;
    }
    
    if (contact.length !== 10 || !/^\d+$/.test(contact)) {
        alert('सम्पर्क नम्बर १० अंकको हुनुपर्छ ।\nContact Number must be 10 digits!');
        return;
    }
    
    // Generate submission number
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const submissionNumber = '820' + timestamp.toString().slice(-9) + String(random).padStart(4, '0');
    
    // Save to localStorage
    let d03Users = JSON.parse(localStorage.getItem('d03Users') || '[]');
    
    const newUser = {
        submissionNo: submissionNumber,
        username: username,
        password: password,
        pan: pan,
        fiscalYear: fiscalYear,
        email: email,
        contact: contact,
        registeredDate: new Date().toISOString()
    };
    
    d03Users.push(newUser);
    localStorage.setItem('d03Users', JSON.stringify(d03Users));
    
    // Save current registration to sessionStorage
    sessionStorage.setItem('d03_current_registration', JSON.stringify({
        submissionNumber: submissionNumber,
        username: username,
        pan: pan,
        fiscalYear: fiscalYear,
        email: email,
        contact: contact,
        transactionAmount: document.getElementById('d03-transaction-input').value,
        profitAmount: document.getElementById('d03-profit-input').value,
        professionType: document.getElementById('d03-profession-input').value
    }));
    
    console.log('D-03 User registered:', newUser);
    
    // Redirect to D-03 form page
    window.location.href = 'd03_form_page.html';
}

function resetD03Form() {
    document.getElementById('d03-username-input').value = '';
    document.getElementById('d03-password-input').value = '';
    document.getElementById('d03-repassword-input').value = '';
    document.getElementById('d03-pan-input').value = '';
    document.getElementById('d03-fiscal-input').value = '';
    document.getElementById('d03-email-input').value = '';
    document.getElementById('d03-contact-input').value = '';
}

function loadIncomeTaxLogin() {
    // Check if we're in an iframe (called from portal)
    if (window.parent && window.parent !== window) {
        // Load the tax return login form in the parent's content area
        const parentDoc = window.parent.document;
        const panelBody = parentDoc.querySelector('.panel-body');
        
        if (panelBody) {
            // Add has-iframe class
            panelBody.classList.add('has-iframe');
            
            // Hide footer
            const footer = parentDoc.querySelector('.footer');
            if (footer) footer.style.display = 'none';
            
            // Create iframe to load the tax return login form
            const iframe = '<iframe src="income_tax/tax_return_login.html" style="width: 100%; height: 800px; border: none;" frameborder="0"></iframe>';
            panelBody.innerHTML = iframe;
            
            // Update breadcrumb
            const breadcrumb = parentDoc.getElementById('breadcrumb');
            if (breadcrumb) {
                breadcrumb.textContent = 'Integrated Tax Menus >> Income Tax >> Tax Return Login';
            }
        }
    } else {
        // If not in iframe, open in same window
        window.location.href = 'tax_return_login.html';
    }
}
