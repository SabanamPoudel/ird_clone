// VAT Return Entry Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('frmVatReturnsSubNo');
    const txtVatPassword = document.getElementById('txtVatPassword');
    const txtVatReTypePassword = document.getElementById('txtVatReTypePassword');
    const txtVATPANNo = document.getElementById('txtVATPANNo');
    const txtContactNumber = document.getElementById('txtContactNumber');

    // Password validation
    txtVatReTypePassword.addEventListener('input', function() {
        if (this.value !== txtVatPassword.value) {
            this.setCustomValidity('पासवर्डहरू मेल खाएनन्');
        } else {
            this.setCustomValidity('');
        }
    });

    txtVatPassword.addEventListener('input', function() {
        if (txtVatReTypePassword.value !== this.value) {
            txtVatReTypePassword.setCustomValidity('पासवर्डहरू मेल खाएनन्');
        } else {
            txtVatReTypePassword.setCustomValidity('');
        }
    });

    // PAN Number validation (numbers only, 9 digits)
    txtVATPANNo.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        
        if (this.value.length > 0 && this.value.length !== 9) {
            this.setCustomValidity('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ');
        } else {
            this.setCustomValidity('');
        }
    });

    // Contact Number validation (numbers only, 10 digits)
    txtContactNumber.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        
        if (this.value.length > 0 && this.value.length !== 10) {
            this.setCustomValidity('सम्पर्क नम्बर १० अंकको हुनुपर्छ');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#d9534f';
            } else {
                field.style.borderColor = '#5cb85c';
            }
        });

        if (!isValid) {
            showMessage('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।', 'error');
            return;
        }

        // Check password match
        if (txtVatPassword.value !== txtVatReTypePassword.value) {
            showMessage('पासवर्डहरू मेल खाएनन्।', 'error');
            return;
        }

        // Check PAN number length
        if (txtVATPANNo.value.length !== 9) {
            showMessage('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ।', 'error');
            return;
        }

        // Check contact number length
        if (txtContactNumber.value && txtContactNumber.value.length !== 10) {
            showMessage('सम्पर्क नम्बर १० अंकको हुनुपर्छ।', 'error');
            return;
        }

        // Collect form data
        const formData = {
            category: form.querySelector('input[name="category"]').value,
            subcategory: form.querySelector('input[name="subcategory"]').value,
            username: document.getElementById('txtVatUsername').value,
            password: txtVatPassword.value,
            panNumber: txtVATPANNo.value,
            email: document.getElementById('txtVatEmailId').value,
            contactNumber: txtContactNumber.value
        };

        console.log('Form submitted:', formData);

        // Show loading state
        const formBody = document.querySelector('.form-body');
        formBody.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            formBody.classList.remove('loading');
            showMessage('दर्ता सफलतापूर्वक सम्पन्न भयो! तपाईंको सब्मिशन नम्बर: ' + generateSubmissionNumber(), 'success');
            
            // Optionally reset form after successful submission
            // form.reset();
        }, 1500);
    });

    // Reset button handler
    form.addEventListener('reset', function() {
        // Clear custom validation messages
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.setCustomValidity('');
            input.style.borderColor = '';
        });
        
        // Remove any messages
        const messages = document.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
    });

    // Helper function to show messages
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Insert message before form buttons
        const formButtons = document.querySelector('.form-buttons');
        formButtons.parentNode.insertBefore(messageDiv, formButtons);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Helper function to generate submission number (demo purpose)
    function generateSubmissionNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return 'VAT' + timestamp + random;
    }

    // Income Tax Login button (if exists)
    const incomeTaxBtn = document.querySelector('.btn-income-tax-login');
    if (incomeTaxBtn) {
        incomeTaxBtn.addEventListener('click', function() {
            // Redirect to income tax login page
            console.log('Redirect to Income Tax Login');
            // window.location.href = '../income_tax/income_tax_login.html';
        });
    }

    // Real-time validation feedback
    const allInputs = form.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#d9534f';
            } else if (this.value.trim()) {
                this.style.borderColor = '#5cb85c';
            } else {
                this.style.borderColor = '';
            }
        });
    });
});
