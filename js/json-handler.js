document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-json');
    const exportBtn = document.getElementById('export-json');
    const reflectionsContainer = document.getElementById('json-reflections');
    const countSpan = document.getElementById('reflection-count');

    console.log(' JSON Handler loaded!');
    console.log('Elements found:', { loadBtn, exportBtn, reflectionsContainer, countSpan });

    // Load JSON reflections
    if (loadBtn) {
        loadBtn.addEventListener('click', loadJSONReflections);
        console.log(' Load button event listener added');
    }

    // Export JSON functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', exportJSON);
        console.log(' Export button event listener added');
    }

    function loadJSONReflections() {
        console.log(' Load button clicked - starting fetch...');
        
        if (!reflectionsContainer) {
            console.error(' reflectionsContainer not found!');
            return;
        }

        fetch('./backend/reflections.json')
            .then(response => {
                console.log('📡 Fetch response:', response.status, response.statusText);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(reflections => {
                console.log(' JSON parsed successfully:', reflections);
                console.log(' Number of entries:', reflections.length);
                
                if (reflections && reflections.length > 0) {
                    console.log(' First entry:', reflections[0]);
                }
                
                displayReflections(reflections);
                updateReflectionCount(reflections.length);
            })
            .catch(error => {
                console.error(' Full error details:', error);
                console.error(' Error stack:', error.stack);
                
                if (reflectionsContainer) {
                    reflectionsContainer.innerHTML = `
                        <div class="error-message">
                            <p> Error loading reflections: ${error.message}</p>
                            <p><small>Check browser console (F12) for details</small></p>
                            <p><small>File path: ./backend/reflections.json</small></p>
                        </div>
                    `;
                }
                updateReflectionCount(0);
            });
    }

    function displayReflections(reflections) {
        console.log(' displayReflections called with:', reflections);
        
        if (!reflectionsContainer) {
            console.error(' reflectionsContainer is null!');
            return;
        }

        if (!reflections || reflections.length === 0) {
            console.log(' No reflections to display');
            reflectionsContainer.innerHTML = '<p>No reflections yet. Add some entries to reflections.json!</p>';
            return;
        }

        console.log(' Processing', reflections.length, 'reflections');

        // Sort by date (newest first)
        reflections.sort((a, b) => new Date(b.date) - new Date(a.date));

        const html = reflections.map((reflection, index) => {
            console.log(` Reflection ${index}:`, reflection);
            return `
                <div class="reflection-card">
                    <div class="reflection-header">
                        <strong> ${new Date(reflection.date).toLocaleString()}</strong>
                    </div>
                    <div class="reflection-text">${escapeHtml(reflection.text)}</div>
                </div>
            `;
        }).join('');

        console.log(' Generated HTML:', html);
        reflectionsContainer.innerHTML = html;
        console.log(' Reflections displayed successfully');
    }

    function updateReflectionCount(count) {
        console.log(' Updating count to:', count);
        if (countSpan) {
            countSpan.textContent = `Total: ${count} reflection${count !== 1 ? 's' : ''}`;
            countSpan.style.color = count > 0 ? '#27ae60' : '#e74c3c';
            console.log(' Count updated in DOM');
        } else {
            console.warn(' countSpan element not found');
        }
    }

    function exportJSON() {
        console.log(' Export button clicked');
        
        fetch('./backend/reflections.json')
            .then(response => {
                console.log(' Export fetch response:', response.status);
                if (!response.ok) {
                    throw new Error(`Export failed: HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(reflections => {
                console.log(' Export data loaded:', reflections);
                const dataStr = JSON.stringify(reflections, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                
                // Create download link
                const url = URL.createObjectURL(dataBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reflections-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                console.log(' Export completed successfully');
                
                // Notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(' JSON exported successfully!');
                }
            })
            .catch(error => {
                console.error(' Export failed:', error);
                alert('Export failed: ' + error.message);
            });
    }

    // Helper function to prevent XSS
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto-load reflections on page load after a short delay
    console.log(' Setting up auto-load...');
    setTimeout(() => {
        console.log(' Auto-loading reflections...');
        loadJSONReflections();
    }, 500);
});