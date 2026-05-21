// Xaltrion - paystack.js
// Checkout flow: reads email from #checkout-email input field

var API_BASE = 'https://license.xaltrion.ai';

function validateEmail(email) {
    return email && email.length > 3 && email.indexOf('@') > 0;
}

function getEmail() {
    var input = document.getElementById('checkout-email');
    return input ? input.value.trim() : '';
}

function showEmailError(show) {
    var err = document.getElementById('email-error');
    var input = document.getElementById('checkout-email');
    if (err) {
        err.style.display = show ? 'block' : 'none';
    }
    if (input) {
        input.style.borderColor = show ? '#f87171' : '';
    }
}

async function startCheckout(tier) {
    var email = getEmail();

    if (!validateEmail(email)) {
        showEmailError(true);
        var invalidInput = document.getElementById('checkout-email');
        if (invalidInput) {
            invalidInput.focus();
        }
        return;
    }
    showEmailError(false);

    var btn = document.getElementById('btn-' + tier);
    var originalText = btn ? btn.textContent : '';
    var allBtns = ['btn-monthly', 'btn-annual', 'btn-founders'];

    allBtns.forEach(function (id) {
        var button = document.getElementById(id);
        if (button) {
            button.disabled = true;
        }
    });
    if (btn) {
        btn.textContent = 'Redirecting to payment...';
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
            alert('Payment could not be started. Please try again or contact support@xaltrion.ai');
            allBtns.forEach(function (id) {
                var button = document.getElementById(id);
                if (button) {
                    button.disabled = false;
                }
            });
            if (btn) {
                btn.textContent = originalText;
            }
        }
    } catch (e) {
        alert('Connection error. Please check your internet connection and try again.');
        allBtns.forEach(function (id) {
            var button = document.getElementById(id);
            if (button) {
                button.disabled = false;
            }
        });
        if (btn) {
            btn.textContent = originalText;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('checkout-email');
    if (input) {
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
    }
});
