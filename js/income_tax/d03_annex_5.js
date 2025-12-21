// D03 Annex 5 - Business Income Details
document.addEventListener('DOMContentLoaded', function() {
    loadFormData();
    setupEventListeners();
    checkSavedData();
});

// Check if data is already saved and toggle buttons accordingly
function checkSavedData() {
    const savedData = localStorage.getItem('d03_annex5_data');
    if (savedData) {
        toggleButtons(true);
    } else {
        toggleButtons(false);
    }
}

// Load saved form data
function loadFormData() {
    const savedData = localStorage.getItem('d03_annex5_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        populateForm(data);
    }
    
    // Load taxpayer info from main form
    loadTaxpayerInfo();
}

// Load taxpayer information
function loadTaxpayerInfo() {
    const d03Data = localStorage.getItem('d03_return_data');
    if (d03Data) {
        const data = JSON.parse(d03Data);
        document.getElementById('fiscalYear').value = data.fiscalYear || '';
        document.getElementById('iro').value = data.iro || '';
        document.getElementById('pan').value = data.pan || '';
        document.getElementById('taxpayerName').value = data.taxpayerName || '';
    }
}

// Populate form with data
function populateForm(data) {
    // Tax information
    if (data.taxType) document.getElementById('taxType').value = data.taxType;
    if (data.taxRate) document.getElementById('taxRate').value = data.taxRate;
    if (data.foreignCountry) document.getElementById('foreignCountry').value = data.foreignCountry;
    
    // Inclusion section (IN)
    for (let i = 1; i <= 16; i++) {
        if (data['in' + i]) {
            document.getElementById('in' + i).value = data['in' + i];
        }
    }
    
    // Deduction section (DE)
    for (let i = 1; i <= 9; i++) {
        if (data['de' + i]) {
            document.getElementById('de' + i).value = data['de' + i];
        }
    }
    
    // Deductible Loss section (DL)
    if (data.dl1) document.getElementById('dl1').value = data.dl1;
    if (data.dl2) document.getElementById('dl2').value = data.dl2;
    
    // Miscellaneous Inclusion (MI)
    if (data.mi1) document.getElementById('mi1').value = data.mi1;
    
    // Discount
    if (data.discountReason) document.getElementById('discountReason').value = data.discountReason;
    if (data.discountPercent) document.getElementById('discountPercent').value = data.discountPercent;
    
    // Recalculate all totals
    calculateInTotal();
    calculateDeTotal();
    calculateDlTotal();
    calculateMiTotal();
}

// Setup event listeners
function setupEventListeners() {
    // Tax type change event - auto-populate tax rate
    const taxTypeSelect = document.getElementById('taxType');
    if (taxTypeSelect) {
        taxTypeSelect.addEventListener('change', function() {
            updateTaxRate(this.value);
        });
    }
    
    // Number input formatting
    const numberInputs = document.querySelectorAll('.number-input');
    numberInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value) {
                this.value = parseFloat(this.value.replace(/,/g, '')).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        });
        
        input.addEventListener('focus', function() {
            this.value = this.value.replace(/,/g, '');
        });
    });
}

