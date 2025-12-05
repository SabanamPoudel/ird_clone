// Taxpayer Portal JavaScript

$(document).ready(function() {
    
    // Update date on page load
    updateDate();
    
    // Check if there's a hash in URL to auto-load content
    if (window.location.hash) {
        var contentUrl = window.location.hash.substring(1); // Remove the # symbol
        if (contentUrl) {
            loadContent(contentUrl, 'Auto-loaded Content');
        }
    }
    
    // Listen for messages from child windows (like D-01 opened in new window)
    window.addEventListener('message', function(event) {
        console.log('Received message:', event.data); // Debug log
        if (event.data && event.data.action === 'loadContent') {
            console.log('Loading content:', event.data.url); // Debug log
            loadContent(event.data.url, 'Loaded from Navigation');
        } else if (event.data && event.data.action === 'loadPage') {
            // Load page in the content area
            loadContent(event.data.page, 'Verify VAT Return');
        }
    });
    
    // Function to update breadcrumb
    function updateBreadcrumb($element) {
        var breadcrumbPath = [];
        var $current = $element.closest('li');
        
        // Get the clicked item text (without icons)
        var clickedText = $element.text().trim();
        breadcrumbPath.push(clickedText);
        
        // Traverse up the tree to build the path
        $current.parents('li').each(function() {
            var $parentLink = $(this).find('> a').first();
            var parentText = $parentLink.clone().children().remove().end().text().trim();
            if (parentText) {
                breadcrumbPath.unshift(parentText);
            }
        });
        
        // Update breadcrumb display
        if (breadcrumbPath.length > 0) {
            $('#breadcrumb').text(breadcrumbPath.join(' >> '));
        }
    }
    
    // Tree Menu Toggle Functionality
    $('.sidebar-menu .expandable').on('click', function(e) {
        e.preventDefault();
        
        var $this = $(this);
        var $parent = $this.parent();
        var $submenu = $parent.find('> .submenu');
        var $toggleIcon = $this.find('.toggle-icon');
        
        if ($submenu.length > 0) {
            // Toggle submenu
            $submenu.slideToggle(200);
            
            // Toggle icon
            if ($toggleIcon.text() === '+') {
                $toggleIcon.text('−');
                $parent.addClass('expanded');
            } else {
                $toggleIcon.text('+');
                $parent.removeClass('expanded');
            }
        }
    });
    
    // Update breadcrumb when clicking child menu items (files)
    $('.sidebar-menu li.child a').on('click', function(e) {
        updateBreadcrumb($(this));
    });
    
    // Content Loading Functionality
    $('.sidebar-menu a[data-content]').on('click', function(e) {
        e.preventDefault();
        
        var contentUrl = $(this).data('content');
        var contentTitle = $(this).text().trim();
        
        if (contentUrl) {
            loadContent(contentUrl, contentTitle);
        }
    });
    
    // Function to load content dynamically
    function loadContent(url, title) {
        var $contentArea = $('.panel-body');
        
        // Show loading state
        $contentArea.html('<div class="loading-content"><i class="fa fa-spinner fa-spin"></i> लोड गर्दै...</div>');
        
        // Load content via iframe or AJAX
        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                // Add has-iframe class to fix height
                $contentArea.addClass('has-iframe');
                
                // Hide footer when content is loaded
                $('.footer').hide();
                
                // Create iframe to load the form
                var iframe = '<iframe src="' + url + '" style="width: 100%; height: 800px; border: none;" frameborder="0"></iframe>';
                $contentArea.html(iframe);
            },
            error: function() {
                // Remove has-iframe class on error
                $contentArea.removeClass('has-iframe');
                
                // Show footer again on error
                $('.footer').show();
                
                $contentArea.html('<div class="error-content"><i class="fa fa-exclamation-triangle"></i> सामग्री लोड गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।</div>');
            }
        });
    }
    
    // Login Form Validation
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        var pan = $('#pan').val().trim();
        var password = $('#password').val().trim();
        var captcha = $('#captcha').val().trim();
        
        // Validation
        if (pan === '') {
            alert('कृपया स्थायी लेखा नम्बर (PAN) प्रविष्ट गर्नुहोस्।');
            $('#pan').focus();
            return false;
        }
        
        if (password === '') {
            alert('कृपया पासवर्ड प्रविष्ट गर्नुहोस्।');
            $('#password').focus();
            return false;
        }
        
        if (captcha === '') {
            alert('कृपया सुरक्षा कोड प्रविष्ट गर्नुहोस्।');
            $('#captcha').focus();
            return false;
        }
        
        // PAN format validation (9 digits)
        if (!/^\d{9}$/.test(pan)) {
            alert('स्थायी लेखा नम्बर (PAN) ९ अंकको हुनुपर्छ।');
            $('#pan').focus();
            return false;
        }
        
        // Show loading
        $(this).find('button[type="submit"]').prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> लगइन गर्दै...');
        
        // Here you would typically make an AJAX call to the server
        // For demo purposes, we'll just show an alert
        setTimeout(function() {
            alert('लगइन प्रणाली अहिले उपलब्ध छैन। कृपया पछि प्रयास गर्नुहोस्।');
            $('#loginForm').find('button[type="submit"]').prop('disabled', false).html('लगइन');
        }, 1000);
    });
    
    // Registration button
    $('#registerBtn').on('click', function(e) {
        e.preventDefault();
        alert('दर्ता प्रणाली छिट्टै उपलब्ध हुनेछ। कृपया ird.gov.np मा जानुहोस् वा नजिकको कर कार्यालयमा सम्पर्क गर्नुहोस्।');
    });
    
    // Refresh Captcha
    $('#refreshCaptcha').on('click', function(e) {
        e.preventDefault();
        var captchaImg = $('#captchaImage');
        var currentSrc = captchaImg.attr('src');
        
        // Add timestamp to force reload
        var newSrc = currentSrc.split('?')[0] + '?' + new Date().getTime();
        captchaImg.attr('src', newSrc);
        
        // Show loading animation
        captchaImg.css('opacity', '0.5');
        setTimeout(function() {
            captchaImg.css('opacity', '1');
        }, 300);
    });
    
    // Forgot Password
    $('#forgotPassword').on('click', function(e) {
        e.preventDefault();
        alert('पासवर्ड रिसेट गर्न कृपया आफ्नो दर्ता गरिएको इमेल वा मोबाइल नम्बरमा पठाइएको लिंक प्रयोग गर्नुहोस्।\n\nसहयोगको लागि: 1660 010 5000 मा सम्पर्क गर्नुहोस्।');
    });
    
    // Service Box Click Handlers
    $('.service-box').on('click', function() {
        var serviceName = $(this).find('h5').text();
        alert(serviceName + ' सेवा छिट्टै उपलब्ध हुनेछ।');
    });
    
    // Smooth Scroll for Internal Links
    $('a[href^="#"]').on('click', function(e) {
        var target = $(this.getAttribute('href'));
        if(target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
    
    // Form Input Focus Effects
    $('.form-control').on('focus', function() {
        $(this).parent().addClass('focused');
    });
    
    $('.form-control').on('blur', function() {
        if ($(this).val() === '') {
            $(this).parent().removeClass('focused');
        }
    });
    
    // Clear Form
    function clearLoginForm() {
        $('#loginForm')[0].reset();
        $('#captcha').val('');
    }
    
    // Toggle Password Visibility (if needed later)
    window.togglePassword = function() {
        var passwordField = $('#password');
        var type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
    };
    
    // Print Page Function
    window.printPage = function() {
        window.print();
    };
    
    // Download Guidelines
    window.downloadGuidelines = function() {
        alert('उपयोगकर्ता निर्देशिका डाउनलोड गर्न छिट्टै उपलब्ध हुनेछ।');
    };
    
    window.generateCaptcha = generateCaptcha;
    
});

// Utility Functions

// Format PAN number as user types
function formatPAN(input) {
    var value = input.value.replace(/\D/g, '');
    if (value.length > 9) {
        value = value.substring(0, 9);
    }
    input.value = value;
}

// Validate Email Format
function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate Phone Number
function validatePhone(phone) {
    var re = /^(97|98)\d{8}$/;
    return re.test(phone);
}

// Show/Hide Loading Spinner
function showLoading() {
    var overlay = $('<div id="loadingOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;"><div style="background: white; padding: 30px; border-radius: 8px; text-align: center;"><i class="fa fa-spinner fa-spin" style="font-size: 48px; color: #168dcf;"></i><p style="margin-top: 15px; color: #333;">कृपया पर्खनुहोस्...</p></div></div>');
    $('body').append(overlay);
}

function hideLoading() {
    $('#loadingOverlay').remove();
}

// Show Success Message
function showSuccess(message) {
    alert('✓ ' + message);
}

// Show Error Message
function showError(message) {
    alert('✗ ' + message);
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

// Update date display in header
function updateDate() {
    const today = new Date();
    const bsDate = convertADtoBS(today);
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
        headerRight.textContent = 'Date: ' + bsDate;
    }
}

// Global function to load content in parent iframe (called from child iframes like D-02, Annex-13)
window.loadInParentIframe = function(url) {
    console.log('loadInParentIframe called with URL:', url);
    const $contentArea = $('.panel-body');
    
    // Show loading state
    $contentArea.html('<div class="loading-content" style="padding: 20px; text-align: center;"><i class="fa fa-spinner fa-spin"></i> लोड गर्दै...</div>');
    
    // Load content via AJAX and create iframe
    $.ajax({
        url: url,
        method: 'GET',
        success: function(data) {
            // Add has-iframe class
            $contentArea.addClass('has-iframe');
            
            // Hide footer when content is loaded
            $('.footer').hide();
            
            // Create iframe to load the form
            var iframe = '<iframe src="' + url + '" style="width: 100%; height: 800px; border: none;" frameborder="0"></iframe>';
            $contentArea.html(iframe);
            
            console.log('Content loaded successfully:', url);
        },
        error: function(error) {
            // Remove has-iframe class on error
            $contentArea.removeClass('has-iframe');
            
            // Show footer again on error
            $('.footer').show();
            
            console.error('Error loading content:', error);
            $contentArea.html('<div class="error-content" style="padding: 20px; color: red;"><i class="fa fa-exclamation-triangle"></i> सामग्री लोड गर्न असफल भयो। कृपया पुन: प्रयास गर्नुहोस्।</div>');
        }
    });
};