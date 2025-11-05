document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('entry-form');
  const input = document.getElementById('entry-text');
  const list = document.getElementById('entry-list');

  // Request permission on load if not already granted
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      console.log('Notification permission:', permission);
    });
  }

  function notifyUser(message) {
    console.log('Triggering notification:', message);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message);
    } else {
      alert(message); // fallback if notifications are blocked
    }
  }

  function loadEntries() {
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

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.push(text);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        input.value = '';
        loadEntries();
        notifyUser('✅ Entry saved to journal!');
      }
    });
  }

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
