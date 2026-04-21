const chatState = {
    conversations: [
        { id: 1, name: 'AliceDev', avatar: null, lastMsg: '¡Hola! ¿Viste el nuevo motor?', time: '10:45', online: true },
        { id: 2, name: 'BobGame', avatar: null, lastMsg: 'El shader está listo.', time: 'Ayer', online: false },
        { id: 3, name: 'CharlieApp', avatar: null, lastMsg: 'Envié el APK.', time: 'Lunes', online: true }
    ],
    activeChat: null,
    userTier: 'free',
    replyingTo: null
};

function renderChatSection() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="chat-container">
            <aside class="chat-sidebar">
                <div class="chat-sidebar-header">
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" class="search-bar" placeholder="Buscar chats..." id="chat-search">
                        <button class="btn-add" title="Nuevo Chat" id="new-chat-btn" style="width: 40px; height: 40px; min-width: 40px;"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="chat-list" id="chat-list-items">
                    ${renderChatItems()}
                </div>
            </aside>
            <main class="chat-main" id="chat-window" style="position:relative;">
                <div class="empty-state" style="margin: auto;">
                    <i class="fas fa-comments"></i>
                    <p>Selecciona un chat para empezar a programar... digo, a hablar.</p>
                </div>
            </main>
        </div>
    `;

    const chatSearchInput = document.getElementById('chat-search');
    if (chatSearchInput) {
        chatSearchInput.addEventListener('input', (e) => {
            const filtered = chatState.conversations.filter(c =>
                c.name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            document.getElementById('chat-list-items').innerHTML = renderChatItems(filtered);
        });
    }
}

function renderChatItems(list = chatState.conversations) {
    return list.map(chat => `
        <div class="chat-item ${chatState.activeChat === chat.id ? 'active' : ''}" onclick="openChat(${chat.id})">
            <div class="chat-avatar-container" onclick="event.stopPropagation(); openPhotoViewer('${escapeHTML(chat.name)}')">
                <div class="avatar-frame">
                    <div class="avatar-inner">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                ${chat.online ? '<div class="online-status"></div>' : ''}
            </div>
            <div class="chat-info">
                <div class="chat-name">
                    ${escapeHTML(chat.name)}
                    <span class="chat-time">${chat.time}</span>
                </div>
                <div class="chat-last-msg">${escapeHTML(chat.lastMsg)}</div>
            </div>
        </div>
    `).join('');
}

function openChat(chatId) {
    chatState.activeChat = chatId;
    const chat = chatState.conversations.find(c => c.id === chatId);
    const chatWindow = document.getElementById('chat-window');

    document.querySelectorAll('.chat-item').forEach(el => el.classList.remove('active'));
    const activeItem = Array.from(document.querySelectorAll('.chat-item')).find(el => el.getAttribute('onclick').includes(`openChat(${chatId})`));
    if (activeItem) activeItem.classList.add('active');

    chatWindow.innerHTML = `
        <div class="chat-main-header">
            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="navigateToProfile('${chatId}')">
                <div class="avatar-frame" style="width:35px; height:35px;"><div class="avatar-inner"><i class="fas fa-user" style="font-size:1rem;"></i></div></div>
                <strong>${escapeHTML(chat.name)}</strong>
            </div>
            <div class="chat-header-actions">
                <i class="fas fa-ellipsis-v" style="cursor:pointer; padding: 10px;" onclick="toggleChatMenu()"></i>
            </div>
        </div>
        <div id="chat-options" class="chat-options-menu" style="display:none;">
            <div class="chat-option-item" onclick="handleChatAction('report')"><i class="fas fa-flag"></i> Reportar</div>
            <div class="chat-option-item" onclick="handleChatAction('block')"><i class="fas fa-ban"></i> Bloquear</div>
            <div class="chat-option-item danger" onclick="handleChatAction('delete')"><i class="fas fa-trash"></i> Eliminar Chat</div>
        </div>
        <div class="chat-messages" id="chat-messages-box">
            <div class="message received" onclick="setReply(this)">Hola!</div>
            <div class="message sent" onclick="setReply(this)">Ey, ¿cómo va ese código?</div>
        </div>
        <div class="chat-input-area">
            <div id="reply-preview" style="display:none; padding: 5px 10px; background: rgba(255,255,255,0.05); border-left: 3px solid var(--accent-color); margin-bottom: 10px; font-size: 0.8rem;">
                Reponiendo a: <span id="reply-text"></span>
                <i class="fas fa-times" style="float:right; cursor:pointer;" onclick="cancelReply()"></i>
            </div>
            <div class="chat-input-actions">
                <i class="fas fa-image" title="Enviar Foto" onclick="handleMultimedia('photo')"></i>
                <i class="fas fa-video" title="Enviar Video" onclick="handleMultimedia('video')"></i>
                <i class="fas fa-sticky-note" title="Stickers" onclick="handleStickers()"></i>
                <i class="fas fa-microphone" title="Nota de voz" onclick="handleVoiceNote()"></i>
            </div>
            <div class="input-wrapper">
                <textarea id="chat-input" placeholder="Escribe un mensaje..." rows="1"></textarea>
                <div class="chat-char-counter" id="chat-counter" style="display:none; font-size: 10px; color: var(--text-secondary); padding: 5px;"></div>
                <button class="btn-send" id="send-msg-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;

    const textarea = document.getElementById('chat-input');
    const counter = document.getElementById('chat-counter');

    textarea.addEventListener('input', function() {
        const isPro = chatState.userTier === 'pro';
        const isSuper = chatState.userTier === 'super';
        const maxLimit = isSuper ? 5000 : (isPro ? 2000 : 500);

        textarea.setAttribute('maxlength', maxLimit);

        if (chatState.userTier === 'free') {
            counter.style.display = 'block';
            counter.innerText = `${this.value.length}/${maxLimit}`;
        } else {
            counter.style.display = 'none';
        }

        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    document.getElementById('send-msg-btn').onclick = sendMessage;

    textarea.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
}

function setReply(el) {
    chatState.replyingTo = el.textContent;
    const preview = document.getElementById('reply-preview');
    if (preview) {
        preview.style.display = 'block';
        document.getElementById('reply-text').innerText = el.textContent;
    }
}

function cancelReply() {
    chatState.replyingTo = null;
    const preview = document.getElementById('reply-preview');
    if (preview) preview.style.display = 'none';
}

function updateChatOrder(msg) {
    const chat = chatState.conversations.find(c => c.id === chatState.activeChat);
    if (chat) {
        chat.lastMsg = msg;
        chat.time = 'Ahora';
        // Mover al principio
        chatState.conversations = [chat, ...chatState.conversations.filter(c => c.id !== chat.id)];
        document.getElementById('chat-list-items').innerHTML = renderChatItems();
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const box = document.getElementById('chat-messages-box');
    const msgDiv = document.createElement('div');

    let extraClass = '';
    if (chatState.userTier !== 'free') extraClass = ' premium-bubble';

    msgDiv.className = 'message sent' + extraClass;
    msgDiv.onclick = () => setReply(msgDiv);

    if (chatState.replyingTo) {
        const replyContext = document.createElement('div');
        replyContext.className = 'reply-context';
        replyContext.innerText = chatState.replyingTo;
        msgDiv.appendChild(replyContext);
        cancelReply();
    }

    const textNode = document.createTextNode(msg);
    msgDiv.appendChild(textNode);
    box.appendChild(msgDiv);

    box.scrollTop = box.scrollHeight;
    input.value = '';
    input.style.height = 'auto';
    updateChatOrder(msg);
}

function handleMultimedia(type) {
    if (chatState.userTier === 'free') {
        alert('Actualiza a PRO para enviar fotos y videos.');
    } else if (type === 'video' && chatState.userTier === 'pro') {
        alert('Solo los Super Desarrolladores pueden enviar videos.');
    } else {
        const box = document.getElementById('chat-messages-box');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent' + (chatState.userTier !== 'free' ? ' premium-bubble' : '');

        if (type === 'photo') {
            msgDiv.innerHTML = `<img src="https://via.placeholder.com/200" class="message-media" alt="Foto">`;
            updateChatOrder('📷 Foto');
        } else {
            msgDiv.innerHTML = `<div class="message-media" style="background:#000; padding:20px; text-align:center;"><i class="fas fa-play"></i> Video (2 min máx)</div>`;
            updateChatOrder('🎥 Video');
        }

        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
    }
}

function handleStickers() {
    if (chatState.userTier === 'free') {
        alert('Solo los usuarios PRO pueden usar stickers.');
    } else {
        const box = document.getElementById('chat-messages-box');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent premium-bubble';
        msgDiv.innerHTML = `<img src="https://api.dicebear.com/7.x/bottts/svg?seed=sticker" class="sticker-img" alt="Sticker">`;
        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
        updateChatOrder('✨ Sticker');
    }
}

function handleVoiceNote() {
    if (chatState.userTier !== 'super') {
        alert('Solo los Super Desarrolladores pueden enviar notas de voz.');
    } else {
        const box = document.getElementById('chat-messages-box');
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent premium-bubble';
        msgDiv.innerHTML = `
            <div class="voice-note">
                <i class="fas fa-play"></i>
                <div class="voice-waves">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                </div>
                <span>0:12</span>
            </div>
        `;
        box.appendChild(msgDiv);
        box.scrollTop = box.scrollHeight;
        updateChatOrder('🎙️ Nota de voz');
    }
}

function toggleChatMenu() {
    const menu = document.getElementById('chat-options');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function handleChatAction(action) {
    if (confirm(`¿Estás seguro de que deseas ${action} este chat?`)) {
        if (action === 'delete') {
            chatState.conversations = chatState.conversations.filter(c => c.id !== chatState.activeChat);
            renderChatSection();
        } else {
            alert(`${action} realizado con éxito.`);
        }
    }
    toggleChatMenu();
}

function openPhotoViewer(name) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:400px; text-align:center;">
            <div class="modal-header">
                <h3>Foto de Perfil: ${escapeHTML(name)}</h3>
                <span class="close-modal" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="avatar-frame" style="width:250px; height:250px; margin: 0 auto 20px;">
                    <div class="avatar-inner" style="font-size:8rem;">
                        <i class="fas fa-user"></i>
                    </div>
                </div>
                <p>Estilo Videojuego Dev</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showNewChatModal() {
    const friends = friendsData.users.filter(u => u.friendStatus === 'friend');

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'new-chat-modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Iniciar Conversación</h3>
                <span class="close-modal" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="user-grid">
                    ${friends.map(f => `
                        <div class="user-card" onclick="startNewChat(${f.id}, '${escapeHTML(f.name)}'); this.closest('.modal').remove();">
                            <div class="avatar-frame" style="margin-bottom:10px;"><div class="avatar-inner"><i class="fas fa-user"></i></div></div>
                            <div class="user-card-name" style="font-size: 1rem;">${escapeHTML(f.name)}</div>
                            <button class="btn-card primary">Chatear</button>
                        </div>
                    `).join('')}
                    ${friends.length === 0 ? '<p>No tienes amigos agregados aún.</p>' : ''}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function startNewChat(id, name) {
    const existing = chatState.conversations.find(c => c.id === id);
    if (!existing) {
        chatState.conversations.unshift({
            id: id,
            name: name,
            avatar: null,
            lastMsg: 'Iniciaste una conversación',
            time: 'Ahora',
            online: true
        });
    }
    renderChatSection();
    openChat(id);
}

document.addEventListener('click', e => {
    if (e.target.closest('#new-chat-btn')) {
        showNewChatModal();
    }
});

window.renderChatSection = renderChatSection;
