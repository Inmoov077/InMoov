/**
 * Serial Log / Terminal component
 *
 * createSerialLog(options) → HTMLElement
 *   options: {
 *       height:    '300px',
 *       showInput: true,
 *       filter:    null | fn(entry) => bool
 *   }
 */
window.createSerialLog = function(options = {}) {
    const height = options.height || '300px';
    const showInput = options.showInput !== false;

    const el = document.createElement('div');
    el.className = 'serial-terminal';

    el.innerHTML = `
        <div class="serial-terminal-output" style="height:${height}"></div>
        ${showInput ? `
        <div class="serial-terminal-input">
            <input type="text" placeholder="Type CMD: command..." id="serial-input-field">
            <button id="serial-send-btn">Send</button>
        </div>` : ''}
    `;

    const output = el.querySelector('.serial-terminal-output');

    // Render existing log
    const state = window.AppState;
    const entries = options.filter
        ? state.serialLog.filter(options.filter)
        : state.serialLog;

    entries.slice(-50).forEach(entry => appendLine(output, entry));

    // Listen for new entries
    const onSerial = (entry) => {
        if (options.filter && !options.filter(entry)) return;
        appendLine(output, entry);
        // Auto-scroll
        output.scrollTop = output.scrollHeight;
    };
    state.on('serial', onSerial);

    // Send command
    if (showInput) {
        const input = el.querySelector('#serial-input-field');
        const sendBtn = el.querySelector('#serial-send-btn');

        const doSend = () => {
            const cmd = input.value.trim();
            if (!cmd) return;
            window.AppSocket.emit('send_raw', { cmd });
            // Add to local log as "sent"
            const entry = { data: `→ ${cmd}`, ts: Date.now() / 1000, type: 'sent' };
            state.serialLog.push(entry);
            state.emit('serial', entry);
            input.value = '';
        };

        sendBtn.addEventListener('click', doSend);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') doSend();
        });
    }

    // Cleanup hook
    el._cleanup = () => { state.off('serial', onSerial); };

    return el;
};

function appendLine(container, entry) {
    const line = document.createElement('div');
    line.className = `serial-line ${entry.type || 'recv'}`;

    const ts = window.formatTimestamp ? window.formatTimestamp(entry.ts) : '';
    line.innerHTML = `<span class="timestamp">${ts}</span>${escapeHtml(entry.data)}`;
    container.appendChild(line);

    // Keep max lines
    while (container.children.length > 200) {
        container.removeChild(container.firstChild);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
