// d03_annex_10.js - Annex 10 Tax Matching Details functionality

(function() {
    'use strict';

    // Listen for messages from iframe
    window.addEventListener('message', function(event) {
        if (event.data.action === 'goBackToSetAnnex') {
            window.location.href = 'd03_set_annex.html';
        }
    });

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Annex 10 (Tax Matching Details) initialized');
    });

})();
