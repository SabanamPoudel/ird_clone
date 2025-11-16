// VAT Returns Form JavaScript

// Global variables for grid management
let gridBody = null;
let addRowToGrid = null;
let updateSummary = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('VAT Returns Form loaded');
    
    // Clear all form data on page load (fresh start on every refresh)
    clearAllFormData();
    
    // Auto-populate PAN and Submission No from sessionStorage
    populatePANFromSession();
    
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize calculation functionality
    initializeCalculations();
    
    // Initialize VAT validation
    initializeVATValidation();
    
    // Initialize transaction grid FIRST (this creates the addRowToGrid function)
    initializeTransactionGrid();
    
    // Initialize Excel controls AFTER grid (so it can use addRowToGrid)
    initializeExcelControls();
    
    // Initialize modals
    initializeModals();
    
    // Initialize INFO modal
    initializeInfoModal();
    
    // Initialize Success modal
    initializeSuccessModal();
    
    // Initialize Submit Confirmation modal
    initializeSubmitConfirmModal();
    
    // Initialize Submit Success modal
    initializeSubmitSuccessModal();
    
    // Initialize Save button
    initializeSaveButton();
    
    // Initialize Submit button
    initializeSubmitButton();
    
    // Initialize Verify button with checkbox
    initializeVerifyButton();
});

// Clear all form data on page load
function clearAllFormData() {
    // Clear all text inputs
    document.querySelectorAll('input[type="text"]').forEach(input => {
        if (input.name !== 'txtPan' && input.name !== 'txtAccountType') {
            input.value = '';
        }
    });
    
    // Reset all dropdowns to default
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Clear transaction grid
    const gridBody = document.getElementById('transaction-grid-body');
    if (gridBody) {
        gridBody.innerHTML = '';
    }
    
    // Reset summary totals
    const totalRecords = document.getElementById('total-records');
    const totalTaxableAmt = document.getElementById('total-taxable-amt');
    const totalExemptedAmt = document.getElementById('total-exempted-amt');
    if (totalRecords) totalRecords.value = '0';
    if (totalTaxableAmt) totalTaxableAmt.value = '0';
    if (totalExemptedAmt) totalExemptedAmt.value = '0';
    
    // Reset "no transaction" checkbox to checked (default state)
    const noTransactionChk = document.getElementById('chk-no-transaction');
    if (noTransactionChk) {
        noTransactionChk.checked = true;
    }
    
    // Reset certification checkbox
    const certificationChk = document.getElementById('chk-certification');
    if (certificationChk) {
        certificationChk.checked = false;
    }
    
    // Reset file input
    const excelFileInput = document.getElementById('excel-file-input');
    if (excelFileInput) {
        excelFileInput.value = '';
    }
    
    // Reset browse button text
    const browseBtn = document.getElementById('browse-excel-btn');
    if (browseBtn) {
        browseBtn.textContent = 'Browse...';
    }
    
    console.log('All form data cleared on page load');
}

// Populate PAN and Submission Number from sessionStorage
function populatePANFromSession() {
    const storedPAN = sessionStorage.getItem('vatPAN');
    const storedSubmissionNo = sessionStorage.getItem('vatSubmissionNo');
    
    if (storedPAN) {
        const panField = document.querySelector('input[name="txtPan"]');
        if (panField) {
            panField.value = storedPAN;
            console.log('PAN populated from session:', storedPAN);
        }
    }
    
    if (storedSubmissionNo) {
        const submissionField = document.getElementById('submissionNumber');
        if (submissionField) {
            submissionField.textContent = storedSubmissionNo;
            console.log('Submission No populated from session:', storedSubmissionNo);
        }
    }
}

// Initialize dropdown functionality
function initializeDropdowns() {
    const filingPeriodSelect = document.getElementById('filingPeriodSelect');
    const periodSelect = document.getElementById('periodSelect');
    const txtTaxYear = document.querySelector('input[name="txtTaxYear"]');
    
    // Initially disable both dropdowns
    if (filingPeriodSelect) {
        filingPeriodSelect.disabled = true;
        filingPeriodSelect.style.opacity = '0.5';
        filingPeriodSelect.style.cursor = 'not-allowed';
    }
    if (periodSelect) {
        periodSelect.disabled = true;
        periodSelect.style.opacity = '0.5';
        periodSelect.style.cursor = 'not-allowed';
    }
    
    // Enable dropdowns when year is entered
    if (txtTaxYear) {
        txtTaxYear.addEventListener('input', function() {
            const yearValue = this.value.trim();
            
            if (yearValue.length === 4 && !isNaN(yearValue)) {
                // Valid 4-digit year entered
                if (filingPeriodSelect) {
                    filingPeriodSelect.disabled = false;
                    filingPeriodSelect.style.opacity = '1';
                    filingPeriodSelect.style.cursor = 'pointer';
                }
            } else {
                // Invalid or empty year
                if (filingPeriodSelect) {
                    filingPeriodSelect.disabled = true;
                    filingPeriodSelect.style.opacity = '0.5';
                    filingPeriodSelect.style.cursor = 'not-allowed';
                    filingPeriodSelect.value = '';
                }
                if (periodSelect) {
                    periodSelect.disabled = true;
                    periodSelect.style.opacity = '0.5';
                    periodSelect.style.cursor = 'not-allowed';
                    periodSelect.value = '';
                    periodSelect.innerHTML = '<option value="">Select...</option>';
                }
            }
        });
    }
    
    // Add dropdown change event listener
    if (filingPeriodSelect && periodSelect) {
        filingPeriodSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            // Clear existing options
            periodSelect.innerHTML = '<option value="">Select...</option>';
            
            if (selectedValue === 'M') {
                // मासिक - Show all 12 months
                const months = [
                    { value: '1', text: 'बैशाख' },
                    { value: '2', text: 'जेठ' },
                    { value: '3', text: 'असार' },
                    { value: '4', text: 'श्रावण' },
                    { value: '5', text: 'भद्र' },
                    { value: '6', text: 'आश्विन' },
                    { value: '7', text: 'कार्तिक' },
                    { value: '8', text: 'मंसिर' },
                    { value: '9', text: 'पुष' },
                    { value: '10', text: 'माघ' },
                    { value: '11', text: 'फाल्गुन' },
                    { value: '12', text: 'चैत्र' }
                ];
                months.forEach(month => {
                    const option = document.createElement('option');
                    option.value = month.value;
                    option.textContent = month.text;
                    periodSelect.appendChild(option);
                });
            } else if (selectedValue === 'Q') {
                // चौमासिक - Show 3 periods
                const periods = [
                    { value: '1', text: 'प्रथम' },
                    { value: '2', text: 'दोस्रो' },
                    { value: '3', text: 'तेस्रो' }
                ];
                periods.forEach(period => {
                    const option = document.createElement('option');
                    option.value = period.value;
                    option.textContent = period.text;
                    periodSelect.appendChild(option);
                });
            } else if (selectedValue === 'B') {
                // दुई मासिक - Show 6 periods
                const periods = [
                    { value: '1', text: 'प्रथम' },
                    { value: '2', text: 'दोस्रो' },
                    { value: '3', text: 'तेस्रो' },
                    { value: '4', text: 'चौथो' },
                    { value: '5', text: 'पाँचौं' },
                    { value: '6', text: 'छैठौं' }
                ];
                periods.forEach(period => {
                    const option = document.createElement('option');
                    option.value = period.value;
                    option.textContent = period.text;
                    periodSelect.appendChild(option);
                });
            }
            
            // Enable महिना dropdown when मा.\ चौ. \ व्दै is selected
            if (this.value) {
                periodSelect.disabled = false;
                periodSelect.style.opacity = '1';
                periodSelect.style.cursor = 'pointer';
            } else {
                periodSelect.disabled = true;
                periodSelect.style.opacity = '0.5';
                periodSelect.style.cursor = 'not-allowed';
                periodSelect.value = '';
            }
        });
    }
}

