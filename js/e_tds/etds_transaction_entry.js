// E-TDS Transaction Entry Page JavaScript

let transactions = [];
let transactionCounter = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Get registration data from sessionStorage
    const registrationData = JSON.parse(sessionStorage.getItem('etds_registration_success') || '{}');

    if (registrationData && registrationData.submissionNumber) {
        // Populate header information
        document.getElementById('displaySubmissionNo').textContent = registrationData.submissionNumber || '';
        document.getElementById('displayWithholderPan').textContent = registrationData.username || '';
        document.getElementById('displayWithholderName').textContent = registrationData.withholderName || '';
        document.getElementById('displayDateFrom').textContent = registrationData.dateFrom || '';
        document.getElementById('displayDateTo').textContent = registrationData.dateTo || '';
        document.getElementById('displayDateType').textContent = registrationData.dateType || '';
    }

    // Tab functionality
    initializeTabs();

    // Initialize event listeners
    initializeEventListeners();
    
    // Load transactions from localStorage if any
    loadTransactions();
});

function initializeEventListeners() {
    // Date type checkboxes
    const bsCheckbox = document.getElementById('chkBS');
    const adCheckbox = document.getElementById('chkAD');

    if (bsCheckbox && adCheckbox) {
        bsCheckbox.addEventListener('change', function() {
            if (!this.checked && !adCheckbox.checked) {
                adCheckbox.checked = true;
            }
        });

        adCheckbox.addEventListener('change', function() {
            if (!this.checked && !bsCheckbox.checked) {
                bsCheckbox.checked = true;
            }
        });
    }

    // Add button
    document.getElementById('btnAdd').addEventListener('click', addTransaction);

    // Reset button
    document.getElementById('btnReset').addEventListener('click', resetForm);

    // Delete All button
    document.getElementById('btnDeleteAll').addEventListener('click', deleteAllTransactions);

    // Save button
    document.getElementById('btnSave').addEventListener('click', saveTransactions);

    // Submit button
    document.getElementById('btnSubmit').addEventListener('click', submitTransactions);

    // Search button
    document.getElementById('btnSearch').addEventListener('click', searchTransaction);

    // Download Sample button
    document.getElementById('btnDownloadSample').addEventListener('click', downloadSample);

    // Refresh button
    document.getElementById('btnRefresh').addEventListener('click', refreshTransactions);

    // Previous and Next buttons
    document.getElementById('btnPrevious').addEventListener('click', function() {
        alert('पछिल्लो पृष्ठ फिचर आउँदै छ।');
    });

    document.getElementById('btnNext').addEventListener('click', function() {
        alert('अर्को पृष्ठ फिचर आउँदै छ।');
    });
}

function addTransaction() {
    const pan = document.getElementById('txtPan').value.trim();
    const name = document.getElementById('txtName').value.trim();
    const payDate = document.getElementById('txtPayDate').value.trim();
    const payAmount = document.getElementById('txtPayAmount').value.trim();
    const tdsAmount = document.getElementById('txtTDSAmount').value.trim();
    const tdsType = document.getElementById('selTDSType').value;

    // Validation
    if (!pan) {
        alert('स्थायी लेखा नं./पान नं. आवश्यक छ।');
        return;
    }

    if (!name) {
        alert('नाम आवश्यक छ।');
        return;
    }

    if (!payDate) {
        alert('भुक्तानी मिति आवश्यक छ।');
        return;
    }

    if (!payAmount) {
        alert('भुक्तानी रकम आवश्यक छ।');
        return;
    }

    if (!tdsAmount) {
        alert('टि.डि.एस रकम आवश्यक छ।');
        return;
    }

    if (!tdsType) {
        alert('टि.डि.एस किसिम छान्नुहोस्।');
        return;
    }

    // Add transaction
    transactionCounter++;
    const transaction = {
        id: transactionCounter,
        sn: transactionCounter,
        pan: pan,
        name: name,
        payDate: payDate,
        payAmount: parseFloat(payAmount),
        tdsAmount: parseFloat(tdsAmount),
        tdsType: tdsType
    };

    transactions.push(transaction);
    renderTransactions();
    updateSummary();
    resetForm();
    
    alert('ट्रान्स्याकशन सफलतापूर्वक थपियो।');
}