// Update tax rate based on selected tax type
function updateTaxRate(taxTypeValue) {
    const taxRateMap = {
        '1': '10',   // बचत तथा ऋणको कारोबार गर्ने सहकारी संस्था नगरपालिकाका क्षेत्रभित्र सञ्चालन भएकोमा
        '2': '15',   // बचत तथा ऋणको कारोबार गर्ने सहकारी संस्था उपमहानगरपालिकाका क्षेत्रभित्र सञ्चालन भएकोमा
        '3': '7',    // सहकारी ऐन ७४ बमोजिम दर्ता भएको उपमहानगरपालिका क्षेत्रका सहकारी संस्था (बचत तथा ऋण बाहेक)
        '4': '5',    // सहकारी ऐन ७४ बमोजिम दर्ता भएको नगरपालिका क्षेत्रका सहकारी संस्था (बचत तथा ऋण बाहेक)
        '5': '20',   // बचत तथा ऋणको कारोबार गर्ने सहकारी संस्था महानगरपालिका क्षेत्रभित्र सञ्चालन भएकोमा
        '6': '10',   // सहकारी ऐन ७४ बमोजिम दर्ता भएको महानगरपालिका क्षेत्रका सहकारी संस्था (बचत तथा ऋण बाहेक)
        '7': '30',   // बैंक, वित्तीय संस्था, सामान्य बीमा व्यवसाय, etc.
        '8': '5',    // नेपालस्थित विदेशी स्थायी संस्थामाथि विदेशमा पठाएको आय
        '9': '5',    // दफा ७० अन्तर्गतका गैर बासिन्दा व्यक्ति
        '10': '25',  // साधारण व्यवसाय (निकाय)
        '11': '20',  // ट्रस्ट (अनुसूची १ को २(५))
        '12': '2',   // दफा ७० अन्तर्गतका तर जल तथा हवाई यातायात वा दूर सञ्चार सेवा उपलब्ध गराउने गैर बासिन्दा व्यक्ति
        '13': '20',  // सार्वजनिक गुठी अन्तर्गत दर्ता भई सञ्चालित विद्यालय महाविद्यालय
        '14': '20'   // ऐक्यका दफा ९२ मा उल्लिखित विशेष उद्योग संचालनमा वर्ष भरी संलग्न
    };
    
    const taxRateInput = document.getElementById('taxRate');
    if (taxRateInput && taxTypeValue && taxRateMap[taxTypeValue]) {
        taxRateInput.value = taxRateMap[taxTypeValue] + '%';
    } else if (taxRateInput) {
        taxRateInput.value = '';
    }
}

// Calculate Inclusion Total (IN)
function calculateInTotal() {
    let total = 0;
    for (let i = 1; i <= 16; i++) {
        const value = parseFloat(document.getElementById('in' + i).value.replace(/,/g, '') || 0);
        total += value;
    }
    document.getElementById('inTotal').value = total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateBusinessIncome();
}

// Calculate Deduction Total (DE)
function calculateDeTotal() {
    let total = 0;
    
    // DE1-DE9
    for (let i = 1; i <= 9; i++) {
        const value = parseFloat(document.getElementById('de' + i).value.replace(/,/g, '') || 0);
        total += value;
    }
    
    document.getElementById('deTotal').value = total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateTotalDeduction();
}

// Calculate Deductible Loss Total (DL)
function calculateDlTotal() {
    const dl1 = parseFloat(document.getElementById('dl1').value.replace(/,/g, '') || 0);
    const dl2 = parseFloat(document.getElementById('dl2').value.replace(/,/g, '') || 0);
    
    const dlSubTotal = dl1 + dl2;
    document.getElementById('dlSubTotal').value = dlSubTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateTotalDeduction();
}

// Calculate Total Deduction (DE Total + DL SubTotal)
function calculateTotalDeduction() {
    const deTotal = parseFloat(document.getElementById('deTotal').value.replace(/,/g, '') || 0);
    const dlSubTotal = parseFloat(document.getElementById('dlSubTotal').value.replace(/,/g, '') || 0);
    
    const totalDeduction = deTotal + dlSubTotal;
    document.getElementById('totalDeduction').value = totalDeduction.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateBusinessIncome();
}

// Calculate Business Income (IN Total - Total Deduction)
function calculateBusinessIncome() {
    const inTotal = parseFloat(document.getElementById('inTotal').value.replace(/,/g, '') || 0);
    const totalDeduction = parseFloat(document.getElementById('totalDeduction').value.replace(/,/g, '') || 0);
    
    const businessIncome = inTotal - totalDeduction;
    document.getElementById('businessIncome').value = businessIncome.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    calculateMiTotal();
}