// Initialize calculation functionality
function initializeCalculations() {
    // Calculate totals and related fields automatically
    function calculateTotals() {
        // Credit column (खरिदमा तिरेको कर क्रेडिट)
        const vatOnPurchase = parseFloat(document.querySelector('input[name="txtVatOnPurchase"]')?.value) || 0;
        const vatOnPurI = parseFloat(document.querySelector('input[name="txtVatOnPurI"]')?.value) || 0;
        const adjCredit = parseFloat(document.querySelector('input[name="txtAdjCredit"]')?.value) || 0;
        
        // ४. जम्मा (Credit Total) = कर लाग्ने खरीद + कर लाग्ने पैठारी + अन्य थपघट क्रेडिट
        const totalCredit = vatOnPurchase + vatOnPurI + adjCredit;
        const totalCreditField = document.querySelector('input[name="txtTotalCredit"]');
        if (totalCreditField) {
            totalCreditField.value = totalCredit.toFixed(2);
        }
        
        // Debit column (बिक्रीमा संकलन गरेको कर डेबिट)
        const vatOnSale = parseFloat(document.querySelector('input[name="txtVatOnSale"]')?.value) || 0;
        const adjDebit = parseFloat(document.querySelector('input[name="txtAdjDebit"]')?.value) || 0;
        
        // ४. जम्मा (Debit Total)
        const totalDebit = vatOnSale + adjDebit;
        const totalDebitField = document.querySelector('input[name="txtTotalDebit"]');
        if (totalDebitField) {
            totalDebitField.value = totalDebit.toFixed(2);
        }
        
        // ५. डेविट-क्रेडिट (+ वा -) = Total Debit - Total Credit
        const debitMinusCredit = totalDebit - totalCredit;
        const vatDueTM = document.querySelector('input[name="txtVatDueTM"]');
        if (vatDueTM) {
            vatDueTM.value = debitMinusCredit.toFixed(2);
        }
        
        // ७. तिर्नु पर्ने कर रू.(५-६) (+ वा -) = (डेविट-क्रेडिट) - (गत महिनाको क्रेडिट)
        const creditBF = parseFloat(document.querySelector('input[name="txtCreditBF"]')?.value) || 0;
        const vatDue = debitMinusCredit - creditBF;
        const vatDueField = document.querySelector('input[name="txtVatDue"]');
        if (vatDueField) {
            vatDueField.value = vatDue.toFixed(2);
        }
    }
    
    // Add event listeners for all fields that affect calculations
    const fieldsToWatch = [
        'txtVatOnPurchase',    // २.१. कर लाग्ने खरीद - Credit
        'txtVatOnPurI',        // २.२. कर लाग्ने पैठारी - Credit
        'txtAdjCredit',        // ३.१. अन्य थपघट - Credit
        'txtVatOnSale',        // १.१. कर लाग्ने बिक्री - Debit
        'txtAdjDebit',         // ३.१. अन्य थपघट - Debit
        'txtCreditBF'          // ६. गत महिनाको मिलान गर्न बांकी क्रेडिट
    ];
    
    fieldsToWatch.forEach(fieldName => {
        const field = document.querySelector(`input[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('input', calculateTotals);
            field.addEventListener('change', calculateTotals);
        }
    });
    
    // Initialize totals with 0
    calculateTotals();
}

// Initialize VAT validation
function initializeVATValidation() {
    // VAT Validation Function - Check if VAT is 13% of transaction amount
    function validateVAT(transactionField, vatField, fieldLabel) {
        const transactionValue = parseFloat(transactionField.value) || 0;
        const vatValue = parseFloat(vatField.value) || 0;
        
        if (transactionValue > 0 && vatValue > 0) {
            const expectedVAT = transactionValue * 0.13;
            const tolerance = 0.01; // Allow small rounding differences
            
            if (Math.abs(vatValue - expectedVAT) > tolerance) {
                // Show error popup
                showErrorPopup('Invalid ' + fieldLabel);
                vatField.value = ''; // Clear the invalid VAT value
                vatField.focus();
                return false;
            }
        }
        return true;
    }
    
    // Show Error Popup
    function showErrorPopup(message) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 20000; display: flex; align-items: center; justify-content: center;';
        
        // Create error dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = 'background: white; width: 350px; border-radius: 4px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);';
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = 'background: linear-gradient(to bottom, #e8f4ff 0%, #d0e9ff 100%); padding: 8px 12px; border-bottom: 1px solid #b3d9ff; font-weight: bold; color: #003d7a; font-size: 14px;';
        header.textContent = 'ERROR';
        
        // Close button in header
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'float: right; border: none; background: transparent; font-size: 20px; cursor: pointer; color: #003d7a; padding: 0 5px;';
        closeBtn.onclick = () => document.body.removeChild(overlay);
        header.appendChild(closeBtn);
        
        // Body with icon and message
        const body = document.createElement('div');
        body.style.cssText = 'padding: 30px 20px; text-align: center;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'width: 50px; height: 50px; margin: 0 auto 15px; background: #d9edf7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #31708f;';
        icon.innerHTML = '&#9432;'; // Info icon
        
        const messageText = document.createElement('div');
        messageText.style.cssText = 'font-size: 14px; color: #333;';
        messageText.textContent = message;
        
        body.appendChild(icon);
        body.appendChild(messageText);
        
        // Footer with OK button
        const footer = document.createElement('div');
        footer.style.cssText = 'padding: 10px 20px; text-align: center; border-top: 1px solid #e0e0e0;';
        
        const okBtn = document.createElement('button');
        okBtn.textContent = 'Ok';
        okBtn.style.cssText = 'padding: 6px 30px; background: linear-gradient(to bottom, #5cb85c 0%, #4cae4c 100%); border: 1px solid #4cae4c; color: white; cursor: pointer; border-radius: 3px; font-size: 13px;';
        okBtn.onclick = () => document.body.removeChild(overlay);
        
        footer.appendChild(okBtn);
        
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }
    
    // Add VAT validation listeners
    const txtTaxableSale = document.querySelector('input[name="txtTaxableSale"]');
    const txtVatOnSale = document.querySelector('input[name="txtVatOnSale"]');
    const txtTaxablePurchase = document.querySelector('input[name="txtTaxablePurchase"]');
    const txtVatOnPurchase = document.querySelector('input[name="txtVatOnPurchase"]');
    const txtTaxablePurI = document.querySelector('input[name="txtTaxablePurI"]');
    const txtVatOnPurI = document.querySelector('input[name="txtVatOnPurI"]');
    
    // Validate VAT On Sale (१.१. कर लाग्ने बिक्री)
    if (txtVatOnSale && txtTaxableSale) {
        txtVatOnSale.addEventListener('blur', function() {
            validateVAT(txtTaxableSale, txtVatOnSale, 'Vat On Sale');
        });
    }
    
    // Validate VAT On Purchase (२.१. कर लाग्ने खरीद)
    if (txtVatOnPurchase && txtTaxablePurchase) {
        txtVatOnPurchase.addEventListener('blur', function() {
            validateVAT(txtTaxablePurchase, txtVatOnPurchase, 'Vat On Purchase');
        });
    }
    
    // Validate VAT On Import (२.२. कर लाग्ने पैठारी)
    if (txtVatOnPurI && txtTaxablePurI) {
        txtVatOnPurI.addEventListener('blur', function() {
            validateVAT(txtTaxablePurI, txtVatOnPurI, 'Vat On Import');
        });
    }
}

// Initialize Excel controls
function initializeExcelControls() {
    const noTransactionChk = document.getElementById('chk-no-transaction');
    const loadExcelChk = document.getElementById('chk-load-excel');
    const browseBtn = document.getElementById('browse-excel-btn');
    const loadBtn = document.getElementById('load-excel-btn');
    const downloadSampleBtn = document.getElementById('download-sample-btn');
    const excelFileInput = document.getElementById('excel-file-input');
    
    function updateExcelControlsState() {
        const isNoTransaction = noTransactionChk.checked;
        
        if (isNoTransaction) {
            // Disable Excel controls when "no transaction" is checked
            loadExcelChk.disabled = true;
            loadExcelChk.checked = false;
            browseBtn.disabled = true;
            loadBtn.disabled = true;
            downloadSampleBtn.disabled = true;
            excelFileInput.disabled = true;
            
            // Change appearance to light/disabled
            loadExcelChk.style.opacity = '0.5';
            browseBtn.style.opacity = '0.5';
            browseBtn.style.cursor = 'not-allowed';
            loadBtn.style.opacity = '0.5';
            loadBtn.style.cursor = 'not-allowed';
            downloadSampleBtn.style.opacity = '0.5';
            downloadSampleBtn.style.cursor = 'not-allowed';
        } else {
            // Enable Excel controls when "no transaction" is unchecked
            loadExcelChk.disabled = false;
            browseBtn.disabled = false;
            loadBtn.disabled = false;
            downloadSampleBtn.disabled = false;
            excelFileInput.disabled = false;
            
            // Change appearance to dark/enabled
            loadExcelChk.style.opacity = '1';
            browseBtn.style.opacity = '1';
            browseBtn.style.cursor = 'pointer';
            loadBtn.style.opacity = '1';
            loadBtn.style.cursor = 'pointer';
            downloadSampleBtn.style.opacity = '1';
            downloadSampleBtn.style.cursor = 'pointer';
        }
    }
    
    // Initial state
    if (noTransactionChk) {
        updateExcelControlsState();
        noTransactionChk.addEventListener('change', updateExcelControlsState);
    }
    
    // Browse Excel file button functionality
    if (browseBtn && excelFileInput) {
        browseBtn.addEventListener('click', function() {
            if (!browseBtn.disabled) {
                excelFileInput.click();
            }
        });
        
        // Show selected filename next to browse button
        excelFileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name || '';
            if (fileName) {
                // Update browse button text to show filename
                browseBtn.textContent = fileName;
                browseBtn.style.maxWidth = '300px';
                browseBtn.style.overflow = 'hidden';
                browseBtn.style.textOverflow = 'ellipsis';
                browseBtn.style.whiteSpace = 'nowrap';
            } else {
                browseBtn.textContent = 'Browse...';
            }
        });
    }
    
    // Load Excel button functionality - supports both CSV and Excel files
    if (loadBtn && excelFileInput) {
        loadBtn.addEventListener('click', function() {
            if (!loadBtn.disabled) {
                const file = excelFileInput.files[0];
                if (!file) {
                    alert('Please select a file first!');
                    return;
                }
                
                const fileName = file.name.toLowerCase();
                const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
                const isCSV = fileName.endsWith('.csv');
                
                if (!isExcel && !isCSV) {
                    alert('Please upload an Excel file (.xlsx, .xls) or CSV file (.csv).');
                    return;
                }
                
                console.log('Loading file:', file.name, 'Size:', file.size, 'bytes', 'Type:', isExcel ? 'Excel' : 'CSV');
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        let rowsData = [];
                        
                        if (isExcel) {
                            // Handle Excel files using SheetJS
                            const data = new Uint8Array(e.target.result);
                            const workbook = XLSX.read(data, { type: 'array' });
                            
                            console.log('Workbook loaded. Sheet names:', workbook.SheetNames);
                            
                            // Get first sheet
                            const firstSheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[firstSheetName];
                            
                            // Convert to JSON (array of arrays)
                            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
                            
                            console.log('Excel file loaded. Total rows:', jsonData.length);
                            console.log('Header row:', jsonData[0]);
                            console.log('First data row:', jsonData[1]);
                            console.log('All data:', jsonData);
                            
                            // Skip header row (index 0)
                            for (let i = 1; i < jsonData.length; i++) {
                                const row = jsonData[i];
                                console.log('Processing row', i, ':', row);
                                
                                // Skip completely empty rows
                                if (!row || row.length === 0) {
                                    console.log('  Skipping empty row');
                                    continue;
                                }
                                
                                // Check if row has any data (not just empty cells)
                                const hasData = row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '');
                                if (!hasData) {
                                    console.log('  Skipping row with no data');
                                    continue;
                                }
                                
                                // Excel rows might have fewer columns if trailing cells are empty
                                // Column mapping: 0=PAN, 1=TradeName, 2=TradeNameType, 3=SORP, 4=TaxableAmount, 5=ExemptedAmount, 6=Remarks
                                const normalizeTradeNameType = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'english' || normalized === 'e') return 'English';
                                    if (normalized === 'nepali' || normalized === 'n') return 'Nepali';
                                    return '';
                                };
                                
                                const normalizeSorp = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'sale' || normalized === 's') return 'Sale';
                                    if (normalized === 'purchase' || normalized === 'p') return 'Purchase';
                                    return '';
                                };
                                
                                const normalizeRemarks = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'ho') return 'Ho';
                                    if (normalized === 'haina' || normalized === 'hoina') return 'Hoina';
                                    return '';
                                };
                                
                                const rowData = {
                                    pan: String(row[0] !== undefined ? row[0] : '').trim(),
                                    tradeName: String(row[1] !== undefined ? row[1] : '').trim(),
                                    tradeNameType: normalizeTradeNameType(row[2]),
                                    sorp: normalizeSorp(row[3]),
                                    taxableAmount: String(row[4] !== undefined ? row[4] : '').trim(),
                                    exemptedAmount: String(row[5] !== undefined ? row[5] : '').trim(),
                                    remarks: normalizeRemarks(row[6])
                                };
                                
                                console.log('  Row data extracted:', rowData);
                                
                                // Only add if at least PAN has data
                                if (rowData.pan) {
                                    rowsData.push(rowData);
                                    console.log('  Row added to queue');
                                } else {
                                    console.log('  Skipping row - no PAN data');
                                }
                            }
                            
                            console.log('Total rows queued for adding:', rowsData.length);
                        } else {
                            // Handle CSV files
                            const text = e.target.result;
                            console.log('CSV file loaded. First 200 chars:', text.substring(0, 200));
                            
                            const lines = text.split(/\r\n|\r|\n/); // Handle all line endings
                            console.log('Total lines found:', lines.length);
                            console.log('Header line:', lines[0]);
                            
                            // Skip header row (index 0) and process data rows
                            for (let i = 1; i < lines.length; i++) {
                                const row = lines[i].trim();
                                if (!row) continue; // Skip empty rows
                                
                                console.log('Processing line', i, ':', row);
                                
                                // Parse CSV row (handle quoted values and commas)
                                const columns = parseCSVLine(row);
                                console.log('  Parsed into', columns.length, 'columns:', columns);
                                
                                // Helper functions to normalize dropdown values
                                const normalizeTradeNameType = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'english' || normalized === 'e') return 'English';
                                    if (normalized === 'nepali' || normalized === 'n') return 'Nepali';
                                    return '';
                                };
                                
                                const normalizeSorp = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'sale' || normalized === 's') return 'Sale';
                                    if (normalized === 'purchase' || normalized === 'p') return 'Purchase';
                                    return '';
                                };
                                
                                const normalizeRemarks = (val) => {
                                    const normalized = String(val).trim().toLowerCase();
                                    if (normalized === 'ho') return 'Ho';
                                    if (normalized === 'haina' || normalized === 'hoina') return 'Hoina';
                                    return '';
                                };
                                
                                // Make sure we have enough columns (at least 7)
                                // Column mapping: 0=PAN, 1=TradeName, 2=TradeNameType, 3=SORP, 4=TaxableAmount, 5=ExemptedAmount, 6=Remarks
                                if (columns.length >= 7) {
                                    rowsData.push({
                                        pan: cleanValue(columns[0]),
                                        tradeName: cleanValue(columns[1]),
                                        tradeNameType: normalizeTradeNameType(columns[2]),
                                        sorp: normalizeSorp(columns[3]),
                                        taxableAmount: cleanValue(columns[4]),
                                        exemptedAmount: cleanValue(columns[5]),
                                        remarks: normalizeRemarks(columns[6])
                                    });
                                }
                            }
                        }
                        
                        // Clear existing grid data
                        const gridBody = document.getElementById('transaction-grid-body');
                        if (gridBody) {
                            gridBody.innerHTML = '';
                        }
                        
                        // Add all rows to grid
                        let rowsAdded = 0;
                        rowsData.forEach(rowData => {
                            console.log('Adding row:', rowData);
                            addRowToGrid(rowData);
                            rowsAdded++;
                        });
                        
                        // Update summary after loading all data
                        if (updateSummary) {
                            updateSummary();
                        }
                        
                        alert(rowsAdded + ' rows loaded successfully from ' + (isExcel ? 'Excel' : 'CSV') + ' file!');
                        console.log('Load complete:', rowsAdded, 'rows added');
                        
                    } catch (error) {
                        console.error('Error loading file:', error);
                        alert('Error loading file: ' + error.message);
                    }
                };
                
                reader.onerror = function() {
                    console.error('FileReader error');
                    alert('Error reading file! Please try again.');
                };
                
                // Read file based on type
                if (isExcel) {
                    reader.readAsArrayBuffer(file); // Excel files need binary data
                } else {
                    reader.readAsText(file, 'UTF-8'); // CSV files as text
                }
            }
        });
    }
    
    // Helper function to parse CSV line with proper quote handling
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let insideQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (insideQuotes && nextChar === '"') {
                    // Double quote inside quoted field
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    insideQuotes = !insideQuotes;
                }
            } else if (char === ',' && !insideQuotes) {
                // Field separator
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        result.push(current);
        
        return result;
    }
    
    // Helper function to clean CSV values (remove quotes and trim)
    function cleanValue(value) {
        if (!value) return '';
        
        // Remove surrounding quotes if present
        value = value.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        
        // Replace double quotes with single quote
        value = value.replace(/""/g, '"');
        
        return value.trim();
    }
    
    // Download Sample Excel button functionality
    if (downloadSampleBtn) {
        downloadSampleBtn.addEventListener('click', function() {
            if (!downloadSampleBtn.disabled) {
                // Create sample data
                const sampleData = [
                    ['SNo', 'PAN', 'TradeName', 'TradeNameType', 'SORP', 'TaxableAmount', 'ExemptedAmount', 'Remarks'],
                    [1, '123456789', 'Sample Company', 'English', 'Sale', 100000, 50000, 'Sample remark'],
                    [2, '987654321', 'नमूना कम्पनी', 'Nepali', 'Purchase', 200000, 75000, 'नमूना टिप्पणी']
                ];
                
                // Create workbook and worksheet using SheetJS
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(sampleData);
                
                // Set column widths
                ws['!cols'] = [
                    { wch: 5 },  // SNo
                    { wch: 12 }, // PAN
                    { wch: 25 }, // TradeName
                    { wch: 15 }, // TradeNameType
                    { wch: 10 }, // SORP
                    { wch: 15 }, // TaxableAmount
                    { wch: 15 }, // ExemptedAmount
                    { wch: 20 }  // Remarks
                ];
                
                XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
                
                // Generate Excel file and download
                XLSX.writeFile(wb, 'Transaction_Sample_Template.xlsx');
            }
        });
    }
}

// Initialize transaction grid
function initializeTransactionGrid() {
    const addBtn = document.getElementById('btn-add-transaction');
    gridBody = document.getElementById('transaction-grid-body');
    const deleteAllBtn = document.getElementById('btn-delete-all');
    const exportExcelBtn = document.getElementById('btn-export-excel');
    
    // Function to renumber all rows
    function renumberRows() {
        const rows = gridBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const snoCell = row.querySelector('td:first-child');
            if (snoCell) {
                snoCell.textContent = index + 1;
            }
        });
    }
    
    // Function to update summary totals - assign to global variable
    updateSummary = function() {
        const rows = gridBody.querySelectorAll('tr');
        let totalRecords = rows.length;
        let totalTaxable = 0;
        let totalExempted = 0;
        
        rows.forEach(row => {
            const taxable = parseFloat(row.querySelector('.row-taxable')?.value) || 0;
            const exempted = parseFloat(row.querySelector('.row-exempted')?.value) || 0;
            totalTaxable += taxable;
            totalExempted += exempted;
        });
        
        document.getElementById('total-records').value = totalRecords;
        document.getElementById('total-taxable-amt').value = totalTaxable.toFixed(2);
        document.getElementById('total-exempted-amt').value = totalExempted.toFixed(2);
    };
    
    // Function to add row to grid (used by both Add button and Excel load) - assign to global variable
    addRowToGrid = function(data) {
        if (!gridBody) return;
        
        const newRow = document.createElement('tr');
        const currentRowCount = gridBody.querySelectorAll('tr').length + 1;
        
        newRow.innerHTML = `
            <td style="border: 1px solid #ccc; padding: 3px; text-align: center; width: 40px;">${currentRowCount}</td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 100px;">
                <input type="text" class="row-pan" style="width: 100%; border: 1px solid #999; padding: 3px; box-sizing: border-box;" maxlength="9" value="${data.pan || ''}">
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 150px;">
                <input type="text" class="row-tradename" style="width: 100%; border: 1px solid #999; padding: 3px; box-sizing: border-box;" value="${data.tradeName || ''}">
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 100px;">
                <select class="row-tradenametype" style="width: 100%; border: 1px solid #999; padding: 3px; box-sizing: border-box;">
                    <option value="">Select...</option>
                    <option value="English" ${data.tradeNameType === 'English' ? 'selected' : ''}>English</option>
                    <option value="Nepali" ${data.tradeNameType === 'Nepali' ? 'selected' : ''}>Nepali</option>
                </select>
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 80px; text-align: center;">
                <select class="row-sorp" style="width: 100%; border: 1px solid #999; padding: 3px; box-sizing: border-box;">
                    <option value="">Select...</option>
                    <option value="Sale" ${data.sorp === 'Sale' ? 'selected' : ''}>Sale</option>
                    <option value="Purchase" ${data.sorp === 'Purchase' ? 'selected' : ''}>Purchase</option>
                </select>
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 120px;">
                <input type="text" class="row-taxable" style="width: 100%; border: 1px solid #999; padding: 3px; text-align: right; box-sizing: border-box;" value="${data.taxableAmount || ''}">
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 120px;">
                <input type="text" class="row-exempted" style="width: 100%; border: 1px solid #999; padding: 3px; text-align: right; box-sizing: border-box;" value="${data.exemptedAmount || ''}">
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; width: 100px;">
                <select class="row-remarks" style="width: 100%; border: 1px solid #999; padding: 3px; box-sizing: border-box;">
                    <option value="">Select...</option>
                    <option value="Ho" ${data.remarks === 'Ho' || data.remarks === 'ho' ? 'selected' : ''}>Ho</option>
                    <option value="Hoina" ${data.remarks === 'Hoina' || data.remarks === 'haina' ? 'selected' : ''}>Hoina</option>
                </select>
            </td>
            <td style="border: 1px solid #ccc; padding: 3px; text-align: center; width: 80px;">
                <button type="button" class="btn-edit-row" style="margin-right: 3px; padding: 2px 5px; background: #5cb85c; color: white; border: none; cursor: pointer;" title="Edit">✎</button>
                <button type="button" class="btn-delete-row" style="padding: 2px 5px; background: #d9534f; color: white; border: none; cursor: pointer; border-radius: 50%;" title="Delete">✕</button>
            </td>
        `;
        
        gridBody.appendChild(newRow);
        
        // Add delete functionality
        const deleteBtn = newRow.querySelector('.btn-delete-row');
        deleteBtn.addEventListener('click', function() {
            newRow.remove();
            renumberRows();
            updateSummary();
        });
        
        // Update summary on input change
        newRow.querySelectorAll('.row-taxable, .row-exempted').forEach(input => {
            input.addEventListener('input', updateSummary);
        });
    };
    
    if (addBtn && gridBody) {
        addBtn.addEventListener('click', function() {
            // Use the addRowToGrid function with empty data
            addRowToGrid({});
        });
    }
    
    // Delete All button functionality
    if (deleteAllBtn && gridBody) {
        deleteAllBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all transactions?')) {
                gridBody.innerHTML = '';
                updateSummary();
            }
        });
    }
    
    // Export to Excel button functionality
    if (exportExcelBtn && gridBody) {
        exportExcelBtn.addEventListener('click', function() {
            const rows = gridBody.querySelectorAll('tr');
            
            if (rows.length === 0) {
                alert('No transaction data to export!');
                return;
            }
            
            // Create CSV content
            let csvContent = 'SNo,PAN,TradeName,TradeNameType,SORP,TaxableAmount,ExemptedAmount,Remarks\n';
            
            rows.forEach((row, index) => {
                const sno = index + 1;
                const pan = row.querySelector('.row-pan')?.value || '';
                const tradeName = row.querySelector('.row-tradename')?.value || '';
                const tradeNameType = row.querySelector('.row-tradenametype')?.value || '';
                const sorp = row.querySelector('.row-sorp')?.value || '';
                const taxable = row.querySelector('.row-taxable')?.value || '0';
                const exempted = row.querySelector('.row-exempted')?.value || '0';
                const remarks = row.querySelector('.row-remarks')?.value || '';
                
                // Escape quotes in CSV
                const escapeCsv = (str) => `"${String(str).replace(/"/g, '""')}"`;
                
                csvContent += `${sno},${escapeCsv(pan)},${escapeCsv(tradeName)},${escapeCsv(tradeNameType)},${escapeCsv(sorp)},${taxable},${exempted},${escapeCsv(remarks)}\n`;
            });
            
            // Add summary row
            const totalRecords = rows.length;
            const totalTaxable = document.getElementById('total-taxable-amt').value;
            const totalExempted = document.getElementById('total-exempted-amt').value;
            csvContent += `\nTotal Records:,${totalRecords},,,,Total Taxable:,${totalTaxable},Total Exempted:,${totalExempted}\n`;
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const fileName = `Transaction_Details_${new Date().toISOString().slice(0,10)}.csv`;
            
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
}

