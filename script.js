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
    
    // Check if all reasons are completed
    checkAllCompleted();
}

function loadCompletedReasons() {
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem('reason' + i + 'Completed') === 'true') {
            const reasonButtons = document.querySelectorAll('.reason-buttons button');
            if (reasonButtons[i - 1]) {
                reasonButtons[i - 1].classList.add('completed');
            }
        }
    }
    
    // Check if secret button should be shown
    checkAllCompleted();
}

function checkAllCompleted() {
    let allCompleted = true;
    for (let i = 1; i <= 5; i++) {
        if (localStorage.getItem('reason' + i + 'Completed') !== 'true') {
            allCompleted = false;
            break;
        }
    }
    
    // Show secret button if all are completed
    if (allCompleted) {
        const secretBtn = document.getElementById('secret-btn');
        if (secretBtn) {
            secretBtn.style.display = 'inline-block';
        }
    }
}

// Initialize
digits[0].focus();
loadCompletedReasons();

function waveText() {
    const headers = document.querySelectorAll('h1, h2');

    headers.forEach(header => {

        // Save original HTML (with images)
        if (!header.dataset.original) {
            header.dataset.original = header.innerHTML;
        }

        // Restore original first (important for re-animation)
        header.innerHTML = header.dataset.original;

        const nodes = [...header.childNodes];
        header.innerHTML = "";

        let delay = 0;

        nodes.forEach(node => {

            // Animate text only
            if (node.nodeType === Node.TEXT_NODE) {

                [...node.textContent].forEach(char => {
                    const span = document.createElement("span");

                    span.innerHTML = char === " " ? "&nbsp;" : char;
                    span.style.animationDelay = `${delay}s`;

                    delay += 0.05;
                    header.appendChild(span);
                });

            }
            // Keep images as-is
            else {
                node.style.animationDelay = `${delay}s`;
                header.appendChild(node.cloneNode(true));
                delay += 0.05;
            }
        });

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

// Valentine's Day No button movement
function moveNoButton() {
    const noBtn = document.getElementById('no-btn');
    if (!noBtn) return;
    
    // Add moved class to switch to absolute positioning
    noBtn.classList.add('moved');
    
    const container = document.querySelector('.valentine-buttons');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate max positions (keep button inside container)
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;
    
    // Generate random position
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    // Move button
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// Add event listeners for No button when it exists
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for page to be ready, then add listeners
    setTimeout(function() {
        const noBtn = document.getElementById('no-btn');
        if (noBtn) {
            // For desktop - hover
            noBtn.addEventListener('mouseenter', moveNoButton);
            
            // For mobile - touch/click
            noBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                moveNoButton();
            });
            
            noBtn.addEventListener('click', function(e) {
                e.preventDefault();
                moveNoButton();
            });
        }
    }, 500);
});

// Re-add listeners when switching to valentine page
const originalShowPage2 = showPage;
showPage = function(pageId) {
    originalShowPage2(pageId);
    setTimeout(waveText, 100);
    
    // Add listeners if we're on the valentine page
    if (pageId === 'valentine-question') {
        setTimeout(function() {
            const noBtn = document.getElementById('no-btn');
            if (noBtn) {
                // For desktop - hover
                noBtn.addEventListener('mouseenter', moveNoButton);
                
                // For mobile - touch/click
                noBtn.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    moveNoButton();
                });
                
                noBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    moveNoButton();
                });
            }
        }, 100);
    }
};