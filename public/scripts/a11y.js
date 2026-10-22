
(function () {
    // 1. Immediately apply saved theme to document
    function applySavedTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (document.body) document.body.setAttribute('data-theme', 'dark');
        } else if (localStorage.getItem('theme') === 'light') {
            document.documentElement.removeAttribute('data-theme');
            if (document.body) document.body.removeAttribute('data-theme');
        }
    }
    applySavedTheme();

    // 2. Initialize and bind the theme toggle button and sync state
    function setupThemeToggle() {
        applySavedTheme();

        // Check if an existing toggle button exists (#themeToggle)
        let btn = document.getElementById('themeToggle');
        if (!btn) {
            // Find navbar or header to place the toggle button
            const nav = document.querySelector('.nav-links') ||
                        document.querySelector('.nav-container') ||
                        document.querySelector('header nav') ||
                        document.querySelector('header');
            if (nav) {
                btn = document.createElement('button');
                btn.id = 'themeToggle';
                btn.type = 'button';
                btn.className = 'theme-toggle-btn';
                nav.appendChild(btn);
            }
        }

        function updateToggleState() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (btn) {
                btn.innerHTML = isDark ? '☀ Light' : '☾ Dark';
                btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
                btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            }
            const profileToggle = document.getElementById('theme-toggle');
            if (profileToggle && profileToggle.checked !== isDark) {
                profileToggle.checked = isDark;
            }
        }

        if (btn) {
            btn.onclick = function () {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const nextTheme = isDark ? 'light' : 'dark';
                if (nextTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if (document.body) document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    if (document.body) document.body.removeAttribute('data-theme');
                }
                localStorage.setItem('theme', nextTheme);
                updateToggleState();
            };
        }

        // Synchronize with Preferences checkbox on profile.html if present
        const profileToggle = document.getElementById('theme-toggle');
        if (profileToggle) {
            profileToggle.checked = (localStorage.getItem('theme') === 'dark');
            profileToggle.onchange = function () {
                const nextTheme = profileToggle.checked ? 'dark' : 'light';
                if (nextTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    if (document.body) document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    if (document.body) document.body.removeAttribute('data-theme');
                }
                localStorage.setItem('theme', nextTheme);
                updateToggleState();
            };
        }

        updateToggleState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupThemeToggle);
    } else {
        setupThemeToggle();
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