// Calculate Miscellaneous Inclusion Total (MI)
function calculateMiTotal() {
    const businessIncome = parseFloat(document.getElementById('businessIncome').value.replace(/,/g, '') || 0);
    const mi1 = parseFloat(document.getElementById('mi1').value.replace(/,/g, '') || 0);
    
    const miTotal = businessIncome + mi1;
    document.getElementById('miTotal').value = miTotal.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Save Annex 5 data
function saveAnnex5() {
    // Validate required field
    const taxType = document.getElementById('taxType').value;
    if (!taxType || taxType === '') {
        showAlertModal('कृपया "करको किसिम" छान्नुहोस्।\n(Please select Tax Type)');
        return;
    }
    
    const data = {
        taxType: taxType,
        taxRate: document.getElementById('taxRate').value,
        foreignCountry: document.getElementById('foreignCountry').value,
        
        // Inclusion (IN)
        in1: document.getElementById('in1').value,
        in2: document.getElementById('in2').value,
        in3: document.getElementById('in3').value,
        in4: document.getElementById('in4').value,
        in5: document.getElementById('in5').value,
        in6: document.getElementById('in6').value,
        in7: document.getElementById('in7').value,
        in8: document.getElementById('in8').value,
        in9: document.getElementById('in9').value,
        in10: document.getElementById('in10').value,
        in11: document.getElementById('in11').value,
        in12: document.getElementById('in12').value,
        in13: document.getElementById('in13').value,
        in14: document.getElementById('in14').value,
        in15: document.getElementById('in15').value,
        in16: document.getElementById('in16').value,
        inTotal: document.getElementById('inTotal').value,
        
        // Deduction (DE)
        de1: document.getElementById('de1').value,
        de2: document.getElementById('de2').value,
        de3: document.getElementById('de3').value,
        de4: document.getElementById('de4').value,
        de5: document.getElementById('de5').value,
        de6: document.getElementById('de6').value,
        de7: document.getElementById('de7').value,
        de8: document.getElementById('de8').value,
        de9: document.getElementById('de9').value,
        deTotal: document.getElementById('deTotal').value,
        
        // Deductible Loss (DL)
        dl1: document.getElementById('dl1').value,
        dl2: document.getElementById('dl2').value,
        dlSubTotal: document.getElementById('dlSubTotal').value,
        totalDeduction: document.getElementById('totalDeduction').value,
        businessIncome: document.getElementById('businessIncome').value,
        
        // Miscellaneous Inclusion (MI)
        mi1: document.getElementById('mi1').value,
        miTotal: document.getElementById('miTotal').value,
        
        // Discount
        discountReason: document.getElementById('discountReason').value,
        discountPercent: document.getElementById('discountPercent').value,
        
        saved: true,
        savedDate: new Date().toISOString()
    };
    
    localStorage.setItem('d03_annex5_data', JSON.stringify(data));
    
    // Show Annex-2 section after saving Annex-5
    localStorage.setItem('d03_show_annex2', '1');
    
    // Update main D03 form with business income
    updateMainForm();
    
    // Show success modal and switch to update/delete buttons
    showSuccessModal();
    toggleButtons(true);
}

// Update Annex 5 data
function updateAnnex5() {
    // Validate required field
    const taxType = document.getElementById('taxType').value;
    if (!taxType || taxType === '') {
        showAlertModal('कृपया "करको किसिम" छान्नुहोस्।\n(Please select Tax Type)');
        return;
    }
    
    const data = {
        taxType: taxType,
        taxRate: document.getElementById('taxRate').value,
        foreignCountry: document.getElementById('foreignCountry').value,
        
        // Inclusion (IN)
        in1: document.getElementById('in1').value,
        in2: document.getElementById('in2').value,
        in3: document.getElementById('in3').value,
        in4: document.getElementById('in4').value,
        in5: document.getElementById('in5').value,
        in6: document.getElementById('in6').value,
        in7: document.getElementById('in7').value,
        in8: document.getElementById('in8').value,
        in9: document.getElementById('in9').value,
        in10: document.getElementById('in10').value,
        in11: document.getElementById('in11').value,
        in12: document.getElementById('in12').value,
        in13: document.getElementById('in13').value,
        in14: document.getElementById('in14').value,
        in15: document.getElementById('in15').value,
        in16: document.getElementById('in16').value,
        inTotal: document.getElementById('inTotal').value,
        
        // Deduction (DE)
        de1: document.getElementById('de1').value,
        de2: document.getElementById('de2').value,
        de3: document.getElementById('de3').value,
        de4: document.getElementById('de4').value,
        de5: document.getElementById('de5').value,
        de6: document.getElementById('de6').value,
        de7: document.getElementById('de7').value,
        de8: document.getElementById('de8').value,
        de9: document.getElementById('de9').value,
        deTotal: document.getElementById('deTotal').value,
        
        // Deductible Loss (DL)
        dl1: document.getElementById('dl1').value,
        dl2: document.getElementById('dl2').value,
        dlSubTotal: document.getElementById('dlSubTotal').value,
        totalDeduction: document.getElementById('totalDeduction').value,
        businessIncome: document.getElementById('businessIncome').value,
        
        // Miscellaneous Inclusion (MI)
        mi1: document.getElementById('mi1').value,
        miTotal: document.getElementById('miTotal').value,
        
        // Discount
        discountReason: document.getElementById('discountReason').value,
        discountPercent: document.getElementById('discountPercent').value,
        
        saved: true,
        savedDate: new Date().toISOString()
    };
    
    localStorage.setItem('d03_annex5_data', JSON.stringify(data));
    
    // Show Annex-2 section after saving Annex-5
    localStorage.setItem('d03_show_annex2', '1');
    
    // Update main D03 form with business income
    updateMainForm();
    
    showAlertModal('अनुसूची -५ को डाटा अद्यावधिक भयो।\n(Annex-5 data updated successfully.).');
}

// Update main D03 form with calculated business income
function updateMainForm() {
    const miTotal = parseFloat(document.getElementById('miTotal').value.replace(/,/g, '') || 0);
    
    // Store business income for main form
    const mainFormData = localStorage.getItem('d03_return_data');
    if (mainFormData) {
        const data = JSON.parse(mainFormData);
        data.businessIncome = miTotal;
        data.annex5Completed = true;
        localStorage.setItem('d03_return_data', JSON.stringify(data));
    }
}

// Delete Annex 5 data
function deleteAnnex5() {
    if (confirm('के तपाईं अनुसूची -५ को डाटा मेटाउन चाहनुहुन्छ?\n(Do you want to delete Annex-5 data?)')) {
        localStorage.removeItem('d03_annex5_data');
        
        // Clear all form fields
        document.getElementById('taxType').value = '';
        document.getElementById('taxRate').value = '';
        document.getElementById('foreignCountry').value = '';
        
        // Clear all input fields
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => {
            if (!input.disabled) {
                input.value = '';
            }
        });
        
        document.getElementById('discountReason').value = '';
        
        showAlertModal('अनुसूची -५ को डाटा मेटाइयो।\n(Annex-5 data deleted.)');
        toggleButtons(false);
    }
}

