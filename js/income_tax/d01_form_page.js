$(document).ready(function() {
    // Flag to prevent repeated modal triggering
    let paymentCalculated = false;
    
    // Update date on page load
    updateDate();

    // Load registration data
    loadRegistrationData();
    
    // Generate request code
    generateRequestCode();
    
    // Add event listeners for filter inputs
    $('#fiscalYear').on('change', function() {
        // Don't auto-calculate, just clear if fiscal year changes
        $('#paymentDetails').html('');
        paymentCalculated = false;
    });
    
    // Validate transaction amount (max 30 lakhs = 3000000)
    $('#transactionAmt').on('blur', function() {
        const value = parseFloat($(this).val()) || 0;
        if (value > 3000000) {
            showModal('कारोबार रकम 3000000 भन्दा बढी भएकोले SA-D01 भर्न हुन्न');
            $(this).val('');
            $('#paymentDetails').html('');
            paymentCalculated = false;
        }
    });
    
    // Validate expense amount (max 30 lakhs = 3000000)
    $('#expenseAmt').on('input', function() {
        const value = parseFloat($(this).val()) || 0;
        if (value > 3000000) {
            showModal('कर योग्य आय कट्टी रकम 3000000 भन्दा बढी भएकोले SA-D01 भर्न हुन्न');
            $(this).val('');
            $('#paymentDetails').html('');
            paymentCalculated = false;
        }
    });
    
    // Only trigger payment calculation when user completes filling expense amount
    $('#expenseAmt').on('blur', function() {
        const fiscalYear = $('#fiscalYear').val();
        const transactionAmt = parseFloat($('#transactionAmt').val()) || 0;
        const expenseAmt = parseFloat($(this).val()) || 0;
        
        if (fiscalYear && transactionAmt > 0 && expenseAmt >= 0 && !paymentCalculated) {
            paymentCalculated = true;
            calculateAndDisplayPayment();
        }
    });
    
    // Reset flag when user changes any input field
    $('#transactionAmt, #expenseAmt').on('focus', function() {
        paymentCalculated = false;
    });
});

// Function to calculate and display payment details
function calculateAndDisplayPayment() {
    const fiscalYear = $('#fiscalYear').val();
    const transactionAmt = parseFloat($('#transactionAmt').val()) || 0;
    const expenseAmt = parseFloat($('#expenseAmt').val()) || 0;
    
    // Only show payment if fiscal year is selected and amounts are entered
    if (fiscalYear && transactionAmt > 0) {
        // Show first confirmation modal
        showConfirmationModal(fiscalYear, transactionAmt, expenseAmt);
    } else {
        $('#paymentDetails').html('');
    }
}

// Function to show first confirmation modal with Cancel and OK buttons
function showConfirmationModal(fiscalYear, transactionAmt, expenseAmt) {
    const modalHTML = `
        <div id="confirmationModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
            <div style="background: white; border-radius: 12px; padding: 40px 50px; max-width: 600px; text-align: left; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <p style="font-size: 15px; color: #333; margin-bottom: 30px; line-height: 1.8;">
                    तपाईंले उल्लेख गरेको कारोबार रकम र कट्टी हुने रकम ठीक भएमा Ok बटन थिच्नुहोस् । अन्यथा Cancel बटन थिच्नुहोस् ।
                </p>
                <div style="display: flex; justify-content: flex-end; gap: 15px;">
                    <button onclick="cancelConfirmation()" style="background: #e0e0e0; color: #666; border: none; padding: 10px 30px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                        Cancel
                    </button>
                    <button onclick="proceedToSecondModal('${fiscalYear}', ${transactionAmt}, ${expenseAmt})" style="background: #d9534f; color: white; border: none; padding: 10px 30px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
}

// Function to cancel confirmation
function cancelConfirmation() {
    $('#confirmationModal').remove();
}

// Function to show second modal and then display payment
function proceedToSecondModal(fiscalYear, transactionAmt, expenseAmt) {
    // Remove first modal
    $('#confirmationModal').remove();
    
    // Show second modal
    const modalHTML = `
        <div id="infoModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
            <div style="background: white; border-radius: 12px; padding: 40px 50px; max-width: 600px; text-align: left; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
                <p style="font-size: 15px; color: #333; margin-bottom: 30px; line-height: 1.8;">
                    अर्को आय वर्षको आय विवरण पेश गर्न चाहेमा पुन: आय वर्ष छनोट गरी कारोबार रकम र कट्टी हुने रकम उल्लेख गर्नुहोस् ।
                </p>
                <div style="display: flex; justify-content: flex-end;">
                    <button onclick="displayPaymentDetails('${fiscalYear}', ${transactionAmt}, ${expenseAmt})" style="background: #5dade2; color: white; border: none; padding: 10px 40px; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
}

