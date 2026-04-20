function renderProfilePage(userId, activeTab = 'posts') {
    const app = document.getElementById('app');

    // Mock data del perfil (En una app real, esto vendría de una API)
    const user = {
        id: userId,
        name: userId === 'me' ? 'Mi Perfil' : 'AliceDev',
        username: userId === 'me' ? 'mi_usuario' : 'alice_coder',
        avatar: null,
        birthday: '1995-05-15',
        gender: 'Femenino',
        experience: 'Desarrollador Web',
        tools: ['App Craft', 'VS Code', 'React', 'Supabase'],
        stats: { projects: 2, apps: 1 },
        isPro: true,
        isSuper: false,
        cvHtml: '<h1>Mi Currículum</h1><p>Experiencia en desarrollo web fullstack...</p>',
        projects: [
            { id: 1, title: 'Dev Network', description: 'Red social para devs', tech: 'JS Puro', collaborators: 3 },
            { id: 2, title: 'E-commerce API', description: 'API robusta para tiendas', tech: 'Node.js', collaborators: 1 }
        ],
        apps: [
            { id: 1, title: 'App de Clima', description: 'Consulta el clima en tiempo real', type: 'Web App' }
        ]
    };

    app.innerHTML = `
        <div class="profile-container">
            <header class="profile-header">
                <div class="profile-cover"></div>
                <div class="profile-info-main">
                    <div class="profile-avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="profile-names">
                        <h2>${escapeHTML(user.name)} ${user.isPro ? '<i class="fas fa-check-circle pro-badge" title="Usuario PRO"></i>' : ''}</h2>
                        <span>@${escapeHTML(user.username)}</span>
                    </div>
                    <div class="profile-actions-top">
                        ${userId === 'me' ? '<button class="btn-primary" onclick="openEditProfileModal()">Editar Perfil</button>' : '<button class="btn-primary">Seguir</button>'}
                    </div>
                </div>
            </header>

            <div class="profile-content">
                <aside class="profile-sidebar">
                    <div class="profile-card">
                        <h3>Sobre mí</h3>
                        <p><i class="fas fa-birthday-cake"></i> <strong>Cumpleaños:</strong> ${escapeHTML(user.birthday)}</p>
                        <p><i class="fas fa-venus-mars"></i> <strong>Sexo:</strong> ${escapeHTML(user.gender)}</p>
                        <p><i class="fas fa-code"></i> <strong>Área:</strong> ${escapeHTML(user.experience)}</p>
                    </div>

                    <div class="profile-card">
                        <h3>Herramientas y Motores</h3>
                        <div class="tools-list">
                            ${user.tools.map(t => `<span class="tool-tag">${escapeHTML(t)}</span>`).join('')}
                        </div>
                    </div>
                </aside>

                <main class="profile-main">
                    <div class="profile-tabs">
                        <div class="p-tab ${activeTab === 'posts' ? 'active' : ''}" onclick="renderProfilePage('${userId}', 'posts')">Publicaciones</div>
                        <div class="p-tab ${activeTab === 'projects' ? 'active' : ''}" onclick="renderProfilePage('${userId}', 'projects')">Proyectos (${user.stats.projects})</div>
                        <div class="p-tab ${activeTab === 'apps' ? 'active' : ''}" onclick="renderProfilePage('${userId}', 'apps')">Apps (${user.stats.apps})</div>
                        <div class="p-tab ${activeTab === 'cv' ? 'active' : ''}" onclick="renderProfilePage('${userId}', 'cv')">Currículum</div>
                    </div>

                    <div id="profile-tab-content">
                        ${renderTabContent(user, activeTab)}
                    </div>
                </main>
            </div>
        </div>
    `;
}

