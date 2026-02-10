// Password functionality
const correctPassword = '0213'; // CHANGE THIS to your actual monthsary (4 digits)

const digits = [
    document.getElementById('digit1'),
    document.getElementById('digit2'),
    document.getElementById('digit3'),
    document.getElementById('digit4')
];

// Auto-focus next input
digits.forEach((digit, index) => {
    digit.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < 3) {
            digits[index + 1].focus();
        }
    });

    digit.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            digits[index - 1].focus();
        }
    });
});

function showHint() {
    document.getElementById("hintBtn").style.display = "none";

    document.getElementById("hintText").style.display = "block";
}


function checkPassword() {
    const enteredPassword = digits.map(d => d.value).join('');
    const errorMsg = document.getElementById('error-msg');
    const errorGif = document.getElementById('error-gif');
    const restartBtn = document.getElementById('restart-btn');

    if (enteredPassword === correctPassword) {
        showPage('page-reasons');
    } else {
        errorMsg.classList.add('show');
        errorGif.style.display = 'flex';
        restartBtn.style.display = 'inline-block';
    }
}

function restartPassword() {
    digits.forEach(d => d.value = '');
    document.getElementById('error-msg').classList.remove('show');
    document.getElementById('error-gif').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'none';
    digits[0].focus();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showReason(num) {
    showPage('reason-' + num);

    markReasonCompleted(num);
}

function markReasonCompleted(num) {
    const reasonButtons = document.querySelectorAll('.reason-buttons button');
    if (reasonButtons[num - 1]) {
        reasonButtons[num - 1].classList.add('completed');
    }

    localStorage.setItem('reason' + num + 'Completed', 'true');
}

function loadCompletedReasons() {
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem('reason' + i + 'Completed') === 'true') {
            const reasonButtons = document.querySelectorAll('.reason-buttons button');
            if (reasonButtons[i - 1]) {
                reasonButtons[i - 1].classList.add.apply('completed');
            }
        }
    }
}

// Initialize
digits[0].focus();

function waveText() {
    const headers = document.querySelectorAll('h1, h2');
    
    headers.forEach(header => {
        // Check if it contains images
        const hasImages = header.querySelector('img');
        
        if (hasImages) {
            // Handle headers with images - wrap only text nodes
            const newContent = [];
            let delay = 0;
            
            header.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // This is text - wrap each character
                    const text = node.textContent;
                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];
                        const span = document.createElement('span');
                        
                        if (char === ' ') {
                            span.innerHTML = '&nbsp;';
                        } else {
                            span.textContent = char;
                        }
                        
                        span.style.animationDelay = `${delay}s`;
                        delay += 0.05;
                        newContent.push(span);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // This is an element (like img) - keep it as is
                    node.style.animationDelay = `${delay}s`;
                    delay += 0.05;
                    newContent.push(node.cloneNode(true));
                }
            });
            
            // Clear and rebuild header
            header.innerHTML = '';
            newContent.forEach(element => header.appendChild(element));
            
        } else {
            // Handle headers without images - same as before
            let text = header.textContent;
            header.innerHTML = '';
            
            let delay = 0;
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const span = document.createElement('span');
                
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                
                span.style.animationDelay = `${delay}s`;
                delay += 0.05;
                
                header.appendChild(span);
            }
        }
    });
}

// Apply wave animation when page loads and when switching pages
document.addEventListener('DOMContentLoaded', waveText);

// Re-apply wave animation when pages change
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage(pageId);
    setTimeout(waveText, 100); // Small delay to ensure page is visible
};