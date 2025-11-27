// storage.js - LocalStorage handler (NO FORM HANDLING)
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('entry-list');

  // Request permission on load if not already granted
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }

  function loadEntries() {
    if (!list) return;

    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    list.innerHTML = '';
    entries.forEach((entry, index) => {
      const li = document.createElement('li');
      li.className = 'card';
      li.innerHTML = `
        <p>${entry}</p>
        <button class="project-link delete-entry" data-index="${index}">🗑️ Delete</button>
      `;
      list.appendChild(li);
    });
  }

  // Only handle delete clicks for localStorage entries
  if (list) {
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-entry')) {
        const index = e.target.getAttribute('data-index');
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.splice(index, 1);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        loadEntries();
        notifyUser('🗑️ Entry deleted from journal!');
      }
    });
  }

  loadEntries();
});

function notifyUser(message) {
  console.log("Notification permission:", Notification.permission);
  console.log("Triggering notification:", message);

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(message);
    } catch (err) {
      console.error("Notification error:", err);
    }
  } else {
    alert(message); // fallback
  }
}
