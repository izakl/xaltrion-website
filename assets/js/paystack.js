// Xaltrion AI - paystack.js
// Handles payment initiation via license API

var API_BASE = 'https://license.xaltrion.ai';
// Fallback if custom domain not yet live:
// var API_BASE = 'https://xaltrion-license-api-dev.azurewebsites.net';

async function startCheckout(tier) {
    var btnId = 'btn-' + tier;
    var btn = document.getElementById(btnId);
    var originalText = btn ? btn.textContent : '';

    var email = prompt('Enter your email address to continue:');
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    if (btn) {
        btn.textContent = 'Loading...';
        btn.disabled = true;
    }

    try {
        var res = await fetch(API_BASE + '/checkout/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tier: tier, email: email })
        });
        var data = await res.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Something went wrong. Please try again or email support@xaltrion.ai');
            if (btn) {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    } catch (e) {
        alert('Connection error. Please try again.');
        if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }
}
