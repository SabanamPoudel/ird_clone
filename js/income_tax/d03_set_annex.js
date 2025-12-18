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
    checkAnnex2Visibility();
    checkAnnex2Update();
    checkAnnex13Update();
    checkAnnex7Link();
    checkAnnex8Link();
    checkAnnex12Link();
});
// Show ( Update ) label for Annex-13 if saved
function checkAnnex13Update() {
    const updateLabel = document.getElementById('annex13UpdateLabel');
    const annex13Saved = localStorage.getItem('d03_annex13_saved');
    if (updateLabel) {
        if (annex13Saved === '1') {
            updateLabel.style.display = 'inline';
        } else {
            updateLabel.style.display = 'none';
        }
    }
}
// Show ( Update ) label for Annex-2 if saved
function checkAnnex2Update() {
    const updateLabel = document.getElementById('annex2UpdateText');
    const annex2Saved = localStorage.getItem('d03_annex2_saved');
    if (updateLabel) {
        if (annex2Saved === '1') {
            updateLabel.style.display = 'inline';
        } else {
            updateLabel.style.display = 'none';
        }
    }
}
// Show Annex-2 section if Annex-5 was saved
function checkAnnex2Visibility() {
    const annex2Section = document.getElementById('annex2Section');
    const showAnnex2 = localStorage.getItem('d03_show_annex2');
    if (annex2Section) {
        if (showAnnex2 === '1') {
            annex2Section.style.display = '';
        } else {
            annex2Section.style.display = 'none';
        }
    }
    // Optionally clear the flag after showing, if you want it to only show once
    // localStorage.removeItem('d03_show_annex2');
}

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
    // Set flag to show Annex-2 after returning
    localStorage.setItem('d03_show_annex2', '1');
    window.location.href = 'd03_annex_5_iframe.html';
}

// Function to be called directly from onclick
function openAnnex5() {
    console.log('openAnnex5 called');
    // Set flag to show Annex-2 after returning
    localStorage.setItem('d03_show_annex2', '1');
    window.location.href = 'd03_annex_5.html';
}

// Open Annex 5(क) in modal (placeholder)
function openAnnex5KaModal() {
    alert('अनुसूची - ५(क): कर छुट कारोबारको विवरण\nयो अनुसूची हालै उपलब्ध छैन।\n(This annex is not available yet.)');
}

// Open Annex 7 in modal (placeholder)
function openAnnex7Modal() {
    window.location.href = 'd03_annex_7.html';
}

// Function to be called directly from onclick  
function openAnnex7() {
    window.location.href = 'd03_annex_7.html';
}

// Check and show Annex-7 Business1 link if data is saved
function checkAnnex7Link() {
    const annex7Link = document.getElementById('annex7Link');
    const annex7Data = localStorage.getItem('annex7_data');
    if (annex7Link) {
        if (annex7Data) {
            annex7Link.style.display = 'inline';
        } else {
            annex7Link.style.display = 'none';
        }
    }
}

// Check if Annex-8 data exists and show/hide link
function checkAnnex8Link() {
    const annex8Link = document.getElementById('annex8Link');
    const annex8Data = localStorage.getItem('annex8_data');
    if (annex8Link) {
        if (annex8Data) {
            annex8Link.style.display = 'inline';
        } else {
            annex8Link.style.display = 'none';
        }
    }
}

// Open Annex 8 in new page
function openAnnex8Modal() {
    window.location.href = 'd03_annex_8.html';
}

// Function to be called directly from onclick
function openAnnex8() {
    window.location.href = 'd03_annex_8.html';
}

// Check if Annex-12 is saved and show/hide link
function checkAnnex12Link() {
    const annex12Link = document.getElementById('annex12Link');
    const annex12Saved = localStorage.getItem('d03_annex12_saved');
    
    if (annex12Link) {
        if (annex12Saved === 'true') {
            annex12Link.style.display = 'inline';
        } else {
            annex12Link.style.display = 'none';
        }
    }
}

// Open Annex-12
function openAnnex12() {
    window.location.href = 'd03_annex_12.html';
}

// Open Annex 10 in modal
function openAnnex10Modal() {
    window.location.href = 'd03_annex_10.html';
}

// Function to be called directly from onclick
function openAnnex10() {
    window.location.href = 'd03_annex_10.html';
}

// Open Annex 13 in new page
function openAnnex13Modal() {
    window.location.href = 'd03_annex_13.html';
}

// Function to be called directly from onclick
function openAnnex13() {
    window.location.href = 'd03_annex_13.html';
}
