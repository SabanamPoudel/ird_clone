// Payment Voucher Print Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get data from URL parameters or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const voucherData = getVoucherData(urlParams);
    
    if (voucherData) {
        populateVoucher(voucherData);
    } else {
        console.error('No voucher data found');
        alert('No payment data found. Please generate a transaction code first.');
    }
});

// Get voucher data from URL parameters or sessionStorage
function getVoucherData(urlParams) {
    // Try to get from URL parameters first
    const dataParam = urlParams.get('data');
    if (dataParam) {
        try {
            return JSON.parse(decodeURIComponent(dataParam));
        } catch (e) {
            console.error('Error parsing URL data:', e);
        }
    }
    
    // Try to get from sessionStorage
    const storedData = sessionStorage.getItem('voucherData');
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error('Error parsing stored data:', e);
        }
    }
    
    return null;
}

// Populate voucher with data
function populateVoucher(data) {
    // Extract only the 7-digit code from transaction code (remove year prefix)
    let voucherNumber = data.transactionCode || '88888829';
    if (voucherNumber.includes('-')) {
        voucherNumber = voucherNumber.split('-')[1].trim();
    }
    
    // First Copy
    document.getElementById('voucherDate1').textContent = data.date || getCurrentNepaliDate();
    document.getElementById('panNumber1').textContent = data.pan || '610915161';
    document.getElementById('bankName1').textContent = data.bankName || 'Rastriya Banijya Bank';
    document.getElementById('voucherNum1').textContent = voucherNumber;
    
    // Second Copy
    document.getElementById('voucherDate2').textContent = data.date || getCurrentNepaliDate();
    document.getElementById('transactionCode2').textContent = data.transactionCode || '2082 - 4026785';
    document.getElementById('panNumber2').textContent = data.pan || '610915161';
    
    // Populate payment details table in first copy
    const tbody = document.getElementById('detailsBody1');
    if (data.paymentData && data.paymentData.length > 0) {
        tbody.innerHTML = data.paymentData.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${voucherNumber}</td>
                <td>${item.taxType} ${item.revenueHead || ''}</td>
                <td class="text-right">${item.bapat || 'अग्रिम कर'}<br>${item.remarks || 'करी'}</td>
                <td>${item.amount || '225'} ${item.fiscalYear || '2081/080'}</td>
                <td>${item.remarks === 'हो' ? 'हो' : 'होइन'}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `
            <tr>
                <td>१</td>
                <td>${voucherNumber}</td>
                <td>प्रारम्भिकमा आधारित मासिक तालिक सूचना कर (११११११)</td>
                <td class="text-right">अग्रिम कर<br>करी</td>
                <td>२२५ २०८१/०८०</td>
                <td>हो</td>
            </tr>
        `;
    }
    
    // Set total amount in breakdown
    const totalAmount = data.totalAmount || 1686;
    document.getElementById('totalBreakdown1').textContent = totalAmount;
}

// Get current Nepali date
function getCurrentNepaliDate() {
    return '--/--/----';
}

// Convert number to words (simplified version)
function numberToWords(num) {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    function convertHundreds(n) {
        let str = '';
        
        if (n > 99) {
            str += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }
        
        if (n > 19) {
            str += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            str += teens[n - 10] + ' ';
            return str;
        }
        
        if (n > 0) {
            str += ones[n] + ' ';
        }
        
        return str;
    }
    
    let result = '';
    
    // Crores
    if (num >= 10000000) {
        result += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
        num %= 10000000;
    }
    
    // Lakhs
    if (num >= 100000) {
        result += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
        num %= 100000;
    }
    
    // Thousands
    if (num >= 1000) {
        result += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
        num %= 1000;
    }
    
    // Remaining hundreds, tens, and ones
    if (num > 0) {
        result += convertHundreds(num);
    }
    
    return result.trim();
}

