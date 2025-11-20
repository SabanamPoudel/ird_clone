// Voucher Entry JavaScript
let vouchers = [];
let editingVoucherId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadHeaderInfo();
    loadVouchers();
    initializeEventListeners();
    
    // Listen for messages from parent to reload TDS types
    window.addEventListener('message', function(event) {
        if (event.data.action === 'reloadTDSTypes') {
            loadTDSTypesFromTransactions();
        }
    });
});

// Load header information from sessionStorage
function loadHeaderInfo() {
    const submissionNo = sessionStorage.getItem('submissionNo') || '820075440572';
    const pan = sessionStorage.getItem('pan') || '610015263';
    const name = sessionStorage.getItem('withholder_name') || 'खाता विजनेश एकेडेमी प्रा.लि.';
    const dateFrom = sessionStorage.getItem('dateFrom') || '2082.07.01';
    const dateTo = sessionStorage.getItem('dateTo') || '2082.08.02';
    const dateType = sessionStorage.getItem('dateType') || 'BS';

    document.getElementById('dpfVITDSTran').textContent = submissionNo;
    document.getElementById('dpfVITDSWithPan').textContent = pan;
    document.getElementById('dpfVITDSWithName').textContent = name;
    document.getElementById('dpfVITDSFrom').textContent = dateFrom;
    document.getElementById('dpfVITDSTo').textContent = dateTo;
    document.getElementById('dpfVITDSType').textContent = dateType;
    
    // Load TDS types from transactions
    loadTDSTypesFromTransactions();
}

// Load TDS types that were used in transactions
function loadTDSTypesFromTransactions() {
    const accountHeadSelect = document.getElementById('cboVITDSAcc');
    const transactions = JSON.parse(localStorage.getItem('tds_transactions') || '[]');
    
    // Get unique TDS types from transactions
    const usedTDSTypes = [...new Set(transactions.map(t => t.tdsType))].filter(type => type);
    
    // Clear existing options except first one
    accountHeadSelect.innerHTML = '<option value="">----Select----</option>';
    
    // Add only the TDS types that were used in transactions
    usedTDSTypes.forEach(tdsType => {
        const option = document.createElement('option');
        option.value = tdsType;
        option.textContent = tdsType;
        accountHeadSelect.appendChild(option);
    });
}

// Load vouchers from localStorage
function initializeEventListeners() {
    // Add button
    document.getElementById('btnVITDSAdd').addEventListener('click', addVoucher);
    
    // Reset button
    document.getElementById('btnVITDSReset').addEventListener('click', resetForm);
    
    // Date type checkboxes
    document.getElementById('chkVITDSBS').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('chkVITDSAD').checked = false;
        }
    });
    
    document.getElementById('chkVITDSAD').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('chkVITDSBS').checked = false;
        }
    });
    
    // Payment mode change - show/hide bank/IRO dropdown
    document.getElementById('cboVITDSPayMode').addEventListener('change', function() {
        const payMode = this.value;
        const cashCodeContainer = document.getElementById('cboVITDSCashCodeContainer');
        const bankCodeContainer = document.getElementById('cboVITDSBankCodeContainer');
        const cashCodeLabel = document.getElementById('lblVITDSCashCode');
        const bankCodeLabel = document.getElementById('lblVITDSBankCode');
        
        if (payMode === 'Cash') {
            cashCodeContainer.style.display = 'block';
            bankCodeContainer.style.display = 'none';
            cashCodeLabel.style.display = 'block';
            bankCodeLabel.style.display = 'none';
        } else {
            cashCodeContainer.style.display = 'none';
            bankCodeContainer.style.display = 'block';
            cashCodeLabel.style.display = 'none';
            bankCodeLabel.style.display = 'block';
        }
    });
}

