// E-TDS Home Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.x-tab');
    const panels = document.querySelectorAll('.x-tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPanel = this.getAttribute('data-panel');
            
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('x-tab-active'));
            panels.forEach(p => p.classList.remove('x-tab-panel-active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('x-tab-active');
            document.getElementById(targetPanel).classList.add('x-tab-panel-active');
        });
    });

    // Radio button toggle for IRO/TSO
    const iroRadio = document.getElementById('rdRTTDSIRO');
    const tsoRadio = document.getElementById('rdRTTDSTSO');
    const iroContainer = document.getElementById('iroContainer');
    const tsoContainer = document.getElementById('tsoContainer');

    if (iroRadio && tsoRadio) {
        iroRadio.addEventListener('change', function() {
            if (this.checked) {
                iroContainer.style.display = 'flex';
                tsoContainer.style.display = 'none';
                document.getElementById('chkRTTDStsoname').value = '';
            }
        });

        tsoRadio.addEventListener('change', function() {
            if (this.checked) {
                iroContainer.style.display = 'none';
                tsoContainer.style.display = 'flex';
                document.getElementById('chkRTTDSironame').value = '';
            }
        });
    }

    // Checkbox toggle for BS/AD dates
    const bsCheckbox = document.getElementById('chkRTTDSBS');
    const adCheckbox = document.getElementById('chkRTTDSAD');
    const bsFromField = document.getElementById('txtRTTDSBSfrom');
    const bsToField = document.getElementById('txtRTTDSBSto');
    const adFromField = document.getElementById('txtRTTDSADfrom');
    const adToField = document.getElementById('txtRTTDSADto');

    if (bsCheckbox && adCheckbox) {
        bsCheckbox.addEventListener('change', function() {
            bsFromField.disabled = !this.checked;
            bsToField.disabled = !this.checked;
            if (!this.checked) {
                bsFromField.value = '';
                bsToField.value = '';
            }
            
            // Ensure at least one is checked
            if (!this.checked && !adCheckbox.checked) {
                adCheckbox.checked = true;
                adFromField.disabled = false;
                adToField.disabled = false;
            }
        });

        adCheckbox.addEventListener('change', function() {
            adFromField.disabled = !this.checked;
            adToField.disabled = !this.checked;
            if (!this.checked) {
                adFromField.value = '';
                adToField.value = '';
            }
            
            // Ensure at least one is checked
            if (!this.checked && !bsCheckbox.checked) {
                bsCheckbox.checked = true;
                bsFromField.disabled = false;
                bsToField.disabled = false;
            }
        });
    }

    // Register button functionality
    const registerBtn = document.getElementById('btnRTTDSRegister');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            if (validateRegistrationForm()) {
                registerUser();
            }
        });
    }

    // Reset button functionality
    const resetBtn = document.getElementById('btnRTTDSReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetRegistrationForm();
        });
    }

    // Auto-fill withholder name when PAN is entered
    const panField = document.getElementById('txtRTTDSwhpan');
    const withholderNameField = document.getElementById('txtRTTDSwhname');
    
    if (panField && withholderNameField) {
        panField.addEventListener('blur', function() {
            const pan = this.value.trim();
            if (pan.length === 9) {
                // Auto-fill with generic company registered name for any 9-digit PAN
                withholderNameField.value = 'company registered name';
                withholderNameField.style.backgroundColor = '#e8f5e9'; // Light green to indicate auto-filled
            } else if (pan.length > 0 && pan.length !== 9) {
                // Show alert if PAN is not 9 digits
                alert('PAN नम्बर ९ अंकको हुनुपर्छ।');
                withholderNameField.value = '';
                withholderNameField.style.backgroundColor = '';
            }
        });

        // Clear background color when manually edited
        withholderNameField.addEventListener('input', function() {
            if (this.value !== '') {
                this.style.backgroundColor = '';
            }
        });
    }

    // Validation function
    function validateRegistrationForm() {
        const username = document.getElementById('txtRTTDSuser').value.trim();
        const password = document.getElementById('txtRTTDSpass').value.trim();
        const repassword = document.getElementById('txtRTTDSrepass').value.trim();
        const whName = document.getElementById('txtRTTDSwhname').value.trim();
        const phone = document.getElementById('txtRTTDSphone').value.trim();
        
        const officeType = document.querySelector('input[name="office_type"]:checked').value;
        const office = officeType === 'IRO' 
            ? document.getElementById('chkRTTDSironame').value 
            : document.getElementById('chkRTTDStsoname').value;

        if (!username) {
            alert('प्रयोगकर्ताको नाम आवश्यक छ।');
            return false;
        }

        if (!password) {
            alert('पासवर्ड आवश्यक छ।');
            return false;
        }

        if (password !== repassword) {
            alert('पासवर्ड मेल खाएन। कृपया पुन: प्रयास गर्नुहोस्।');
            return false;
        }

        if (!whName) {
            alert('विथहोल्डरको नाम आवश्यक छ।');
            return false;
        }

        if (!office) {
            alert(officeType === 'IRO' ? 'आ.रा.का छान्नुहोस्।' : 'क.से.का छान्नुहोस्।');
            return false;
        }

        if (!phone) {
            alert('फोन नं. आवश्यक छ।');
            return false;
        }

        if (phone.length !== 10) {
            alert('फोन नं. १० अंकको हुनुपर्छ।');
            return false;
        }

        return true;
    }

    // Register user function
    function registerUser() {
        const username = document.getElementById('txtRTTDSuser').value.trim();
        const password = document.getElementById('txtRTTDSpass').value.trim();
        const pan = document.getElementById('txtRTTDSwhpan').value.trim();
        const whName = document.getElementById('txtRTTDSwhname').value.trim();
        const email = document.getElementById('txtRTTDSmailID').value.trim();
        const phone = document.getElementById('txtRTTDSphone').value.trim();
        const address = document.getElementById('txtRTTDSadd').value.trim();
        const voucherDate = document.getElementById('txtRTTDSvdate').value.trim();
        
        const officeType = document.querySelector('input[name="office_type"]:checked').value;
        const office = officeType === 'IRO' 
            ? document.getElementById('chkRTTDSironame').value 
            : document.getElementById('chkRTTDStsoname').value;
        
        const bsCheckbox = document.getElementById('chkRTTDSBS');
        const adCheckbox = document.getElementById('chkRTTDSAD');
        const bsFrom = document.getElementById('txtRTTDSBSfrom').value.trim();
        const bsTo = document.getElementById('txtRTTDSBSto').value.trim();
        const adFrom = document.getElementById('txtRTTDSADfrom').value.trim();
        const adTo = document.getElementById('txtRTTDSADto').value.trim();

        // Generate submission number
        const submissionNumber = 'SUB-' + Date.now();

        // Create user object
        const userData = {
            submissionNumber: submissionNumber,
            username: username,
            password: password,
            pan: pan,
            withholderName: whName,
            officeType: officeType,
            office: office,
            email: email,
            phone: phone,
            address: address,
            voucherDate: voucherDate,
            bsFrom: bsFrom,
            bsTo: bsTo,
            adFrom: adFrom,
            adTo: adTo,
            registeredDate: new Date().toISOString()
        };

        // Save to localStorage
        let users = JSON.parse(localStorage.getItem('etds_users') || '[]');
        users.push(userData);
        localStorage.setItem('etds_users', JSON.stringify(users));

        // Prepare data for success page
        const successData = {
            submissionNumber: submissionNumber,
            username: username,
            withholderName: whName,
            iroName: officeType === 'IRO' ? office : '',
            tsoName: officeType === 'TSO' ? office : '',
            phone: phone,
            address: address,
            dateFrom: bsCheckbox.checked ? bsFrom : adFrom,
            dateTo: bsCheckbox.checked ? bsTo : adTo,
            dateType: bsCheckbox.checked ? 'BS' : 'AD'
        };

        // Store success data in sessionStorage
        sessionStorage.setItem('etds_registration_success', JSON.stringify(successData));

        // Send message to parent window to load success page in iframe
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                action: 'loadContent',
                url: 'html/e_tds/etds_registration_success.html'
            }, '*');
        } else {
            // If not in iframe, navigate directly
            window.location.href = 'etds_registration_success.html';
        }
    }

    // Reset form function
    function resetRegistrationForm() {
        document.getElementById('txtRTTDSuser').value = '';
        document.getElementById('txtRTTDSpass').value = '';
        document.getElementById('txtRTTDSrepass').value = '';
        document.getElementById('txtRTTDSwhpan').value = '';
        document.getElementById('txtRTTDSwhname').value = '';
        document.getElementById('chkRTTDSironame').value = '';
        document.getElementById('chkRTTDStsoname').value = '';
        document.getElementById('txtRTTDSmailID').value = '';
        document.getElementById('txtRTTDSphone').value = '';
        document.getElementById('txtRTTDSadd').value = '';
        document.getElementById('txtRTTDSvdate').value = '';
        document.getElementById('txtRTTDSBSfrom').value = '';
        document.getElementById('txtRTTDSBSto').value = '';
        document.getElementById('txtRTTDSADfrom').value = '';
        document.getElementById('txtRTTDSADto').value = '';
        
        // Reset radio to IRO
        document.getElementById('rdRTTDSIRO').checked = true;
        iroContainer.style.display = 'flex';
        tsoContainer.style.display = 'none';
        
        // Reset checkboxes
        document.getElementById('chkRTTDSBS').checked = true;
        document.getElementById('chkRTTDSAD').checked = false;
        bsFromField.disabled = false;
        bsToField.disabled = false;
        adFromField.disabled = true;
        adToField.disabled = true;
    }
});

