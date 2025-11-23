document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('load-json');
    const exportBtn = document.getElementById('export-json');
    const reflectionsContainer = document.getElementById('json-reflections');
    const countSpan = document.getElementById('reflection-count');

    // Load JSON reflections
    if (loadBtn) {
        loadBtn.addEventListener('click', loadJSONReflections);
    }

    // Export JSON functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', exportJSON);
    }

    function loadJSONReflections() {
        fetch('backend/reflections.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('JSON file not found');
                }
                return response.json();
            })
            .then(reflections => {
                displayReflections(reflections);
                updateReflectionCount(reflections.length);
                
                // Browser API: Show notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(`📚 Loaded ${reflections.length} reflections from JSON!`);
                }
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
                reflectionsContainer.innerHTML = `
                    <div class="error-message">
                        <p> Unable to load reflections.json</p>
                        <p><small>Make sure the file exists in /backend/ folder</small></p>
                    </div>
                `;
                updateReflectionCount(0);
            });
    }

    function displayReflections(reflections) {
        if (reflections.length === 0) {
            reflectionsContainer.innerHTML = '<p>No reflections yet. Run save_entry.py to add some!</p>';
            return;
        }

        // Sort by date (newest first)
        reflections.sort((a, b) => new Date(b.date) - new Date(a.date));

        reflectionsContainer.innerHTML = reflections.map(reflection => `
            <div class="reflection-card">
                <div class="reflection-header">
                    <strong> ${new Date(reflection.date).toLocaleString()}</strong>
                    <span class="reflection-id">#${reflection.id.toString().slice(-6)}</span>
                </div>
                <div class="reflection-text">${escapeHtml(reflection.text)}</div>
            </div>
        `).join('');
    }

    function updateReflectionCount(count) {
        if (countSpan) {
            countSpan.textContent = `Total: ${count} reflection${count !== 1 ? 's' : ''}`;
            countSpan.style.color = count > 0 ? '#27ae60' : '#e74c3c';
        }
    }

    function exportJSON() {
        fetch('backend/reflections.json')
            .then(response => response.json())
            .then(reflections => {
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

                // Notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(' JSON exported successfully!');
                }
            })
            .catch(error => {
                console.error('Export failed:', error);
                alert('Export failed: ' + error.message);
            });
    }

    // Helper function to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Auto-load reflections on page load
    setTimeout(loadJSONReflections, 1000);
});