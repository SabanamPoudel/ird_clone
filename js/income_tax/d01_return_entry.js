$(document).ready(function() {
    // Update date on page load
    updateDate();

    // Register button functionality
    $('#registerBtn').on('click', function() {
        const pan = $('#pan').val().trim();
        const businessName = $('#businessName').val().trim();
        const address = $('#address').val().trim();
        const mobile = $('#mobile').val().trim();
        const email = $('#email').val().trim();

        if (!pan) {
            alert('कृपया स्थायी लेखा नम्बर भर्नुहोस् । (Please enter PAN Number)');
            return;
        }

        if (pan.length !== 9 || !/^\d+$/.test(pan)) {
            alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ । (PAN must be 9 digits)');
            return;
        }

        if (!businessName) {
            alert('कृपया ब्यवसायको नाम भर्नुहोस् । (Please enter Business Name)');
            return;
        }

        if (!address) {
            alert('कृपया ठेगाना भर्नुहोस् । (Please enter Address)');
            return;
        }

        if (!mobile) {
            alert('कृपया मोबाइल नम्बर भर्नुहोस् । (Please enter Mobile Number)');
            return;
        }

        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
            alert('मोबाइल नम्बर १० अंकको हुनुपर्छ । (Mobile number must be 10 digits)');
            return;
        }

        // Save to localStorage
        const d01Entry = {
            pan: pan,
            businessName: businessName,
            address: address,
            mobile: mobile,
            email: email,
            registeredDate: new Date().toISOString()
        };

        let d01Entries = JSON.parse(localStorage.getItem('d01Entries') || '[]');
        d01Entries.push(d01Entry);
        localStorage.setItem('d01Entries', JSON.stringify(d01Entries));

        alert('दर्ता सफल भयो ! (Registration Successful!)\n\nPAN: ' + pan + '\nBusiness: ' + businessName);

        // Clear form
        clearForm();
    });

    // Reset button functionality
    $('#resetBtn').on('click', function() {
        clearForm();
    });

    // Enter key support
    $('.form-control').on('keypress', function(e) {
        if (e.which === 13) {
            $('#registerBtn').click();
        }
    });
});

// Function to clear form
function clearForm() {
    $('#pan').val('');
    $('#businessName').val('');
    $('#address').val('');
    $('#mobile').val('');
    $('#email').val('');
}

// Function to convert AD to BS (Bikram Sambat)
function convertADtoBS(adDate) {
    const adYear = adDate.getFullYear();
    const adMonth = adDate.getMonth() + 1;
    const adDay = adDate.getDate();
    
    let bsYear = adYear + 57;
    let bsMonth = adMonth + 8;
    let bsDay = adDay + 14;
    
    if (bsMonth > 12) {
        bsMonth -= 12;
    }
    
    if (adMonth <= 4) {
        bsYear = adYear + 56;
    }
    
    const daysInMonth = 30;
    if (bsDay > daysInMonth) {
        bsDay -= daysInMonth;
        bsMonth += 1;
        if (bsMonth > 12) {
            bsMonth = 1;
            bsYear += 1;
        }
    }
    
    return bsYear + '.' + String(bsMonth).padStart(2, '0') + '.' + String(bsDay).padStart(2, '0');
}

// Update date display
function updateDate() {
    const today = new Date();
    const bsDate = convertADtoBS(today);
    const dateLabel = $('#currentDate');
    if (dateLabel.length) {
        dateLabel.text('Date: ' + bsDate);
    }
}

// Toggle menu function
function toggleMenu(element) {
    const $element = $(element);
    const $submenu = $element.siblings('.submenu');
    
    if ($submenu.length) {
        $submenu.slideToggle(200);
        $submenu.toggleClass('show');
    }
}

// Function to load page in parent iframe (for navigation from D-01 to other forms)
function loadInParentIframe(url) {
    // Check if this page is opened in a new window/tab (not in iframe)
    if (window.opener) {
        // Opened via window.open(), close current window and load in opener's iframe
        window.opener.postMessage({
            action: 'loadContent',
            url: url
        }, '*');
        window.close();
    } else if (window.parent !== window) {
        // Opened in iframe, navigate parent to taxpayer portal with the new content
        window.parent.location.href = '../taxpayer_portal.html#' + url;
    } else {
        // Standalone window, redirect to taxpayer portal
        window.location.href = '../taxpayer_portal.html#' + url;
    }
}
