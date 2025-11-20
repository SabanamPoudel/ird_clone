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

    // PAN number auto-fill name
    const panInput = document.getElementById('txtPan');
    const nameInput = document.getElementById('txtName');
    
    if (panInput && nameInput) {
        panInput.addEventListener('blur', function() {
            const pan = this.value.trim();
            if (pan && !nameInput.value) {
                // Auto-fill name based on PAN
                const autoName = getPanHolderName(pan);
                nameInput.value = autoName;
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

    // Load XML file
    document.getElementById('linkLoadXML').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('fileLoadXML').click();
    });

    document.getElementById('fileLoadXML').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            loadXMLFile(file);
        }
    });

    // Load Excel file
    document.getElementById('linkLoadExcel').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('fileLoadExcel').click();
    });

    document.getElementById('fileLoadExcel').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            loadExcelFile(file);
        }
    });

    // Save XML file
    document.getElementById('linkSaveXML').addEventListener('click', function(e) {
        e.preventDefault();
        saveToXML();
    });

    // Save Excel file
    document.getElementById('linkSaveExcel').addEventListener('click', function(e) {
        e.preventDefault();
        saveToExcel();
    });

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
    
    // Save to localStorage so voucher form can access TDS types
    localStorage.setItem('tds_transactions', JSON.stringify(transactions));
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
            <td><button class="btn-delete" onclick="deleteTransaction(${index})">❌</button></td>
        `;
        tbody.appendChild(row);
    });
    
    // Notify parent to resize iframe
    notifyParentResize();
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
        
        // Update localStorage
        localStorage.setItem('tds_transactions', JSON.stringify(transactions));
        
        alert('ट्रान्स्याकशन मेटाइयो।');
    }
}

function deleteAllTransactions() {
    if (confirm('के तपाईं सबै ट्रान्स्याकशनहरू मेटाउन चाहनुहुन्छ?')) {
        transactions = [];
        transactionCounter = 0;
        renderTransactions();
        updateSummary();
        
        // Update localStorage
        localStorage.setItem('tds_transactions', JSON.stringify(transactions));
        
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

function refreshTransactions() {
    loadTransactions();
    alert('ट्रान्स्याकशनहरू रिफ्रेस गरियो।');
}

// Get PAN holder name
function getPanHolderName(pan) {
    return `PAN ${pan} वाला को name`;
}

// Load XML file
function loadXMLFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            
            // Parse XML and load transactions
            const records = xmlDoc.getElementsByTagName('Transaction');
            const loadedTransactions = [];
            
            for (let i = 0; i < records.length; i++) {
                const record = records[i];
                loadedTransactions.push({
                    id: transactionCounter++,
                    sn: i + 1,
                    pan: record.getElementsByTagName('PAN')[0]?.textContent || '',
                    name: record.getElementsByTagName('Name')[0]?.textContent || '',
                    payDate: record.getElementsByTagName('PayDate')[0]?.textContent || '',
                    payAmount: parseFloat(record.getElementsByTagName('PayAmount')[0]?.textContent || 0),
                    tdsAmount: parseFloat(record.getElementsByTagName('TDSAmount')[0]?.textContent || 0),
                    tdsType: record.getElementsByTagName('TDSType')[0]?.textContent || ''
                });
            }
            
            transactions.push(...loadedTransactions);
            renderTransactions();
            updateSummary();
            
            // Save to localStorage
            localStorage.setItem('tds_transactions', JSON.stringify(transactions));
            
            alert(`XML फाइलबाट ${loadedTransactions.length} ट्रान्स्याकशनहरू लोड भए।`);
        } catch (error) {
            alert('XML फाइल लोड गर्न समस्या भयो। कृपया मान्य XML फाइल छान्नुहोस्।');
            console.error('XML Load Error:', error);
        }
    };
    reader.readAsText(file);
}

// Load Excel file
function loadExcelFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Skip header row (first row)
            const loadedTransactions = [];
            for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row[0]) { // Only process rows with PAN
                    loadedTransactions.push({
                        id: transactionCounter++,
                        sn: i,
                        pan: row[0]?.toString() || '',
                        name: row[1]?.toString() || '',
                        payDate: row[2]?.toString() || '',
                        payAmount: parseFloat(row[3]) || 0,
                        tdsAmount: parseFloat(row[4]) || 0,
                        tdsType: row[5]?.toString() || ''
                    });
                }
            }
            
            transactions.push(...loadedTransactions);
            renderTransactions();
            updateSummary();
            
            // Save to localStorage
            localStorage.setItem('tds_transactions', JSON.stringify(transactions));
            
            alert(`Excel फाइलबाट ${loadedTransactions.length} ट्रान्स्याकशनहरू लोड भए।`);
        } catch (error) {
            alert('Excel फाइल लोड गर्न समस्या भयो। कृपया मान्य Excel फाइल छान्नुहोस्।');
            console.error('Excel Load Error:', error);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Save to XML file
function saveToXML() {
    if (transactions.length === 0) {
        alert('सेभ गर्नका लागि कुनै ट्रान्स्याकशन छैन।');
        return;
    }
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<Transactions>\n';
    transactions.forEach(t => {
        xml += '  <Transaction>\n';
        xml += `    <PAN>${t.pan}</PAN>\n`;
        xml += `    <Name>${t.name}</Name>\n`;
        xml += `    <PayDate>${t.payDate}</PayDate>\n`;
        xml += `    <PayAmount>${t.payAmount}</PayAmount>\n`;
        xml += `    <TDSAmount>${t.tdsAmount}</TDSAmount>\n`;
        xml += `    <TDSType>${t.tdsType}</TDSType>\n`;
        xml += '  </Transaction>\n';
    });
    xml += '</Transactions>';
    
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TDS_Transactions.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('ट्रान्स्याकशनहरू XML फाइलमा सेभ भए।');
}

// Save to Excel file
function saveToExcel() {
    if (transactions.length === 0) {
        alert('सेभ गर्नका लागि कुनै ट्रान्स्याकशन छैन।');
        return;
    }
    
    const data = [
        ['PAN Number', 'Name', 'Payment Date', 'Payment Amount', 'TDS Amount', 'TDS Type']
    ];
    
    transactions.forEach(t => {
        data.push([
            t.pan,
            t.name,
            t.payDate,
            t.payAmount,
            t.tdsAmount,
            t.tdsType
        ]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'TDS_Transactions.xlsx');
    
    alert('ट्रान्स्याकशनहरू Excel फाइलमा सेभ भए।');
}

// Notify parent window to resize iframe
function notifyParentResize() {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({
            action: 'resizeIframe'
        }, '*');
    }
}
