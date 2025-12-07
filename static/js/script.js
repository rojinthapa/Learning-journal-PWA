// js/script.js - UPDATED FOR LAB 7 PWA
// Includes: Navigation, Theme Toggle, Live Date, Service Worker, and Offline Detection

document.addEventListener('DOMContentLoaded', () => {
    console.log(' Initializing Learning Journal PWA...');

    // ==========================================
    // 1. Navigation Logic (Flask Compatible)
    // ==========================================
    const navHTML = `
        <nav class="navbar">
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/journal">Journal</a></li>
                <li><a href="/projects">Projects</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    `;

    const navPlaceholder = document.getElementById('nav-placeholder');

    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHTML;
        const currentPath = window.location.pathname;
        const navLinks = navPlaceholder.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Handle active state for current page
            if (currentPath === linkPath) {
                link.classList.add('active');
            }
            // Handle home route variations (/ or /index)
            else if (linkPath === '/' && (currentPath === '/' || currentPath === '/index')) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================
    // 2. Live Date/Time Display
    // ==========================================
    const dateTimeElement = document.getElementById('live-date-time');
    if (dateTimeElement) {
        const updateDateTime = () => {
            const now = new Date();
            const options = {
                weekday: 'long', year: 'numeric', month: 'long',
                day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
            };
            dateTimeElement.textContent = `Current Date: ${now.toLocaleString('en-GB', options)}`;
        };
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    // ==========================================
    // 3. Theme Switcher (Dark Mode)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const updateToggleButton = () => {
        if (!themeToggle) return;
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    };

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    if (themeToggle) {
        updateToggleButton();
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            updateToggleButton();
        });
    }

    // ==========================================
    // 4. LAB 7 EXTRA FEATURE: Offline Detection
    // ==========================================
    // This satisfies "Notifying users when they are offline" requirement

    function updateOnlineStatus() {
        // Create the notification banner if it doesn't exist
        let offlineMsg = document.getElementById('offline-banner');
        if (!offlineMsg) {
            offlineMsg = document.createElement('div');
            offlineMsg.id = 'offline-banner';
            // Styling for the banner
            offlineMsg.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: #e74c3c;
                color: white;
                text-align: center;
                padding: 12px;
                z-index: 9999;
                font-weight: bold;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
                transform: translateY(100%); /* Hidden by default */
            `;
            document.body.appendChild(offlineMsg);
        }

        if (!navigator.onLine) {
            // User is OFFLINE
            offlineMsg.textContent = '⚠️ You are currently OFFLINE. Changes may not save.';
            offlineMsg.style.background = '#e74c3c'; // Red
            offlineMsg.style.transform = 'translateY(0)'; // Slide up
            console.log('Network status: Offline');
        } else {
            // User is ONLINE
            offlineMsg.textContent = '✅ You are back ONLINE.';
            offlineMsg.style.background = '#27ae60'; // Green
            offlineMsg.style.transform = 'translateY(0)'; // Slide up briefly

            // Hide after 3 seconds
            setTimeout(() => {
                offlineMsg.style.transform = 'translateY(100%)';
            }, 3000);
            console.log('Network status: Online');
        }
    }

    // Listen for network changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check status on load
    if (!navigator.onLine) {
        updateOnlineStatus();
    }
});

// ==========================================
// 5. LAB 7: Service Worker Registration
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ ServiceWorker registered with scope:', registration.scope);
            })
            .catch(err => {
                console.log('❌ ServiceWorker registration failed:', err);
            });
    });
}
