// Main Entry JavaScript - Tab Switching

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    checkVoucherTabAccess();
    setupIframeAutoResize();
});

function setupIframeAutoResize() {
    const iframes = document.querySelectorAll('.content-iframe');
    
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            resizeIframe(this);
        });
    });
    
    // Listen for messages from iframes
    window.addEventListener('message', function(e) {
        if (e.data && e.data.action === 'resizeIframe') {
            const iframes = document.querySelectorAll('.content-iframe');
            iframes.forEach(iframe => {
                if (iframe.contentWindow === e.source) {
                    resizeIframe(iframe);
                }
            });
        }
    });
}

function resizeIframe(iframe) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const height = iframeDoc.body.scrollHeight;
        iframe.style.height = height + 'px';
    } catch (e) {
        console.log('Cannot resize iframe:', e);
    }
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const tabType = this.getAttribute('data-tab');
            
            // Block voucher tab if no transactions exist
            if (tabType === 'voucher') {
                const transactions = JSON.parse(localStorage.getItem('tds_transactions') || '[]');
                if (transactions.length === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    alert('कृपया पहिले ट्रान्स्याक्सन भर्ने फारममा विवरण भर्नुहोस् र Add बटन क्लिक गर्नुहोस्।');
                    return false;
                }
            }
            
            handleTabClick(tabType);
        }, true); // Use capture phase
    });
    
    // Check periodically if transactions are added
    setInterval(checkVoucherTabAccess, 1000);
    
    // Initial check
    checkVoucherTabAccess();
}

function checkVoucherTabAccess() {
    const transactions = JSON.parse(localStorage.getItem('tds_transactions') || '[]');
    const voucherTab = document.querySelector('[data-tab="voucher"]');
    
    if (voucherTab) {
        if (transactions.length === 0) {
            voucherTab.style.opacity = '0.5';
            voucherTab.style.cursor = 'not-allowed';
            voucherTab.style.pointerEvents = 'none';
            voucherTab.classList.add('disabled-tab');
        } else {
            voucherTab.style.opacity = '1';
            voucherTab.style.cursor = 'pointer';
            voucherTab.style.pointerEvents = 'auto';
            voucherTab.classList.remove('disabled-tab');
        }
    }
}

function handleTabClick(tabType) {
    // Double check for voucher tab access
    if (tabType === 'voucher') {
        const transactions = JSON.parse(localStorage.getItem('tds_transactions') || '[]');
        if (transactions.length === 0) {
            alert('कृपया पहिले ट्रान्स्याक्सन भर्ने फारममा विवरण भर्नुहोस् र Add बटन क्लिक गर्नुहोस्।');
            // Keep transaction tab active
            const transactionTab = document.querySelector('[data-tab="transaction"]');
            const transactionPanel = document.getElementById('transaction-panel');
            if (transactionTab) transactionTab.classList.add('active');
            if (transactionPanel) transactionPanel.classList.add('active');
            return;
        }
    }
    
    if (tabType === 'logout') {
        sessionStorage.clear();
        localStorage.clear();
        if (window.parent !== window) {
            window.parent.postMessage({
                action: 'loadContent',
                url: 'html/e_tds/etds_home.html'
            }, '*');
        } else {
            window.location.href = 'etds_home.html';
        }
        return;
    }

    // Check if trying to access voucher tab
    if (tabType === 'voucher') {
        const transactions = JSON.parse(localStorage.getItem('tds_transactions') || '[]');
        if (transactions.length === 0) {
            alert('कृपया पहिले ट्रान्स्याक्सन भर्ने फारममा विवरण भर्नुहोस् र Add बटन क्लिक गर्नुहोस्।');
            return false;
        }
    }

    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    // Add active class to clicked tab
    const activeButton = document.querySelector(`[data-tab="${tabType}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Show corresponding panel
    const activePanel = document.getElementById(`${tabType}-panel`);
    if (activePanel) {
        activePanel.classList.add('active');
        
        // If switching to voucher panel, reload the TDS types
        if (tabType === 'voucher') {
            const voucherIframe = activePanel.querySelector('iframe');
            if (voucherIframe && voucherIframe.contentWindow) {
                // Send message to voucher iframe to reload TDS types
                voucherIframe.contentWindow.postMessage({
                    action: 'reloadTDSTypes'
                }, '*');
            }
        }
    }
}
