// D-03 Set Annex JavaScript

function backToD03() {
    window.location.href = 'd03_main_form.html';
}

// Handle annex actions
document.addEventListener('DOMContentLoaded', function() {
    console.log('D-03 Set Annex page loaded');
    setupAnnexClickHandlers();
    checkAnnex5Data();
    checkAnnex10Data();
});

// Check if Annex 5 data exists and show Business1 link
function checkAnnex5Data() {
    const annex5Data = localStorage.getItem('d03_annex5_data');
    const businessLink = document.getElementById('annex5BusinessLink');
    
    if (annex5Data && businessLink) {
        businessLink.style.display = 'inline';
    }
}

// Check if Annex 10 data exists and show Update label
function checkAnnex10Data() {
    const annex10Data = localStorage.getItem('d03_annex10_data');
    const updateLabel = document.getElementById('annex10UpdateLabel');
    
    if (annex10Data && updateLabel) {
        const data = JSON.parse(annex10Data);
        if (data.saved) {
            updateLabel.style.display = 'inline';
        }
    }
}

// Setup click handlers for all annex plus icons
function setupAnnexClickHandlers() {
    const annexIcons = document.querySelectorAll('.action-icon');
    
    annexIcons.forEach((icon, index) => {
        icon.addEventListener('click', function() {
            // Determine which annex based on the row
            const row = this.closest('tr');
            const annexName = row.querySelector('.annex-name').textContent.trim();
            
            if (annexName === 'अनुसूची - २') {
                openAnnex2Modal();
            } else if (annexName === 'अनुसूची - ५') {
                openAnnex5Modal();
            } else if (annexName === 'अनुसूची - ५(क)') {
                openAnnex5KaModal();
            } else if (annexName === 'अनुसूची - ७') {
                openAnnex7Modal();
            } else if (annexName === 'अनुसूची - ८') {
                openAnnex8Modal();
            } else if (annexName === 'अनुसूची - १०') {
                openAnnex10Modal();
            } else if (annexName === 'अनुसूची - १३') {
                openAnnex13Modal();
            } else {
                alert('यो अनुसूची हालै उपलब्ध छैन।\n(This annex is not available yet.)');
            }
        });
    });
}

// Open Annex 2 in new page
function openAnnex2Modal() {
    window.location.href = 'd03_annex_2.html';
}

// Open Annex 5 in new page with iframe
function openAnnex5Modal() {
    window.location.href = 'd03_annex_5_iframe.html';
}

// Open Annex 5(क) in modal (placeholder)
function openAnnex5KaModal() {
    alert('अनुसूची - ५(क): कर छुट कारोबारको विवरण\nयो अनुसूची हालै उपलब्ध छैन।\n(This annex is not available yet.)');
}

// Open Annex 7 in modal (placeholder)
function openAnnex7Modal() {
    window.location.href = 'd03_annex_7.html';
}

// Open Annex 8 in modal (placeholder)
function openAnnex8Modal() {
    alert('अनुसूची - ८: गैर व्यावसायिक सम्पत्तिको निसर्गबाट प्राप्त खुद लाभ\nयो अनुसूची हालै उपलब्ध छैन।\n(This annex is not available yet.)');
}

// Open Annex 10 in modal
function openAnnex10Modal() {
    window.location.href = 'd03_annex_10.html';
}

// Open Annex 13 in modal (placeholder)
function openAnnex13Modal() {
    alert('अनुसूची - १३: कर दाबी गरिएको विवरण\nयो अनुसूची हालै उपलब्ध छैन।\n(This annex is not available yet.)');
}
