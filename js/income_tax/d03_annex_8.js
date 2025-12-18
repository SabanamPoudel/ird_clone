// d03_annex_8.js - Handler for Annex-8

// Listen for messages from iframe
window.addEventListener('message', function(event) {
    if (event.data.type === 'annex8Saved') {
        // Handle any parent page updates if needed
        console.log('Annex-8 data saved successfully');
    }
});

// Function to close the annex and return to set annex page
function closeAnnex8() {
    window.location.href = 'd03_set_annex.html';
}
