/**
 * InMoov Command Center — SPA Core
 * Hash router, global state, Socket.IO bridge.
 */

// ═══════════════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════════════
const State = {
    connected: false,
    port: null,
    servos: {},
    limits: {},
    wave: { active: false, pattern: 'gentle', speed: 50, amplitude: 50 },
    enabledParts: { r_arm: true, r_hand: true, l_arm: true, l_hand: true },
    patterns: [],
    serialLog: [],
    currentView: 'overview',
    sidebarCollapsed: false,
    selectedJoint: null,
    poses: [],
    sequence: [],
    driveSpeed: 0,
    driveTurn: 0,
    _listeners: {},
    on(event, fn)  { (this._listeners[event] = this._listeners[event] || []).push(fn); },
    off(event, fn) { this._listeners[event] = (this._listeners[event] || []).filter(f => f !== fn); },
    emit(event, data) { (this._listeners[event] || []).forEach(fn => fn(data)); },
};

// ═══════════════════════════════════════════════
//  SOCKET.IO
// ═══════════════════════════════════════════════
const socket = io();

socket.on('connection_status', (data) => {
    State.connected = data.connected;
    State.port = data.port || null;
    updateConnectionUI(data);
    State.emit('connection', data);
});

socket.on('status_update', (data) => {
    if (data.servos)        State.servos = data.servos;
    if (data.wave)          State.wave = data.wave;
    if (data.enabled_parts) State.enabledParts = data.enabled_parts;
    State.connected = data.connected;
    State.emit('status', data);
});

socket.on('limits', (data) => { State.limits = data; State.emit('limits', data); });
socket.on('patterns', (data) => { State.patterns = data; State.emit('patterns', data); });

socket.on('serial_log', (data) => {
    const entry = { data: data.data, ts: data.ts, type: 'recv' };
    State.serialLog.push(entry);
    if (State.serialLog.length > 500) State.serialLog.shift();
    State.emit('serial', entry);
});

socket.on('arduino_ready', (data) => { addSystemLog(data.message || 'Arduino Ready'); State.emit('ready', data); });
socket.on('command_ok', (data) => { addSystemLog(data.response || 'OK'); });
socket.on('command_error', (data) => { addSystemLog(data.error || 'Error', 'error'); });
socket.on('enabled_parts_update', (data) => { State.enabledParts = data; State.emit('enabledParts', data); });

function addSystemLog(msg, type = 'system') {
    const entry = { data: msg, ts: Date.now() / 1000, type };
    State.serialLog.push(entry);
    if (State.serialLog.length > 500) State.serialLog.shift();
    State.emit('serial', entry);
}

// ═══════════════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════════════
const VIEWS = {
    'overview':     { title: 'Overview' },
    'body-control': { title: 'Body Control' },
    'mobility':     { title: 'Mobility Base' },
    'part-tester':  { title: 'Part Tester' },
    'patterns':     { title: 'Patterns' },
    'config':       { title: 'Configuration' },
    'diagnostics':  { title: 'Diagnostics' },
};

function navigate(viewName) {
    if (!VIEWS[viewName]) viewName = 'overview';
    const container = document.getElementById('view-container');
    if (!container) return;

    // Cleanup previous view
    if (container._cleanup) { container._cleanup(); container._cleanup = null; }
    container.innerHTML = '';

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + viewName);
    });

    State.currentView = viewName;

    const mountFn = window['mount_' + viewName.replace(/-/g, '_')];
    if (mountFn) {
        mountFn(container, State, socket);
    } else {
        container.innerHTML = `<div class="page-header"><h2>${VIEWS[viewName].title}</h2><p>Loading...</p></div>`;
    }

    document.getElementById('sidebar').classList.remove('mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('visible');
}

function onHashChange() {
    navigate(location.hash.slice(1) || 'overview');
}