// Initialize modals
function initializeModals() {
    // Credit Modal
    const creditModal = document.getElementById('creditModal');
    const btnAdjustmentCredit = document.getElementById('btnAdjustmentCredit');
    const btnCloseCreditModal = document.getElementById('btnCloseCreditModal');
    const btnCancelCredit = document.getElementById('btnCancelCredit');
    const btnOkCredit = document.getElementById('btnOkCredit');
    
    // Open Credit modal
    if (btnAdjustmentCredit) {
        btnAdjustmentCredit.addEventListener('click', function() {
            if (creditModal) {
                creditModal.style.display = 'flex';
                creditModal.classList.add('active');
            }
            // Clear form
            document.getElementById('txtCreditAdjustment').value = '';
            document.getElementById('txtConsumerRefund').value = '';
            document.getElementById('txtCreditOther').value = '';
            document.getElementById('totalCreditAmount').textContent = '0';
        });
    }
    
    // Close Credit modal handlers
    if (btnCloseCreditModal) {
        btnCloseCreditModal.addEventListener('click', function() {
            if (creditModal) {
                creditModal.style.display = 'none';
                creditModal.classList.remove('active');
            }
        });
    }
    
    if (btnCancelCredit) {
        btnCancelCredit.addEventListener('click', function() {
            if (creditModal) {
                creditModal.style.display = 'none';
                creditModal.classList.remove('active');
            }
        });
    }
    
    // Credit OK button
    if (btnOkCredit) {
        btnOkCredit.addEventListener('click', function() {
            const total = parseFloat(document.getElementById('totalCreditAmount')?.textContent || '0');
            const creditField = document.querySelector('input[name="txtAdjCredit"]');
            if (creditField) {
                creditField.value = total.toFixed(2);
                // Trigger calculation after updating the field
                const event = new Event('input', { bubbles: true });
                creditField.dispatchEvent(event);
            }
            if (creditModal) {
                creditModal.style.display = 'none';
                creditModal.classList.remove('active');
            }
        });
    }
    
    // Calculate Credit total
    function calculateCreditTotal() {
        const adj = parseFloat(document.getElementById('txtCreditAdjustment')?.value || '0');
        const refund = parseFloat(document.getElementById('txtConsumerRefund')?.value || '0');
        const other = parseFloat(document.getElementById('txtCreditOther')?.value || '0');
        const total = adj + refund + other;
        const totalElement = document.getElementById('totalCreditAmount');
        if (totalElement) totalElement.textContent = total;
    }
    
    // Add event listeners for Credit calculation
    document.getElementById('txtCreditAdjustment')?.addEventListener('input', calculateCreditTotal);
    document.getElementById('txtConsumerRefund')?.addEventListener('input', calculateCreditTotal);
    document.getElementById('txtCreditOther')?.addEventListener('input', calculateCreditTotal);
    
    // Debit Modal
    const debitModal = document.getElementById('debitModal');
    const btnAdjustmentDebit = document.getElementById('btnAdjustmentDebit');
    const btnCloseDebitModal = document.getElementById('btnCloseDebitModal');
    const btnCancelDebit = document.getElementById('btnCancelDebit');
    const btnOkDebit = document.getElementById('btnOkDebit');
    
    // Open Debit modal
    if (btnAdjustmentDebit) {
        btnAdjustmentDebit.addEventListener('click', function() {
            if (debitModal) {
                debitModal.style.display = 'flex';
                debitModal.classList.add('active');
            }
            // Clear form
            document.getElementById('txtDebitAdjustment').value = '';
            document.getElementById('txtDebitOther').value = '';
            document.getElementById('totalDebitAmount').textContent = '0';
        });
    }
    
    // Close Debit modal handlers
    if (btnCloseDebitModal) {
        btnCloseDebitModal.addEventListener('click', function() {
            if (debitModal) {
                debitModal.style.display = 'none';
                debitModal.classList.remove('active');
            }
        });
    }
    
    if (btnCancelDebit) {
        btnCancelDebit.addEventListener('click', function() {
            if (debitModal) {
                debitModal.style.display = 'none';
                debitModal.classList.remove('active');
            }
        });
    }
    
    // Debit OK button
    if (btnOkDebit) {
        btnOkDebit.addEventListener('click', function() {
            const total = parseFloat(document.getElementById('totalDebitAmount')?.textContent || '0');
            const debitField = document.querySelector('input[name="txtAdjDebit"]');
            if (debitField) {
                debitField.value = total.toFixed(2);
                // Trigger calculation after updating the field
                const event = new Event('input', { bubbles: true });
                debitField.dispatchEvent(event);
            }
            if (debitModal) {
                debitModal.style.display = 'none';
                debitModal.classList.remove('active');
            }
        });
    }
    
    // Calculate Debit total
    function calculateDebitTotal() {
        const adj = parseFloat(document.getElementById('txtDebitAdjustment')?.value || '0');
        const other = parseFloat(document.getElementById('txtDebitOther')?.value || '0');
        const total = adj + other;
        const totalElement = document.getElementById('totalDebitAmount');
        if (totalElement) totalElement.textContent = total;
    }
    
    // Add event listeners for Debit calculation
    document.getElementById('txtDebitAdjustment')?.addEventListener('input', calculateDebitTotal);
    document.getElementById('txtDebitOther')?.addEventListener('input', calculateDebitTotal);
}

