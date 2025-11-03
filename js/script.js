

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Reusable Navigation Menu Logic ---
    
    const navHTML = `
        <nav class="navbar">
            <ul class="nav-menu">
                <li><a href="index.html">Home</a></li>
                <li><a href="journal.html">Journal</a></li>
                <li><a href="projects.html">Projects</a></li>
                <li><a href="about.html">About</a></li>
            </ul>
        </nav>
    `;

    const navPlaceholder = document.getElementById('nav-placeholder');

    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHTML;
        
        const currentPagePath = window.location.pathname;
        const navLinks = navPlaceholder.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (currentPagePath.endsWith(linkPath) || 
                (linkPath === 'index.html' && (currentPagePath.endsWith('/') || currentPagePath === '/'))) {
                link.classList.add('active');
            }
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
