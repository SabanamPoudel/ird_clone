// Handle messages from the iframe
window.addEventListener('message', function(event) {
    if (event.data.action === 'goBackToSetAnnex') {
        window.location.href = 'd03_set_annex.html';
    }
});