// Initialize INFO Modal
function initializeInfoModal() {
    const infoModal = document.getElementById('infoModal');
    const btnCloseInfo = document.getElementById('btnCloseInfo');
    const btnOkInfo = document.getElementById('btnOkInfo');
    
    // Close INFO modal handlers
    if (btnCloseInfo) {
        btnCloseInfo.addEventListener('click', function() {
            if (infoModal) infoModal.style.display = 'none';
        });
    }
    
    if (btnOkInfo) {
        btnOkInfo.addEventListener('click', function() {
            if (infoModal) infoModal.style.display = 'none';
        });
    }
    
    // Close on outside click
    if (infoModal) {
        infoModal.addEventListener('click', function(e) {
            if (e.target === infoModal) {
                infoModal.style.display = 'none';
            }
        });
    }
}

// Function to show INFO modal with message
function showInfoModal(message) {
    const infoModal = document.getElementById('infoModal');
    const infoMessageContent = document.getElementById('infoMessageContent');
    
    if (infoModal && infoMessageContent) {
        infoMessageContent.innerHTML = message;
        infoModal.style.display = 'flex';
    }
}

// Initialize Save Button
function initializeSaveButton() {
    const btnSave = document.getElementById('btn-save');
    
    if (btnSave) {
        // Remove any existing event listeners by cloning the button
        const newBtnSave = btnSave.cloneNode(true);
        btnSave.parentNode.replaceChild(newBtnSave, btnSave);
        
        newBtnSave.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Save button clicked - showing success modal');
            // Always show success modal when Save is clicked
            showSuccessModal();
        });
    }
}

