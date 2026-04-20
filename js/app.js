document.addEventListener('DOMContentLoaded', () => {
    console.log('Dev app cargada');

    initTheme();
    renderFeed();
});

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

const mockPosts = [
    {
        id: 1,
        user: 'JulesCoder',
        time: '5m',
        content: '¡Bienvenidos a Dev! Estamos construyendo la mejor red social para desarrolladores. HTML, CSS y JS puro para empezar. #Dev #Coding',
        isAd: false
    },
    {
        id: 2,
        user: 'Anuncio Pro',
        time: 'Publicidad',
        content: 'Aprende Supabase en tiempo récord y construye apps increíbles como esta.',
        isAd: true
    },
    {
        id: 3,
        user: 'DevMaster',
        time: '2h',
        content: '¿Alguien ha probado ya el nuevo motor App Craft? Me parece que va a revolucionar el desarrollo de apps nativas.',
        isAd: false
    }
];

function renderFeed() {
    const feed = document.getElementById('feed');
    if (!feed) return;

    feed.innerHTML = mockPosts.map(post => `
        <div class="post ${post.isAd ? 'ad' : ''}">
            <div class="post-header">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <span class="username">${post.user} ${post.isAd ? '<span class="ad-badge">Anuncio</span>' : ''}</span>
                    <span class="post-time">${post.time}</span>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-actions">
                <div class="action-item"><i class="far fa-heart"></i> Me gusta</div>
                <div class="action-item"><i class="far fa-comment"></i> Comentar</div>
                <div class="action-item"><i class="fas fa-share"></i> Compartir</div>
            </div>
        </div>
    `).join('');
}
