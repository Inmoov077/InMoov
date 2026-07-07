/**
 * Configuration View
 */
window.mount_config = function(container, State, socket) {
    const groups = {
        r_arm:  { label: 'Right Arm',  servos: ['r_shoulder', 'r_omoplate', 'r_bicep', 'r_rotate'] },
        r_hand: { label: 'Right Hand', servos: ['r_thumb', 'r_index', 'r_middle', 'r_ring', 'r_pinky', 'r_wrist'] },
        l_arm:  { label: 'Left Arm',   servos: ['l_shoulder', 'l_omoplate', 'l_bicep', 'l_rotate'] },
        l_hand: { label: 'Left Hand',  servos: ['l_thumb', 'l_index', 'l_middle', 'l_ring', 'l_pinky', 'l_wrist'] },
    };

    container.innerHTML = `
        <div class="page-header fade-in">
            <h2>${ic('gear')} Configuration</h2>
            <p>Pin mapping, servo limits, and connection settings</p>
        </div>
        <div class="two-column">
            <div>
                <div class="card" style="margin-bottom:12px">
                    <div class="card-header"><h3>${ic('pin')} Pin / Channel Mapping</h3></div>
                    <div id="cfg-pin-map"></div>
                </div>
            </div>
            <div>
                <div class="card" style="margin-bottom:12px">
                    <div class="card-header">
                        <h3>${ic('link')} Connection</h3>
                        <span class="badge ${State.connected ? 'badge-steel' : 'badge-coral'}" id="cfg-conn-badge">${State.connected ? 'Connected' : 'Disconnected'}</span>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:10px">
                        <div style="display:flex;gap:6px;align-items:end">
                            <div class="input-group" style="flex:1">
                                <label>Port (auto-detected)</label>
                                <input class="input-field" id="cfg-port" value="${State.port || 'Auto-detect'}" readonly>
                            </div>
                            <button class="btn btn-primary" id="cfg-connect-btn">${State.connected ? 'Disconnect' : 'Connect'}</button>
                        </div>
                        <div id="cfg-ports-list" style="font-size:10px;color:var(--text-muted)">Loading ports...</div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h3>${ic('target')} Servo Limits</h3></div>
                    <div id="cfg-limits" style="max-height:350px;overflow-y:auto"></div>
                </div>
            </div>
        </div>
    `;

    const pinMap = document.getElementById('cfg-pin-map');
    Object.entries(groups).forEach(([groupKey, group]) => {
        const hdr = document.createElement('div');
        hdr.style.cssText = 'font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin:10px 0 4px;padding-left:4px';
        hdr.textContent = group.label;
        pinMap.appendChild(hdr);

        group.servos.forEach(servoName => {
            const config = State.limits[servoName];
            if (!config) return;
            const isChannel = config.ch !== undefined;
            const pinValue = isChannel ? config.ch : config.pin;
            const row = document.createElement('div');
            row.className = 'pin-map-row';
            row.innerHTML = `
                <span class="pin-label">${fmtName(servoName)}</span>
                <span class="pin-type ${isChannel ? 'pca' : 'direct'}">${isChannel ? 'PCA9685' : 'Direct'}</span>
                <input class="pin-input" type="number" value="${pinValue}" data-servo="${servoName}">
            `;
            row.querySelector('.pin-input').addEventListener('change', function() {
                socket.emit('set_pin_config', { servo: servoName, pin: parseInt(this.value) });
            });
            pinMap.appendChild(row);
        });
    });

    const limitsEl = document.getElementById('cfg-limits');
    Object.entries(State.limits).forEach(([name, config]) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--border)';
        row.innerHTML = `
            <span style="flex:1;font-size:11px;font-weight:500">${fmtName(name)}</span>
            <span style="font-size:9px;color:var(--text-muted)">Min</span>
            <span style="font-size:11px;color:var(--cream);min-width:28px;text-align:center">${config.min}°</span>
            <span style="font-size:9px;color:var(--text-muted)">Max</span>
            <span style="font-size:11px;color:var(--coral);min-width:28px;text-align:center">${config.max}°</span>
            <span style="font-size:9px;color:var(--text-muted)">Rest</span>
            <span style="font-size:11px;color:var(--sage);min-width:28px;text-align:center">${config.rest}°</span>
        `;
        limitsEl.appendChild(row);
    });

    fetch('/api/ports').then(r => r.json()).then(data => {
        const portsEl = document.getElementById('cfg-ports-list');
        if (!data.ports.length) { portsEl.textContent = 'No COM ports detected'; }
        else { portsEl.innerHTML = data.ports.map(p => `<div style="padding:1px 0">${p.device} — ${p.description || 'Unknown'}</div>`).join(''); }
        if (data.detected && !State.connected) { const pi = document.getElementById('cfg-port'); if (pi) pi.value = data.detected; }
    }).catch(() => { document.getElementById('cfg-ports-list').textContent = 'Failed to load ports'; });

    document.getElementById('cfg-connect-btn')?.addEventListener('click', () => {
        socket.emit(State.connected ? 'disconnect_arduino' : 'connect_arduino');
    });

    const onConn = (data) => {
        const badge = document.getElementById('cfg-conn-badge');
        const btn = document.getElementById('cfg-connect-btn');
        const pi = document.getElementById('cfg-port');
        if (badge) { badge.textContent = data.connected ? 'Connected' : 'Disconnected'; badge.className = data.connected ? 'badge badge-steel' : 'badge badge-coral'; }
        if (btn) btn.textContent = data.connected ? 'Disconnect' : 'Connect';
        if (pi) pi.value = data.port || 'Auto-detect';
    };
    State.on('connection', onConn);

    container._cleanup = () => State.off('connection', onConn);

    function fmtName(n) { return n.replace('r_', 'R.').replace('l_', 'L.').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
};
