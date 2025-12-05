// D-02 Main Form JavaScript

$(document).ready(function() {
    loadD02Data();
    setupCalculations();
    loadSavedFormData();
});

function loadD02Data() {
    const registrationData = JSON.parse(sessionStorage.getItem('d02_current_registration') || '{}');
    
    if (!registrationData.pan) {
        alert('कृपया पहिले दर्ता गर्नुहोस्। (Please register first)');
        window.location.href = 'd02_return_entry.html';
        return;
    }
    
    // Display user information in form
    if (registrationData.submissionNo) {
        $('#submissionNo').text(registrationData.submissionNo);
        $('#submissionNo2').val(registrationData.submissionNo);
    }
    if (registrationData.pan) {
        $('#panNo').val(registrationData.pan);
    }
    if (registrationData.fiscalYear) {
        $('#fiscalYear').val(registrationData.fiscalYear);
    }
    if (registrationData.username) {
        $('#taxpayerName').val(registrationData.username);
    }
    if (registrationData.email) {
        $('#email').val(registrationData.email);
    }
    if (registrationData.contact) {
        $('#mobile').val(registrationData.contact);
    }
    
    // Set default values
    $('#accountType').val('A');
    $('#taxpayerStatus').text('सक्रिय');
    $('#iroName').text('आन्तरिक राजस्व कार्यालय भरतपुर');
    
    console.log('D-02 Main Form loaded with data:', registrationData);
}

// Setup automatic calculations
function setupCalculations() {
    // Calculate total income (कारोबार रकम - कट्टी हुने रकम)
    $('#transactionAmount, #deductibleAmount').on('input', function() {
        const transaction = parseFloat($('#transactionAmount').val()) || 0;
        const deductible = parseFloat($('#deductibleAmount').val()) || 0;
        $('#totalIncome').val((transaction - deductible).toFixed(2));
    });
    
    // Calculate tax amounts with different rates (using IRD truncate method)
    $('#tax1Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        // Row 1: Fixed tax of 7500.00 only if amount is entered
        if (amount > 0) {
            $('#tax1Calculated').val('7500.00');
        } else {
            $('#tax1Calculated').val('0.00');
        }
        calculateSubtotals();
    });
    
    $('#tax1_1Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        const tax = truncateIRD(amount * 0.0025);
        $('#tax1_1Calculated').val(tax.toFixed(2));
        calculateSubtotals();
    });
    
    $('#tax1_2Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        const tax = truncateIRD(amount * 0.003);
        $('#tax1_2Calculated').val(tax.toFixed(2));
        calculateSubtotals();
    });
    
    $('#tax1_3Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        const tax = truncateIRD(amount * 0.01);
        $('#tax1_3Calculated').val(tax.toFixed(2));
        calculateSubtotals();
    });
    
    $('#tax1_4Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        const tax = truncateIRD(amount * 0.008);
        $('#tax1_4Calculated').val(tax.toFixed(2));
        calculateSubtotals();
    });
    
    $('#tax1_5Amount').on('input', function() {
        const amount = parseFloat($(this).val()) || 0;
        const tax = truncateIRD(amount * 0.02);
        $('#tax1_5Calculated').val(tax.toFixed(2));
        calculateSubtotals();
    });
    
    // Calculate cost expense
    $('#openingStock, #purchaseAmount, #directExpense, #closingStock').on('input', function() {
        const opening = parseFloat($('#openingStock').val()) || 0;
        const purchase = parseFloat($('#purchaseAmount').val()) || 0;
        const direct = parseFloat($('#directExpense').val()) || 0;
        const closing = parseFloat($('#closingStock').val()) || 0;
        
        const costExpense = opening + purchase + direct - closing;
        $('#costExpense').val(costExpense.toFixed(2));
        calculateTotalExpenses();
    });
}

// IRD truncate function (Math.floor to 2 decimal places)
function truncateIRD(num) {
    return Math.floor(num * 100) / 100;
}

