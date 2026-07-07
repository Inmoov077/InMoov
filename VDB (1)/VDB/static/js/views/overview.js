/**
 * Overview View — Mission Control
 */
window.mount_overview = function(container, State, socket) {
    const startTime = Date.now();

    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('home')} Overview</h2>
            <p>InMoov upper-body robot — system overview</p>
        </div>

        <div class="grid-4 stagger" id="overview-stats">
            <div class="stat-card accent-steel">
                <span class="stat-icon">${ic('cpu')}</span>
                <span class="stat-value" id="stat-servos">20</span>
                <span class="stat-label">Active Servos</span>
            </div>
            <div class="stat-card accent-cream">
                <span class="stat-icon">${ic('film')}</span>
                <span class="stat-value" id="stat-pattern">&mdash;</span>
                <span class="stat-label">Current Pattern</span>
            </div>
            <div class="stat-card accent-sage">
                <span class="stat-icon">${ic('plug')}</span>
                <span class="stat-value" id="stat-connection">&mdash;</span>
                <span class="stat-label">Connection</span>
            </div>
            <div class="stat-card accent-coral">
                <span class="stat-icon">${ic('clock')}</span>
                <span class="stat-value" id="stat-uptime">0s</span>
                <span class="stat-label">Uptime</span>
            </div>
        </div>

        <div style="margin-top:20px">
            <h3 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);margin-bottom:10px">Quick Actions</h3>
            <div class="quick-actions stagger">
                <button class="quick-action-btn" id="qa-connect">${ic('plug')} Connect Arduino</button>
                <button class="quick-action-btn" id="qa-home">${ic('crosshair')} Home Position</button>
                <button class="quick-action-btn" id="qa-estop">${ic('stop')} Emergency Stop</button>
                <button class="quick-action-btn" id="qa-body">${ic('arm')} Body Control</button>
            </div>
        </div>

        <div class="two-column" style="margin-top:20px">
            <div class="card">
                <div class="card-header">
                    <h3>${ic('robot')} Robot Status</h3>
                    <span class="badge badge-coral" id="overview-conn-badge">Offline</span>
                </div>
                <div id="overview-body-preview"></div>
            </div>
            <div class="card">
                <div class="card-header">
                    <h3>${ic('activity')} Recent Activity</h3>
                </div>
                <div class="activity-feed" id="overview-activity"></div>
            </div>
        </div>
    `;

    // SVG body preview
    const bodyPreview = document.getElementById('overview-body-preview');
    if (bodyPreview && window.createSVGBody) {
        bodyPreview.appendChild(window.createSVGBody({
            height: '320px',
            onJointClick: (name) => { location.hash = '#body-control'; State.selectedJoint = name; }
        }));
    }

    function updateStats() {
        const activeServos = Object.keys(State.limits).length || 20;
        document.getElementById('stat-servos').textContent = activeServos;

        const pat = State.wave.active ? State.wave.pattern : '\u2014';
        const patEl = document.getElementById('stat-pattern');
        if (patEl) patEl.textContent = pat === '\u2014' ? '\u2014' : pat.charAt(0).toUpperCase() + pat.slice(1);

        const connEl = document.getElementById('stat-connection');
        const badge = document.getElementById('overview-conn-badge');
        if (State.connected) {
            if (connEl) connEl.textContent = State.port || 'Yes';
            if (badge) { badge.textContent = 'Online'; badge.className = 'badge badge-steel'; }
        } else {
            if (connEl) connEl.textContent = 'Offline';
            if (badge) { badge.textContent = 'Offline'; badge.className = 'badge badge-coral'; }
        }
    }

    let uptimeInterval;
    function startUptime() {
        const fetchUptime = () => {
            fetch('/api/system_info').then(r => r.json()).then(data => {
                const el = document.getElementById('stat-uptime');
                if (el) el.textContent = formatTime(data.uptime);
            }).catch(() => {});
        };
        fetchUptime();
        uptimeInterval = setInterval(fetchUptime, 5000);
    }

    function updateActivity() {
        const feed = document.getElementById('overview-activity');
        if (!feed) return;
        feed.innerHTML = '';
        const recent = State.serialLog.slice(-10).reverse();
        recent.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `<span class="activity-time">${formatTimestamp(entry.ts)}</span><span class="activity-msg">${entry.data}</span>`;
            feed.appendChild(item);
        });
        if (!recent.length) {
            feed.innerHTML = '<div class="activity-item"><span class="activity-msg" style="color:var(--text-muted)">No activity yet. Connect your Arduino to get started.</span></div>';
        }
    }

    document.getElementById('qa-connect')?.addEventListener('click', () => {
        socket.emit(State.connected ? 'disconnect_arduino' : 'connect_arduino');
    });
    document.getElementById('qa-home')?.addEventListener('click', () => socket.emit('go_home'));
    document.getElementById('qa-estop')?.addEventListener('click', () => socket.emit('emergency_stop'));
    document.getElementById('qa-body')?.addEventListener('click', () => { location.hash = '#body-control'; });

    const onStatus = () => updateStats();
    const onConn = () => updateStats();
    const onSerial = () => updateActivity();

    State.on('status', onStatus);
    State.on('connection', onConn);
    State.on('serial', onSerial);

    updateStats();
    updateActivity();
    startUptime();

    container._cleanup = () => {
        State.off('status', onStatus);
        State.off('connection', onConn);
        State.off('serial', onSerial);
        clearInterval(uptimeInterval);
    };
};
