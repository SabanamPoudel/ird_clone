// D-02 Return Entry JavaScript

function showAdditionalFields() {
    const fiscalYear = document.getElementById('d02-fiscal-input').value;
    
    if (fiscalYear) {
        document.getElementById('transactionAmountRow').style.display = '';
        document.getElementById('profitAmountRow').style.display = '';
        document.getElementById('professionTypeRow').style.display = '';
    } else {
        document.getElementById('transactionAmountRow').style.display = 'none';
        document.getElementById('profitAmountRow').style.display = 'none';
        document.getElementById('professionTypeRow').style.display = 'none';
    }
}

function registerD02User() {
    const username = document.getElementById('d02-username-input').value.trim();
    const password = document.getElementById('d02-password-input').value.trim();
    const repassword = document.getElementById('d02-repassword-input').value.trim();
    const pan = document.getElementById('d02-pan-input').value.trim();
    const fiscalYear = document.getElementById('d02-fiscal-input').value.trim();
    const email = document.getElementById('d02-email-input').value.trim();
    const contact = document.getElementById('d02-contact-input').value.trim();
    const transactionAmt = document.getElementById('d02-transaction-input').value.trim();
    const profitAmt = document.getElementById('d02-profit-input').value.trim();
    const professionType = document.getElementById('d02-profession-input').value.trim();
    
    // Validation
    if (!username) {
        alert('कृपया प्रयोगकर्ताको नाम भर्नुहोस् । (Please enter Username)');
        return;
    }
    
    if (!password) {
        alert('कृपया पासवर्ड भर्नुहोस् । (Please enter Password)');
        return;
    }
    
    if (password !== repassword) {
        alert('पासवर्ड मिलेन । (Passwords do not match)');
        return;
    }
    
    if (!pan) {
        alert('कृपया स्थायी लेखा नम्बर भर्नुहोस् । (Please enter PAN)');
        return;
    }
    
    if (pan.length !== 9 || !/^\d+$/.test(pan)) {
        alert('स्थायी लेखा नम्बर ९ अंकको हुनुपर्छ । (PAN must be 9 digits)');
        return;
    }
    
    if (!fiscalYear) {
        alert('कृपया आर्थिक वर्ष छान्नुहोस् । (Please select Fiscal Year)');
        return;
    }
    
    if (!contact) {
        alert('कृपया सम्पर्क नम्बर भर्नुहोस् । (Please enter Contact Number)');
        return;
    }
    
    if (contact.length !== 10 || !/^\d+$/.test(contact)) {
        alert('सम्पर्क नम्बर १० अंकको हुनुपर्छ । (Contact Number must be 10 digits)');
        return;
    }
    
    if (!transactionAmt) {
        alert('कृपया कारोबार रकम भर्नुहोस् । (Please enter Transaction Amount)');
        return;
    }
    
    const transactionAmount = parseFloat(transactionAmt);
    if (transactionAmount <= 3000000) {
        alert('कारोबार रकम 30 लाख भन्दा बढी हुनुपर्छ । (Transaction Amount must be more than 30 lakhs)');
        return;
    }
    
    if (transactionAmount >= 10000000) {
        alert('कारोबार रकम 1 करोड भन्दा कम हुनुपर्छ । (Transaction Amount must be less than 1 crore)');
        return;
    }
    
    if (!profitAmt) {
        alert('कृपया नाफा रकम भर्नुहोस् । (Please enter Profit Amount)');
        return;
    }
    
    if (!professionType) {
        alert('कृपया किसिम छान्नुहोस् । (Please select Profession Type)');
        return;
    }
    
    // Generate submission number
    const timestamp = new Date().getTime();
    const submissionNo = 'D02-' + timestamp.toString().slice(-8);
    
    // Save to localStorage
    let d02Users = JSON.parse(localStorage.getItem('d02Users') || '[]');
    
    const newUser = {
        submissionNo: submissionNo,
        username: username,
        password: password,
        pan: pan,
        fiscalYear: fiscalYear,
        email: email,
        contact: contact,
        transactionAmount: transactionAmt,
        profitAmount: profitAmt,
        professionType: professionType,
        registeredDate: new Date().toISOString()
    };
    
    d02Users.push(newUser);
    localStorage.setItem('d02Users', JSON.stringify(d02Users));
    
    // Save current registration to sessionStorage
    sessionStorage.setItem('d02_current_registration', JSON.stringify({
        submissionNo: submissionNo,
        username: username,
        pan: pan,
        fiscalYear: fiscalYear,
        email: email,
        contact: contact,
        transactionAmount: transactionAmt,
        profitAmount: profitAmt,
        professionType: professionType
    }));
    
    console.log('D-02 User registered:', newUser);
    
    // Redirect to D-02 form page
    window.location.href = 'd02_form_page.html';
}

