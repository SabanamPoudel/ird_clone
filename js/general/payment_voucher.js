// Load user data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Clear all form data on page refresh
    clearAllPaymentVoucherData();
    
    const loginData = JSON.parse(localStorage.getItem('lastLoginAttempt') || '{}');
    
    if (loginData.panNumber) {
        document.getElementById('panNumber').textContent = loginData.panNumber;
    }
    
    // Tab 2: Load vouchers data
    loadPendingVouchers();
    loadPaidVouchers();
    
    // Add event listener for fiscal year filter
    const filterYearSelect = document.getElementById('filterYear');
    if (filterYearSelect) {
        filterYearSelect.addEventListener('change', filterVouchersByYear);
    }
    
    // Add event listeners for payment confirmation modal
    const btnConfirmPayment = document.getElementById('btnConfirmPayment');
    if (btnConfirmPayment) {
        btnConfirmPayment.addEventListener('click', confirmPayment);
    }
    
    const btnCancelPayment = document.getElementById('btnCancelPayment');
    if (btnCancelPayment) {
        btnCancelPayment.addEventListener('click', cancelPayment);
    }
    
    // Add event listeners for payment success modal
    const btnMakePayment = document.getElementById('btnMakePayment');
    if (btnMakePayment) {
        btnMakePayment.addEventListener('click', handleMakePayment);
    }
    
    const btnCancelSuccess = document.getElementById('btnCancelSuccess');
    if (btnCancelSuccess) {
        btnCancelSuccess.addEventListener('click', cancelSuccess);
    }
});

// Clear all payment voucher form data on page refresh
function clearAllPaymentVoucherData() {
    // Clear bank selection
    const bankSelect = document.getElementById('bankSelect');
    if (bankSelect) {
        bankSelect.selectedIndex = 0;
    }
    
    // Clear all table rows except the first one, and reset the first row
    const paymentRows = document.getElementById('paymentRows');
    if (paymentRows) {
        // Remove all rows except the first one
        while (paymentRows.children.length > 1) {
            paymentRows.removeChild(paymentRows.lastChild);
        }
        
        // Reset the first row
        const firstRow = paymentRows.children[0];
        if (firstRow) {
            // Reset करको प्रकार dropdown
            const taxTypeSelect = firstRow.querySelector('select[name="taxType"]');
            if (taxTypeSelect) {
                taxTypeSelect.selectedIndex = 0;
            }
            
            // Reset राजस्व शीर्षक cell to helper text
            const revenueCell = firstRow.cells[2];
            if (revenueCell) {
                revenueCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
            }
            
            // Reset बापत cell to helper text
            const bapatCell = firstRow.cells[3];
            if (bapatCell) {
                bapatCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
            }
            
            // Clear राजस्व रकम (amount) input
            const amountInput = firstRow.querySelector('input[name="amount"]');
            if (amountInput) {
                amountInput.value = '';
            }
            
            // Reset आर्थिक बर्ष (fiscal year) dropdown
            const fiscalYearSelect = firstRow.querySelector('select[name="fiscalYear"]');
            if (fiscalYearSelect) {
                fiscalYearSelect.selectedIndex = 0;
            }
            
            // Clear कैफियत (remarks) cell
            const remarksCell = firstRow.cells[6];
            if (remarksCell) {
                remarksCell.innerHTML = '';
            }
        }
    }
    
    // Reset total amount to ० (Nepali zero)
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
        totalAmount.textContent = '०';
    }
    
    // Clear transaction code
    const transactionCode = document.getElementById('transactionCode');
    if (transactionCode) {
        transactionCode.textContent = '';
    }
    
    console.log('All payment voucher data cleared on page refresh');
}

// Tab switching function
function switchTab(tabIndex) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById('tab' + tabIndex).classList.add('active');
    buttons[tabIndex].classList.add('active');
}

