// Xaltrion AI — main.js  (smooth scroll + mobile menu)
document.addEventListener('DOMContentLoaded', function () {
    // smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href') || '';
            if (href.length <= 1) return;
            var t = document.querySelector(href);
            if (t) {
                e.preventDefault();
                t.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // mobile menu (injected so all pages get a single behavior source)
    var navRow = document.querySelector('.container.nav-row');
    if (!navRow) return;

    var burger = document.getElementById('navBurger');
    if (!burger) {
        burger = document.createElement('button');
        burger.className = 'nav-burger';
        burger.id = 'navBurger';
        burger.setAttribute('aria-label', 'Open menu');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-controls', 'mobileMenu');
        burger.innerHTML = '<span></span><span></span><span></span>';
        navRow.appendChild(burger);
    }

    var menu = document.getElementById('mobileMenu');
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'mobile-menu';
        menu.id = 'mobileMenu';
        menu.setAttribute('aria-hidden', 'true');
        menu.innerHTML = [
            '<nav class="mobile-menu__links" aria-label="Mobile">',
            '  <a href="index.html#features">Features</a>',
            '  <a href="brokers.html">Brokers</a>',
            '  <a href="roadmap.html">Roadmap</a>',
            '  <a href="pricing.html">Pricing</a>',
            '  <a href="beta.html">Beta Access</a>',
            '  <a href="docs.html">Docs</a>',
            '  <a href="https://discord.gg/9XS5zF2MfJ" target="_blank" rel="noopener">Community</a>',
            '</nav>',
            '<a class="cta cta-primary mobile-menu__cta" href="download.html">Download for Windows →</a>'
        ].join('');
        document.body.appendChild(menu);
    }

    function setOpen(open) {
        menu.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
        setOpen(!menu.classList.contains('open'));
    });

    menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            setOpen(false);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 780) setOpen(false);
    });
});
