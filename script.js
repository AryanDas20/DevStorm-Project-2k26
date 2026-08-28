document.addEventListener('DOMContentLoaded', () => {
    const pwInput = document.getElementById('pw-input');
    const outputContainer = document.getElementById('password-output');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const strengthBar = document.getElementById('strength-bar');
    const strengthDesc = document.getElementById('strength-desc');
    const breachStatus = document.getElementById('breach-status');

    pwInput.addEventListener('input', async () => {
        const password = pwInput.value;

        if (password.length > 0) {
            outputContainer.style.display = 'block';
            await checkPassword(password);
        } else {
            outputContainer.style.display = 'none';
        }
    });

    async function checkPassword(password) {
        // 1. Local Strength Check
        const strengthScore = calculateLocalStrength(password);
        updateLocalStrengthDisplay(strengthScore);

        // 2. Breach Check (k-Anonymity)
        const sha1 = await sha1Hash(password);
        const prefix = sha1.slice(0, 5);
        const suffix = sha1.slice(5).toUpperCase();
        
        try {
            const apiResponse = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
            if (!apiResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const hashes = await apiResponse.text();
            const count = checkSuffix(hashes, suffix);
            
            updateBreachDisplay(count);
            updateOverallDisplay(strengthScore, count);
        } catch (error) {
            console.error('API Error:', error);
            breachStatus.innerHTML = '<span class="breach-alert">Error checking for breaches. API may be offline.</span>';
        }
    }

    function calculateLocalStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updateLocalStrengthDisplay(score) {
        const percentage = (score / 5) * 100;
        strengthBar.style.width = `${percentage}%`;
        
        let desc = '';
        let color = '';
        switch(score) {
            case 0:
            case 1: desc = 'Weak'; color = '#ff4d4d'; break;
            case 2: desc = 'Fair'; color = '#FF9800'; break;
            case 3: desc = 'Good'; color = '#FFEB3B'; break;
            case 4: desc = 'Strong'; color = 'rgba(212, 168, 67, 1)'; break;
            case 5: desc = 'Excellent!'; color = '#4caf50'; break;
        }
        strengthBar.style.backgroundColor = color;
        strengthDesc.textContent = desc;
        strengthDesc.style.color = color;
    }

    async function sha1Hash(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    function checkSuffix(hashes, suffix) {
        const lines = hashes.split('\n');
        for (let line of lines) {
            const [hashSuffix, count] = line.trim().split(':');
            if (hashSuffix === suffix) {
                return parseInt(count);
            }
        }
        return 0;
    }

    function updateBreachDisplay(count) {
        if (count > 0) {
            breachStatus.innerHTML = `<span class="breach-alert">WARNING: This password was found ${count.toLocaleString()} times in known breaches. DO NOT USE.</span>`;
        } else {
            breachStatus.innerHTML = '<span class="no-breach">This password has not been found in known leaks (according to k-Anonymity check).</span>';
        }
    }

    function updateOverallDisplay(strengthScore, count) {
        if (count > 0) {
            statusIcon.style.backgroundColor = '#ff4d4d';
            statusText.textContent = 'PWNED: This password is compromised.';
            statusText.style.color = '#ff4d4d';
        } else {
            if (strengthScore >= 4) {
                statusIcon.style.backgroundColor = '#4caf50';
                statusText.textContent = 'SECURE: Local strong, no breaches found.';
                statusText.style.color = '#4caf50';
            } else if (strengthScore >= 2) {
                statusIcon.style.backgroundColor = '#FFEB3B';
                statusText.textContent = 'FAIR: Locally fair, no breaches found.';
                statusText.style.color = '#FFEB3B';
            } else {
                statusIcon.style.backgroundColor = '#FF9800';
                statusText.textContent = 'WEAK: Locally weak, but no breaches found.';
                statusText.style.color = '#FF9800';
            }
        }
    }
});