// Function to generate unique submission number
function generateSubmissionNumber() {
    // Format: 82 (year) + random 10 digits
    const year = '82'; // Nepali year 2082
    const randomPart = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    return year + randomPart;
}

// Function to show success modal with submission number
function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    const submissionNoSpan = document.getElementById('generatedSubmissionNo');
    
    if (successModal && submissionNoSpan) {
        // Generate new unique submission number
        const newSubmissionNo = generateSubmissionNumber();
        submissionNoSpan.textContent = newSubmissionNo;
        
        // Update the submission number display at the top of the form
        const submissionNumberDisplay = document.getElementById('submissionNumber');
        if (submissionNumberDisplay) {
            submissionNumberDisplay.textContent = newSubmissionNo;
        }
        
        // Store in sessionStorage for future use
        sessionStorage.setItem('vatSubmissionNo', newSubmissionNo);
        
        // Show the modal
        successModal.style.display = 'flex';
    }
}

// Initialize Success Modal
function initializeSuccessModal() {
    const successModal = document.getElementById('successModal');
    const btnCloseSuccess = document.getElementById('btnCloseSuccess');
    const btnOkSuccess = document.getElementById('btnOkSuccess');
    
    // Close success modal handlers
    if (btnCloseSuccess) {
        btnCloseSuccess.addEventListener('click', function() {
            if (successModal) successModal.style.display = 'none';
        });
    }
    
    if (btnOkSuccess) {
        btnOkSuccess.addEventListener('click', function() {
            if (successModal) successModal.style.display = 'none';
        });
    }
    
    // Close on outside click
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }
}

