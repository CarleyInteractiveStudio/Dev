document.addEventListener('DOMContentLoaded', () => {
    console.log('Dev app cargada');

    initTheme();
    renderFeed();
    handleDynamicNav();
    window.addEventListener('resize', handleDynamicNav);
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

function handleDynamicNav() {
    const sidebar = document.getElementById('main-sidebar');
    const items = Array.from(sidebar.querySelectorAll('.nav-item'));
    const moreItem = sidebar.querySelector('[data-nav="more"]');

    // Altura disponible en la ventana restando márgenes
    const availableHeight = window.innerHeight - 100;
    const itemHeight = 60; // 40px height + 20px gap

    let currentHeight = 0;
    let itemsToShow = [];
    let itemsToHide = [];

    // Siempre queremos mostrar "Inicio" y "Más"
    items.forEach(item => {
        const navType = item.getAttribute('data-nav');
        if (navType === 'home' || navType === 'more') {
            itemsToShow.push(item);
            currentHeight += itemHeight;
        }
    });

    items.forEach(item => {
        const navType = item.getAttribute('data-nav');
        if (navType !== 'home' && navType !== 'more') {
            if (currentHeight + itemHeight <= availableHeight) {
                itemsToShow.push(item);
                currentHeight += itemHeight;
            } else {
                itemsToHide.push(item);
            }
        }
    });

    // Reordenar visualmente en el DOM (simplificado)
    items.forEach(item => {
        if (itemsToHide.includes(item)) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    });

    // Si no hay items ocultos, podríamos ocultar el botón "Más"
    // Pero según el usuario, "Más" es donde se guardan los otros, así que lo dejamos siempre visible
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
