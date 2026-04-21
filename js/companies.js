/**
 * js/companies.js
 * Gestión de empresas, historial laboral y reclamaciones.
 */

const companiesData = {
    list: [
        { id: 1, name: 'Google', verified: true, industry: 'Tech' },
        { id: 2, name: 'Microsoft', verified: true, industry: 'Tech' },
        { id: 3, name: 'Dev Studio', verified: false, industry: 'Game Dev' }
    ]
};

function renderCompanySearch() {
    const container = document.getElementById('company-management-area');
    if (!container) return;

    container.innerHTML = `
        <div class="company-search-box">
            <input type="text" id="company-input" class="search-bar" placeholder="Buscar o crear empresa donde trabajas..." style="padding-left:15px; margin-bottom:10px;">
            <div id="company-results" class="results-dropdown"></div>
        </div>
        <div id="company-claim-area" style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.03); border-radius:10px; display:none;">
            <h4>Reclamar Propiedad de Empresa</h4>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:10px;">Sube documentos legales para verificar que eres el dueño.</p>
            <input type="file" id="claim-docs" style="margin-bottom:10px;">
            <button class="btn-card primary" onclick="submitClaim()">Enviar Reclamación</button>
        </div>
    `;

    const input = document.getElementById('company-input');
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const results = companiesData.list.filter(c => c.name.toLowerCase().includes(query));

        const resultsDiv = document.getElementById('company-results');
        if (query.length < 2) {
            resultsDiv.innerHTML = '';
            return;
        }

        resultsDiv.innerHTML = results.map(c => `
            <div class="result-item" onclick="selectCompany(${c.id}, '${escapeHTML(c.name)}')">
                ${escapeHTML(c.name)} ${c.verified ? '<i class="fas fa-check-circle" style="color:var(--accent-color)"></i>' : ''}
            </div>
        `).join('');

        if (results.length === 0) {
            resultsDiv.innerHTML += `<div class="result-item" onclick="createNewCompany('${escapeHTML(query)}')">Crear nueva empresa: "${escapeHTML(query)}"</div>`;
        }
    });
}

function selectCompany(id, name) {
    alert(`Has seleccionado trabajar en ${name}. Se enviará una solicitud de confirmación.`);
    document.getElementById('company-results').innerHTML = '';
    document.getElementById('company-input').value = name;
    document.getElementById('company-claim-area').style.display = 'block';
}

function createNewCompany(name) {
    const newId = companiesData.list.length + 1;
    companiesData.list.push({ id: newId, name: name, verified: false, industry: 'Unknown' });
    selectCompany(newId, name);
}

function submitClaim() {
    alert('Documentos enviados. El equipo de Dev revisará tu solicitud de propiedad en las próximas 48 horas.');
    document.getElementById('company-claim-area').style.display = 'none';
}

window.devCompanies = { renderCompanySearch, submitClaim };