// Toggle between Save and Update/Delete buttons
function toggleButtons(saved) {
    const saveBtn = document.getElementById('saveBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const updateBtn = document.getElementById('updateBtn');
    
    if (saved) {
        saveBtn.style.display = 'none';
        deleteBtn.style.display = 'inline-block';
        updateBtn.style.display = 'inline-block';
    } else {
        saveBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'none';
        updateBtn.style.display = 'none';
    }
}

// Go back to set annex page
function goBackToSetAnnex() {
    // Show confirmation modal
    document.getElementById('confirmModal').classList.add('active');
}

// Close confirmation modal
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

// Confirm and go back
function confirmGoBack() {
    closeConfirmModal();
    window.location.href = 'd03_set_annex.html';
}

// Detail popup functions (placeholders for future implementation)
function addInterestDetails() {
    alert('Interest details form will open here.\nThis will be implemented in detail entry module.');
    // TODO: Open modal/popup for detailed interest entry
}

function addTradingStockDetails() {
    alert('Trading stock details form will open here.\nThis will be implemented in detail entry module.');
    // TODO: Open modal/popup for trading stock details
}

// Interest Details Modal Functions
function addInterestDetails() {
    // Load saved interest details if any
    const savedData = localStorage.getItem('d03_annex5_interest_details');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('interest1').value = data.interest1 || '';
        document.getElementById('interest2').value = data.interest2 || '';
        document.getElementById('interest3').value = data.interest3 || '';
        calculateInterestTotal();
    }
    
    // Show modal
    document.getElementById('interestModal').classList.add('active');
}

function closeInterestModal() {
    document.getElementById('interestModal').classList.remove('active');
}