function calculateSubtotals() {
    // Get input amounts (left column)
    const tax1Amt = parseFloat($('#tax1Amount').val()) || 0;
    const tax1_1Amt = parseFloat($('#tax1_1Amount').val()) || 0;
    const tax1_2Amt = parseFloat($('#tax1_2Amount').val()) || 0;
    const tax1_3Amt = parseFloat($('#tax1_3Amount').val()) || 0;
    const tax1_4Amt = parseFloat($('#tax1_4Amount').val()) || 0;
    const tax1_5Amt = parseFloat($('#tax1_5Amount').val()) || 0;
    
    // Get calculated tax amounts (right column)
    const tax1 = parseFloat($('#tax1Calculated').val()) || 0;
    const tax1_1 = parseFloat($('#tax1_1Calculated').val()) || 0;
    const tax1_2 = parseFloat($('#tax1_2Calculated').val()) || 0;
    const tax1_3 = parseFloat($('#tax1_3Calculated').val()) || 0;
    const tax1_4 = parseFloat($('#tax1_4Calculated').val()) || 0;
    const tax1_5 = parseFloat($('#tax1_5Calculated').val()) || 0;
    
    // Subtotal Amount (left): Sum of all input amounts
    const subtotalAmount = tax1Amt + tax1_1Amt + tax1_2Amt + tax1_3Amt + tax1_4Amt + tax1_5Amt;
    $('#subtotal1Amount').val(subtotalAmount.toFixed(2));
    
    // Subtotal Calculated (right): Sum of all calculated taxes
    const subtotalCalculated = tax1 + tax1_1 + tax1_2 + tax1_3 + tax1_4 + tax1_5;
    $('#subtotal1Calculated').val(subtotalCalculated.toFixed(2));
    
    calculateGrandTotal();
}

function calculateFeesAndInterest() {
    console.log('Calculate button clicked');
    
    // Get the subtotal tax amount (row 2 calculated)
    const subtotalTax = parseFloat($('#subtotal1Calculated').val()) || 0;
    
    // Calculate fee (दफा ११७) - Example: 10% penalty fee or fixed amount
    // You may need to adjust this formula based on actual IRD rules
    const fee117 = subtotalTax * 0.10; // 10% of total tax as penalty fee
    
    // Calculate interest (दफा ११८) - Example: Daily interest calculation
    // Formula might be: (tax amount × days late × daily interest rate)
    // For demo, using a percentage
    const interest118 = truncateIRD(fee117 * 0.10126); // Interest on the fee
    
    // दफा ११९ usually applies to other scenarios
    const interest119 = 0; // Typically 0 unless specific conditions

    console.log('Calculated - Fee 117:', fee117, 'Interest 118:', interest118, 'Interest 119:', interest119);

    // Set both left and right columns to the same calculated values
    $('#fee117Amount').val(fee117.toFixed(2));
    $('#fee117Calculated').val(fee117.toFixed(2));
    
    $('#interest118Amount').val(interest118.toFixed(2));
    $('#interest118Calculated').val(interest118.toFixed(2));
    
    $('#interest119Amount').val(interest119.toFixed(2));
    $('#interest119Calculated').val(interest119.toFixed(2));

    calculateGrandTotal();
}

function calculateGrandTotal() {
    const subtotalAmount = parseFloat($('#subtotal1Amount').val()) || 0;
    const subtotalCalculated = parseFloat($('#subtotal1Calculated').val()) || 0;
    const fee117Amount = parseFloat($('#fee117Amount').val()) || 0;
    const interest118Amount = parseFloat($('#interest118Amount').val()) || 0;
    const interest119Amount = parseFloat($('#interest119Amount').val()) || 0;
    const fee117 = parseFloat($('#fee117Calculated').val()) || 0;
    const interest118 = parseFloat($('#interest118Calculated').val()) || 0;
    const interest119 = parseFloat($('#interest119Calculated').val()) || 0;

    console.log('Subtotal Amount:', subtotalAmount, 'Subtotal Calculated:', subtotalCalculated);
    console.log('Fee/Interest Amounts:', fee117Amount, interest118Amount, interest119Amount);
    console.log('Fee/Interest Calculated:', fee117, interest118, interest119);

    // Grand Total Amount (left): row 2 + row 5 + row 6 + row 7
    const grandLeft = subtotalAmount + fee117Amount + interest118Amount + interest119Amount;
    
    // Grand Total Calculated (right): row 2 + row 5 + row 6 + row 7
    const grandRight = truncateIRD(subtotalCalculated + fee117 + interest118 + interest119);

    console.log('Grand Total Left:', grandLeft, 'Grand Total Right:', grandRight);

    $('#grandTotalAmount').val(grandLeft.toFixed(2));
    $('#grandTotalCalculated').val(grandRight.toFixed(2));
}