// Handle tax type change
function handleTaxTypeChange(select) {
    const row = select.closest('tr');
    const revenueCell = row.cells[2];
    const bapatCell = row.cells[3];
    const remarksCell = row.cells[6];
    
    if (select.value === 'I') {
        // Income Tax - आय कर
        revenueCell.innerHTML = `<select name="revenueHead" class="form-field">
            <option value="">राजस्व शीर्षक छान्नुहोस</option>
            <option value="11111">11111 (आय कर – व्यक्तिगत वा एकलौटी फर्म)</option>
            <option value="11112">11112 (पारिश्रमिक आय कर)</option>
            <option value="11113">11113 (पूँजीगत लाभ कर व्यक्तिगत)</option>
            <option value="11115">11115 (आकस्मिक लाभ कर (व्यक्तिगत))</option>
            <option value="11121">11121 (आय कर – सरकारी प्रतिष्ठानहरु)</option>
            <option value="11122">11122 (आय कर – पब्लिक लि.)</option>
            <option value="11123">11123 (आय कर – प्रा. लि.)</option>
            <option value="11124">11124 (आय कर – अन्य निकाय)</option>
            <option value="11125">11125 (पूँजीगत लाभ कर निकाय)</option>
            <option value="11126">11126 (आकस्मिक लाभ कर (निकाय))</option>
            <option value="11131">11131 (बहाल कर)</option>
            <option value="11132">11132 (व्याज कर)</option>
            <option value="11133">11133 (लाभांश कर)</option>
            <option value="11134">11134 (अन्य लगानीको आयकर)</option>
            <option value="11135">11135 (आकस्मिक लाभ कर)</option>
            <option value="11139">11139 (अन्य आयकर)</option>
            <option value="11211">11211 (पारिश्रमिकमा आधारित सामाजिक सुरक्षा कर)</option>
        </select>`;
        bapatCell.innerHTML = `<select name="bapat" class="form-field">
            <option value="">बापत छान्नुहोस</option>
            <option value="1">आय विवरण</option>
            <option value="2">अग्रिम कर कट्टी</option>
            <option value="3">अग्रिम आयकर</option>
            <option value="4">अनुमानित आयकर</option>
            <option value="5">संशोधित कर निर्धारण</option>
            <option value="6">व्याज</option>
            <option value="7">आयकर बक्यौता</option>
            <option value="8">शुल्क</option>
            <option value="9">जरिवाना</option>
            <option value="10">बहालकर</option>
            <option value="11">पूँजीगत लाभकर</option>
            <option value="12">सवारी साधन कर</option>
            <option value="13">धरोटी</option>
        </select>`;
        // Add TDS dropdown for Income Tax
        remarksCell.innerHTML = `<select name="tds" class="form-field" onchange="handleTDSChange(this)">
            <option value="">टि. डि. एस. छान्नुहोस्</option>
            <option value="yes">हो</option>
            <option value="no">होइन</option>
        </select>`;
    } else if (select.value === 'V') {
        // VAT - मुल्य अ. कर
        revenueCell.innerHTML = `<select name="revenueHead" class="form-field">
            <option value="">राजस्व शीर्षक छान्नुहोस</option>
            <option value="33311">33311 (मु.अ.कर – उत्पादन)</option>
            <option value="33313">33313 (मु.अ.कर – वस्तु बिक्री र वितरण)</option>
            <option value="33314">33314 (मु.अ.कर – परामर्श तथा ठेक्का)</option>
            <option value="33315">33315 (मु.अ.कर – पर्यटन सेवा)</option>
            <option value="33316">33316 (मु.अ.कर – सञ्चार, विमा, हवाई र अन्य सेवा)</option>
            <option value="33317">33317 (मु.अ.कर – बेदख्वाल (रिमर्स चार्ज))</option>
        </select>`;
        bapatCell.innerHTML = `<select name="bapat" class="form-field">
            <option value="">बापत छान्नुहोस</option>
            <option value="1">कर विवरण</option>
            <option value="2">भिला विवरण</option>
            <option value="3">कर निर्धारण</option>
            <option value="4">विशेष आदेश</option>
            <option value="5">बेदत्तावालको कर</option>
            <option value="6">बक्यौता</option>
            <option value="7">सेवा आयातको दफा ८ (३)</option>
            <option value="8">भवन निर्माण दफा ८ (३)</option>
            <option value="9">धरोटी</option>
        </select>`;
        remarksCell.innerHTML = '';
    } else if (select.value === 'O') {
        // Other Tax - अन्य शुल्क
        revenueCell.innerHTML = `<select name="revenueHead" class="form-field">
            <option value="">राजस्व शीर्षक छान्नुहोस</option>
            <option value="11119">11119 (आकस्मिक लाभ कर)</option>
            <option value="11412">11412 (विलासिता शुल्क)</option>
            <option value="11423">11423 (स्वास्थ्य जोखिम कर)</option>
            <option value="11442">11442 (स्वास्थ्य सेवा)</option>
            <option value="11443">11443 (शिक्षा सेवा शुल्क शैक्षिक संस्था)</option>
            <option value="11444">11444 (शिक्षा सेवा शुल्क वैदेशिक अध्ययन)</option>
            <option value="11445">11445 (विधुतिय सेवा कर)</option>
            <option value="14193">14193 (वैदेशिक पर्यटन शुल्क)</option>
            <option value="14194">14194 (वैदेशिक रोजगार सेवा शुल्क)</option>
            <option value="14214">14214 (दुर सञ्चार सेवा शुल्क)</option>
            <option value="14215">14215 (टेलिफोन स्वामित्व शुल्क)</option>
            <option value="14521">14521 (प्रदूषण शुल्क)</option>
        </select>`;
        bapatCell.innerHTML = `<select name="bapat" class="form-field">
            <option value="">बापत छान्नुहोस</option>
            <option value="1">वैदेशिक पर्यटन शुल्क</option>
            <option value="2">वैदेशिक रोजगार सेवा शुल्क</option>
            <option value="3">विवरण</option>
            <option value="4">शिक्षा सेवा शुल्क</option>
            <option value="5">स्वास्थ्य जोखिम कर</option>
            <option value="6">स्वास्थ्य सेवा कर</option>
            <option value="7">बेरुजू</option>
            <option value="8">धरोटी</option>
            <option value="9">इजाजत/नविकरण दस्तुर</option>
            <option value="10">स्टिकर दस्तुर</option>
            <option value="11">अन्य शुल्क विवरण</option>
            <option value="12">अन्य शुल्क निर्धारण</option>
            <option value="13">व्याज</option>
            <option value="14">जरिवाना</option>
            <option value="15">विलम्ब शुल्क</option>
            <option value="16">निरकासनको अन्य शुल्क</option>
            <option value="17">बक्यौता</option>
        </select>`;
        remarksCell.innerHTML = '';
    } else {
        revenueCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
        bapatCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
        remarksCell.innerHTML = '';
    }
}

