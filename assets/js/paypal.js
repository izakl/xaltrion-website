// Xaltrion - paypal.js
// Checkout flow: reads email from #checkout-email (or #email-input fallback)

var API_BASE = 'https://license.xaltrion.ai';

function validateEmail(email) {
    return email && email.length > 3 && email.indexOf('@') > 0;
}

function getEmailInput() {
    return document.getElementById('checkout-email') || document.getElementById('email-input');
}

function getEmail() {
    var input = getEmailInput();
    return input ? input.value.trim() : '';
}

function showEmailError(show) {
    var err = document.getElementById('email-error');
    var input = getEmailInput();
    if (err) {
        err.style.display = show ? 'block' : 'none';
    }
    if (input) {
        input.style.borderColor = show ? '#f87171' : '';
    }
}

async function startCheckout(tier, evt) {
    var email = getEmail();

    if (!validateEmail(email)) {
        showEmailError(true);
        var invalidInput = getEmailInput();
        if (invalidInput) {
            invalidInput.focus();
        }
        return;
    }
    showEmailError(false);

    var btn = (evt && evt.target) ? evt.target : document.getElementById('btn-' + tier);
    var originalText = btn ? btn.textContent : '';
    var allBtns = ['btn-monthly', 'btn-annual', 'btn-founders'];

    allBtns.forEach(function (id) {
        var button = document.getElementById(id);
        if (button) {
            button.disabled = true;
        }
    });

    if (btn) {
        btn.textContent = 'Redirecting to PayPal...';
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
            return;
        }

        throw new Error('No checkout URL returned');
    } catch (e) {
        allBtns.forEach(function (id) {
            var button = document.getElementById(id);
            if (button) {
                button.disabled = false;
            }
        });

        if (btn) {
            btn.textContent = originalText || 'Buy Now';
        }

        alert('Checkout failed. Please try again or contact support@xaltrion.ai');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var input = getEmailInput();
    if (!input) {
        return;
    }

    input.addEventListener('input', function () {
        showEmailError(false);
    });

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            var btn = document.getElementById('btn-monthly');
            if (btn) {
                btn.focus();
            }
        }
    });
});
