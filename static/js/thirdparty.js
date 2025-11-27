document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('youtube-video');
  if (video) {
    video.innerHTML = `
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/wTu9KclPkCc"
        title="How to Learn Coding from Scratch in 2025 | Tuta Tech" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    `;
  }
});