// Handle TDS dropdown change
function handleTDSChange(select) {
    // Don't replace the dropdown - just keep it as is
    // The selected value will be used when generating the voucher
    // This allows users to change their selection anytime
}

// Calculate total amount
function calculateTotal() {
    const rows = document.querySelectorAll('#paymentRows tr:not(.total-row)');
    let total = 0;
    
    rows.forEach(row => {
        const amountInput = row.querySelector('input[name="amount"]');
        if (amountInput && amountInput.value) {
            total += parseFloat(amountInput.value) || 0;
        }
    });
    
    // Display total with proper formatting
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) {
        totalElement.textContent = total > 0 ? total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '०';
    }
}

// Add new row
function addRow() {
    const tbody = document.getElementById('paymentRows');
    const rows = tbody.querySelectorAll('tr:not(.total-row)');
    const newRowNumber = rows.length + 1;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="text-center">${newRowNumber}</td>
        <td>
            <select name="taxType" class="form-field" onchange="handleTaxTypeChange(this)">
                <option value="">करको प्रकार छान्नुहोस</option>
                <option value="V">मुल्य अ. कर</option>
                <option value="I">आय कर</option>
                <option value="O">अन्य शुल्क</option>
            </select>
        </td>
        <td>
            <label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>
        </td>
        <td>
            <label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>
        </td>
        <td>
            <input type="number" name="amount" placeholder="राजस्व रकम लेख्नुहोस" class="form-field text-right" oninput="calculateTotal()" onchange="calculateTotal()">
        </td>
        <td>
            <select name="fiscalYear" class="form-field year-select">
                <option value="">आर्थिक बर्ष छान्नुहोस</option>
                <option value="2082.083">2082/083</option>
                <option value="2081.082">2081/082</option>
                <option value="2080.081">2080/081</option>
            </select>
        </td>
        <td></td>
        <td class="text-center">
            <button class="btn-add" onclick="removeRow(this)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" fill="red"/>
                </svg>
            </button>
        </td>
    `;
    
    const totalRow = tbody.querySelector('.total-row');
    tbody.insertBefore(newRow, totalRow);
}

// Remove row
function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
    
    // Renumber rows
    const rows = document.querySelectorAll('#paymentRows tr:not(.total-row)');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    calculateTotal();
}

// Helper function to get current Nepali date
function getCurrentNepaliDate() {
    // Simple approximation - in production, use proper Nepali calendar conversion
    return '2082/08/15';
}

// Helper function to get tax type name
function getTaxTypeName(code) {
    const taxTypes = {
        'V': 'मुल्य अ. कर',
        'I': 'आय कर',
        'O': 'अन्य शुल्क'
    };
    return taxTypes[code] || '';
}

// Show payment confirmation modal
function showPaymentConfirmation() {
    const bankSelect = document.getElementById('bankSelect');
    
    if (!bankSelect.value) {
        alert('कृपया बैंक छान्नुहोस (Please select a bank)');
        return;
    }
    
    const rows = document.querySelectorAll('#paymentRows tr:not(.total-row)');
    let paymentData = [];
    let totalAmount = 0;
    
    rows.forEach((row, index) => {
        const taxType = row.querySelector('select[name="taxType"]');
        const revenueHead = row.querySelector('select[name="revenueHead"]');
        const bapat = row.querySelector('select[name="bapat"]');
        const amount = row.querySelector('input[name="amount"]');
        const fiscalYear = row.querySelector('select[name="fiscalYear"]');
        const remarks = row.cells[6].textContent.trim();
        
        if (taxType && taxType.value && amount && amount.value) {
            const revenueHeadText = revenueHead ? revenueHead.options[revenueHead.selectedIndex].text : '';
            const bapatText = bapat ? bapat.options[bapat.selectedIndex].text : '';
            const fiscalYearText = fiscalYear && fiscalYear.value ? fiscalYear.options[fiscalYear.selectedIndex].text : '';
            
            paymentData.push({
                sn: index + 1,
                taxType: getTaxTypeName(taxType.value),
                revenueHead: revenueHeadText,
                bapat: bapatText,
                amount: parseFloat(amount.value),
                fiscalYear: fiscalYearText,
                remarks: remarks || ''
            });
            
            totalAmount += parseFloat(amount.value) || 0;
        }
    });
    
    if (paymentData.length === 0) {
        alert('कृपया कम्तिमा एक राजस्व प्रविष्टि भर्नुहोस् (Please fill at least one revenue entry)');
        return;
    }
    
    // Populate modal with payment data
    const tbody = document.getElementById('confirmPaymentDetails');
    tbody.innerHTML = paymentData.map(item => `
        <tr>
            <td>${item.sn}</td>
            <td>${item.taxType}</td>
            <td>${item.revenueHead}</td>
            <td>${item.bapat}</td>
            <td style="text-align: right;">${item.amount}</td>
            <td>${item.fiscalYear}</td>
            <td>${item.remarks}</td>
        </tr>
    `).join('');
    
    // Set total amount
    document.getElementById('confirmTotalAmount').textContent = totalAmount;
    
    // Store data for later use
    window.pendingPaymentData = { paymentData, totalAmount };
    
    // Show modal
    document.getElementById('paymentConfirmModal').style.display = 'flex';
}

// Generate transaction code for Tab 1 (Make Payment)
function generateCode() {
    showPaymentConfirmation();
}

// Confirm payment and generate code
function confirmPayment() {
    const { paymentData, totalAmount } = window.pendingPaymentData;
    
    // Generate random code
    const year = '2082';
    const code = Math.floor(1000000 + Math.random() * 9000000);
    const transactionCode = `${year}-${code}`;
    
    // Save to pending vouchers
    const newVoucher = {
        sn: pendingVouchersData.length + 1,
        code: transactionCode,
        date: getCurrentNepaliDate(),
        amount: totalAmount,
        status: 'Pending',
        fiscalYear: '2082.083'
    };
    
    pendingVouchersData.push(newVoucher);
    
    // Save to localStorage
    localStorage.setItem('pendingVouchersData', JSON.stringify(pendingVouchersData));
    
    // Refresh the pending vouchers table
    loadPendingVouchers();
    
    // Hide confirmation modal
    document.getElementById('paymentConfirmModal').style.display = 'none';
    
    // Show success modal with the same data
    const successTbody = document.getElementById('successPaymentDetails');
    successTbody.innerHTML = paymentData.map(item => `
        <tr>
            <td>${item.sn}</td>
            <td>${item.taxType}</td>
            <td>${item.revenueHead}</td>
            <td>${item.bapat}</td>
            <td style="text-align: right;">${item.amount}</td>
            <td>${item.fiscalYear}</td>
            <td>${item.remarks}</td>
        </tr>
    `).join('');
    
    // Set transaction code and total amount in success modal
    document.getElementById('generatedTransactionCode').textContent = transactionCode;
    document.getElementById('successTotalAmount').textContent = totalAmount;
    
    // Store transaction code for later use
    window.generatedTransactionCode = transactionCode;
    
    // Show success modal
    document.getElementById('paymentSuccessModal').style.display = 'flex';
}

// Handle Make Payment button click
function handleMakePayment() {
    const { paymentData, totalAmount } = window.pendingPaymentData;
    
    // Get bank name
    const bankSelect = document.getElementById('bankSelect');
    const exciseBankSelect = document.getElementById('exciseBankSelect');
    let bankName = '';
    
    if (bankSelect && bankSelect.value) {
        bankName = bankSelect.options[bankSelect.selectedIndex].text;
    } else if (exciseBankSelect && exciseBankSelect.value) {
        bankName = exciseBankSelect.options[exciseBankSelect.selectedIndex].text;
    }
    
    // Get transaction code from success modal
    const transactionCode = document.getElementById('generatedTransactionCode').textContent;
    
    // Prepare voucher data
    const voucherData = {
        transactionCode: transactionCode,
        date: getCurrentNepaliDate(),
        pan: document.getElementById('panNumber') ? document.getElementById('panNumber').textContent : '610015263',
        bankName: bankName,
        paymentData: paymentData,
        totalAmount: totalAmount
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('voucherData', JSON.stringify(voucherData));
    
    // Open voucher in new window
    window.open('payment_voucher_print.html', '_blank', 'width=1000,height=800');
    
    // Close success modal
    document.getElementById('paymentSuccessModal').style.display = 'none';
    
    // Switch to Tab 2 (View Payment Status)
    switchTab(1);
    
    // Clear pending payment data
    window.pendingPaymentData = null;
    window.generatedTransactionCode = null;
}

// Cancel success modal
function cancelSuccess() {
    document.getElementById('paymentSuccessModal').style.display = 'none';
    window.pendingPaymentData = null;
    window.generatedTransactionCode = null;
}

// Cancel payment confirmation
function cancelPayment() {
    document.getElementById('paymentConfirmModal').style.display = 'none';
    window.pendingPaymentData = null;
}

// ========== TAB 2: VIEW PAYMENT STATUS FUNCTIONS ==========

// Initialize data from localStorage or empty arrays
function initializePaymentData() {
    const storedPending = localStorage.getItem('pendingVouchersData');
    const storedPaid = localStorage.getItem('paidVouchersData');
    
    if (storedPending) {
        try {
            pendingVouchersData = JSON.parse(storedPending);
        } catch (e) {
            pendingVouchersData = [];
        }
    } else {
        pendingVouchersData = [];
    }
    
    if (storedPaid) {
        try {
            paidVouchersData = JSON.parse(storedPaid);
        } catch (e) {
            paidVouchersData = [];
        }
    } else {
        paidVouchersData = [];
    }
}

// Data storage arrays
let pendingVouchersData = [];
let paidVouchersData = [];

// Initialize data on page load
initializePaymentData();

// Load pending vouchers with optional filtering
function loadPendingVouchers(filterYear = '') {
    const tbody = document.getElementById('pendingVouchers');
    
    // Filter data if year is provided
    let filteredData = pendingVouchersData;
    if (filterYear) {
        filteredData = pendingVouchersData.filter(item => item.fiscalYear === filterYear);
    }
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #666;">कुनै पनि विवरण भेटिएन</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => `
        <tr>
            <td>${item.sn}</td>
            <td>${item.code}</td>
            <td>${item.date}</td>
            <td style="text-align: right;">${item.amount.toLocaleString('en-IN')}</td>
            <td style="text-align: center;">
                <button class="btn-icon" onclick="viewVoucherDetails('${item.code}')" title="View Details">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="green"/>
                    </svg>
                </button>
            </td>
            <td style="text-align: center;">
                <button class="btn-icon" onclick="printVoucher('${item.code}')" title="Print">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="brown"/>
                    </svg>
                </button>
            </td>
            <td style="color: ${item.status === 'Pending' ? '#ff9800' : '#2196F3'}; font-weight: bold;">${item.status}</td>
            <td style="text-align: center;">
                <button class="btn-primary" onclick="makePaymentFromStatus('${item.code}')">Make payment</button>
            </td>
        </tr>
    `).join('');
}

// Load paid vouchers with optional filtering
function loadPaidVouchers(filterYear = '') {
    const tbody = document.getElementById('paidVouchers');
    
    // Filter data if year is provided
    let filteredData = paidVouchersData;
    if (filterYear) {
        // Match the format in paidVouchersData (e.g., "2082/083")
        const yearFormat = filterYear.replace('.', '/');
        filteredData = paidVouchersData.filter(item => item.fiscalYear === yearFormat);
    }
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px; color: #666;">कुनै पनि विवरण भेटिएन</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredData.map(item => `
        <tr>
            <td>${item.sn}</td>
            <td>${item.office}</td>
            <td>${item.requestCode}</td>
            <td>${item.voucherNo}</td>
            <td>${item.voucherDate}</td>
            <td>${item.fiscalYear}</td>
            <td>${item.accountCode}</td>
            <td>${item.accountDesc}</td>
            <td style="text-align: right;">${item.amount.toLocaleString('en-IN')}</td>
            <td style="text-align: center;">
                <button class="btn-icon" onclick="printPaidVoucher('${item.voucherNo}')" title="Print">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" fill="brown"/>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// View voucher details
function viewVoucherDetails(code) {
    const voucher = pendingVouchersData.find(v => v.code === code);
    if (!voucher) {
        alert('Voucher not found!');
        return;
    }
    
    const details = `
        ═══════════════════════════════════════
        VOUCHER DETAILS
        ═══════════════════════════════════════
        
        Request Code: ${voucher.code}
        Request Date: ${voucher.date}
        Amount: Rs. ${voucher.amount.toLocaleString('en-IN')}
        Status: ${voucher.status}
        Fiscal Year: ${voucher.fiscalYear.replace('.', '/')}
        
        ═══════════════════════════════════════
    `;
    
    alert(details);
}

// Print voucher (pending)
function printVoucher(code) {
    const voucher = pendingVouchersData.find(v => v.code === code);
    if (!voucher) {
        alert('Voucher not found!');
        return;
    }
    
    // Prepare voucher data for printing
    const voucherData = {
        transactionCode: voucher.code,
        date: voucher.date,
        pan: document.getElementById('panNumber') ? document.getElementById('panNumber').textContent : '610015263',
        bankName: 'Nepal Bank Limited', // Default bank name
        paymentData: [
            {
                sn: 1,
                taxType: 'मुल्य अ. कर',
                revenueHead: '33311 (मु.अ.कर – उत्पादन)',
                bapat: 'कर विवरण',
                amount: voucher.amount,
                fiscalYear: voucher.fiscalYear ? voucher.fiscalYear.replace('.', '/') : '2082/083',
                remarks: ''
            }
        ],
        totalAmount: voucher.amount
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('voucherData', JSON.stringify(voucherData));
    
    // Open voucher in new window
    window.open('payment_voucher_print.html', '_blank', 'width=1000,height=800');
}

// Print paid voucher
function printPaidVoucher(voucherNo) {
    const voucher = paidVouchersData.find(v => v.voucherNo === voucherNo);
    if (!voucher) {
        alert('Voucher not found!');
        return;
    }
    
    // Prepare voucher data for printing
    const voucherData = {
        transactionCode: voucher.requestCode,
        date: voucher.voucherDate,
        pan: document.getElementById('panNumber') ? document.getElementById('panNumber').textContent : '610015263',
        bankName: 'Nepal Bank Limited', // Default bank name
        paymentData: [
            {
                sn: 1,
                taxType: voucher.accountDesc || 'मुल्य अ. कर',
                revenueHead: voucher.accountCode + ' (' + voucher.accountDesc + ')',
                bapat: 'भुक्तानी भएको',
                amount: voucher.amount,
                fiscalYear: voucher.fiscalYear,
                remarks: 'Voucher No: ' + voucher.voucherNo
            }
        ],
        totalAmount: voucher.amount,
        voucherNumber: voucher.voucherNo
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('voucherData', JSON.stringify(voucherData));
    
    // Open voucher in new window
    window.open('payment_voucher_print.html', '_blank', 'width=1000,height=800');
}

// Make payment from status view
function makePaymentFromStatus(code) {
    const voucher = pendingVouchersData.find(v => v.code === code);
    if (!voucher) {
        alert('Voucher not found!');
        return;
    }
    
    const confirmPayment = confirm(`Make payment for voucher ${code}?\n\nAmount: Rs. ${voucher.amount.toLocaleString('en-IN')}\n\nThis will redirect you to the payment gateway.`);
    
    if (confirmPayment) {
        alert(`Processing payment for ${code}...\n\nRedirecting to bank payment gateway...`);
        // In production, this would redirect to actual payment gateway
    }
}

// Filter vouchers by fiscal year
function filterVouchersByYear() {
    const filterYear = document.getElementById('filterYear').value;
    loadPendingVouchers(filterYear);
    loadPaidVouchers(filterYear);
}

// ========== TAB 3: EXCISE PAYMENT FUNCTIONS ==========

// Handle Excise tax type change in Tab 3
function handleExciseTaxTypeChange(select) {
    const row = select.closest('tr');
    const revenueCell = row.cells[2];
    const bapatCell = row.cells[3];
    
    if (select.value === 'E') {
        // Excise - अन्त शुल्क
        revenueCell.innerHTML = `<select name="revenueHead" class="form-field">
            <option value="">राजस्व शीर्षक छान्नुहोस</option>
            <option value="33331">33331 (अन्टःशुल्क – सुर्तीजन्य पदार्थ)</option>
            <option value="33332">33332 (अन्टःशुल्क – मदिरा)</option>
            <option value="33333">33333 (अन्टःशुल्क – बियर)</option>
            <option value="33334">33334 (अन्टःशुल्क – अन्य औद्योगिक उत्पादन)</option>
        </select>`;
        
        bapatCell.innerHTML = `<select name="bapat" class="form-field">
            <option value="">बापत छान्नुहोस</option>
            <option value="1">इजाजत/नविकरण दस्तुर</option>
            <option value="2">स्टिकर दस्तुर</option>
            <option value="3">अन्टःशुल्क विवरण</option>
            <option value="4">अन्टःशुल्क निर्धारण</option>
            <option value="5">व्याज</option>
            <option value="6">जरिवाना</option>
            <option value="7">विलम्ब शुल्क</option>
            <option value="8">बक्यौता</option>
            <option value="9">निरकासनको अन्टःशुल्क</option>
            <option value="10">धरोटी</option>
        </select>`;
    } else {
        revenueCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
        bapatCell.innerHTML = '<label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>';
    }
}

// Calculate total for Tab 3 Excise
function calculateExciseTotal() {
    const rows = document.querySelectorAll('#tab2 tbody tr:not(.total-row)');
    let total = 0;
    
    rows.forEach(row => {
        const amountInput = row.querySelector('input[name="amount"]');
        if (amountInput && amountInput.value) {
            total += parseFloat(amountInput.value) || 0;
        }
    });
    
    // Display total with proper formatting
    const totalElement = document.querySelector('#tab2 .total-amount');
    if (totalElement) {
        totalElement.textContent = total > 0 ? total.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : '०';
    }
}

// Add event listeners to Tab 3 on page load
document.addEventListener('DOMContentLoaded', function() {
    // Tab 3 - Excise Payment
    const tab3 = document.getElementById('tab2');
    if (tab3) {
        // Add change listener to branch dropdown
        const branchSelect = document.getElementById('branchSelect');
        const exciseBankContainer = document.getElementById('exciseBankSelectionContainer');
        
        if (branchSelect && exciseBankContainer) {
            branchSelect.addEventListener('change', function() {
                if (this.value) {
                    exciseBankContainer.style.display = 'inline';
                } else {
                    exciseBankContainer.style.display = 'none';
                }
            });
        }
        
        // Add change listener to tax type dropdown
        const taxTypeSelect = tab3.querySelector('select[name="taxType"]');
        if (taxTypeSelect) {
            taxTypeSelect.addEventListener('change', function() {
                handleExciseTaxTypeChange(this);
            });
        }
        
        // Add input listener to amount field
        const amountInput = tab3.querySelector('input[name="amount"]');
        if (amountInput) {
            amountInput.addEventListener('input', calculateExciseTotal);
            amountInput.addEventListener('change', calculateExciseTotal);
        }
        
        // Add click listener to Add button
        const addButton = tab3.querySelector('.btn-add');
        if (addButton) {
            addButton.addEventListener('click', addExciseRow);
        }
        
        // Add click listener to Generate Transaction Code button
        const generateButton = tab3.querySelector('.btn-generate');
        if (generateButton) {
            generateButton.addEventListener('click', generateExciseCode);
        }
    }
});

// Add new row for Excise (Tab 3)
function addExciseRow() {
    const tab3 = document.getElementById('tab2');
    const tbody = tab3.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr:not(.total-row)');
    const newRowNumber = rows.length + 1;
    
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="text-center">${newRowNumber}</td>
        <td>
            <select name="taxType" class="form-field" onchange="handleExciseTaxTypeChange(this)">
                <option value="">करको प्रकार छान्नुहोस</option>
                <option value="E">अन्त शुल्क</option>
            </select>
        </td>
        <td>
            <label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>
        </td>
        <td>
            <label class="helper-text">पहिले करको प्रकार छान्नुहोस</label>
        </td>
        <td>
            <input type="number" name="amount" placeholder="राजस्व रकम लेख्नुहोस" class="form-field text-right" oninput="calculateExciseTotal()" onchange="calculateExciseTotal()">
        </td>
        <td>
            <select name="fiscalYear" class="form-field year-select">
                <option value="">आर्थिक बर्ष छान्नुहोस</option>
                <option value="2082.083">2082/083</option>
                <option value="2081.082">2081/082</option>
                <option value="2080.081">2080/081</option>
                <option value="2079.080">2079/080</option>
                <option value="2078.079">2078/079</option>
                <option value="2077.078">2077/078</option>
                <option value="2076.077">2076/077</option>
                <option value="2075.076">2075/076</option>
                <option value="2074.075">2074/075</option>
                <option value="2073.074">2073/074</option>
                <option value="2072.073">2072/073</option>
                <option value="2071.072">2071/072</option>
                <option value="2070.071">2070/071</option>
                <option value="2069.070">2069/070</option>
                <option value="2068.069">2068/069</option>
                <option value="2067.068">2067/068</option>
                <option value="2066.067">2066/067</option>
                <option value="2065.066">2065/066</option>
                <option value="2064.065">2064/065</option>
                <option value="2063.064">2063/064</option>
                <option value="2062.063">2062/063</option>
                <option value="2061.062">2061/062</option>
                <option value="2060.061">2060/061</option>
                <option value="2059.060">2059/060</option>
                <option value="2058.059">2058/059</option>
            </select>
        </td>
        <td></td>
        <td class="text-center">
            <button class="btn-add" onclick="removeExciseRow(this)">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" fill="red"/>
                </svg>
            </button>
        </td>
    `;
    
    const totalRow = tbody.querySelector('.total-row');
    tbody.insertBefore(newRow, totalRow);
}

// Remove row from Excise (Tab 3)
function removeExciseRow(button) {
    const row = button.closest('tr');
    const tbody = row.closest('tbody');
    row.remove();
    
    // Renumber rows
    const rows = tbody.querySelectorAll('tr:not(.total-row)');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    calculateExciseTotal();
}

// Show excise payment confirmation modal
function showExcisePaymentConfirmation() {
    const branchSelect = document.getElementById('branchSelect');
    const exciseBankSelect = document.getElementById('exciseBankSelect');
    
    if (!branchSelect.value) {
        alert('कृपया शाखा छान्नुहोस (Please select a branch)');
        return;
    }
    
    if (!exciseBankSelect.value) {
        alert('कृपया बैंक छान्नुहोस (Please select a bank)');
        return;
    }
    
    const tab3 = document.getElementById('tab2');
    const rows = tab3.querySelectorAll('tbody tr:not(.total-row)');
    let paymentData = [];
    let totalAmount = 0;
    
    rows.forEach((row, index) => {
        const taxType = row.querySelector('select[name="taxType"]');
        const revenueHead = row.querySelector('select[name="revenueHead"]');
        const bapat = row.querySelector('select[name="bapat"]');
        const amount = row.querySelector('input[name="amount"]');
        const fiscalYear = row.querySelector('select[name="fiscalYear"]');
        const remarks = row.cells[6].textContent.trim();
        
        if (taxType && taxType.value && amount && amount.value) {
            const revenueHeadText = revenueHead ? revenueHead.options[revenueHead.selectedIndex].text : '';
            const bapatText = bapat ? bapat.options[bapat.selectedIndex].text : '';
            const fiscalYearText = fiscalYear && fiscalYear.value ? fiscalYear.options[fiscalYear.selectedIndex].text : '';
            
            paymentData.push({
                sn: index + 1,
                taxType: 'अन्त शुल्क',
                revenueHead: revenueHeadText,
                bapat: bapatText,
                amount: parseFloat(amount.value),
                fiscalYear: fiscalYearText,
                remarks: remarks || ''
            });
            
            totalAmount += parseFloat(amount.value) || 0;
        }
    });
    
    if (paymentData.length === 0) {
        alert('कृपया कम्तिमा एक राजस्व प्रविष्टि भर्नुहोस् (Please fill at least one revenue entry)');
        return;
    }
    
    // Populate modal with payment data
    const tbody = document.getElementById('confirmPaymentDetails');
    tbody.innerHTML = paymentData.map(item => `
        <tr>
            <td>${item.sn}</td>
            <td>${item.taxType}</td>
            <td>${item.revenueHead}</td>
            <td>${item.bapat}</td>
            <td style="text-align: right;">${item.amount}</td>
            <td>${item.fiscalYear}</td>
            <td>${item.remarks}</td>
        </tr>
    `).join('');
    
    // Set total amount
    document.getElementById('confirmTotalAmount').textContent = totalAmount;
    
    // Store data for later use
    window.pendingPaymentData = { paymentData, totalAmount };
    
    // Show modal
    document.getElementById('paymentConfirmModal').style.display = 'flex';
}

// Generate transaction code for Excise (Tab 3)
function generateExciseCode() {
    showExcisePaymentConfirmation();
}

