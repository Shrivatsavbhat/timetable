
(function () {
    function normalizeFontSize(value) {
        if (value === 'small') return -1;
        if (value === 'normal') return 0;
        if (value === 'large') return 1;
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? Math.max(-5, Math.min(5, parsed)) : 0;
    }

    function applySavedSettings() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (document.body) document.body.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            if (document.body) document.body.removeAttribute('data-theme');
        }

        const fontSize = normalizeFontSize(localStorage.getItem('fontSize'));
        document.documentElement.setAttribute('data-size', String(fontSize));
        document.documentElement.style.setProperty('--font-size-level', fontSize);
        if (document.body) {
            document.body.setAttribute('data-size', String(fontSize));
            document.body.style.setProperty('--font-size-level', fontSize);
        }
    }
    applySavedSettings();

    function setupHeaderControls() {
        applySavedSettings();

        let themeBtn = document.getElementById('themeToggle');
        if (!themeBtn) {
            const container = document.querySelector('.header-controls') ||
                              document.querySelector('.nav-container') ||
                              document.querySelector('header');
            if (container) {
                themeBtn = document.createElement('button');
                themeBtn.id = 'themeToggle';
                themeBtn.type = 'button';
                themeBtn.className = 'theme-toggle-btn';
                container.appendChild(themeBtn);
            }
        }

        function updateThemeUI() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (themeBtn) {
                themeBtn.textContent = isDark ? '☀' : '☾';
                themeBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
                themeBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
                themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            }
            const profileToggle = document.getElementById('theme-toggle');
            if (profileToggle && profileToggle.checked !== isDark) {
                profileToggle.checked = isDark;
            }
        }

        if (themeBtn) {
            themeBtn.onclick = function () {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const next = isDark ? 'light' : 'dark';
                if (next === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if (document.body) document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    if (document.body) document.body.removeAttribute('data-theme');
                }
                localStorage.setItem('theme', next);
                updateThemeUI();
            };
        }

        const profileToggle = document.getElementById('theme-toggle');
        if (profileToggle) {
            profileToggle.checked = (localStorage.getItem('theme') === 'dark');
            profileToggle.onchange = function () {
                const next = profileToggle.checked ? 'dark' : 'light';
                if (next === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if (document.body) document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    if (document.body) document.body.removeAttribute('data-theme');
                }
                localStorage.setItem('theme', next);
                updateThemeUI();
            };
        }

        updateThemeUI();

        function updateFontSizeUI(size) {
            document.querySelectorAll('.size-controls [data-size]').forEach(btn => {
                const s = btn.dataset.size;
                btn.setAttribute('aria-pressed', s === '0' && size === 0 ? 'true' : 'false');
            });
        }

        let currentSize = normalizeFontSize(localStorage.getItem('fontSize'));

        document.querySelectorAll('.size-controls [data-size]').forEach(btn => {
            btn.onclick = function () {
                const action = Number.parseInt(btn.dataset.size, 10);
                currentSize = action === 0 ? 0 : Math.max(-5, Math.min(5, currentSize + action));

                document.documentElement.setAttribute('data-size', String(currentSize));
                document.documentElement.style.setProperty('--font-size-level', currentSize);
                if (document.body) {
                    document.body.setAttribute('data-size', String(currentSize));
                    document.body.style.setProperty('--font-size-level', currentSize);
                }
                localStorage.setItem('fontSize', String(currentSize));
                updateFontSizeUI(currentSize);
            };
        });

        document.documentElement.setAttribute('data-size', String(currentSize));
        document.documentElement.style.setProperty('--font-size-level', currentSize);
        if (document.body) {
            document.body.setAttribute('data-size', String(currentSize));
            document.body.style.setProperty('--font-size-level', currentSize);
        }
        updateFontSizeUI(currentSize);

        const crLoginButton = document.querySelector('a.cr-login-btn:not(.cr-dashboard-btn)');
        const headerControls = document.querySelector('.header-controls');
        if (crLoginButton && headerControls) {
            fetch('/api/auth/me')
                .then(response => response.ok ? response.json() : null)
                .then(data => {
                    if (data?.user?.role !== 'CR') return;

                    crLoginButton.remove();
                    const dashboardButton = document.createElement('a');
                    dashboardButton.href = '/admin-dashboard.html';
                    dashboardButton.className = 'cr-login-btn cr-dashboard-btn';
                    dashboardButton.textContent = 'CR Dashboard';
                    headerControls.appendChild(dashboardButton);
                });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupHeaderControls);
    } else {
        setupHeaderControls();
    }

    let toastContainer = null;

    window.showToast = function (message, type = 'info', duration = 4000) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'a11y-toast-container';
            toastContainer.setAttribute('role', 'region');
            toastContainer.setAttribute('aria-label', 'System Notifications');
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `a11y-toast ${type}`;
        toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

        const textSpan = document.createElement('span');
        textSpan.textContent = message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Dismiss notification');
        closeBtn.onclick = () => toast.remove();

        toast.appendChild(textSpan);
        toast.appendChild(closeBtn);
        toastContainer.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, duration);
        }
    };

    window.accessibleConfirm = function (message) {
        return new Promise((resolve) => {
            const prevActive = document.activeElement;
            const overlay = document.createElement('div');
            overlay.className = 'a11y-confirm-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.6);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(2px);';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-labelledby', 'a11y-confirm-msg');

            const box = document.createElement('div');
            box.style.cssText = 'background:var(--surface,#ffffff);color:var(--text-main,#0f172a);border:1px solid var(--border,#cbd5e1);padding:24px;border-radius:12px;max-width:420px;width:90%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.3);';

            const p = document.createElement('p');
            p.id = 'a11y-confirm-msg';
            p.style.cssText = 'margin:0 0 20px 0;font-size:15px;color:inherit;line-height:1.5;font-weight:500;';
            p.textContent = message;

            const actions = document.createElement('div');
            actions.style.cssText = 'display:flex;justify-content:flex-end;gap:12px;';

            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.cssText = 'padding:8px 16px;border-radius:6px;border:1px solid var(--border,#cbd5e1);background:var(--surface,#f8fafc);color:var(--text-muted,#334155);cursor:pointer;font-weight:500;';

            const confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.textContent = 'Confirm';
            confirmBtn.style.cssText = 'padding:8px 16px;border-radius:6px;border:none;background:var(--primary,#6B3F25);color:var(--surface,#ffffff);font-weight:600;cursor:pointer;';

            const cleanup = (val) => {
                overlay.remove();
                if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
                resolve(val);
            };

            cancelBtn.onclick = () => cleanup(false);
            confirmBtn.onclick = () => cleanup(true);

            overlay.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') cleanup(false);
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === cancelBtn) {
                        e.preventDefault();
                        confirmBtn.focus();
                    } else if (!e.shiftKey && document.activeElement === confirmBtn) {
                        e.preventDefault();
                        cancelBtn.focus();
                    }
                }
            });

            actions.appendChild(cancelBtn);
            actions.appendChild(confirmBtn);
            box.appendChild(p);
            box.appendChild(actions);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            confirmBtn.focus();
        });
    };
})();