// Initialize Submit Confirmation Modal
function initializeSubmitConfirmModal() {
    const submitConfirmModal = document.getElementById('submitConfirmModal');
    const btnCloseSubmitConfirm = document.getElementById('btnCloseSubmitConfirm');
    const btnYesSubmit = document.getElementById('btnYesSubmit');
    const btnNoSubmit = document.getElementById('btnNoSubmit');
    
    // Close handlers
    if (btnCloseSubmitConfirm) {
        btnCloseSubmitConfirm.addEventListener('click', function() {
            if (submitConfirmModal) submitConfirmModal.style.display = 'none';
        });
    }
    
    if (btnNoSubmit) {
        btnNoSubmit.addEventListener('click', function() {
            if (submitConfirmModal) submitConfirmModal.style.display = 'none';
        });
    }
    
    if (btnYesSubmit) {
        btnYesSubmit.addEventListener('click', function() {
            // Close confirmation modal
            if (submitConfirmModal) submitConfirmModal.style.display = 'none';
            
            // Show final submit success modal
            showSubmitSuccessModal();
        });
    }
    
    // Close on outside click
    if (submitConfirmModal) {
        submitConfirmModal.addEventListener('click', function(e) {
            if (e.target === submitConfirmModal) {
                submitConfirmModal.style.display = 'none';
            }
        });
    }
}

