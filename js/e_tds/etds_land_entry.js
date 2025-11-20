// Land Entry JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadHeaderInfo();
    loadFormData();
    initializeEventHandlers();
});

// Load header information from sessionStorage
function loadHeaderInfo() {
    const submissionNo = sessionStorage.getItem('submissionNo') || '820075440572';
    const pan = sessionStorage.getItem('pan') || '610015263';
    const name = sessionStorage.getItem('withholder_name') || 'खाता विजनेश एकेडेमी प्रा.लि.';
    const dateFrom = sessionStorage.getItem('dateFrom') || '2082.07.01';
    const dateTo = sessionStorage.getItem('dateTo') || '2082.08.02';
    const dateType = sessionStorage.getItem('dateType') || 'BS';

    document.getElementById('dpfLandTran').textContent = submissionNo;
    document.getElementById('dpfLandWithPan').textContent = pan;
    document.getElementById('dpfLandWithName').textContent = name;
    document.getElementById('dpfLandFrom').textContent = dateFrom;
    document.getElementById('dpfLandTo').textContent = dateTo;
    document.getElementById('dpfLandType').textContent = dateType;
}

// Load form data
function loadFormData() {
    const submissionNo = sessionStorage.getItem('submissionNo') || '820075440572';
    const username = sessionStorage.getItem('username') || '';
    const email = sessionStorage.getItem('email') || '';
    const phone = sessionStorage.getItem('phone') || '';
    const address = sessionStorage.getItem('address') || '';
    
    document.getElementById('txtSubNo').value = submissionNo;
    document.getElementById('txtUsername').value = username || 'null';
    document.getElementById('txtEmail').value = email || 'null';
    document.getElementById('txtPhone').value = phone || 'null';
    document.getElementById('txtAddress').value = address || 'null';
    document.getElementById('txtBSFrom').value = '';
    document.getElementById('txtBSTo').value = '';
    document.getElementById('txtADFrom').value = '';
    document.getElementById('txtADTO').value = '';
}

// Initialize event handlers
function initializeEventHandlers() {
    // BS checkbox handler
    document.getElementById('chkBS').addEventListener('change', function() {
        const isChecked = this.checked;
        document.getElementById('txtBSFrom').disabled = !isChecked;
        document.getElementById('txtBSTo').disabled = !isChecked;
        
        // Toggle AD checkbox
        if (isChecked) {
            document.getElementById('chkAD').checked = false;
            document.getElementById('txtADFrom').disabled = true;
            document.getElementById('txtADTO').disabled = true;
        } else {
            // If unchecking BS, automatically check AD
            document.getElementById('chkAD').checked = true;
            document.getElementById('txtADFrom').disabled = false;
            document.getElementById('txtADTO').disabled = false;
        }
    });

    // AD checkbox handler
    document.getElementById('chkAD').addEventListener('change', function() {
        const isChecked = this.checked;
        document.getElementById('txtADFrom').disabled = !isChecked;
        document.getElementById('txtADTO').disabled = !isChecked;
        
        // Toggle BS checkbox
        if (isChecked) {
            document.getElementById('chkBS').checked = false;
            document.getElementById('txtBSFrom').disabled = true;
            document.getElementById('txtBSTo').disabled = true;
        } else {
            // If unchecking AD, automatically check BS
            document.getElementById('chkBS').checked = true;
            document.getElementById('txtBSFrom').disabled = false;
            document.getElementById('txtBSTo').disabled = false;
        }
    });

    // Update button handler
    document.getElementById('btnUpdate').addEventListener('click', function() {
        updateLandDetails();
    });
}

// Update land details
function updateLandDetails() {
    const username = document.getElementById('txtUsername').value.trim();
    const phone = document.getElementById('txtPhone').value.trim();
    
    const bsChecked = document.getElementById('chkBS').checked;
    const adChecked = document.getElementById('chkAD').checked;
    
    const dateFrom = bsChecked ? document.getElementById('txtBSFrom').value.trim() : document.getElementById('txtADFrom').value.trim();
    const dateTo = bsChecked ? document.getElementById('txtBSTo').value.trim() : document.getElementById('txtADTO').value.trim();

    // Validation
    if (!username) {
        alert('प्रयोगकर्ताको नाम आवश्यक छ।');
        return;
    }

    if (!phone) {
        alert('फोन नं. आवश्यक छ।');
        return;
    }

    if ((bsChecked || adChecked) && (!dateFrom || !dateTo)) {
        alert('कृपया मिति अन्तराल भर्नुहोस्।');
        return;
    }

    // Success message
    alert('विवरण सफलतापूर्वक अपडेट भयो।');
    
    // Clear form
    document.getElementById('txtUsername').value = '';
    document.getElementById('txtEmail').value = '';
    document.getElementById('txtPhone').value = '';
    document.getElementById('txtAddress').value = '';
    document.getElementById('txtBSFrom').value = '';
    document.getElementById('txtBSTo').value = '';
    document.getElementById('txtADFrom').value = '';
    document.getElementById('txtADTO').value = '';
}