// Add voucher
function addVoucher() {
    const accHead = document.getElementById('cboVITDSAcc').value;
    const vouchNo = document.getElementById('txtVITDSVouchNo').value.trim();
    const payMode = document.getElementById('cboVITDSPayMode').value;
    const payDate = document.getElementById('txtVITDSPayDate').value.trim();
    const cashCode = document.getElementById('cboVITDSCashCode').value;
    const bankCode = document.getElementById('cboVITDSBankCode').value;
    const amount = document.getElementById('txtVITDSAmt').value.trim();
    
    // Get date type
    const dateType = document.getElementById('chkVITDSBS').checked ? 'BS' : 'AD';
    
    // Validation
    if (!accHead) {
        alert('कृपया शिर्षक चयन गर्नुहोस्');
        return;
    }
    
    if (!vouchNo) {
        alert('कृपया भौचर नं. भर्नुहोस्');
        return;
    }
    
    if (!payMode) {
        alert('कृपया तिरेको प्रकार चयन गर्नुहोस्');
        return;
    }
    
    if (!payDate) {
        alert('कृपया दाखिला मिति भर्नुहोस्');
        return;
    }
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert('कृपया मान्य टि.डि.एस रकम भर्नुहोस्');
        return;
    }
    
    // Get bank/IRO based on payment mode
    let bankOrIro = '';
    if (payMode === 'Cash') {
        bankOrIro = cashCode || '';
    } else {
        bankOrIro = bankCode || '';
    }
    
    // Check if voucher is reconciled
    const reconcileStatus = checkVoucherReconciliation(vouchNo, payDate);
    
    const voucher = {
        id: editingVoucherId || Date.now(),
        accHead: accHead,
        vouchNo: vouchNo,
        payMode: payMode,
        payDate: payDate + ' ' + dateType,
        bankOrIro: bankOrIro,
        amount: parseFloat(amount),
        reconciled: reconcileStatus
    };
    
    if (editingVoucherId) {
        // Update existing voucher
        const index = vouchers.findIndex(v => v.id === editingVoucherId);
        if (index !== -1) {
            vouchers[index] = voucher;
        }
        editingVoucherId = null;
    } else {
        // Add new voucher
        vouchers.push(voucher);
    }
    
    saveVouchers();
    renderVouchers();
    resetForm();
    updateSummary();
}

// Reset form
function resetForm() {
    document.getElementById('cboVITDSAcc').value = '';
    document.getElementById('txtVITDSVouchNo').value = '';
    document.getElementById('cboVITDSPayMode').value = '';
    document.getElementById('txtVITDSPayDate').value = '';
    document.getElementById('cboVITDSCashCode').value = '';
    document.getElementById('cboVITDSBankCode').value = '';
    document.getElementById('txtVITDSAmt').value = '';
    document.getElementById('chkVITDSBS').checked = true;
    document.getElementById('chkVITDSAD').checked = false;
    editingVoucherId = null;
    
    // Reset bank/IRO visibility
    document.getElementById('cboVITDSCashCodeContainer').style.display = 'none';
    document.getElementById('cboVITDSBankCodeContainer').style.display = 'block';
    document.getElementById('lblVITDSCashCode').style.display = 'none';
    document.getElementById('lblVITDSBankCode').style.display = 'block';
}

