document.addEventListener('DOMContentLoaded', () => {
    console.log('Dev app cargada');

    initTheme();
    renderFeed();
    handleDynamicNav();
    initPublishModal();
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

function initPublishModal() {
    const modal = document.getElementById('publish-modal');
    const btn = document.querySelector('.btn-add');
    const span = document.querySelector('.close-modal');
    const textarea = document.getElementById('post-text');
    const counter = document.querySelector('.char-counter');

    btn.onclick = () => {
        modal.style.display = 'flex';
    }

    span.onclick = () => {
        modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    textarea.oninput = () => {
        const len = textarea.value.length;
        counter.innerText = `${len}/500`;
        if (len >= 500) {
            counter.style.color = 'red';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
        updatePreview();
    }

    // Interactividad de opciones PRO para vista previa
    const proOptions = document.querySelectorAll('.pro-option');
    const previewPost = document.getElementById('post-preview');

    proOptions.forEach(opt => {
        opt.onclick = () => {
            const glow = opt.getAttribute('data-glow');
            const effect = opt.getAttribute('data-effect');

            if (glow) {
                // Quitar otros glows
                previewPost.classList.forEach(cls => {
                    if (cls.startsWith('glow-')) previewPost.classList.remove(cls);
                });
                previewPost.classList.add(glow);

                // Marcar seleccionado
                document.querySelectorAll('.glow-color').forEach(c => c.classList.remove('selected'));
                opt.classList.add('selected');
            }

            if (effect) {
                previewPost.classList.toggle(effect);
                opt.classList.toggle('selected-effect');
                // Estilo visual para opción seleccionada
                opt.style.borderColor = opt.classList.contains('selected-effect') ? 'var(--accent-color)' : 'var(--border-color)';
            }
        };
    });

    function updatePreview() {
        const previewContent = document.getElementById('preview-content');
        previewContent.innerText = textarea.value || 'Tu mensaje aparecerá aquí...';
    }

    const submitBtn = document.getElementById('submit-post');
    submitBtn.onclick = () => {
        if (textarea.value.trim() === '') return;

        alert('¡Publicado! (Simulado para usuarios gratuitos)');
        textarea.value = '';
        counter.innerText = '0/500';
        modal.style.display = 'none';
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

    // Ocultar "Más" si no hay nada que esconder
    if (itemsToHide.length === 0) {
        moreItem.style.display = 'none';
    } else {
        moreItem.style.display = 'flex';
    }
}

const mockPosts = [
    {
        id: 1,
        user: 'JulesCoder',
        time: '5m',
        content: '¡Bienvenidos a Dev! Estamos construyendo la mejor red social para desarrolladores. HTML, CSS y JS puro para empezar. #Dev #Coding',
        isAd: false,
        extraClass: ''
    },
    {
        id: 4,
        user: 'SuperDev',
        time: '15m',
        content: '<span class="text-glow" style="color: #2ea043">¡Mira mi publicación con iluminación y animación de lluvia! Esto es nivel Super Desarrollador.</span>',
        isAd: false,
        extraClass: 'glow-green anim-rain'
    },
    {
        id: 2,
        user: 'Anuncio Pro',
        time: 'Publicidad',
        content: 'Aprende Supabase en tiempo récord y construye apps increíbles como esta.',
        isAd: true,
        extraClass: ''
    },
    {
        id: 3,
        user: 'DevMaster',
        time: '2h',
        content: 'Esta es una publicación muy larga que debería mostrar el efecto de plegado estilo Threads para que no ocupe demasiado espacio en el feed de los usuarios y se vea más profesional. ' + 'Lorem ipsum '.repeat(20),
        isAd: false,
        extraClass: 'folded'
    }
];

function renderFeed() {
    const feed = document.getElementById('feed');
    if (!feed) return;

    feed.innerHTML = mockPosts.map(post => `
        <div class="post ${post.isAd ? 'ad' : ''} ${post.extraClass || ''}">
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