function calculateInterestTotal() {
    const interest1 = parseFloat(document.getElementById('interest1').value.replace(/,/g, '') || 0);
    const interest2 = parseFloat(document.getElementById('interest2').value.replace(/,/g, '') || 0);
    const interest3 = parseFloat(document.getElementById('interest3').value.replace(/,/g, '') || 0);
    
    const total = interest1 + interest2 + interest3;
    document.getElementById('interestTotal').value = total.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function checkInterestTotal() {
    calculateInterestTotal();
    const total = document.getElementById('interestTotal').value;
    alert('जम्मा रकम: ' + total);
}

function saveInterestDetails() {
    // Calculate total
    calculateInterestTotal();
    
    // Get the total value
    const totalValue = document.getElementById('interestTotal').value;
    
    // Update the main form field
    document.getElementById('de1').value = totalValue;
    
    // Save interest details to localStorage
    const interestData = {
        interest1: document.getElementById('interest1').value,
        interest2: document.getElementById('interest2').value,
        interest3: document.getElementById('interest3').value,
        total: totalValue
    };
    localStorage.setItem('d03_annex5_interest_details', JSON.stringify(interestData));
    
    // Recalculate deduction total
    calculateDeTotal();
    
    // Close modal
    closeInterestModal();
}

// Trading Stock Details Modal Functions
function addTradingStockDetails() {
    // Load saved trading stock details if any
    const savedData = localStorage.getItem('d03_annex5_trading_stock_details');
    if (savedData) {
        const data = JSON.parse(savedData);
        for (let i = 1; i <= 8; i++) {
            document.getElementById('tradingStock' + i).value = data['tradingStock' + i] || '';
        }
        calculateTradingStockTotal();
    }
    
    // Show modal
    document.getElementById('tradingStockModal').classList.add('active');
}

function closeTradingStockModal() {
    document.getElementById('tradingStockModal').classList.remove('active');
}

function calculateTradingStockTotal() {
    // Calculate 19.6 (जम्मा खर्च) = sum of 19.1 to 19.5
    const ts1 = parseFloat(document.getElementById('tradingStock1').value.replace(/,/g, '') || 0);
    const ts2 = parseFloat(document.getElementById('tradingStock2').value.replace(/,/g, '') || 0);
    const ts3 = parseFloat(document.getElementById('tradingStock3').value.replace(/,/g, '') || 0);
    const ts4 = parseFloat(document.getElementById('tradingStock4').value.replace(/,/g, '') || 0);
    const ts5 = parseFloat(document.getElementById('tradingStock5').value.replace(/,/g, '') || 0);
    
    const total19_6 = ts1 + ts2 + ts3 + ts4 + ts5;
    document.getElementById('tradingStock6').value = total19_6.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // Calculate 19.8 (कुल लागत खर्च) = 19.6 - 19.7
    const ts7 = parseFloat(document.getElementById('tradingStock7').value.replace(/,/g, '') || 0);
    const total19_8 = total19_6 - ts7;
    document.getElementById('tradingStock8').value = total19_8.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function saveTradingStockDetails() {
    // Get the value from field 19.8 (कुल लागत खर्च)
    const totalValue = document.getElementById('tradingStock8').value;
    
    // Update the main form field
    document.getElementById('de2').value = totalValue;
    
    // Save trading stock details to localStorage
    const tradingStockData = {};
    for (let i = 1; i <= 8; i++) {
        tradingStockData['tradingStock' + i] = document.getElementById('tradingStock' + i).value;
    }
    localStorage.setItem('d03_annex5_trading_stock_details', JSON.stringify(tradingStockData));
    
    // Recalculate deduction total
    calculateDeTotal();
    
    // Close modal
    closeTradingStockModal();
}

// Repairs and Improvements Modal Functions
function addRepairDetails() {
    // Load saved repair details if any
    const savedData = localStorage.getItem('d03_annex5_repair_details');
    if (savedData) {
        const data = JSON.parse(savedData);
        // Load row 1 (वास्तविक मर्मत सुधार खर्च)
        for (let i = 1; i <= 5; i++) {
            document.getElementById('repair1_' + i).value = data['repair1_' + i] || '';
        }
        // Load row 2 (सिमा क्तोकिएको मर्मत सुधार खर्च)
        for (let i = 1; i <= 5; i++) {
            document.getElementById('repair2_' + i).value = data['repair2_' + i] || '';
        }
        // Load row 4 (निलान नभएको मर्मत खर्च)
        for (let i = 1; i <= 5; i++) {
            document.getElementById('repair4_' + i).value = data['repair4_' + i] || '';
        }
        // Load row 5 (समूह ङ को मर्मत खर्च)
        document.getElementById('repair5_5').value = data['repair5_5'] || '';
        
        // Calculate all rows
        calculateRepairRow(1);
        calculateRepairRow(2);
        calculateRepairRow(4);
        calculateRepairRow(5);
    }
    
    // Show modal
    document.getElementById('repairModal').classList.add('active');
}

function closeRepairModal() {
    document.getElementById('repairModal').classList.remove('active');
}

function calculateRepairRow(rowNum) {
    if (rowNum === 1 || rowNum === 2) {
        // Calculate row total
        let total = 0;
        for (let i = 1; i <= 5; i++) {
            const value = parseFloat(document.getElementById('repair' + rowNum + '_' + i).value.replace(/,/g, '') || 0);
            total += value;
        }
        document.getElementById('repair' + rowNum + '_total').value = total.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        // Recalculate row 3 (जम्मा मर्मत खर्च) = row 1 + row 2
        calculateRepairRow3();
    } else if (rowNum === 4) {
        // Calculate row 4 total
        let total = 0;
        for (let i = 1; i <= 5; i++) {
            const value = parseFloat(document.getElementById('repair4_' + i).value.replace(/,/g, '') || 0);
            total += value;
        }
        document.getElementById('repair4_total').value = total.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    } else if (rowNum === 5) {
        // Calculate row 5 total (only column 5)
        const value = parseFloat(document.getElementById('repair5_5').value.replace(/,/g, '') || 0);
        document.getElementById('repair5_total').value = value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}

function calculateRepairRow3() {
    // Row 3 (जम्मा मर्मत खर्च) = Row 1 + Row 2 for each column
    for (let i = 1; i <= 5; i++) {
        const row1 = parseFloat(document.getElementById('repair1_' + i).value.replace(/,/g, '') || 0);
        const row2 = parseFloat(document.getElementById('repair2_' + i).value.replace(/,/g, '') || 0);
        const total = row1 + row2;
        document.getElementById('repair3_' + i).value = total.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    // Calculate row 3 total
    let grandTotal = 0;
    for (let i = 1; i <= 5; i++) {
        const value = parseFloat(document.getElementById('repair3_' + i).value.replace(/,/g, '') || 0);
        grandTotal += value;
    }
    document.getElementById('repair3_total').value = grandTotal.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function saveRepairDetails() {
    // Get the total value from row 3 (जम्मा मर्मत खर्च)
    const totalValue = document.getElementById('repair3_total').value;
    
    // Update the main form field
    document.getElementById('de3').value = totalValue;
    
    // Save repair details to localStorage
    const repairData = {};
    // Save row 1
    for (let i = 1; i <= 5; i++) {
        repairData['repair1_' + i] = document.getElementById('repair1_' + i).value;
    }
    // Save row 2
    for (let i = 1; i <= 5; i++) {
        repairData['repair2_' + i] = document.getElementById('repair2_' + i).value;
    }
    // Save row 4
    for (let i = 1; i <= 5; i++) {
        repairData['repair4_' + i] = document.getElementById('repair4_' + i).value;
    }
    // Save row 5
    repairData['repair5_5'] = document.getElementById('repair5_5').value;
    
    localStorage.setItem('d03_annex5_repair_details', JSON.stringify(repairData));
    
    // Recalculate deduction total
    calculateDeTotal();
    
    // Close modal
    closeRepairModal();
}

// Depreciation Modal Functions
function addDepreciationDetails() {
    // Show modal first
    document.getElementById('depreciationModal').classList.add('active');
    
    // Load saved depreciation details if any
    const savedData = localStorage.getItem('d03_annex5_depreciation_details');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            // Load all input fields
            for (let row = 1; row <= 11; row++) {
                for (let col = 1; col <= 5; col++) {
                    const fieldId = 'dep' + row + '_' + col;
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.value = data[fieldId] || '';
                    }
                }
                // Load sub-rows
                if (row === 1) {
                    for (let subRow = 1; subRow <= 2; subRow++) {
                        for (let col = 1; col <= 5; col++) {
                            const fieldId = 'dep1_' + subRow + '_' + col;
                            const field = document.getElementById(fieldId);
                            if (field) {
                                field.value = data[fieldId] || '';
                            }
                        }
                    }
                }
                // Load checkboxes for row 6.1
                if (row === 6) {
                    for (let col = 1; col <= 4; col++) {
                        const fieldId = 'dep6_1_' + col;
                        const field = document.getElementById(fieldId);
                        if (field) {
                            field.checked = data[fieldId] || false;
                        }
                    }
                }
            }
            calculateDepreciation();
        } catch (e) {
            console.error('Error loading depreciation data:', e);
        }
    }
}

function closeDepreciationModal() {
    document.getElementById('depreciationModal').classList.remove('active');
}

function calculateDepreciation() {
    // Calculate row 1.1 total (ह्रास आधारमा थपघट)
    let row1_1_total = 0;
    for (let i = 1; i <= 5; i++) {
        const val = parseFloat(document.getElementById('dep1_1_' + i).value.replace(/,/g, '') || 0);
        row1_1_total += val;
    }
    document.getElementById('dep1_1_total').value = row1_1_total.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    
    // Calculate row 1.2 (यो वर्ष कायम हुने शुरु ह्रास आधार) = row 1 + row 1.1
    for (let i = 1; i <= 5; i++) {
        const row1 = parseFloat(document.getElementById('dep1_' + i).value.replace(/,/g, '') || 0);
        const row1_1 = parseFloat(document.getElementById('dep1_1_' + i).value.replace(/,/g, '') || 0);
        const total = row1 + row1_1;
        document.getElementById('dep1_2_' + i).value = total.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }
    
    // Calculate row 1.2 total
    let row1_2_total = 0;
    for (let i = 1; i <= 5; i++) {
        const val = parseFloat(document.getElementById('dep1_2_' + i).value.replace(/,/g, '') || 0);
        row1_2_total += val;
    }
    document.getElementById('dep1_2_total').value = row1_2_total.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    
    // Calculate totals for rows 2-10
    for (let row = 2; row <= 10; row++) {
        let rowTotal = 0;
        const maxCol = (row === 5 || row === 6 || row === 8 || row === 9) ? 4 : 5;
        for (let i = 1; i <= maxCol; i++) {
            const val = parseFloat(document.getElementById('dep' + row + '_' + i).value.replace(/,/g, '') || 0);
            rowTotal += val;
        }
        if (document.getElementById('dep' + row + '_total')) {
            document.getElementById('dep' + row + '_total').value = rowTotal.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
        }
    }
    
    // Calculate row 11 (समूह ङ को कुल जम्मा)
    // This would typically be calculated based on specific depreciation rules
    // For now, just sum the relevant fields
    const dep11_5_value = parseFloat(document.getElementById('dep1_2_5').value.replace(/,/g, '') || 0);
    document.getElementById('dep11_5').value = dep11_5_value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
    document.getElementById('dep11_total').value = dep11_5_value.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0});
}

