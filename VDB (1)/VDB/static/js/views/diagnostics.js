/**
 * Diagnostics View — serial terminal + servo health + system info
 */
window.mount_diagnostics = function(container, State, socket) {
    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('signal')} Diagnostics</h2>
            <p>Serial terminal, system health, and servo status monitoring</p>
        </div>

        <div class="two-column">
            <div class="card" style="grid-row: span 2">
                <div class="card-header">
                    <h3>${ic('terminal')} Serial Terminal</h3>
                    <div class="btn-group">
                        <button class="btn btn-sm" id="diag-clear-btn">${ic('trash')} Clear</button>
                        <button class="btn btn-sm" id="diag-status-btn">${ic('barChart')} Request Status</button>
                    </div>
                </div>
                <div id="diag-terminal"></div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px">
                <div class="card">
                    <div class="card-header"><h3>${ic('barChart')} System Info</h3></div>
                    <div class="grid-2" id="diag-sysinfo">
                        <div class="stat-card accent-steel" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Uptime</span>
                            <span class="stat-value" style="font-size:16px" id="diag-uptime">&mdash;</span>
                        </div>
                        <div class="stat-card accent-sage" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Connection</span>
                            <span class="stat-value" style="font-size:16px" id="diag-conn">&mdash;</span>
                        </div>
                        <div class="stat-card accent-coral" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Bytes Sent</span>
                            <span class="stat-value" style="font-size:16px" id="diag-sent">0</span>
                        </div>
                        <div class="stat-card accent-cream" style="padding:10px">
                            <span class="stat-label" style="font-size:9px">Bytes Recv</span>
                            <span class="stat-value" style="font-size:16px" id="diag-recv">0</span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>${ic('cpu')} Servo Health</h3></div>
                    <div class="health-grid" id="diag-health-grid"></div>
                </div>
            </div>
        </div>
    `;

    const terminalContainer = document.getElementById('diag-terminal');
    if (window.createSerialLog) {
        terminalContainer.appendChild(window.createSerialLog({ height: '440px', showInput: true }));
    }

    document.getElementById('diag-clear-btn')?.addEventListener('click', () => {
        State.serialLog.length = 0;
        const output = terminalContainer.querySelector('.serial-terminal-output');
        if (output) output.innerHTML = '';
    });

    document.getElementById('diag-status-btn')?.addEventListener('click', () => socket.emit('request_status'));

    const healthGrid = document.getElementById('diag-health-grid');
    Object.entries(State.limits).forEach(([name, config]) => {
        const angle = State.servos[name] ?? config.rest;
        const range = config.max - config.min;
        const pct = range > 0 ? ((angle - config.min) / range * 100) : 0;
        const deviation = Math.abs(angle - config.rest);
        let status = 'rest';
        if (deviation > range * 0.7) status = 'limit';
        else if (deviation > range * 0.3) status = 'mid';

        const tile = document.createElement('div');
        tile.className = `health-tile status-${status}`;
        tile.dataset.servo = name;
        tile.innerHTML = `
            <div class="servo-name">${fmtName(name)}</div>
            <div class="servo-angle">${angle}°</div>
            <div class="servo-bar"><div class="servo-bar-fill" style="width:${pct}%"></div></div>
        `;
        healthGrid.appendChild(tile);
    });

    let infoInterval;
    function updateSysInfo() {
        fetch('/api/system_info').then(r => r.json()).then(data => {
            const u = document.getElementById('diag-uptime');
            const s = document.getElementById('diag-sent');
            const r = document.getElementById('diag-recv');
            if (u && window.formatTime) u.textContent = formatTime(data.uptime);
            if (s) s.textContent = fmtBytes(data.bytes_sent);
            if (r) r.textContent = fmtBytes(data.bytes_recv);
        }).catch(() => {});
        const c = document.getElementById('diag-conn');
        if (c) c.textContent = State.connected ? (State.port || 'Yes') : 'No';
    }
    updateSysInfo();
    infoInterval = setInterval(updateSysInfo, 3000);

    const onStatus = (data) => {
        if (!data.servos) return;
        Object.entries(data.servos).forEach(([name, angle]) => {
            const tile = healthGrid.querySelector(`[data-servo="${name}"]`);
            if (!tile) return;
            const config = State.limits[name];
            if (!config) return;
            const range = config.max - config.min;
            const pct = range > 0 ? ((angle - config.min) / range * 100) : 0;
            const deviation = Math.abs(angle - config.rest);
            let status = 'rest';
            if (deviation > range * 0.7) status = 'limit';
            else if (deviation > range * 0.3) status = 'mid';
            tile.className = `health-tile status-${status}`;
            tile.querySelector('.servo-angle').textContent = angle + '°';
            tile.querySelector('.servo-bar-fill').style.width = pct + '%';
        });
    };
    State.on('status', onStatus);

    container._cleanup = () => { State.off('status', onStatus); clearInterval(infoInterval); };

    function fmtName(n) { return n.replace('r_', 'R.').replace('l_', 'L.').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
    function fmtBytes(b) { if (b < 1024) return b + 'B'; if (b < 1048576) return (b / 1024).toFixed(1) + 'KB'; return (b / 1048576).toFixed(1) + 'MB'; }
};
