// Xaltrion — main.js  (smooth scroll + mobile menu + theme toggle)
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

    // theme toggle (injected into every page's nav so the control is consistent).
    // The actual theme is already applied pre-paint by the inline bootstrap in
    // <head> (window.XTheme); here we just add the visible ☀/☾ control.
    var navRowEl = document.querySelector('.container.nav-row');
    if (navRowEl && window.XTheme && !document.getElementById('themeToggle')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle';
        btn.id = 'themeToggle';
        btn.setAttribute('aria-label', 'Toggle light/dark theme');
        btn.setAttribute('title', 'Toggle light/dark theme');
        btn.innerHTML = [
            // sun — shown in dark mode (click to go light)
            '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
            '<circle cx="12" cy="12" r="4"></circle>',
            '<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>',
            '</svg>',
            // moon — shown in light mode (click to go dark)
            '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
            '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
            '</svg>'
        ].join('');
        // place the control just before the Download CTA when present, else at the end
        var cta = navRowEl.querySelector('a.cta');
        if (cta) { navRowEl.insertBefore(btn, cta); } else { navRowEl.appendChild(btn); }
        btn.addEventListener('click', function () { window.XTheme.toggle(); });
    }

    // Theme-aware brand lockup: the SVG ships with near-white wordmark text for
    // the dark site, so in light mode the text was invisible. Swap to the
    // dark-text variant (…-light.svg) whenever the theme is light. One source for
    // every page (nav + footer); preserves any ?v= cache-bust + path prefix.
    function applyThemedLogo() {
        var light = !!(window.XTheme && window.XTheme.get && window.XTheme.get() === 'light');
        document.querySelectorAll('img[src*="xaltrion-lockup-horizontal"]').forEach(function (img) {
            var src = img.getAttribute('src') || '';
            var q = '';
            var qi = src.indexOf('?');
            if (qi >= 0) { q = src.slice(qi); src = src.slice(0, qi); }
            var darkPath = src.replace('-light.svg', '.svg');
            var newPath = light ? darkPath.replace(/\.svg$/, '-light.svg') : darkPath;
            img.setAttribute('src', newPath + q);
        });
    }
    applyThemedLogo();
    window.addEventListener('xaltrion-theme-changed', applyThemedLogo);

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
