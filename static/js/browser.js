document.addEventListener('DOMContentLoaded', () => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('🔔 Notifications enabled for journal updates!');
      }
    });
  }
});