// Initialize Submit Button
function initializeSubmitButton() {
    const btnSubmit = document.getElementById('btn-submit');
    
    if (btnSubmit) {
        // Remove any existing event listeners
        const newBtnSubmit = btnSubmit.cloneNode(true);
        btnSubmit.parentNode.replaceChild(newBtnSubmit, btnSubmit);
        
        newBtnSubmit.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Submit button clicked - showing confirmation modal');
            
            // Show confirmation modal
            const submitConfirmModal = document.getElementById('submitConfirmModal');
            if (submitConfirmModal) {
                submitConfirmModal.style.display = 'flex';
            }
        });
    }
}

// Function to show final submit success modal
function showSubmitSuccessModal() {
    const submitSuccessModal = document.getElementById('submitSuccessModal');
    const finalSubmissionNo = document.getElementById('finalSubmissionNo');
    
    if (submitSuccessModal && finalSubmissionNo) {
        // Get or generate submission number
        let submissionNo = sessionStorage.getItem('vatSubmissionNo');
        if (!submissionNo) {
            submissionNo = generateSubmissionNumber();
            sessionStorage.setItem('vatSubmissionNo', submissionNo);
        }
        
        finalSubmissionNo.textContent = submissionNo;
        submitSuccessModal.style.display = 'flex';
    }
}

