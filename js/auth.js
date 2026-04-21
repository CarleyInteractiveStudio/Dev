/**
 * js/auth.js
 * Maneja la autenticación y vinculación con GitHub usando Supabase.
 */

async function loginWithGitHub() {
    try {
        // En una implementación real con Supabase configurado:
        // const { data, error } = await supabase.auth.signInWithOAuth({
        //   provider: 'github',
        //   options: {
        //     redirectTo: window.location.origin,
        //     scopes: 'repo' // Importante para clonar repositorios más adelante
        //   }
        // });

        console.log("Iniciando OAuth con GitHub...");
        alert("Redirigiendo a GitHub para autenticación real (Requiere configuración de Supabase Auth)...");

        // Simulación para el prototipo
        setTimeout(() => {
            localStorage.setItem('github_connected', 'true');
            localStorage.setItem('github_user', 'DevUser_GH');
            updateUIConnectedGitHub();
        }, 1000);

    } catch (error) {
        console.error("Error en GitHub Auth:", error);
    }
}

function updateUIConnectedGitHub() {
    const ghBtn = document.getElementById('github-connect-btn');
    const isConnected = localStorage.getItem('github_connected') === 'true';

    if (ghBtn) {
        if (isConnected) {
            const user = localStorage.getItem('github_user');
            ghBtn.innerHTML = `<i class="fab fa-github"></i> Conectado como ${user}`;
            ghBtn.classList.add('connected');
            ghBtn.disabled = true;
        } else {
            ghBtn.innerHTML = `<i class="fab fa-github"></i> Conectar con GitHub`;
            ghBtn.classList.remove('connected');
            ghBtn.disabled = false;
        }
    }
}

// Inicializar estado de conexión
document.addEventListener('DOMContentLoaded', () => {
    updateUIConnectedGitHub();
});

window.devAuth = { loginWithGitHub, updateUIConnectedGitHub };
