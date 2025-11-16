// Tax Return Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Login button click handler
    const loginBtn = document.getElementById('btnITRLLogin');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const submissionNo = document.getElementById('txtITRLSubmissionNo-input').value.trim();
            const username = document.getElementById('txtITRLUsername-input').value.trim();
            const password = document.getElementById('txtITRLPassword-input').value.trim();
            
            // Validation
            if (!submissionNo) {
                alert('कृपया सब्मिशन नं. प्रविष्ट गर्नुहोस्। (Please enter Submission No.)');
                document.getElementById('txtITRLSubmissionNo-input').focus();
                return;
            }
            
            if (!username) {
                alert('कृपया प्रयोगकर्ताको नाम प्रविष्ट गर्नुहोस्। (Please enter Username)');
                document.getElementById('txtITRLUsername-input').focus();
                return;
            }
            
            if (!password) {
                alert('कृपया पासवर्ड प्रविष्ट गर्नुहोस्। (Please enter Password)');
                document.getElementById('txtITRLPassword-input').focus();
                return;
            }
            
            // Check if user exists in localStorage
            // Check across all income tax return types (D-02, D-03, D-04)
            let users = [];
            let userFound = null;
            
            // Check D-02 users
            const d02Users = JSON.parse(localStorage.getItem('d02Users') || '[]');
            userFound = d02Users.find(u => 
                u.submissionNo === submissionNo && 
                u.username === username && 
                u.password === password
            );
            
            // If not found, check D-03 users
            if (!userFound) {
                const d03Users = JSON.parse(localStorage.getItem('d03Users') || '[]');
                userFound = d03Users.find(u => 
                    u.submissionNo === submissionNo && 
                    u.username === username && 
                    u.password === password
                );
            }
            
            // If not found, check D-04 users
            if (!userFound) {
                const d04Users = JSON.parse(localStorage.getItem('d04Users') || '[]');
                userFound = d04Users.find(u => 
                    u.submissionNo === submissionNo && 
                    u.username === username && 
                    u.password === password
                );
            }
            
            // If not found, check general income tax return users
            if (!userFound) {
                const incomeTaxUsers = JSON.parse(localStorage.getItem('incomeTaxReturnUsers') || '[]');
                userFound = incomeTaxUsers.find(u => 
                    u.submissionNo === submissionNo && 
                    u.username === username && 
                    u.password === password
                );
            }
            
            if (userFound) {
                const formType = userFound.formType || 'Income Tax Return';
                const fiscalYear = userFound.fiscalYear || 'N/A';
                const pan = userFound.pan || 'N/A';
                
                alert('लगइन सफल भयो! (Login Successful!)\n\n' +
                      'सब्मिशन नं.: ' + submissionNo + '\n' +
                      'प्रयोगकर्ताको नाम: ' + username + '\n' +
                      'फारम प्रकार: ' + formType + '\n' +
                      'स्थायी लेखा नम्बर: ' + pan + '\n' +
                      'आर्थिक वर्ष: ' + fiscalYear + '\n\n' +
                      'तपाईं अब आफ्नो रिटर्न प्रविष्टि र रुजु गर्न सक्नुहुन्छ।');
                
                // Clear form after successful login
                document.getElementById('txtITRLSubmissionNo-input').value = '';
                document.getElementById('txtITRLUsername-input').value = '';
                document.getElementById('txtITRLPassword-input').value = '';
            } else {
                alert('लगइन असफल! (Login Failed!)\n\n' +
                      'कृपया आफ्नो विवरण जाँच गर्नुहोस्। (Please check your details)\n\n' +
                      'सुनिश्चित गर्नुहोस्:\n' +
                      '• सब्मिशन नं. सही छ\n' +
                      '• प्रयोगकर्ताको नाम सही छ\n' +
                      '• पासवर्ड सही छ');
                document.getElementById('txtITRLPassword-input').value = '';
                document.getElementById('txtITRLPassword-input').focus();
            }
        });
    }
    
    // Allow Enter key to submit
    const inputs = document.querySelectorAll('#txtITRLSubmissionNo-input, #txtITRLUsername-input, #txtITRLPassword-input');
    inputs.forEach(function(input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginBtn.click();
            }
        });
    });
    
    // Focus on first field on load
    setTimeout(function() {
        document.getElementById('txtITRLSubmissionNo-input').focus();
    }, 100);
});