// Other Expenses Management
let expenseCounter = 0;

function addOtherExpense() {
    expenseCounter++;
    const row = $(
        `<div id="expense${expenseCounter}" style="display: flex; align-items: center; border-bottom: 1px dashed #C5D9F1; padding: 10px 0;">
            <div style="width: 60px; text-align: center;">
                <input type="text" value="${expenseCounter}" readonly class="x-form-field" style="width: 40px; height: 24px; text-align: center; background: white; border: 1px solid #b5b8c8; border-radius: 5px; padding: 2px; box-shadow: inset 0 1px 2px #e0e6ef; font-size: 11px;">
            </div>
            <div style="width: 300px; padding-left: 0;">
                <input type="text" id="expenseDesc${expenseCounter}" placeholder="विवरण" class="x-form-field" style="width: 98%; height: 24px; background: white; border: 1px solid #b5b8c8; border-radius: 5px; padding: 2px; box-shadow: inset 0 1px 2px #e0e6ef; font-size: 11px;">
            </div>
            <div style="width: 120px; display: flex; align-items: center; justify-content: center;">
                <input type="text" id="expenseAmt${expenseCounter}" class="x-form-field TxtRight expense-amount" placeholder="रकम" style="width: 90px; height: 24px; background: white; border: 1px solid #b5b8c8; border-radius: 5px; padding: 2px; box-shadow: inset 0 1px 2px #e0e6ef; text-align: right; font-size: 11px; margin-left: 0;" onchange="calculateOtherExpenses()">
            </div>
            <div style="width: 60px; display: flex; align-items: center; justify-content: flex-start; padding-left: 18px;">
                <button class="x-btn" style="background: none; border: none; padding: 0; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="removeExpense(${expenseCounter})">
                    <img src="../../resources/cancel.png" alt="Delete" style="width: 22px; height: 22px; display: block;">
                </button>
            </div>
        </div>`
    );
    $('#otherExpensesBox').append(row);
}

function removeExpense(id) {
    $(`#expense${id}`).remove();
    calculateOtherExpenses();
}

function calculateOtherExpenses() {
    let total = 0;
    $('.expense-amount').each(function() {
        const val = parseFloat($(this).val()) || 0;
        total += val;
    });
    $('#totalOtherExpenses').val(total.toFixed(2));
    calculateTotalExpenses();
}

function calculateTotalExpenses() {
    const costExpense = parseFloat($('#costExpense').val()) || 0;
    const otherExpenses = parseFloat($('#totalOtherExpenses').val()) || 0;
    $('#totalExpenses').val((costExpense + otherExpenses).toFixed(2));
}

// Navigation functions
function openAnnex10Modal() {
    document.getElementById('annex10Modal').style.display = 'block';
}

function closeAnnex10Modal() {
    document.getElementById('annex10Modal').style.display = 'none';
}

function confirmAnnex10() {
    closeAnnex10Modal();
    
    // Check if transaction amount has been entered
    const transactionAmount = $('#transactionAmount').val();
    
    if (!transactionAmount || parseFloat(transactionAmount) <= 0) {
        // Transaction amount not entered, show message modal
        setTimeout(() => {
            document.getElementById('annex10MessageModal').style.display = 'block';
        }, 300);
        return;
    }
    
    // Check if form has been saved
    const savedData = sessionStorage.getItem('d02FormData');
    
    if (savedData) {
        // Form is saved, open Annex 10 page
        window.location.href = 'annex_10.html';
    } else {
        // Form not saved, show message modal
        setTimeout(() => {
            document.getElementById('annex10MessageModal').style.display = 'block';
        }, 300);
    }
}