// Initialize Submit Success Modal
function initializeSubmitSuccessModal() {
    const submitSuccessModal = document.getElementById('submitSuccessModal');
    const btnCloseSubmitSuccess = document.getElementById('btnCloseSubmitSuccess');
    const btnOkSubmitSuccess = document.getElementById('btnOkSubmitSuccess');
    
    // Close handlers
    if (btnCloseSubmitSuccess) {
        btnCloseSubmitSuccess.addEventListener('click', function() {
            if (submitSuccessModal) submitSuccessModal.style.display = 'none';
        });
    }
    
    if (btnOkSubmitSuccess) {
        btnOkSubmitSuccess.addEventListener('click', function() {
            if (submitSuccessModal) submitSuccessModal.style.display = 'none';
        });
    }
    
    // Close on outside click
    if (submitSuccessModal) {
        submitSuccessModal.addEventListener('click', function(e) {
            if (e.target === submitSuccessModal) {
                submitSuccessModal.style.display = 'none';
            }
        });
    }
}

// Initialize Verify Button with Checkbox Control
function initializeVerifyButton() {
    const checkbox = document.getElementById('chk-certification');
    const verifyBtn = document.getElementById('btn-verify');
    
    if (checkbox && verifyBtn) {
        // Initial state - disabled
        verifyBtn.disabled = true;
        verifyBtn.style.opacity = '0.5';
        verifyBtn.style.cursor = 'not-allowed';
        
        // Listen to checkbox change
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Enable and brighten the verify button
                verifyBtn.disabled = false;
                verifyBtn.style.opacity = '1';
                verifyBtn.style.cursor = 'pointer';
            } else {
                // Disable and dim the verify button
                verifyBtn.disabled = true;
                verifyBtn.style.opacity = '0.5';
                verifyBtn.style.cursor = 'not-allowed';
            }
        });
        
        // Add click handler for verify button
        verifyBtn.addEventListener('click', function() {
            if (!this.disabled) {
                showVerifyConfirmationModal();
            }
        });
    }
}

// Show verification confirmation modal with iframe
function showVerifyConfirmationModal() {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'verifyConfirmationOverlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = `
        background: white;
        border-radius: 5px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        width: 700px;
        max-width: 90%;
        height: 500px;
        max-height: 90vh;
        position: relative;
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #d9534f;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        font-size: 24px;
        line-height: 24px;
        cursor: pointer;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(modalOverlay);
    };
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'vat_verify_confirmation.html';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 5px;
    `;
    
    // Listen for message from confirmation page
    window.addEventListener('message', function(event) {
        if (event.data && event.data.action === 'showLoginPage') {
            // Get PAN and Submission Number
            const panField = document.querySelector('input[name="txtPan"]');
            const submissionNoField = document.getElementById('submissionNumber');
            
            const pan = panField ? panField.value : '';
            const submissionNo = submissionNoField ? submissionNoField.textContent : '';
            
            // Replace iframe content with login page
            iframe.src = `vat_return_login.html?pan=${encodeURIComponent(pan)}&submissionNo=${encodeURIComponent(submissionNo)}`;
            
            console.log('Loading VAT return login page for verification');
        }
    });
    
    iframeContainer.appendChild(closeBtn);
    iframeContainer.appendChild(iframe);
    modalOverlay.appendChild(iframeContainer);
    document.body.appendChild(modalOverlay);
}
