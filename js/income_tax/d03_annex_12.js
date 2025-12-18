// Message handler for Annex 12 iframe communication
window.addEventListener('message', function(event) {
    if (event.data.type === 'annex12Saved') {
        // Update the link visibility in parent page
        checkAnnex12Link();
    } else if (event.data.type === 'annex12Deleted') {
        // Hide the link in parent page
        checkAnnex12Link();
    }
});

function closeAnnex12() {
    window.location.href = 'd03_set_annex.html';
}
