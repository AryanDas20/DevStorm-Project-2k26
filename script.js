document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('.search-input');
    const searchContainer = document.querySelector('.search-container');
    const outputContainer = document.getElementById('password-checker-results');

    // Simple password strength check criteria
    const criteria = {
        length: { text: "At least 8 characters", valid: (pw) => pw.length >= 8 },
        uppercase: { text: "Contains at least one uppercase letter", valid: (pw) => /[A-Z]/.test(pw) },
        lowercase: { text: "Contains at least one lowercase letter", valid: (pw) => /[a-z]/.test(pw) },
        number: { text: "Contains at least one number", valid: (pw) => /\d/.test(pw) },
        specialChar: { text: "Contains at least one special character", valid: (pw) => /[^A-Za-z0-9]/.test(pw) }
    };

    inputField.addEventListener('input', () => {
        const password = inputField.value;

        if (password.length > 0) {
            outputContainer.style.display = 'block';
            checkPasswordStrength(password);
        } else {
            outputContainer.style.display = 'none';
        }
    });

    // Mirror hover expansion effect to keep sync
    searchContainer.addEventListener('mouseover', () => {
        outputContainer.classList.add('expanded');
    });

    searchContainer.addEventListener('mouseout', () => {
        outputContainer.classList.remove('expanded');
    });

    function checkPasswordStrength(password) {
        let passedChecks = 0;
        let checksHtml = '';
        let strength = 0;

        for (const key in criteria) {
            const check = criteria[key];
            if (check.valid(password)) {
                passedChecks++;
                strength++;
                checksHtml += `<div class="check-item"><span class="status-icon status-valid valid-icon"></span><span class="check-text">${check.text}</span></div>`;
            } else {
                checksHtml += `<div class="check-item"><span class="status-icon status-invalid invalid-icon"></span><span class="check-text">${check.text}</span></div>`;
            }
        }

        // --- Strength Score and Bar ---
        const maxScore = Object.keys(criteria).length;
        const scorePercentage = (strength / maxScore) * 100;
        let strengthText = "";
        let barColor = "";

        if (scorePercentage < 40) {
            strengthText = "Weak (Too easily guessed)";
            barColor = "#f44336"; // Red
        } else if (scorePercentage < 60) {
            strengthText = "Moderate (Requires caution)";
            barColor = "#FF9800"; // Orange
        } else if (scorePercentage < 80) {
            strengthText = "Strong (Good password)";
            barColor = "var(--accent-blue)"; // Gold/Accent from your theme
        } else {
            strengthText = "Very Strong (Excellent!)";
            barColor = "#4CAF50"; // Green
        }

        // --- Breach Checker (Simulated for this tool) ---
        let breachHtml = '';
        // Predefined list of leaked prefixes for simulation (last digits are hashed)
        const commonLeakedPrefixes = ['password', '123456', 'admin', 'qwerty'];
        const pwPrefix = password.slice(0, password.length - 2).toLowerCase();

        if (commonLeakedPrefixes.includes(pwPrefix) && password.length > 5) {
            breachHtml = `<div class="breach-alert"><span class="output-summary status-invalid invalid-icon"></span> WARNING: This password has been found in known data leaks. DO NOT USE.</div>`;
        }

        // Create the full output HTML structure
        outputContainer.innerHTML = `
            <h2 class="output-title">Password Strength Summary</h2>
            <p class="output-summary">Evaluating: <span style="font-family: monospace; border-bottom: 1px dashed white; display: inline-block; padding-bottom: 2px;">${password}</span></p>
            
            <div class="checks-container">
                ${checksHtml}
            </div>

            ${breachHtml}

            <div class="strength-display">
                <span class="strength-text" style="color: ${barColor};">${strengthText}</span>
                <div class="strength-bar-container">
                    <div class="strength-bar" style="width: ${scorePercentage}%; background-color: ${barColor};"></div>
                </div>
            </div>
        `;
    }
});