function saveDepreciationDetails() {
    // Get the total depreciation value (you may need to adjust which field to use)
    const totalValue = document.getElementById('dep11_total').value;
    
    // Update the main form field
    document.getElementById('de4').value = totalValue;
    
    // Save depreciation details to localStorage
    const depData = {};
    for (let row = 1; row <= 11; row++) {
        for (let col = 1; col <= 5; col++) {
            const fieldId = 'dep' + row + '_' + col;
            if (document.getElementById(fieldId)) {
                depData[fieldId] = document.getElementById(fieldId).value;
            }
        }
        // Save sub-rows
        if (row === 1) {
            for (let subRow = 1; subRow <= 2; subRow++) {
                for (let col = 1; col <= 5; col++) {
                    const fieldId = 'dep1_' + subRow + '_' + col;
                    if (document.getElementById(fieldId)) {
                        depData[fieldId] = document.getElementById(fieldId).value;
                    }
                }
            }
        }
        // Save checkboxes for row 6.1
        if (row === 6) {
            for (let col = 1; col <= 4; col++) {
                const fieldId = 'dep6_1_' + col;
                if (document.getElementById(fieldId)) {
                    depData[fieldId] = document.getElementById(fieldId).checked;
                }
            }
        }
    }
    
    localStorage.setItem('d03_annex5_depreciation_details', JSON.stringify(depData));
    
    // Recalculate deduction total
    calculateDeTotal();
    
    // Close modal
    closeDepreciationModal();
}