function closeAnnex10MessageModal() {
    document.getElementById('annex10MessageModal').style.display = 'none';
}

function openAnnex13Modal() {
    // Directly load Annex-13 in the parent iframe instead of showing a modal
    loadInParentIframe('income_tax/annex_13.html');
}

function closeAnnex13Modal() {
    document.getElementById('annex13Modal').style.display = 'none';
}

function confirmAnnex13() {
    closeAnnex13Modal();
    // Show the message modal after closing the first one
    setTimeout(() => {
        document.getElementById('annex13MessageModal').style.display = 'block';
    }, 300);
}

function closeAnnex13MessageModal() {
    document.getElementById('annex13MessageModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const annex10Modal = document.getElementById('annex10Modal');
    const annex13Modal = document.getElementById('annex13Modal');
    const annex10MessageModal = document.getElementById('annex10MessageModal');
    const annex13MessageModal = document.getElementById('annex13MessageModal');
    const saveSuccessModal = document.getElementById('saveSuccessModal');
    const warningModal = document.getElementById('warningModal');
    
    if (event.target == annex10Modal) {
        closeAnnex10Modal();
    }
    if (event.target == annex13Modal) {
        closeAnnex13Modal();
    }
    if (event.target == annex10MessageModal) {
        closeAnnex10MessageModal();
    }
    if (event.target == annex13MessageModal) {
        closeAnnex13MessageModal();
    }
    if (event.target == saveSuccessModal) {
        closeSaveSuccessModal();
    }
    if (event.target == warningModal) {
        closeWarningModal();
    }
}

// Save form data
function saveD02Form() {
    // Validate that transaction amount is entered
    const transactionAmount = $('#transactionAmount').val();
    
    if (!transactionAmount || parseFloat(transactionAmount) <= 0) {
        // Show warning modal
        document.getElementById('warningModal').style.display = 'block';
        return;
    }
    
    // Collect all other expenses
    const expenses = [];
    $('.expense-amount').each(function() {
        const id = $(this).attr('id').replace('expenseAmt', '');
        const desc = $(`#expenseDesc${id}`).val();
        const amt = $(this).val();
        if (desc && amt) {
            expenses.push({ description: desc, amount: amt });
        }
    });
    
    const formData = {
        // Income details
        transactionAmount: $('#transactionAmount').val(),
        deductibleAmount: $('#deductibleAmount').val(),
        totalIncome: $('#totalIncome').val(),
        
        // Tax calculations
        tax1Amount: $('#tax1Amount').val(),
        tax1_1Amount: $('#tax1_1Amount').val(),
        tax1_2Amount: $('#tax1_2Amount').val(),
        tax1_3Amount: $('#tax1_3Amount').val(),
        tax1_4Amount: $('#tax1_4Amount').val(),
        tax1_5Amount: $('#tax1_5Amount').val(),
        
        // Expense details
        openingStock: $('#openingStock').val(),
        purchaseAmount: $('#purchaseAmount').val(),
        directExpense: $('#directExpense').val(),
        closingStock: $('#closingStock').val(),
        costExpense: $('#costExpense').val(),
        
        // Other expenses
        otherExpenses: expenses,
        totalOtherExpenses: $('#totalOtherExpenses').val(),
        totalExpenses: $('#totalExpenses').val(),
        
        // Calculated values
        subtotal1Calculated: $('#subtotal1Calculated').val(),
        fee117Calculated: $('#fee117Calculated').val(),
        interest118Calculated: $('#interest118Calculated').val(),
        interest119Calculated: $('#interest119Calculated').val(),
        grandTotalCalculated: $('#grandTotalCalculated').val(),
        
        timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('d02FormData', JSON.stringify(formData));
    
    // Save PAN number separately for Annex-10 page
    const panNo = $('#panNo').val();
    if (panNo) {
        sessionStorage.setItem('d02_panNo', panNo);
    }
    
    // Get submission number and show success modal
    const registrationData = JSON.parse(sessionStorage.getItem('d02_current_registration') || '{}');
    const submissionNo = registrationData.submissionNo || '';
    
    $('#savedSubmissionNo').text(submissionNo);
    document.getElementById('saveSuccessModal').style.display = 'block';
}

function closeSaveSuccessModal() {
    document.getElementById('saveSuccessModal').style.display = 'none';
}

function closeWarningModal() {
    document.getElementById('warningModal').style.display = 'none';
    // Focus on transaction amount field
    $('#transactionAmount').focus();
}

// Load saved form data
function loadSavedFormData() {
    const savedData = sessionStorage.getItem('d02FormData');
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            
            // Load income details
            $('#transactionAmount').val(formData.transactionAmount || '');
            $('#deductibleAmount').val(formData.deductibleAmount || '');
            $('#totalIncome').val(formData.totalIncome || '');
            
            // Load tax amounts
            $('#tax1Amount').val(formData.tax1Amount || '');
            $('#tax1_1Amount').val(formData.tax1_1Amount || '');
            $('#tax1_2Amount').val(formData.tax1_2Amount || '');
            $('#tax1_3Amount').val(formData.tax1_3Amount || '');
            $('#tax1_4Amount').val(formData.tax1_4Amount || '');
            $('#tax1_5Amount').val(formData.tax1_5Amount || '');
            
            // Load expense details
            $('#openingStock').val(formData.openingStock || '');
            $('#purchaseAmount').val(formData.purchaseAmount || '');
            $('#directExpense').val(formData.directExpense || '');
            $('#closingStock').val(formData.closingStock || '');
            
            // Load other expenses
            if (formData.otherExpenses && formData.otherExpenses.length > 0) {
                formData.otherExpenses.forEach(expense => {
                    addOtherExpense();
                    $(`#expenseDesc${expenseCounter}`).val(expense.description);
                    $(`#expenseAmt${expenseCounter}`).val(expense.amount);
                });
                calculateOtherExpenses();
            }
            
            // Trigger calculations
            $('#tax1_1Amount').trigger('input');
            $('#tax1_2Amount').trigger('input');
            $('#tax1_3Amount').trigger('input');
            $('#tax1_4Amount').trigger('input');
            $('#tax1_5Amount').trigger('input');
            $('#openingStock').trigger('input');
            
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
    }
}

// Submit form
function submitD02Form() {
    // Validate required fields
    if (!$('#transactionAmount').val()) {
        alert('कृपया कारोबार रकम भर्नुहोस्! (Please enter transaction amount!)');
        $('#transactionAmount').focus();
        return;
    }
    
    if (!$('#totalIncome').val() || parseFloat($('#totalIncome').val()) <= 0) {
        alert('कृपया वैध आय रकम भर्नुहोस्! (Please enter valid income amount!)');
        return;
    }
    
    // Save before submit
    saveD02Form();
    
    // Show confirmation
    if (confirm('के तपाइँ यो फाराम पेश गर्न चाहनुहुन्छ? (Do you want to submit this form?)')) {
        // Here you would typically send data to server
        alert('फाराम सफलतापूर्वक पेश गरियो! (Form submitted successfully!)\n\nजम्मा कर: रु. ' + $('#grandTotalCalculated').val());
        
        // You can redirect to a success page or print page
        // window.location.href = 'd02_success.html';
    }
}

// Fallback loadInParentIframe for D-02 form
window.loadInParentIframe = function(url) {
    try {
        if (parent && parent.loadInParentIframe && parent !== window) {
            parent.loadInParentIframe(url);
        } else {
            window.open(url, '_blank');
        }
    } catch (e) {
        console.error('Error in loadInParentIframe:', e);
        window.open(url, '_blank');
    }
};
