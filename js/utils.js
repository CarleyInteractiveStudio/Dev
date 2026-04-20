function escapeHTML(str) {
    if (!str) return '';
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}

// Función para detectar enlaces de YouTube y convertirlos en embeds
function parseYouTubeLinks(text) {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = text.match(youtubeRegex);
    if (match && match[1]) {
        const videoId = match[1];
        const embed = `
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
        return text.replace(youtubeRegex, '') + embed;
    }
    return text;
}

window.escapeHTML = escapeHTML;
window.parseYouTubeLinks = parseYouTubeLinks;