function printDepreciationReport() {
    alert('Print Report functionality will be implemented.');
    // TODO: Implement print report
}

// Other Expense Modal Functions
function addOtherExpenseDetails() {
    // Load saved other expense details if any
    const savedData = localStorage.getItem('d03_annex5_other_expense_details');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('other1').value = data.other1 || '';
        document.getElementById('other2').value = data.other2 || '';
        document.getElementById('other3').value = data.other3 || '';
        document.getElementById('other4').value = data.other4 || '';
        calculateOtherExpenseTotal();
    }
    
    // Show modal
    document.getElementById('otherExpenseModal').classList.add('active');
}

function closeOtherExpenseModal() {
    document.getElementById('otherExpenseModal').classList.remove('active');
}

function calculateOtherExpenseTotal() {
    const other1 = parseFloat(document.getElementById('other1').value.replace(/,/g, '') || 0);
    const other2 = parseFloat(document.getElementById('other2').value.replace(/,/g, '') || 0);
    const other3 = parseFloat(document.getElementById('other3').value.replace(/,/g, '') || 0);
    const other4 = parseFloat(document.getElementById('other4').value.replace(/,/g, '') || 0);
    
    const total = other1 + other2 + other3 + other4;
    document.getElementById('otherExpenseTotal').value = total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function checkOtherExpenseTotal() {
    calculateOtherExpenseTotal();
    const total = document.getElementById('otherExpenseTotal').value;
    alert('जम्मा रकम: ' + total);
}

function saveOtherExpenseDetails() {
    // Calculate total
    calculateOtherExpenseTotal();
    
    // Get the total value
    const totalValue = document.getElementById('otherExpenseTotal').value;
    
    // Update the main form field (DE9 - Others than mentioned)
    document.getElementById('de9').value = totalValue;
    
    // Save other expense details to localStorage
    const otherExpenseData = {
        other1: document.getElementById('other1').value,
        other2: document.getElementById('other2').value,
        other3: document.getElementById('other3').value,
        other4: document.getElementById('other4').value,
        total: totalValue
    };
    localStorage.setItem('d03_annex5_other_expense_details', JSON.stringify(otherExpenseData));
    
    // Recalculate deduction total
    calculateDeTotal();
    
    // Close modal
    closeOtherExpenseModal();
}

// Carried Forward Loss Modal Functions
function addCarriedForwardLoss() {
    // Load saved carried forward loss details if any
    const savedData = localStorage.getItem('d03_annex5_carried_forward_loss_details');
    if (savedData) {
        const data = JSON.parse(savedData);
        for (let i = 1; i <= 10; i++) {
            document.getElementById('loss' + i).value = data['loss' + i] || '';
        }
        calculateCarriedForwardLossTotal();
    }
    
    // Show modal
    document.getElementById('carriedForwardLossModal').classList.add('active');
}

function closeCarriedForwardLossModal() {
    document.getElementById('carriedForwardLossModal').classList.remove('active');
}

function calculateCarriedForwardLossTotal() {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
        const value = parseFloat(document.getElementById('loss' + i).value.replace(/,/g, '') || 0);
        total += value;
    }
    document.getElementById('carriedForwardLossTotal').value = total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function checkCarriedForwardLossTotal() {
    calculateCarriedForwardLossTotal();
    const total = document.getElementById('carriedForwardLossTotal').value;
    alert('जम्मा रकम: ' + total);
}

function saveCarriedForwardLossDetails() {
    // Calculate total
    calculateCarriedForwardLossTotal();
    
    // Get the total value
    const totalValue = document.getElementById('carriedForwardLossTotal').value;
    
    // Update the main form field (DL2 - Carried forward loss)
    document.getElementById('dl2').value = totalValue;
    
    // Save carried forward loss details to localStorage
    const lossData = {};
    for (let i = 1; i <= 10; i++) {
        lossData['loss' + i] = document.getElementById('loss' + i).value;
    }
    lossData.total = totalValue;
    localStorage.setItem('d03_annex5_carried_forward_loss_details', JSON.stringify(lossData));
    
    // Recalculate deductible loss total
    calculateDlTotal();
    
    // Close modal
    closeCarriedForwardLossModal();
}

// Alert Modal Functions
function showAlertModal(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alertModal').classList.add('active');
}

function closeAlertModal() {
    document.getElementById('alertModal').classList.remove('active');
}

// Success Modal Functions
function showSuccessModal() {
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}