function resetD02Form() {
    document.getElementById('d02-username-input').value = '';
    document.getElementById('d02-password-input').value = '';
    document.getElementById('d02-repassword-input').value = '';
    document.getElementById('d02-pan-input').value = '';
    document.getElementById('d02-fiscal-input').value = '';
    document.getElementById('d02-email-input').value = '';
    document.getElementById('d02-contact-input').value = '';
    document.getElementById('d02-transaction-input').value = '';
    document.getElementById('d02-profit-input').value = '';
    document.getElementById('d02-profession-input').value = '';
    
    // Hide additional fields
    document.getElementById('transactionAmountRow').style.display = 'none';
    document.getElementById('profitAmountRow').style.display = 'none';
    document.getElementById('professionTypeRow').style.display = 'none';
}

function calculatePresumptiveTaxIRD() {
    // Input amounts (all 5 for demo)
    const fixedTax = 7500;
    const amounts = [5, 5, 5, 5, 5];
    const rates = [0.0025, 0.003, 0.01, 0.008, 0.02];
    const penalties = [0, 0, 0];

    // Calculate taxes for each slab
    const taxes = amounts.map((amt, i) => +(amt * rates[i]).toFixed(2));

    // Row-by-row output
    console.log('Row | Input Amount | Rate   | Tax');
    console.log('-----------------------------------');
    console.log(`1   | 5           | —     | ${fixedTax.toFixed(2)}`);
    for (let i = 0; i < amounts.length; i++) {
        console.log(`${i+1.1} | ${amounts[i]}           | ${(rates[i]*100).toFixed(2)}% | ${taxes[i].toFixed(2)}`);
    }

    // Subtotal calculations
    const totalInput = 5 + amounts.reduce((a,b) => a+b, 0); // 5 (row 1) + sum of all
    const taxSubtotal = fixedTax + taxes.reduce((a,b) => a+b, 0);
    const grandTotal = taxSubtotal + penalties.reduce((a,b) => a+b, 0);

    console.log('-----------------------------------');
    console.log(`Row 2 Total Input Amount: ${totalInput}`);
    console.log(`Tax Subtotal: ${taxSubtotal.toFixed(2)}`);
    console.log('Penalties/Interest: 0, 0, 0');
    console.log(`Grand Total (Row 8): ${grandTotal.toFixed(2)}`);

    // Exact values for IRD portal
    console.log('\nEXACT VALUES TO ENTER IN THE IRD PORTAL:');
    console.log('Row 1: Enter 5 (Tax box will show 7500.00)');
    for (let i = 0; i < amounts.length; i++) {
        console.log(`Row 1.${i+1}: Enter 5 (Tax box will show ${taxes[i].toFixed(2)})`);
    }
    console.log('Penalty/Interest: Enter 0 for all');
    console.log(`Grand Total: ${grandTotal.toFixed(2)}`);
}

function truncateIRD(num) {
    // Truncate to two decimals (IRD style)
    return Math.floor(num * 100) / 100;
}

function calculatePresumptiveTaxIRDPortal(row1, row11, row12, row13, row14, row15, penalty5 = 0, penalty6 = 0, penalty7 = 0) {
    // Input amounts
    const inputs = [row1, row11, row12, row13, row14, row15];
    const rates = [null, 0.0025, 0.003, 0.01, 0.008, 0.02];
    const fixedTax = 7500.00;
    // आयमा-जम्मा
    const totalInput = inputs.reduce((a, b) => a + b, 0);
    // Tax calculations
    const taxValues = [fixedTax];
    for (let i = 1; i < inputs.length; i++) {
        const rawTax = inputs[i] * rates[i];
        taxValues[i] = truncateIRD(rawTax);
    }
    // Tax total
    const taxTotal = taxValues.reduce((a, b) => a + b, 0);
    // Penalties/Interest
    const penalties = [penalty5, penalty6, penalty7];
    const penaltySum = penalties.reduce((a, b) => a + b, 0);
    // Final payable
    const finalPayable = truncateIRD(taxTotal + penaltySum);
    // Output
    console.log('Row | Input | Rate   | Raw Tax | Truncated Tax');
    console.log('------------------------------------------------');
    console.log(`1   | ${row1}    | —      | —      | ${fixedTax.toFixed(2)}`);
    console.log(`1.1 | ${row11}   | 0.25%  | ${(row11*0.0025).toFixed(5)} | ${taxValues[1].toFixed(2)}`);
    console.log(`1.2 | ${row12}   | 0.3%   | ${(row12*0.003).toFixed(5)} | ${taxValues[2].toFixed(2)}`);
    console.log(`1.3 | ${row13}   | 1%     | ${(row13*0.01).toFixed(5)} | ${taxValues[3].toFixed(2)}`);
    console.log(`1.4 | ${row14}   | 0.8%   | ${(row14*0.008).toFixed(5)} | ${taxValues[4].toFixed(2)}`);
    console.log(`1.5 | ${row15}   | 2%     | ${(row15*0.02).toFixed(5)} | ${taxValues[5].toFixed(2)}`);
    console.log('------------------------------------------------');
    console.log(`आयमा-जम्मा: ${totalInput.toFixed(2)}`);
    console.log(`Tax Total: ${taxTotal.toFixed(2)}`);
    console.log(`Penalties/Interest: ${penalties.join(', ')}`);
    console.log(`Final Payable (जम्मा ४+५+६+७): ${finalPayable.toFixed(2)}`);
    // IRD portal field values
    console.log('\nIRD Portal Field Values:');
    console.log(`Row 1: Enter ${row1} (Tax box: ${fixedTax.toFixed(2)})`);
    console.log(`Row 1.1: Enter ${row11} (Tax box: ${taxValues[1].toFixed(2)})`);
    console.log(`Row 1.2: Enter ${row12} (Tax box: ${taxValues[2].toFixed(2)})`);
    console.log(`Row 1.3: Enter ${row13} (Tax box: ${taxValues[3].toFixed(2)})`);
    console.log(`Row 1.4: Enter ${row14} (Tax box: ${taxValues[4].toFixed(2)})`);
    console.log(`Row 1.5: Enter ${row15} (Tax box: ${taxValues[5].toFixed(2)})`);
    console.log('Penalty/Interest: Enter 0 for all unless specified');
    console.log(`आयमा-जम्मा: ${totalInput.toFixed(2)}`);
    console.log(`Tax Total: ${taxTotal.toFixed(2)}`);
    console.log(`Final Payable: ${finalPayable.toFixed(2)}`);
}