// Function to display payment details after modals
function displayPaymentDetails(fiscalYear, transactionAmt, expenseAmt) {
    // Remove second modal
    $('#infoModal').remove();
    
    const netIncome = transactionAmt - expenseAmt;
    
    // D-01 presumptive tax calculation: 0.3% of transaction amount
    const taxRate = 0.003;
    const taxAmount = transactionAmt * taxRate;
    
    // Section 117 fee calculation (approximate - 1% of tax or minimum 200)
    const section117Fee = Math.max(taxAmount * 0.01, 200);
    
    // Section 119 interest - no interest for D-01
    const section119Interest = 0;
    
    // Total amount to pay
    const totalAmount = taxAmount + section117Fee + section119Interest;
    
    // Display payment table
    const paymentHTML = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #dee2e6;">
            <thead>
                <tr style="background-color: #f8f9fa;">
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">आर्थिक बर्ष</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">कारोबार रकम</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">कट्टी हुने रकम</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">आय रकम</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">लाग्न कर रकम</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">दफा ११७ बमोजिमको शुल्क</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">दफा ११९ बमोजिमको ब्याज</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">जम्मा तिर्नुपर्ने रकम</th>
                    <th style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">${fiscalYear}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${transactionAmt.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${expenseAmt.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${netIncome.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${taxAmount.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${section117Fee.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${section119Interest.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: right;">${totalAmount.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 8px; font-size: 11px; text-align: center;">
                        <button onclick="deletePaymentRow()" style="background: transparent; color: #dc3545; border: none; padding: 4px 8px; cursor: pointer; font-size: 16px;">
                            🗑️
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
    
    $('#paymentDetails').html(paymentHTML);
}

// Function to delete payment row
function deletePaymentRow() {
    $('#paymentDetails').html('');
    $('#fiscalYear').val('');
    $('#transactionAmt').val('');
    $('#expenseAmt').val('');
}

// Function to load registration data from sessionStorage
function loadRegistrationData() {
    const registrationData = JSON.parse(sessionStorage.getItem('d01_current_registration') || '{}');
    
    if (registrationData.pan) {
        $('#displayPan').text(registrationData.pan);
        $('#displayBusinessName').text(registrationData.businessName);
        $('#displayAddress').text(registrationData.address);
        $('#displayMobile').text(registrationData.mobile);
        $('#displayEmail').text(registrationData.email || 'N/A');
        
        // Set current date
        const today = new Date();
        const bsDate = convertADtoBS(today);
        $('#displayDate').text(bsDate);
    } else {
        // No registration data found, redirect back to entry page
        alert('कृपया पहिले दर्ता गर्नुहोस्। (Please register first)');
        window.location.href = 'd01_return_entry.html';
    }
}

// Function to generate request code
function generateRequestCode() {
    const requestCode = 'D01-' + Date.now().toString().slice(-8);
    $('#displayRequestCode').text(requestCode);
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

// Function to show modal popup
function showModal(message) {
    // Create modal overlay if it doesn't exist
    let modalOverlay = document.getElementById('validationModal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'validationModal';
        modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = 'background: white; border-radius: 15px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
        
        const iconDiv = document.createElement('div');
        iconDiv.style.cssText = 'margin-bottom: 20px;';
        iconDiv.innerHTML = '<svg width="80" height="80" viewBox="0 0 80 80" style="margin: 0 auto;"><circle cx="40" cy="40" r="38" fill="none" stroke="#b8c5d0" stroke-width="3"/><circle cx="40" cy="25" r="3" fill="#b8c5d0"/><rect x="37" y="32" width="6" height="28" rx="3" fill="#b8c5d0"/></svg>';
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'modalMessage';
        messageDiv.style.cssText = 'font-size: 16px; color: #333; margin-bottom: 25px; line-height: 1.6;';
        
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.cssText = 'background: #5dade2; color: white; border: none; padding: 12px 40px; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 500;';
        okButton.onclick = function() {
            document.body.removeChild(modalOverlay);
        };
        
        modalContent.appendChild(iconDiv);
        modalContent.appendChild(messageDiv);
        modalContent.appendChild(okButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }
    
    document.getElementById('modalMessage').textContent = message;
    modalOverlay.style.display = 'flex';
}