// Render vouchers
function renderVouchers() {
    const tbody = document.getElementById('voucherTableBody');
    
    if (vouchers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="empty-state">कुनै भौचर छैन</td></tr>';
        return;
    }
    
    tbody.innerHTML = vouchers.map((voucher, index) => {
        // Determine icon and text based on reconciliation status
        const reconcileDisplay = voucher.reconciled === 'Reconciled' 
            ? 'Reconciled <img src="../../resources/ok.png" alt="✓" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 5px;">'
            : 'Not Reconciled <img src="../../resources/cancel.png" alt="✗" style="width: 16px; height: 16px; vertical-align: middle; margin-left: 5px;">';
        
        return `
            <tr>
                <td style="text-align: right;">${index + 1}</td>
                <td>${voucher.accHead}</td>
                <td>${voucher.vouchNo}</td>
                <td>${voucher.payMode}</td>
                <td>${voucher.payDate}</td>
                <td>${voucher.bankOrIro}</td>
                <td style="text-align: right;">${voucher.amount.toFixed(2)}</td>
                <td style="text-align: center;">${reconcileDisplay}</td>
                <td style="text-align: center;">
                    <button class="action-btn" onclick="editVoucher(${voucher.id})" title="Edit">
                        <span class="edit-icon"></span>
                    </button>
                </td>
                <td style="text-align: center;">
                    <button class="action-btn" onclick="deleteVoucher(${voucher.id})" title="Delete">
                        <span class="delete-icon"></span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit voucher
function editVoucher(id) {
    const voucher = vouchers.find(v => v.id === id);
    if (!voucher) return;
    
    editingVoucherId = id;
    
    document.getElementById('cboVITDSAcc').value = voucher.accHead;
    document.getElementById('txtVITDSVouchNo').value = voucher.vouchNo;
    document.getElementById('cboVITDSPayMode').value = voucher.payMode;
    
    // Extract date and type
    const dateParts = voucher.payDate.split(' ');
    document.getElementById('txtVITDSPayDate').value = dateParts[0];
    
    if (dateParts[1] === 'BS') {
        document.getElementById('chkVITDSBS').checked = true;
        document.getElementById('chkVITDSAD').checked = false;
    } else {
        document.getElementById('chkVITDSBS').checked = false;
        document.getElementById('chkVITDSAD').checked = true;
    }
    
    // Set bank or IRO based on payment mode
    if (voucher.payMode === 'Cash') {
        document.getElementById('cboVITDSCashCode').value = voucher.bankOrIro;
        document.getElementById('cboVITDSCashCodeContainer').style.display = 'block';
        document.getElementById('cboVITDSBankCodeContainer').style.display = 'none';
        document.getElementById('lblVITDSCashCode').style.display = 'block';
        document.getElementById('lblVITDSBankCode').style.display = 'none';
    } else {
        document.getElementById('cboVITDSBankCode').value = voucher.bankOrIro;
    }
    
    document.getElementById('txtVITDSAmt').value = voucher.amount;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete voucher
function deleteVoucher(id) {
    if (!confirm('के तपाइँ यो भौचर मेटाउन चाहनुहुन्छ?')) {
        return;
    }
    
    vouchers = vouchers.filter(v => v.id !== id);
    saveVouchers();
    renderVouchers();
    updateSummary();
}

// Update summary
function updateSummary() {
    const totalAmount = vouchers.reduce((sum, v) => sum + v.amount, 0);
    document.getElementById('dpTDSVouchAmt').textContent = totalAmount.toFixed(2);
}

// Check if voucher is reconciled with payment vouchers
function checkVoucherReconciliation(voucherNo, paymentDate) {
    // Get payment vouchers from localStorage
    const paymentVouchers = JSON.parse(localStorage.getItem('payment_vouchers') || '[]');
    
    // Check if voucher number and date match
    const matchedVoucher = paymentVouchers.find(pv => 
        pv.voucherNumber === voucherNo && pv.paymentDate === paymentDate
    );
    
    return matchedVoucher ? 'Reconciled' : 'Not Reconciled';
}

// Save vouchers to localStorage
function saveVouchers() {
    const submissionNo = sessionStorage.getItem('submissionNo') || '820075440572';
    localStorage.setItem(`vouchers_${submissionNo}`, JSON.stringify(vouchers));
}

// Load vouchers from localStorage
function loadVouchers() {
    const submissionNo = sessionStorage.getItem('submissionNo') || '820075440572';
    const saved = localStorage.getItem(`vouchers_${submissionNo}`);
    
    if (saved) {
        vouchers = JSON.parse(saved);
        renderVouchers();
        updateSummary();
    }
}