// Tab 2: Withholder Login Function
function loginWithholder() {
    const submissionNo = document.getElementById('loginSubmissionNo').value.trim();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Validation
    if (!submissionNo) {
        alert('सब्मिशन नं. आवश्यक छ।');
        return;
    }

    if (!username) {
        alert('प्रयोगकर्ताको नाम आवश्यक छ।');
        return;
    }

    if (!password) {
        alert('पासवर्ड आवश्यक छ।');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('etds_users') || '[]');
    
    // Find matching user
    const user = users.find(u => 
        u.submissionNumber === submissionNo && 
        u.username === username && 
        u.password === password
    );

    if (user) {
        alert('लगइन सफल भयो!\n\nस्वागत छ, ' + user.withholderName);
        // Clear form
        document.getElementById('loginSubmissionNo').value = '';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        
        // Here you can redirect to dashboard or show user data
        console.log('Logged in user:', user);
    } else {
        alert('लगइन असफल!\n\nसब्मिशन नं., प्रयोगकर्ताको नाम वा पासवर्ड गलत छ।');
    }
}

// Tab 3: Withholdee Login Function
function loginWithholdee() {
    const pan = document.getElementById('loginPAN').value.trim();
    const username = document.getElementById('loginWithholdeeUsername').value.trim();
    const password = document.getElementById('loginWithholdeePassword').value.trim();

    // Validation
    if (!pan) {
        alert('करदाता नं. (पान नं.) आवश्यक छ।');
        return;
    }

    if (!username) {
        alert('प्रयोगकर्ताको नाम आवश्यक छ।');
        return;
    }

    if (!password) {
        alert('पासवोर्ड आवश्यक छ।');
        return;
    }

    // For withholdee login, we can implement basic validation
    // Since this is a simplified version, we'll just show a success message
    // In a real system, this would verify against a database
    
    alert('लगइन सफल भयो!\n\nस्वागत छ, ' + username);
    
    // Clear form
    document.getElementById('loginPAN').value = '';
    document.getElementById('loginWithholdeeUsername').value = '';
    document.getElementById('loginWithholdeePassword').value = '';
    
    // Here you can redirect to withholdee dashboard
    console.log('Withholdee logged in:', { pan, username });
}
