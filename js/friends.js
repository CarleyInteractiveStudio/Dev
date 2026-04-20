const friendsData = {
    users: [
        { id: 101, name: 'AliceDev', role: 'Desarrollador Web', tags: ['#react', '#node'], experience: 'desarrollador web', following: false, friendStatus: 'none' },
        { id: 102, name: 'BobGame', role: 'Desarrollo de Juego Nativo', tags: ['#unity', '#csharp'], experience: 'desarrollo de juego nativas', following: false, friendStatus: 'none' },
        { id: 103, name: 'CharlieApp', role: 'Desarrollo de App Nativa', tags: ['#swift', '#ios'], experience: 'desarrollo de app nativas', following: true, friendStatus: 'friend' },
        { id: 104, name: 'DianaDesign', role: 'Animación', tags: ['#blender', '#threejs'], experience: 'animacion', following: false, friendStatus: 'pending_received' },
        { id: 105, name: 'EveWeb', role: 'Desarrollador Web', tags: ['#html', '#css'], experience: 'desarrollador web', following: true, friendStatus: 'none' },
        { id: 106, name: 'FrankGodot', role: 'Desarrollo de Juego Web', tags: ['#godot', '#js'], experience: 'desarrollo de juego web', following: false, friendStatus: 'pending_sent' }
    ],
    currentUserExperience: 'desarrollador web'
};

function renderFriendsSection(tab = 'explore') {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="friends-container">
            <div class="friends-tabs">
                <button class="tab-btn ${tab === 'explore' ? 'active' : ''}" onclick="renderFriendsSection('explore')">Explorar</button>
                <button class="tab-btn ${tab === 'requests' ? 'active' : ''}" onclick="renderFriendsSection('requests')">Solicitudes</button>
                <button class="tab-btn ${tab === 'my-friends' ? 'active' : ''}" onclick="renderFriendsSection('my-friends')">Mis Amigos</button>
            </div>

            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" class="search-bar" placeholder="Buscar por nombre o #tecnología..." id="friend-search">
            </div>

            <div class="user-grid" id="user-grid">
                <!-- Usuarios cargados dinámicamente -->
            </div>
        </div>
    `;

    filterAndRenderUsers(tab);

    const searchInput = document.getElementById('friend-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => filterAndRenderUsers(tab, searchInput.value));
    }
}

function filterAndRenderUsers(tab, query = '') {
    const grid = document.getElementById('user-grid');
    if (!grid) return;

    let filtered = [];

    // 1. Filtrar por Tab
    if (tab === 'explore') {
        filtered = friendsData.users.filter(u => u.friendStatus !== 'friend' && u.friendStatus !== 'pending_received');
    } else if (tab === 'requests') {
        filtered = friendsData.users.filter(u => u.friendStatus === 'pending_received');
    } else if (tab === 'my-friends') {
        filtered = friendsData.users.filter(u => u.friendStatus === 'friend');
    }

    // 2. Filtrar por Búsqueda
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.tags.some(t => t.toLowerCase().includes(q))
        );
    }

    // 3. Priorizar por Experiencia en 'Explore'
    if (tab === 'explore') {
        filtered.sort((a, b) => {
            if (a.experience === friendsData.currentUserExperience && b.experience !== friendsData.currentUserExperience) return -1;
            if (a.experience !== friendsData.currentUserExperience && b.experience === friendsData.currentUserExperience) return 1;
            return 0;
        });
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1">
                <i class="fas fa-user-slash"></i>
                <p>No se encontraron resultados en esta sección.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(user => `
        <div class="user-card">
            <div class="user-card-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-card-name">${escapeHTML(user.name)}</div>
            <div class="user-card-role">${escapeHTML(user.role)}</div>
            <div class="user-card-tags">
                ${user.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
            </div>
            <div class="user-card-actions">
                <button class="btn-card secondary" onclick="navigateToProfile('${user.id}')">
                    <i class="fas fa-eye"></i> Perfil
                </button>
                ${getActionButtons(user, tab)}
            </div>
        </div>
    `).join('');
}

function getActionButtons(user, tab) {
    let buttons = '';

    // Lógica de Amistad
    if (user.friendStatus === 'none') {
        buttons += `<button class="btn-card primary"><i class="fas fa-user-plus"></i> Conectar</button>`;
    } else if (user.friendStatus === 'pending_sent') {
        buttons += `<button class="btn-card secondary" disabled>Enviada</button>`;
    } else if (user.friendStatus === 'pending_received') {
        buttons += `
            <button class="btn-card primary"><i class="fas fa-check"></i> Aceptar</button>
            <button class="btn-card secondary"><i class="fas fa-times"></i> Rechazar</button>
        `;
    } else if (user.friendStatus === 'friend') {
        buttons += `<button class="btn-card secondary"><i class="fas fa-user-minus"></i> Eliminar</button>`;
    }

    // Lógica de Seguir
    if (user.following) {
        buttons += `<button class="btn-card secondary active"><i class="fas fa-minus-circle"></i> Dejar de seguir</button>`;
    } else {
        buttons += `<button class="btn-card secondary"><i class="fas fa-rss"></i> Seguir</button>`;
    }

    return buttons;
}

function navigateToProfile(userId) {
    renderProfilePage(userId);
}

// Integrar con app.js
window.renderFriendsSection = renderFriendsSection;
