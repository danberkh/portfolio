// Loads shared header/footer, marks the active nav link, and runs the theme toggle.
// The site has no build step (GitHub Pages, static files), so header/footer are
// fetched at runtime from /partials and injected into each page's mount points.

document.addEventListener('DOMContentLoaded', async () => {
    await loadPartials();
    setActiveNavLink();
    initThemeToggle();
});

// --- Partial loading ---------------------------------------------------

async function loadPartials() {
    await Promise.all([
        loadPartial('header.html', 'header'),
        loadPartial('footer.html', 'footer'),
    ]);
}

async function loadPartial(url, mountId) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url} responded ${res.status}`);
        mount.innerHTML = await res.text();
    } catch (err) {
        console.error(`Failed to load partial: ${url}`, err);
    }
}

// --- Active nav link -----------------------------------------------------
// Nav links no longer live in each page, so the "active" page can't be
// hardcoded — it's resolved here from the current URL after the header loads.

function setActiveNavLink() {
    const path = window.location.pathname;
    let current = path.substring(path.lastIndexOf('/') + 1);
    current = current === '' || current === 'index.html' ? 'index' : current.replace('.html', '');

    document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
        link.classList.toggle('active', link.dataset.page === current);
    });
}

// --- Theme toggle — the only JS this site needed before partials ---------

function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const lightIcon = document.querySelector('.theme-toggle-light');
    const darkIcon = document.querySelector('.theme-toggle-dark');

    function updateIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        if (lightIcon && darkIcon) {
            lightIcon.style.display = isDark ? 'none' : 'inline';
            darkIcon.style.display = isDark ? 'inline' : 'none';
        }
    }

    updateIcon();

    if (toggle) {
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            if (isDark) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            updateIcon();
        });
    }
}
