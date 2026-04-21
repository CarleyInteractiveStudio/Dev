/**
 * js/settings.js
 * Panel de configuración, personalización premium y suscripciones.
 */

function renderSettingsSection() {
    const app = document.getElementById('app');
    const isPremium = chatState.userTier !== 'free';
    const isSuper = chatState.userTier === 'super';

    app.innerHTML = `
        <div class="settings-container">
            <section class="settings-section">
                <h3><i class="fas fa-palette"></i> Temas de la Aplicación</h3>
                <div class="theme-grid">
                    <div class="theme-card" onclick="setTheme('dark')">
                        <div class="theme-preview" style="background:#0d1117; border: 1px solid #30363d;"></div>
                        <span>Oscuro (Verde)</span>
                    </div>
                    <div class="theme-card" onclick="setTheme('light')">
                        <div class="theme-preview" style="background:#f6f8fa; border: 1px solid #d0d7de;"></div>
                        <span>Claro (Azul)</span>
                    </div>
                    <div class="theme-card ${!isPremium ? 'locked' : ''}" onclick="applyPremiumTheme('cyberpunk')">
                        <div class="theme-preview" style="background:linear-gradient(45deg, #ff00ff, #00ffff);"></div>
                        <span>Cyberpunk</span>
                    </div>
                    <div class="theme-card ${!isPremium ? 'locked' : ''}" onclick="applyPremiumTheme('matrix')">
                        <div class="theme-preview" style="background:#000; border: 1px solid #00ff00;"></div>
                        <span>Matrix</span>
                    </div>
                </div>
            </section>

            <section class="settings-section">
                <h3><i class="fas fa-font"></i> Personalización de Chat</h3>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">Cambia cómo ves y cómo ven tus mensajes.</p>
                <div class="font-grid">
                    <div class="font-card" style="font-family: sans-serif;" onclick="setChatFont('default')">Predeterminada</div>
                    <div class="font-card ${!isPremium ? 'locked' : ''}" style="font-family: 'Courier New', monospace;" onclick="applyPremiumFont('monospace')">Code Monospace</div>
                    <div class="font-card ${!isPremium ? 'locked' : ''}" style="font-family: 'Orbitron', sans-serif;" onclick="applyPremiumFont('futurist')">Futurista</div>
                </div>
            </section>

            <section class="settings-section">
                <h3><i class="fas fa-star"></i> Planes de Suscripción</h3>
                <div class="plans-container">
                    <div class="plan-card pro">
                        <span class="premium-badge-settings">PRO</span>
                        <div class="plan-price">$3.50<span style="font-size:0.8rem">/mes</span></div>
                        <ul class="plan-features">
                            <li><i class="fas fa-check"></i> 1000+ Caracteres</li>
                            <li><i class="fas fa-check"></i> Subir Fotos</li>
                            <li><i class="fas fa-check"></i> Stickers Personalizados</li>
                            <li><i class="fas fa-check"></i> Temas y Fuentes Pro</li>
                        </ul>
                        <button class="btn-primary" style="width:100%" onclick="upgradeTier('pro')">Mejorar a Pro</button>
                    </div>
                    <div class="plan-card super">
                        <span class="premium-badge-settings" style="background:linear-gradient(45deg, #a335ee, #ff00ff); color:white;">SUPER</span>
                        <div class="plan-price">$6.99<span style="font-size:0.8rem">/mes</span></div>
                        <ul class="plan-features">
                            <li><i class="fas fa-check"></i> 5000 Caracteres</li>
                            <li><i class="fas fa-check"></i> Enviar Videos (2 min)</li>
                            <li><i class="fas fa-check"></i> Notas de Voz</li>
                            <li><i class="fas fa-check"></i> Sin Anuncios</li>
                        </ul>
                        <button class="btn-primary" style="width:100%; background: #a335ee;" onclick="upgradeTier('super')">Ser Super Dev</button>
                    </div>
                </div>
            </section>
        </div>
    `;
}

function applyPremiumTheme(name) {
    if (chatState.userTier === 'free') {
        alert('Este tema es exclusivo para usuarios PRO. ¡Pásate al lado premium!');
        return;
    }
    alert(`Tema ${name} aplicado con éxito.`);
}

function applyPremiumFont(name) {
    if (chatState.userTier === 'free') {
        alert('Esta fuente es exclusiva para usuarios PRO.');
        return;
    }
    alert(`Fuente ${name} aplicada al chat.`);
}

function upgradeTier(tier) {
    chatState.userTier = tier;
    alert(`¡Felicidades! Ahora eres nivel ${tier.toUpperCase()}. Disfruta de tus nuevas ventajas.`);
    renderSettingsSection();
}

window.renderSettingsSection = renderSettingsSection;
