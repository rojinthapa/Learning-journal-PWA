// json-handler.js - Flask Backend Handler
console.log(" json-handler.js loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log(" DOM loaded - setting up Flask form handler");

    // Get elements
    const form = document.getElementById('entry-form');
    const nameInput = document.getElementById('entry-name');
    const textInput = document.getElementById('entry-text');
    const status = document.getElementById('form-status');
    const loadBtn = document.getElementById('load-json');
    const exportBtn = document.getElementById('export-json');

    console.log(" Form elements:", {
        form: form ? "FOUND" : "MISSING",
        nameInput: nameInput ? "FOUND" : "MISSING",
        textInput: textInput ? "FOUND" : "MISSING",
        status: status ? "FOUND" : "MISSING"
    });

    // Handle form submission to Flask
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log(" Form submitted to Flask");

            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            console.log(" Form data:", { name, text });

            // Validation
            if (!name || !text) {
                console.log("❌ Validation failed - empty fields");
                if (status) {
                    status.textContent = "❌ Please fill in both fields";
                    status.style.color = "red";
                }
                return;
            }

            // Show saving status
            if (status) {
                status.textContent = " Saving to Flask backend...";
                status.style.color = "blue";
            }

            try {
                console.log(" Sending to Flask...");

                const response = await fetch('/api/reflections', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        reflection: text
                    })
                });

                console.log(" Response status:", response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log(" Saved successfully:", result);

                    if (status) {
                        status.textContent = " Successfully saved to Flask!";
                        status.style.color = "green";
                    }

                    // Clear form
                    form.reset();

                    // Reload reflections
                    loadReflections();

                } else {
                    const error = await response.text();
                    throw new Error(`Server error: ${response.status} - ${error}`);
                }

            } catch (error) {
                console.error("❌ Save failed:", error);
                if (status) {
                    status.textContent = "❌ Save failed - check console";
                    status.style.color = "red";
                }
            }
        });
    } else {
        console.error("❌ entry-form not found!");
    }

    // Load reflections button
    if (loadBtn) {
        loadBtn.addEventListener('click', function() {
            console.log(" Manual load triggered");
            loadReflections();
        });
    }

    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReflections);
    }

    // Auto-load on page start
    loadReflections();
});

// Load reflections from Flask
async function loadReflections() {
    console.log(" Loading reflections from Flask...");

    try {
        const response = await fetch('/api/reflections');

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const reflections = await response.json();
        console.log(" Loaded reflections:", reflections);

        displayReflections(reflections);

    } catch (error) {
        console.error("❌ Load failed:", error);
        displayError("Failed to load reflections");
    }
}

// Display reflections in DOM
function displayReflections(reflections) {
    const container = document.getElementById('json-reflections');
    const countSpan = document.getElementById('reflection-count');

    if (!container) {
        console.error("❌ json-reflections container not found!");
        return;
    }

    // Update counter
    if (countSpan) {
        countSpan.textContent = `Total: ${reflections.length}`;
    }

    // Clear and display
    container.innerHTML = '';

    if (reflections.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No reflections yet. Add one above! 📝</div>';
        return;
    }

    // Add each reflection
    reflections.forEach(reflection => {
        const card = document.createElement('div');
        card.className = 'reflection-card';
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 16px;
            margin: 12px 0;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <strong style="color: #2c3e50;">${reflection.name || 'Anonymous'}</strong>
                <span style="color: #7f8c8d; font-size: 0.9em;">${reflection.date || 'No date'}</span>
            </div>
            <p style="margin: 0; line-height: 1.5; color: #34495e;">${reflection.reflection || reflection.text || ''}</p>
        `;

        container.appendChild(card);
    });
}

// Display error
function displayError(message) {
    const container = document.getElementById('json-reflections');
    if (container) {
        container.innerHTML = `
            <div style="background: #ffebee; border: 1px solid #f44336; padding: 16px; border-radius: 8px; color: #c62828;">
                ❌ ${message}
            </div>
        `;
    }
}

// Export reflections as JSON file
async function exportReflections() {
    try {
        const response = await fetch('/api/reflections');
        const reflections = await response.json();

        const blob = new Blob([JSON.stringify(reflections, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reflections-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(" Exported reflections");

    } catch (error) {
        console.error('❌ Export failed:', error);
        alert('Export failed - check console');
    }
}