// ═══════════════════════════════════════════════
//  UI HELPERS
// ═══════════════════════════════════════════════
function updateConnectionUI(data) {
    const indicator = document.getElementById('connection-status');
    const statusText = indicator ? indicator.querySelector('.status-text') : null;
    const mobileDot = document.getElementById('mobile-connection');

    if (indicator) {
        indicator.classList.toggle('connected', data.connected);
        indicator.classList.toggle('disconnected', !data.connected);
    }
    if (statusText) statusText.textContent = data.connected ? (data.port || 'Connected') : 'Disconnected';
    if (mobileDot) {
        mobileDot.classList.toggle('connected', data.connected);
        mobileDot.classList.toggle('disconnected', !data.connected);
    }
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function formatTimestamp(ts) {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Create an icon span: ic('home') → <span class="icon-svg">...</span> */
function ic(name) {
    if (window.Icons && window.Icons[name]) {
        return `<span class="icon-svg">${window.Icons[name]()}</span>`;
    }
    return '';
}

window.AppState = State;
window.AppSocket = socket;
window.formatTime = formatTime;
window.formatTimestamp = formatTimestamp;
window.ic = ic;

// ═══════════════════════════════════════════════
//  INJECT SIDEBAR ICONS
// ═══════════════════════════════════════════════
function injectSidebarIcons() {
    if (!window.Icons) return;
    const map = {
        'logo-icon-slot':       Icons.robot(),
        'toggle-icon-slot':     Icons.chevronLeft(),
        'nav-icon-overview':    Icons.home(),
        'nav-icon-body-control': Icons.arm(),
        'nav-icon-mobility':    Icons.compass(),
        'nav-icon-part-tester': Icons.flask(),
        'nav-icon-patterns':    Icons.film(),
        'nav-icon-config':      Icons.gear(),
        'nav-icon-diagnostics': Icons.signal(),
        'estop-icon-slot':      Icons.stop(),
        'mobile-menu-icon':     Icons.menu(),
    };
    Object.entries(map).forEach(([id, svg]) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add('icon-svg');
            el.innerHTML = svg;
        }
    });
}

// ═══════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            State.sidebarCollapsed = sidebar.classList.contains('collapsed');
        });
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        mobileBtn.addEventListener('click', () => { sidebar.classList.toggle('mobile-open'); overlay.classList.toggle('visible'); });
        overlay.addEventListener('click', () => { sidebar.classList.remove('mobile-open'); overlay.classList.remove('visible'); });
    }

    const estopBtn = document.getElementById('estop-btn');
    if (estopBtn) {
        estopBtn.addEventListener('click', () => {
            socket.emit('emergency_stop');
            State.wave.active = false;
            State.emit('status', State);
        });
    }

    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', (e) => { e.preventDefault(); location.hash = a.getAttribute('href'); });
    });

    window.addEventListener('hashchange', onHashChange);

    loadViewScripts(() => {
        injectSidebarIcons();
        onHashChange();
    });
});

function loadViewScripts(callback) {
    const scripts = [
        '/static/js/components/icons.js',
        '/static/js/components/sidebar.js',
        '/static/js/components/servo-slider.js',
        '/static/js/components/serial-log.js',
        '/static/js/components/svg-body.js',
        '/static/js/components/joystick.js',
        '/static/js/views/overview.js',
        '/static/js/views/body-control.js',
        '/static/js/views/mobility.js',
        '/static/js/views/part-tester.js',
        '/static/js/views/patterns.js',
        '/static/js/views/config.js',
        '/static/js/views/diagnostics.js',
    ];

    let loaded = 0;
    // Load icons.js first, then rest
    const iconScript = document.createElement('script');
    iconScript.src = scripts[0];
    iconScript.onload = iconScript.onerror = () => {
        // Now load the rest
        scripts.slice(1).forEach(src => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = s.onerror = () => { loaded++; if (loaded === scripts.length - 1) callback(); };
            document.head.appendChild(s);
        });
    };
    document.head.appendChild(iconScript);
}