function updatePresumptiveTaxUIIRD(row1, row11, row12, row13, row14, row15, penalty5 = 0, penalty6 = 0, penalty7 = 0) {
    // Input amounts
    const inputs = [row1, row11, row12, row13, row14, row15];
    const rates = [null, 0.0025, 0.003, 0.01, 0.008, 0.02];
    const fixedTax = 7500.00;
    // आयमा-जम्मा (left side)
    const totalInput = inputs.reduce((a, b) => a + b, 0);
    // Tax calculations
    const taxValues = [fixedTax];
    for (let i = 1; i < inputs.length; i++) {
        const rawTax = inputs[i] * rates[i];
        taxValues[i] = Math.floor(rawTax * 100) / 100;
    }
    // Tax total
    const taxTotal = taxValues.reduce((a, b) => a + b, 0);
    // Penalties/Interest
    const penalties = [penalty5, penalty6, penalty7];
    const penaltySum = penalties.reduce((a, b) => a + b, 0);
    // Final payable
    const finalPayable = Math.floor((taxTotal + penaltySum) * 100) / 100;
    // UI update (pseudo-code, replace with actual DOM update as needed)
    document.getElementById('totalInputAmountBox').value = totalInput.toFixed(2); // left side box
    document.getElementById('tax1Box').value = fixedTax.toFixed(2); // right side box for row 1
    document.getElementById('taxTotalBox').value = taxTotal.toFixed(2); // total tax box
    document.getElementById('finalPayableBox').value = finalPayable.toFixed(2); // final payable box
}

function updateInputTotalsIRD(row1, row11, row12, row13, row14, row15, penalty5 = 0, penalty6 = 0, penalty7 = 0) {
    // Input amounts
    const inputs = [row1, row11, row12, row13, row14, row15];
    // आयमा-जम्मा (left side total)
    const totalInput = inputs.reduce((a, b) => a + b, 0);
    // Penalties/Interest
    const penalties = [penalty5, penalty6, penalty7];
    const penaltySum = penalties.reduce((a, b) => a + b, 0);
    // Final input total (जम्मा (४+५+६+७))
    const finalInputTotal = totalInput + penaltySum;
    // UI update (pseudo-code, replace with actual DOM update as needed)
    document.getElementById('subtotalInputBox').value = totalInput.toFixed(2); // जम्मा (१ +१.१+१.२+१.३+१.४+१.५)
    document.getElementById('finalInputTotalBox').value = finalInputTotal.toFixed(2); // जम्मा (४+५+६+७)
}

// To run the calculation, call:
// calculatePresumptiveTaxIRD();
// calculatePresumptiveTaxIRDPortal(5, 5, 5, 5, 5, 5);

function setLeftSideSumIRD() {
    // Get input values from DOM (replace IDs with your actual input field IDs)
    const row1 = parseFloat(document.getElementById('row1Input').value) || 0;
    const row11 = parseFloat(document.getElementById('row11Input').value) || 0;
    const row12 = parseFloat(document.getElementById('row12Input').value) || 0;
    const row13 = parseFloat(document.getElementById('row13Input').value) || 0;
    const row14 = parseFloat(document.getElementById('row14Input').value) || 0;
    const row15 = parseFloat(document.getElementById('row15Input').value) || 0;
    // Calculate sum
    const totalInput = row1 + row11 + row12 + row13 + row14 + row15;
    // Update left side total field (replace with your actual field ID)
    document.getElementById('leftTotalBox').value = totalInput.toFixed(2);
}
