// js/script.js - UPDATED FOR FLASK

document.addEventListener('DOMContentLoaded', () => {
    console.log(' Initializing Flask navigation system...');

    // --- Reusable Navigation Menu Logic for FLASK ---

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
        console.log('Current Flask path:', currentPath);

        const navLinks = navPlaceholder.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            // Set active class based on current Flask route
            if (currentPath === linkPath) {
                link.classList.add('active');
            }
            // Handle home route (both / and /index should activate home)
            else if (linkPath === '/' && (currentPath === '/' || currentPath === '/index')) {
                link.classList.add('active');
            }

            console.log(`Link: ${linkPath}, Current: ${currentPath}, Active: ${link.classList.contains('active')}`);
        });
    }

    // --- Live Date/Time Display (Interactive Feature 1) ---

    const dateTimeElement = document.getElementById('live-date-time');

    if (dateTimeElement) {
        const updateDateTime = () => {
            const now = new Date();
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const formattedDate = now.toLocaleString('en-GB', options);
            dateTimeElement.textContent = `Current Date and Time: ${formattedDate}`;
        };

        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    // --- Theme Switcher (Interactive Feature 2) ---

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
});
