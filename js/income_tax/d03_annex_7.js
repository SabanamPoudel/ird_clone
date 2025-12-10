// d03_annex_7.js
// Annex 7 - Investment Income Calculation Details

// Close Annex 7 and return to main form
function closeAnnex7() {
    window.location.href = 'd03_return_entry.html';
}

// Load Annex 7 data when iframe loads
window.addEventListener('load', function() {
    const iframe = document.getElementById('annex7Frame');
    
    if (iframe) {
        iframe.addEventListener('load', function() {
            loadAnnex7Data();
        });
    }

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
        if (event.data.type === 'saveAnnex7') {
            saveAnnex7(event.data.data);
        } else if (event.data.type === 'deleteAnnex7') {
            deleteAnnex7();
        } else if (event.data.type === 'goBackToSetAnnex') {
            goBackToSetAnnex();
        } else if (event.data.type === 'requestAnnex7Data') {
            loadAnnex7Data();
        }
    });
});

// Load Annex 7 data from localStorage
function loadAnnex7Data() {
    const iframe = document.getElementById('annex7Frame');
    if (!iframe || !iframe.contentWindow) return;

    const savedData = localStorage.getItem('annex7_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            iframe.contentWindow.postMessage({
                type: 'loadData',
                data: data
            }, '*');
        } catch (e) {
            console.error('Error loading Annex 7 data:', e);
        }
    }
}

// Save Annex 7 data to localStorage
function saveAnnex7(data) {
    try {
        localStorage.setItem('annex7_data', JSON.stringify(data));
        alert('डाटा सफलतापूर्वक सुरक्षित गरियो। (Data saved successfully.)');
        
        // Update delete button visibility
        const iframe = document.getElementById('annex7Frame');
        if (iframe && iframe.contentWindow) {
            const deleteBtn = iframe.contentWindow.document.getElementById('deleteBtn');
            if (deleteBtn) {
                deleteBtn.style.display = 'inline-block';
            }
        }
    } catch (e) {
        console.error('Error saving Annex 7 data:', e);
        alert('डाटा सुरक्षित गर्न त्रुटि भयो। (Error saving data.)');
    }
}

// Delete Annex 7 data from localStorage
function deleteAnnex7() {
    try {
        localStorage.removeItem('annex7_data');
        alert('डाटा सफलतापूर्वक मेटियो। (Data deleted successfully.)');
        
        // Reload the iframe to clear all fields
        const iframe = document.getElementById('annex7Frame');
        if (iframe) {
            iframe.src = iframe.src;
        }
    } catch (e) {
        console.error('Error deleting Annex 7 data:', e);
        alert('डाटा मेट्न त्रुटि भयो। (Error deleting data.)');
    }
}

// Navigate back to set annex page
function goBackToSetAnnex() {
    // Check if there's unsaved data
    const iframe = document.getElementById('annex7Frame');
    if (iframe && iframe.contentWindow) {
        // Could add unsaved changes check here if needed
        window.location.href = 'd03_set_annex.html';
    }
}