function renderTabContent(user, tab) {
    if (tab === 'posts') {
        return `
            <div class="empty-state">
                <i class="fas fa-pencil-alt"></i>
                <p>No hay publicaciones recientes de ${escapeHTML(user.name)}.</p>
            </div>
        `;
    }

    if (tab === 'projects') {
        return `
            <div class="projects-list">
                ${user.projects.map(p => `
                    <div class="project-card">
                        <div class="project-header">
                            <h4>${escapeHTML(p.title)}</h4>
                            <span class="tech-badge">${escapeHTML(p.tech)}</span>
                        </div>
                        <p>${escapeHTML(p.description)}</p>
                        <div class="project-footer">
                            <span><i class="fas fa-users"></i> ${p.collaborators} colaboradores</span>
                            <button class="btn-card secondary"><i class="fas fa-code"></i> Ver Código</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (tab === 'apps') {
        return `
            <div class="apps-list">
                ${user.apps.map(a => `
                    <div class="project-card app-card">
                        <div class="project-header">
                            <h4>${escapeHTML(a.title)}</h4>
                            <span class="tech-badge">${escapeHTML(a.type)}</span>
                        </div>
                        <p>${escapeHTML(a.description)}</p>
                        <div class="project-footer">
                            <span class="warning-text"><i class="fas fa-clock"></i> Pendiente de verificación</span>
                            <button class="btn-card primary"><i class="fas fa-play"></i> Correr App</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (tab === 'cv') {
        // Usar un iframe con sandbox para renderizar el HTML del currículum de forma segura
        const blob = new Blob([user.cvHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        return `
            <div class="cv-viewer">
                <iframe
                    srcdoc="${escapeHTML(user.cvHtml)}"
                    sandbox="allow-scripts"
                    style="width:100%; height:600px; border:none; background:white; border-radius:8px;">
                </iframe>
            </div>
        `;
    }
}

function openEditProfileModal() {
    document.getElementById('edit-profile-modal').style.display = 'flex';
}

// Estilos para el perfil
const style = document.createElement('style');
style.textContent = `
    .profile-container {
        max-width: 1000px;
        margin: 0 auto;
        padding-bottom: 50px;
    }
    .profile-header {
        background: var(--card-bg);
        border-radius: 0 0 15px 15px;
        overflow: hidden;
        margin-bottom: 20px;
        border: 1px solid var(--border-color);
    }
    .profile-cover {
        height: 200px;
        background: linear-gradient(45deg, var(--accent-color), #58a6ff);
        opacity: 0.3;
    }
    .profile-info-main {
        padding: 0 30px 20px;
        display: flex;
        align-items: flex-end;
        gap: 20px;
        margin-top: -60px;
    }
    .profile-avatar-large {
        width: 150px;
        height: 150px;
        background: var(--bg-primary);
        border-radius: 50%;
        border: 5px solid var(--card-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: var(--text-secondary);
    }
    .profile-names {
        flex: 1;
        padding-bottom: 10px;
    }
    .profile-names h2 { margin: 0; display: flex; align-items: center; gap: 10px; }
    .pro-badge { color: #f1e05a; font-size: 1.2rem; }
    .profile-actions-top { padding-bottom: 15px; }

    .profile-content {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 20px;
    }
    .profile-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
    }
    .profile-card h3 { margin-top: 0; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
    .profile-card p { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); }

    .tools-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .tool-tag { background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 20px; font-size: 0.85rem; border: 1px solid var(--border-color); }

    .profile-tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color);
        margin-bottom: 20px;
    }
    .p-tab {
        padding: 15px 25px;
        cursor: pointer;
        color: var(--text-secondary);
        font-weight: 600;
        position: relative;
    }
    .p-tab.active { color: var(--accent-color); }
    .p-tab.active::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-color);
    }

    /* Proyectos y Apps */
    .projects-list, .apps-list {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
    }
    .project-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        padding: 15px;
    }
    .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    .project-header h4 { margin: 0; font-size: 1.1rem; }
    .tech-badge { background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }
    .project-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }
    .warning-text { color: #f1e05a; }

    /* CV Viewer */
    .cv-viewer {
        background: #f0f0f0;
        padding: 20px;
        border-radius: 12px;
        min-height: 500px;
        color: #333;
    }

    @media (max-width: 800px) {
        .profile-content { grid-template-columns: 1fr; }
        .profile-info-main { flex-direction: column; align-items: center; text-align: center; margin-top: -75px; }
    }
`;
document.head.appendChild(style);

window.renderProfilePage = renderProfilePage;