function renderTransactions() {
    const tbody = document.getElementById('transactionTableBody');
    tbody.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.sn}</td>
            <td>${transaction.pan}</td>
            <td>${transaction.name}</td>
            <td>${transaction.payDate}</td>
            <td>${transaction.payAmount.toFixed(2)}</td>
            <td>${transaction.tdsAmount.toFixed(2)}</td>
            <td>${transaction.tdsType}</td>
            <td><button class="btn-edit" onclick="editTransaction(${index})">✏️</button></td>
            <td><button class="btn-delete" onclick="deleteTransaction(${index})">🗑️</button></td>
        `;
        tbody.appendChild(row);
    });
}

function editTransaction(index) {
    const transaction = transactions[index];
    
    document.getElementById('txtPan').value = transaction.pan;
    document.getElementById('txtName').value = transaction.name;
    document.getElementById('txtPayDate').value = transaction.payDate;
    document.getElementById('txtPayAmount').value = transaction.payAmount;
    document.getElementById('txtTDSAmount').value = transaction.tdsAmount;
    document.getElementById('selTDSType').value = transaction.tdsType;

    // Remove the transaction temporarily (will be re-added on save)
    transactions.splice(index, 1);
    renderTransactions();
    updateSummary();
}

function deleteTransaction(index) {
    if (confirm('के तपाईं यो ट्रान्स्याकशन मेटाउन चाहनुहुन्छ?')) {
        transactions.splice(index, 1);
        renderTransactions();
        updateSummary();
        alert('ट्रान्स्याकशन मेटाइयो।');
    }
}

function deleteAllTransactions() {
    if (confirm('के तपाईं सबै ट्रान्स्याकशनहरू मेटाउन चाहनुहुन्छ?')) {
        transactions = [];
        transactionCounter = 0;
        renderTransactions();
        updateSummary();
        alert('सबै ट्रान्स्याकशनहरू मेटाइए।');
    }
}

function resetForm() {
    document.getElementById('txtPan').value = '';
    document.getElementById('txtName').value = '';
    document.getElementById('txtPayDate').value = '';
    document.getElementById('txtPayAmount').value = '';
    document.getElementById('txtTDSAmount').value = '';
    document.getElementById('selTDSType').value = '';
}

function updateSummary() {
    const totalPay = transactions.reduce((sum, t) => sum + t.payAmount, 0);
    const totalTDS = transactions.reduce((sum, t) => sum + t.tdsAmount, 0);

    document.getElementById('totalPayAmount').textContent = totalPay.toFixed(2);
    document.getElementById('totalTDSAmount').textContent = totalTDS.toFixed(2);
}

function saveTransactions() {
    if (transactions.length === 0) {
        alert('ट्रान्स्याकशनहरू थप्नुहोस्।');
        return;
    }

    // Save to localStorage
    const registrationData = JSON.parse(sessionStorage.getItem('etds_registration_success') || '{}');
    const saveData = {
        submissionNumber: registrationData.submissionNumber,
        transactions: transactions,
        savedDate: new Date().toISOString()
    };

    localStorage.setItem('etds_transactions_' + registrationData.submissionNumber, JSON.stringify(saveData));
    alert('ट्रान्स्याकशनहरू सफलतापूर्वक सुरक्षित गरियो।');
}

function loadTransactions() {
    const registrationData = JSON.parse(sessionStorage.getItem('etds_registration_success') || '{}');
    if (registrationData.submissionNumber) {
        const savedData = localStorage.getItem('etds_transactions_' + registrationData.submissionNumber);
        if (savedData) {
            const data = JSON.parse(savedData);
            transactions = data.transactions || [];
            transactionCounter = transactions.length > 0 ? Math.max(...transactions.map(t => t.sn)) : 0;
            renderTransactions();
            updateSummary();
        }
    }
}

function submitTransactions() {
    if (transactions.length === 0) {
        alert('ट्रान्स्याकशनहरू थप्नुहोस्।');
        return;
    }

    if (confirm('के तपाईं ट्रान्स्याकशनहरू पेश गर्न चाहनुहुन्छ?')) {
        // Save before submit
        saveTransactions();
        alert('ट्रान्स्याकशनहरू सफलतापूर्वक पेश गरियो।');
        // Here you would typically send data to server
    }
}

function searchTransaction() {
    const searchPan = document.getElementById('txtSearchPan').value.trim();
    const searchName = document.getElementById('txtSearchName').value.trim();

    if (!searchPan && !searchName) {
        alert('खोज्नको लागि पान नं. वा नाम प्रविष्ट गर्नुहोस्।');
        return;
    }

    // Filter transactions
    const filtered = transactions.filter(t => {
        const panMatch = searchPan ? t.pan.includes(searchPan) : true;
        const nameMatch = searchName ? t.name.toLowerCase().includes(searchName.toLowerCase()) : true;
        return panMatch && nameMatch;
    });

    if (filtered.length === 0) {
        alert('कुनै ट्रान्स्याकशन भेटिएन।');
    } else {
        alert(`${filtered.length} ट्रान्स्याकशनहरू भेटिए।`);
        // You could render only filtered transactions here
    }
}

function downloadSample() {
    // Create a link element to download the sample file
    const link = document.createElement('a');
    link.href = '../../media/TDS_Transaction_Upload_Sample_File.xls';
    link.download = 'TDS Transaction Upload Sample File.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Handle logout
            if (tabName === 'logout') {
                if (confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ?')) {
                    sessionStorage.removeItem('etds_registration_success');
                    // Navigate back to home or login
                    if (window.parent && window.parent !== window) {
                        window.parent.postMessage({
                            action: 'loadContent',
                            url: 'html/e_tds/etds_home.html'
                        }, '*');
                    } else {
                        window.location.href = 'etds_home.html';
                    }
                }
                return;
            }
            
            // Handle other tabs
            if (tabName === 'voucher') {
                alert('भौचर भर्ने फारम फिचर आउँदै छ।');
            } else if (tabName === 'land') {
                alert('ल्यान्ड विवरण परिवर्तन गर्ने फारम फिचर आउँदै छ।');
            }
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function refreshTransactions() {
    loadTransactions();
    alert('ट्रान्स्याकशनहरू रिफ्रेस गरियो।');
}
